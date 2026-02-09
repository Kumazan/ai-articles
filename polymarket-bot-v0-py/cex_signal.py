"""External signal helpers (CEX price drift) for 15m Up/Down markets.

Design goals:
- dependency-light (aiohttp only)
- no secrets
- produce stable, interpretable signals for dashboard & paper trading

We fetch a small window of 1m klines from Binance public API and compute a
15-minute drift. Then map drift -> p_hat(up) via a conservative squashing
function.

This is NOT a guarantee of edge; it's just an external reference signal.
"""

from __future__ import annotations

import math
import time
import asyncio
from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional

import aiohttp

BINANCE_SPOT = "https://api.binance.com"


@dataclass
class DriftSignal:
    ts: int
    type: str
    symbol: str
    venue: str
    window_s: int
    open: float
    last: float
    drift: float
    p_hat_up: float


def drift_to_p_hat(drift: float, *, k: float = 0.18, scale: float = 0.0025) -> float:
    """Map drift in [-inf, inf] to p_hat in [0,1].

    drift is fractional change over ~15m (e.g. +0.001 = +0.1%).
    k sets max deviation from 0.5.
    scale sets how quickly the function saturates.

    Conservative by design (keeps p_hat close to 0.5).
    """
    if scale <= 0:
        return 0.5
    x = drift / scale
    # tanh squashing
    return max(0.0, min(1.0, 0.5 + k * math.tanh(x)))


async def fetch_binance_1m_klines(
    session: aiohttp.ClientSession,
    *,
    symbol: str,
    limit: int = 16,
) -> List[List[Any]]:
    url = f"{BINANCE_SPOT}/api/v3/klines"
    params = {"symbol": symbol, "interval": "1m", "limit": str(limit)}
    async with session.get(url, params=params, timeout=10) as r:
        r.raise_for_status()
        js = await r.json()
    if not isinstance(js, list):
        return []
    return js


async def compute_drift_signal(
    session: aiohttp.ClientSession,
    *,
    symbol: str,
    window_s: int = 15 * 60,
) -> Optional[DriftSignal]:
    # Use ~16 minutes of 1m candles to approximate last 15m drift.
    kl = await fetch_binance_1m_klines(session, symbol=symbol, limit=16)
    if len(kl) < 2:
        return None

    try:
        o = float(kl[0][1])  # open price
        last = float(kl[-1][4])  # close price
    except Exception:
        return None

    if o <= 0:
        return None

    drift = (last - o) / o
    p_hat = drift_to_p_hat(drift)

    return DriftSignal(
        ts=int(time.time() * 1000),
        type="cex_drift_15m",
        symbol=symbol,
        venue="binance_spot",
        window_s=window_s,
        open=o,
        last=last,
        drift=float(drift),
        p_hat_up=float(p_hat),
    )


async def compute_multi(signals: List[str]) -> Dict[str, Dict[str, Any]]:
    """Compute signals for multiple Binance symbols."""
    out: Dict[str, Dict[str, Any]] = {}
    async with aiohttp.ClientSession() as session:
        tasks = [compute_drift_signal(session, symbol=s) for s in signals]
        res = await asyncio.gather(*tasks)
        for s, r in zip(signals, res):
            if r is None:
                continue
            out[s] = asdict(r)
    return out
