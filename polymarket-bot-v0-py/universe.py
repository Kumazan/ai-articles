from __future__ import annotations

import asyncio
import os
import sys
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

import aiohttp


@dataclass
class MarketInfo:
    """Lightweight market record from rewards API."""
    condition_id: str
    question: str
    volume_24h: float
    rewards_daily_rate: float
    active: bool
    closed: bool


@dataclass
class UniverseStats:
    """Statistics about the filtered universe."""

    total_fetched: int
    after_rewards_filter: int
    after_tradable_filter: int
    reason_counts: Dict[str, int]

    def summary(self) -> str:
        reasons = ", ".join(f"{k}={v}" for k, v in sorted(self.reason_counts.items()))
        return (
            f"Universe: fetched={self.total_fetched} "
            f"rewards_ok={self.after_rewards_filter} "
            f"tradable_ok={self.after_tradable_filter}"
            + (f" | {reasons}" if reasons else "")
        )


async def fetch_rewards_condition_ids(
    *,
    session: aiohttp.ClientSession,
    host: str,
    limit: int,
) -> List[str]:
    """Fetch condition_ids from /rewards/markets/current (liquidity proxy).

    Returns up to `limit` unique condition_ids.
    """
    out: List[str] = []
    seen = set()
    cursor = ""  # empty means first page

    while len(out) < limit:
        url = f"{host}/rewards/markets/current"
        params = {"next_cursor": cursor}
        async with session.get(url, params=params, timeout=15) as r:
            r.raise_for_status()
            js = await r.json()
        data = js.get("data") or []
        for row in data:
            cid = row.get("condition_id")
            if cid and cid not in seen:
                out.append(cid)
                seen.add(cid)
                if len(out) >= limit:
                    break
        cursor = js.get("next_cursor")
        if not cursor or cursor == "-1":
            break
        await asyncio.sleep(0)

    return out


async def fetch_rewards_markets(
    *,
    session: aiohttp.ClientSession,
    host: str,
    limit: int,
) -> List[MarketInfo]:
    """Fetch market info from /rewards/markets/current.

    Returns list of MarketInfo with metadata for filtering.
    """
    out: List[MarketInfo] = []
    seen: set = set()
    cursor = ""

    while len(out) < limit:
        url = f"{host}/rewards/markets/current"
        params = {"next_cursor": cursor}
        async with session.get(url, params=params, timeout=15) as r:
            r.raise_for_status()
            js = await r.json()
        data = js.get("data") or []
        for row in data:
            cid = row.get("condition_id")
            if not cid or cid in seen:
                continue
            seen.add(cid)
            out.append(MarketInfo(
                condition_id=cid,
                question=row.get("question", ""),
                volume_24h=float(row.get("volume_24h") or 0),
                rewards_daily_rate=float(row.get("rewards_daily_rate") or 0),
                active=bool(row.get("active", True)),
                closed=bool(row.get("closed", False)),
            ))
            if len(out) >= limit:
                break
        cursor = js.get("next_cursor")
        if not cursor or cursor == "-1":
            break
        await asyncio.sleep(0)

    return out


def filter_rewards_markets(
    markets: List[MarketInfo],
    *,
    min_volume_24h: float = 0.0,
    min_daily_rate: float = 0.0,
    exclude_closed: bool = True,
) -> List[MarketInfo]:
    """Coarse filter using rewards API fields only (fast).

    This does NOT guarantee tradability on CLOB. We still need to check:
    accepting_orders && enable_order_book && !closed.
    """
    filtered: List[MarketInfo] = []
    for m in markets:
        if exclude_closed and m.closed:
            continue
        if m.volume_24h < min_volume_24h:
            continue
        if m.rewards_daily_rate < min_daily_rate:
            continue
        filtered.append(m)
    return filtered


async def fetch_market_state(
    session: aiohttp.ClientSession,
    host: str,
    condition_id: str,
) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """Fetch CLOB market state for a condition_id.

    Returns (market_json, error_reason).

    We intentionally use raw HTTP to keep this module lightweight.
    """
    # Endpoint shape used elsewhere in the repo via py-clob-client get_market.
    # The underlying REST route is /markets/{condition_id} on the CLOB host.
    url = f"{host}/markets/{condition_id}"
    try:
        async with session.get(url, timeout=15) as r:
            if r.status == 404:
                return None, "not_found"
            r.raise_for_status()
            js = await r.json()
        return js, None
    except asyncio.TimeoutError:
        return None, "timeout"
    except Exception:
        return None, "fetch_error"


