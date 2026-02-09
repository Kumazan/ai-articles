from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple


@dataclass
class Level:
    price: float
    size: float


def _to_levels(asks: Any) -> List[Level]:
    out: List[Level] = []
    for x in asks or []:
        # OrderSummary has .price/.size; dict has ['price']/['size']
        p = getattr(x, "price", None)
        s = getattr(x, "size", None)
        if p is None:
            p = x.get("price")
        if s is None:
            s = x.get("size")
        out.append(Level(price=float(p), size=float(s)))

    # IMPORTANT: Polymarket CLOB arrays are not guaranteed best-first.
    # Normalize to best-first for buy cost calculation.
    out.sort(key=lambda lv: lv.price)
    return out


def cost_to_buy_shares(asks: Any, shares: float) -> Optional[Tuple[float, float]]:
    """Returns (cost_usdc, avg_price) for buying `shares` from the ask book.

    If insufficient depth, returns None.
    """
    if shares <= 0:
        return 0.0, 0.0

    levels = _to_levels(asks)
    remaining = shares
    cost = 0.0

    for lvl in levels:
        if remaining <= 0:
            break
        take = min(remaining, lvl.size)
        cost += take * lvl.price
        remaining -= take

    if remaining > 1e-9:
        return None

    avg = cost / shares
    return cost, avg


def taker_fee_usdc(fee_rate_bps: int, price: float, shares: float) -> float:
    """Fee model per Polymarket docs.

    For BUY and SELL, fee in USDC is symmetric:
      fee_usdc = baseRate * min(price, 1-price) * shares
    where baseRate = fee_rate_bps / 10_000.

    This matches the docs formulas once BUY base-fee is converted to quote.
    """
    if fee_rate_bps <= 0 or shares <= 0:
        return 0.0
    base = fee_rate_bps / 10_000
    return base * min(price, 1.0 - price) * shares


def find_best_structural_arb(
    *,
    outcomes: List[Dict[str, Any]],
    orderbooks: Dict[str, Any],
    fee_rate_bps: int,
    min_profit_pct: float,
    max_shares: float,
    step: float,
    min_shares: float = 0.0,
) -> Optional[Dict[str, Any]]:
    """Find best q (shares) for buy-all-outcomes structural arb.

    outcomes: list of {outcome, token_id}
    orderbooks: token_id -> orderbook summary (with asks)

    Profit per share = 1 - total_cost_per_share.
    We search q in [step, max_shares] and pick maximum expected profit USDC.
    """
    if step <= 0:
        step = 1.0

    best: Optional[Dict[str, Any]] = None

    q = max(step, min_shares)
    while q <= max_shares + 1e-9:
        legs = []
        total_cost = 0.0
        feasible = True

        for o in outcomes:
            tid = o["token_id"]
            ob = orderbooks.get(tid)
            asks = getattr(ob, "asks", None) or (ob.get("asks") if isinstance(ob, dict) else None)
            res = cost_to_buy_shares(asks, q)
            if res is None:
                feasible = False
                break
            cost_usdc, avg_price = res
            fee = taker_fee_usdc(fee_rate_bps, avg_price, q)
            total_cost += cost_usdc + fee
            legs.append(
                {
                    "outcome": o.get("outcome"),
                    "token_id": tid,
                    "shares": q,
                    "avg_price": avg_price,
                    "cost_usdc": cost_usdc,
                    "fee_usdc": fee,
                }
            )

        if feasible:
            payout = q  # exactly one outcome pays 1 USDC per share
            profit = payout - total_cost
            profit_pct = profit / payout if payout > 0 else 0.0
            if profit_pct >= min_profit_pct:
                cand = {
                    "q": q,
                    "profit_usdc": profit,
                    "profit_pct": profit_pct,
                    "total_cost_usdc": total_cost,
                    "legs": legs,
                }
                if best is None or cand["profit_usdc"] > best["profit_usdc"]:
                    best = cand

        q += step

    return best
