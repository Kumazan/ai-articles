import asyncio
import json
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import aiohttp
from dotenv import load_dotenv
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import ApiCreds
from rich.console import Console

console = Console()

DATA_DIR = Path(os.getenv("DATA_DIR", "./data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)


def append_jsonl(filename: str, obj: Any) -> None:
    p = DATA_DIR / filename
    with p.open("a", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False) + "\n")


def now_ms() -> int:
    return int(time.time() * 1000)


async def http_get_json(session: aiohttp.ClientSession, url: str) -> Any:
    async with session.get(url, timeout=10) as r:
        r.raise_for_status()
        return await r.json()


async def check_geoblock(session: aiohttp.ClientSession) -> Dict[str, Any]:
    return await http_get_json(session, "https://polymarket.com/api/geoblock")


@dataclass
class TokenRef:
    symbol: str
    outcome: str
    token_id: str


@dataclass
class MarketRef:
    symbol: str
    condition_id: str
    question: str
    tokens: List[TokenRef]


def best(ob: Any) -> Tuple[Optional[float], Optional[float]]:
    """Return (best_bid, best_ask) from an orderbook.

    IMPORTANT: Polymarket's returned `bids`/`asks` are not guaranteed best-first.
    Empirically, bids often come low→high and asks high→low.
    So we compute:
      best_bid = max(bid prices)
      best_ask = min(ask prices)
    """
    bids = getattr(ob, "bids", None) or (ob.get("bids") if isinstance(ob, dict) else []) or []
    asks = getattr(ob, "asks", None) or (ob.get("asks") if isinstance(ob, dict) else []) or []

    def px(x: Any) -> float:
        return float(getattr(x, "price", None) or x.get("price"))

    best_bid = max((px(x) for x in bids), default=None)  # type: ignore[arg-type]
    best_ask = min((px(x) for x in asks), default=None)  # type: ignore[arg-type]
    return best_bid, best_ask


async def resolve_active_15m_market(session: aiohttp.ClientSession, client: ClobClient, symbol: str) -> MarketRef:
    # event slug uses 15m epoch start; try forward first then backward
    base = int(time.time() // (15 * 60)) * (15 * 60)
    candidates = [base + 1800, base + 900, base, base - 900, base - 1800]

    for epoch in candidates:
        url = f"https://polymarket.com/event/{symbol.lower()}-updown-15m-{epoch}"
        try:
            async with session.get(url, timeout=10) as r:
                if r.status != 200:
                    continue
                html = await r.text()
            # extract conditionId from HTML
            import re

            m = re.search(r'"conditionId"\s*:\s*"(0x[0-9a-fA-F]{64})"', html)
            if not m:
                continue
            condition_id = m.group(1)
            mkt = client.get_market(condition_id)
            if mkt.get("closed") or (not mkt.get("accepting_orders")) or (not mkt.get("enable_order_book")):
                continue
            tokens = [
                TokenRef(symbol=symbol, outcome=t["outcome"], token_id=t["token_id"]) for t in (mkt.get("tokens") or [])
            ]
            return MarketRef(symbol=symbol, condition_id=condition_id, question=mkt.get("question", ""), tokens=tokens)
        except Exception:
            continue

    raise RuntimeError(f"could not resolve active 15m market for {symbol}")


async def watch_15m(client: ClobClient, poll_ms: int) -> None:
    """Watches current 15m UP/DOWN markets and logs top-of-book to jsonl.

    Quiet mode by default: prints a short summary every SUMMARY_EVERY_S.
    """
    summary_every_s = int(os.getenv("SUMMARY_EVERY_S", "10"))
    last_summary = 0.0

    async with aiohttp.ClientSession() as session:
        markets: Dict[str, MarketRef] = {}

        async def refresh():
            nonlocal markets
            out: Dict[str, MarketRef] = {}
            for sym in ["BTC", "ETH", "SOL"]:
                out[sym] = await resolve_active_15m_market(session, client, sym)
            markets = out
            console.print({"15m_active": {k: v.condition_id for k, v in markets.items()}}, style="green")

        await refresh()

        last_refresh = time.time()
        while True:
            # refresh every 60s (15m markets rotate)
            if time.time() - last_refresh > 60:
                try:
                    await refresh()
                except Exception as e:
                    console.print({"refresh_failed": str(e)}, style="yellow")
                last_refresh = time.time()

            snap = {"ts": now_ms(), "type": "pm_15m_top", "markets": {}}

            for sym, mkt in markets.items():
                snap["markets"][sym] = {"condition_id": mkt.condition_id, "tokens": []}
                for t in mkt.tokens:
                    try:
                        ob = client.get_order_book(t.token_id)
                        bid, ask = best(ob)
                        snap["markets"][sym]["tokens"].append(
                            {"outcome": t.outcome, "token_id": t.token_id, "best_bid": bid, "best_ask": ask}
                        )
                    except Exception:
                        # stale token between refreshes; ignore
                        continue

            append_jsonl(f"pm15m-{time.strftime('%Y-%m-%d')}.jsonl", snap)

            if time.time() - last_summary >= summary_every_s:
                # print only best asks for UP outcomes as quick glance
                brief = {}
                for sym, m in snap["markets"].items():
                    up = next((x for x in m["tokens"] if str(x["outcome"]).lower() == "up"), None)
                    down = next((x for x in m["tokens"] if str(x["outcome"]).lower() == "down"), None)
                    brief[sym] = {
                    "up_bid": up.get("best_bid") if up else None,
                    "up_ask": up.get("best_ask") if up else None,
                    "down_bid": down.get("best_bid") if down else None,
                    "down_ask": down.get("best_ask") if down else None,
                }
                console.print({"15m_top": brief})
                last_summary = time.time()

            await asyncio.sleep(poll_ms / 1000)


async def scan_structural_arb(client: ClobClient, max_markets: int, max_outcomes: int, min_profit_pct: float) -> None:
    """Scan a bounded universe for *executable* structural arb.

    Optimizations:
    - Cache universe for a while (avoid refetch every scan)
    - Parallelize per-market work using asyncio threads (py-clob-client is sync)
    - Batch orderbooks per market (already)

    Still v0: keep it bounded & robust.
    """
    from py_clob_client.clob_types import BookParams
    from arb_exec import find_best_structural_arb, best_bid_ask

    t0 = time.time()

    # -------- Universe cache --------
    global _UNIVERSE_CACHE
    try:
        _UNIVERSE_CACHE
    except NameError:
        _UNIVERSE_CACHE = {"ts": 0.0, "cids": []}

    cache_ttl = int(os.getenv("ARB_UNIVERSE_TTL_S", "300"))
    use_rewards = os.getenv("ARB_USE_REWARDS_UNIVERSE", "1") != "0"
    rewards_n = int(os.getenv("ARB_REWARDS_MARKETS", "160"))

    if time.time() - float(_UNIVERSE_CACHE["ts"]) > cache_ttl or not _UNIVERSE_CACHE["cids"]:
        cids: List[str] = []
        seen = set()

        # 1) rewards universe (best liquidity proxy)
        if use_rewards:
            try:
                from universe import fetch_rewards_condition_ids

                async with aiohttp.ClientSession() as s:
                    rewards_cids = await fetch_rewards_condition_ids(session=s, host=os.getenv("CLOB_HOST", "https://clob.polymarket.com"), limit=min(rewards_n, max_markets))
                for cid in rewards_cids:
                    if cid not in seen:
                        cids.append(cid)
                        seen.add(cid)
            except Exception:
                pass

        # 2) sampling markets as fallback/fill
        cursor = "MA=="  # INITIAL_CURSOR base64
        pages = int(os.getenv("ARB_SCAN_PAGES", "8"))
        for _ in range(pages):
            res = await asyncio.to_thread(client.get_sampling_markets, cursor)
            cursor = res.get("next_cursor")
            for m in res.get("data", []):
                cid = m.get("condition_id")
                if cid and cid not in seen:
                    cids.append(cid)
                    seen.add(cid)
                if len(cids) >= max_markets:
                    break
            if len(cids) >= max_markets or not cursor or cursor == "-1":
                break

        _UNIVERSE_CACHE = {"ts": time.time(), "cids": cids}
    else:
        cids = list(_UNIVERSE_CACHE["cids"])[:max_markets]

    # -------- Params --------
    max_shares = float(os.getenv("ARB_MAX_SHARES", "50"))
    step = float(os.getenv("ARB_SHARE_STEP", "5"))
    env_min_shares = float(os.getenv("ARB_MIN_SHARES", "5"))
    concurrency = int(os.getenv("ARB_CONCURRENCY", "10"))

    sem = asyncio.Semaphore(max(1, concurrency))
    err_count = 0
    rate_limit_count = 0
    signal_bids_gt_1 = 0
    lock = asyncio.Lock()

    async def eval_market(cid: str) -> Optional[Dict[str, Any]]:
        nonlocal err_count, rate_limit_count, signal_bids_gt_1
        async with sem:
            try:
                mkt = await asyncio.to_thread(client.get_market, cid)
                tokens = mkt.get("tokens") or []
                if len(tokens) < 2 or len(tokens) > max_outcomes:
                    return None

                fee_bps = int(mkt.get("taker_base_fee") or 0)

                params = [BookParams(token_id=t["token_id"]) for t in tokens]
                obs = await asyncio.to_thread(client.get_order_books, params)
                ob_by_id = {ob.asset_id: ob for ob in obs}

                # Extra signal: sum(best bids) > 1 (often needs inventory/shorting; log as signal only)
                sum_best_bid = 0.0
                sum_best_ask = 0.0
                ok_bidask = True
                legs_top = []
                for t in tokens:
                    ob = ob_by_id.get(t["token_id"])
                    if not ob:
                        ok_bidask = False
                        break
                    bb, ba = best_bid_ask(ob)
                    legs_top.append({"outcome": t.get("outcome"), "token_id": t.get("token_id"), "best_bid": bb, "best_ask": ba})
                    if bb is None or ba is None:
                        ok_bidask = False
                        break
                    sum_best_bid += bb
                    sum_best_ask += ba

                if ok_bidask and sum_best_bid > 1.0 + min_profit_pct:
                    async with lock:
                        signal_bids_gt_1 += 1
                    append_jsonl(
                        f"arb-signals-{time.strftime('%Y-%m-%d')}.jsonl",
                        {
                            "ts": now_ms(),
                            "type": "signal_sum_best_bids_gt_1",
                            "condition_id": cid,
                            "question": mkt.get("question"),
                            "n_outcomes": len(tokens),
                            "sum_best_bid": round(sum_best_bid, 6),
                            "sum_best_ask": round(sum_best_ask, 6),
                            "note": "signal only; execution may require inventory/shorting",
                            "legs": legs_top,
                        },
                    )

                ob0 = next(iter(ob_by_id.values()), None)
                ob_min = getattr(ob0, "min_order_size", None) if ob0 is not None else None
                try:
                    min_shares = max(env_min_shares, float(ob_min) if ob_min is not None else env_min_shares)
                except Exception:
                    min_shares = env_min_shares

                # Fast-path note: binary markets benefit most from buy-all-outcomes arb
                best = find_best_structural_arb(
                    outcomes=tokens,
                    orderbooks=ob_by_id,
                    fee_rate_bps=fee_bps,
                    min_profit_pct=min_profit_pct,
                    max_shares=max_shares,
                    step=step,
                    min_shares=min_shares,
                )
                if best is None:
                    return None

                return {
                    "ts": now_ms(),
                    "type": "arb_exec_buy_all_outcomes",
                    "condition_id": cid,
                    "question": mkt.get("question"),
                    "n_outcomes": len(tokens),
                    "fee_bps": fee_bps,
                    **best,
                }
            except Exception as e:
                msg = str(e)
                async with lock:
                    err_count += 1
                    if "429" in msg or "rate" in msg.lower():
                        rate_limit_count += 1
                return None

    tasks = [eval_market(cid) for cid in cids]
    results = await asyncio.gather(*tasks)
    found = [r for r in results if r is not None]

    found.sort(key=lambda x: -float(x.get("profit_usdc", 0.0)))

    summary = {
        "ts": now_ms(),
        "type": "arb_scan_summary",
        "scanned": len(cids),
        "universe": len(cids),
        "found": len(found),
        "best_profit_usdc": found[0]["profit_usdc"] if found else None,
        "best_profit_pct": found[0]["profit_pct"] if found else None,
        "took_s": round(time.time() - t0, 3),
        "max_shares": max_shares,
        "step": step,
        "concurrency": concurrency,
        "universe_ttl_s": cache_ttl,
        "errors": err_count,
        "rate_limits": rate_limit_count,
        "signals_sum_bids_gt_1": signal_bids_gt_1,
    }

    append_jsonl(f"arbscan-{time.strftime('%Y-%m-%d')}.jsonl", summary)

    if found:
        for o in found[:5]:
            append_jsonl(f"arb-{time.strftime('%Y-%m-%d')}.jsonl", o)

        if os.getenv("PAPER_FILL_ENABLED", "1") != "0":
            max_trades = int(os.getenv("PAPER_FILL_MAX_TRADES_PER_SCAN", "1"))
            for o in found[:max_trades]:
                trade = {
                    "ts": now_ms(),
                    "type": "paper_fill",
                    "strategy": "arb_exec_buy_all_outcomes",
                    "condition_id": o["condition_id"],
                    "question": o.get("question"),
                    "q": o.get("q"),
                    "profit_usdc": o.get("profit_usdc"),
                    "profit_pct": o.get("profit_pct"),
                    "fee_bps": o.get("fee_bps"),
                    "legs": o.get("legs"),
                }
                append_jsonl(f"paper-fills-{time.strftime('%Y-%m-%d')}.jsonl", trade)

        console.print({"STRUCTURAL_ARB_FOUND": found[0]}, style="bold magenta")
    else:
        console.print({"arb_scan": summary})


def _load_env_file(path: str) -> None:
    """Load KEY=VALUE lines into os.environ if not already set."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                if k and (k not in os.environ or not os.environ.get(k)):
                    os.environ[k] = v
    except FileNotFoundError:
        return


def build_client() -> ClobClient:
    # Fallback: systemd in some environments may not pass EnvironmentFile vars.
    _load_env_file("/etc/polymarket-bot/polymarket.env")
    _load_env_file("/etc/polymarket-bot/polymarket_clob_creds.env")
    _load_env_file("/root/.openclaw/workspace/.secrets/polymarket.env")
    _load_env_file("/root/.openclaw/workspace/.secrets/polymarket_clob_creds.env")

    host = os.getenv("CLOB_HOST", "https://clob.polymarket.com")
    chain_id = int(os.getenv("CHAIN_ID", "137"))
    pk = os.getenv("POLYMARKET_PRIVATE_KEY")
    if not pk:
        raise RuntimeError("Missing POLYMARKET_PRIVATE_KEY")

    api_key = os.getenv("POLY_API_KEY")
    api_secret = os.getenv("POLY_API_SECRET")
    api_pass = os.getenv("POLY_API_PASSPHRASE")

    creds = None
    if api_key and api_secret and api_pass:
        creds = ApiCreds(api_key=api_key, api_secret=api_secret, api_passphrase=api_pass)

    # signature_type and funder are for trading; v0 scanner doesn't need them.
    return ClobClient(host=host, chain_id=chain_id, key=pk, creds=creds)


async def main():
    load_dotenv()

    async with aiohttp.ClientSession() as session:
        geo = await check_geoblock(session)
        console.print({"geoblock": geo})
        if geo.get("blocked"):
            raise RuntimeError(f"Geoblocked: {geo}")

    client = build_client()

    # Ensure we have L2 creds available (store them in env yourself after first run)
    # Some endpoints may work without, but this keeps us ready for live later.
    if not (os.getenv("POLY_API_KEY") and os.getenv("POLY_API_SECRET") and os.getenv("POLY_API_PASSPHRASE")):
        try:
            creds = client.create_or_derive_api_creds()
            # Do NOT print secret. Just show that it worked.
            console.print({"derived_api_creds": {"apiKey": creds.api_key, "passphrase": creds.api_passphrase}}, style="cyan")
            console.print("Save POLY_API_KEY/POLY_API_SECRET/POLY_API_PASSPHRASE into .env (secret not printed here)")
        except Exception as e:
            console.print(f"Could not derive API creds: {e}", style="yellow")

    tasks = []

    if os.getenv("WATCH_15M_ENABLED", "1") != "0":
        poll_ms = int(os.getenv("WATCH_15M_POLL_MS", "800"))
        tasks.append(asyncio.create_task(watch_15m(client, poll_ms)))

    if os.getenv("ARB_SCAN_ENABLED", "1") != "0":
        interval_s = int(os.getenv("ARB_SCAN_INTERVAL_S", "30"))
        max_markets = int(os.getenv("ARB_SCAN_MAX_MARKETS", "120"))
        max_outcomes = int(os.getenv("ARB_SCAN_MAX_OUTCOMES", "12"))
        min_profit_pct = float(os.getenv("ARB_MIN_PROFIT_PCT", "0.005"))

        async def loop():
            while True:
                await scan_structural_arb(client, max_markets, max_outcomes, min_profit_pct)
                await asyncio.sleep(interval_s)

        tasks.append(asyncio.create_task(loop()))

    if not tasks:
        console.print("No tasks enabled. Set WATCH_15M_ENABLED or ARB_SCAN_ENABLED.")
        return

    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