async def filter_tradable_by_clob(
    markets: List[MarketInfo],
    *,
    session: aiohttp.ClientSession,
    host: str,
    max_concurrency: int = 25,
) -> Tuple[List[MarketInfo], Dict[str, int]]:
    """Filter markets by executable/tradable flags from CLOB market endpoint."""

    sem = asyncio.Semaphore(max_concurrency)
    reason_counts: Dict[str, int] = {}
    out: List[MarketInfo] = []

    def bump(k: str) -> None:
        reason_counts[k] = reason_counts.get(k, 0) + 1

    async def one(m: MarketInfo) -> None:
        async with sem:
            js, err = await fetch_market_state(session, host, m.condition_id)
        if err:
            bump(err)
            return
        if not isinstance(js, dict):
            bump("bad_payload")
            return

        # Required tradable conditions
        if js.get("closed") is True:
            bump("closed")
            return
        if js.get("accepting_orders") is not True:
            bump("not_accepting_orders")
            return
        if js.get("enable_order_book") is not True:
            bump("order_book_disabled")
            return

        out.append(m)
        bump("ok")

    await asyncio.gather(*(one(m) for m in markets))
    return out, reason_counts


async def fetch_filtered_universe(
    *,
    session: aiohttp.ClientSession,
    host: str,
    limit: int = 200,
    min_volume_24h: float = 0.0,
    min_daily_rate: float = 0.0,
    exclude_closed: bool = True,
    verbose: bool = False,
) -> Tuple[List[str], UniverseStats]:
    """High-level: fetch + filter + return condition_ids with stats.

    Args:
        session: aiohttp session
        host: CLOB host URL
        limit: Max markets to fetch
        min_volume_24h: Filter threshold
        min_daily_rate: Filter threshold
        exclude_closed: Exclude closed markets
        verbose: Print stats summary

    Returns:
        (list of condition_ids, UniverseStats)
    """
    # Fetch more than limit to allow filtering
    fetch_limit = int(limit * 2.0) + 100
    markets_all = await fetch_rewards_markets(session=session, host=host, limit=fetch_limit)

    rewards_ok = filter_rewards_markets(
        markets_all,
        min_volume_24h=min_volume_24h,
        min_daily_rate=min_daily_rate,
        exclude_closed=exclude_closed,
    )

    # Check tradability (executable) flags on CLOB
    tradable_ok, reason_counts = await filter_tradable_by_clob(
        rewards_ok,
        session=session,
        host=host,
    )

    # Trim to requested limit
    tradable_ok = tradable_ok[:limit]

    stats = UniverseStats(
        total_fetched=len(markets_all),
        after_rewards_filter=len(rewards_ok),
        after_tradable_filter=len(tradable_ok),
        reason_counts=reason_counts,
    )

    if verbose:
        print(f"[universe] {stats.summary()}")

    return [m.condition_id for m in tradable_ok], stats


# CLI for testing
if __name__ == "__main__":
    async def _main():
        host = os.getenv("CLOB_HOST", "https://clob.polymarket.com")
        limit = int(os.getenv("UNIVERSE_LIMIT", "100"))
        min_vol = float(os.getenv("UNIVERSE_MIN_VOL", "0"))
        min_rate = float(os.getenv("UNIVERSE_MIN_RATE", "0"))

        async with aiohttp.ClientSession() as session:
            cids, stats = await fetch_filtered_universe(
                session=session,
                host=host,
                limit=limit,
                min_volume_24h=min_vol,
                min_daily_rate=min_rate,
                verbose=True,
            )
            print(f"\nReturned {len(cids)} condition_ids")
            if "--show" in sys.argv:
                for cid in cids[:10]:
                    print(f"  {cid}")
                if len(cids) > 10:
                    print(f"  ... and {len(cids) - 10} more")

    asyncio.run(_main())
