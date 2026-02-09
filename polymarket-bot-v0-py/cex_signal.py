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


@dataclass
class DistToOpenSignal:
    ts: int
    type: str
    symbol: str
    venue: str
    # current 15m candle reference
    open_15m: float
    last: float
    # estimated remaining time in seconds to the 15m boundary
    t_rem_s: float
    # estimated 1m vol (std of 1m log returns)
    sigma_1m: float
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


def _phi(z: float) -> float:
    """Standard normal CDF."""
    return 0.5 * (1.0 + math.erf(z / math.sqrt(2.0)))


def p_hat_from_dist_to_open(
    *,
    open_15m: float,
    last: float,
    t_rem_s: float,
    sigma_1m: float,
) -> float:
    """Estimate P(close > open) using a simple Brownian approximation.

    Assumptions:
    - log returns are roughly normal
    - drift is ignored (conservative)

    If t_rem_s is tiny or sigma is 0, probability collapses to a step function.
    """
    if open_15m <= 0 or last <= 0:
        return 0.5
    if t_rem_s <= 1:
        return 1.0 if last > open_15m else 0.0

    # Convert 1m sigma of log returns to remaining horizon sigma.
    # sigma_T = sigma_1m * sqrt(T_minutes)
    T_min = max(1e-6, t_rem_s / 60.0)
    sigma_T = max(1e-9, sigma_1m * math.sqrt(T_min))

    # We want P(log(close/open) > 0).
    # If log return ~ N(0, sigma_T^2), then P(X > -log(last/open)).
    a = math.log(last / open_15m)
    # P(close > open) = P(X > -a) = 1 - Phi((-a)/sigma_T)
    z = (-a) / sigma_T
    return max(0.0, min(1.0, 1.0 - _phi(z)))


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


def _t_rem_to_next_15m_boundary_s(now_s: Optional[float] = None) -> float:
    """Seconds remaining until the next 15-minute boundary (UTC)."""
    if now_s is None:
        now_s = time.time()
    # 15m boundary on unix time
    period = 15 * 60
    return float(period - (int(now_s) % period))


def _sigma_1m_from_klines(kl: List[List[Any]]) -> float:
    """Stddev of 1m log returns from kline closes."""
    closes: List[float] = []
    for row in kl:
        try:
            closes.append(float(row[4]))
        except Exception:
            continue
    if len(closes) < 3:
        return 0.0
    rets: List[float] = []
    for a, b in zip(closes[:-1], closes[1:]):
        if a > 0 and b > 0:
            rets.append(math.log(b / a))
    if len(rets) < 3:
        return 0.0
    mu = sum(rets) / len(rets)
    var = sum((x - mu) ** 2 for x in rets) / max(1, (len(rets) - 1))
    return float(math.sqrt(max(0.0, var)))


async def compute_dist_to_open_signal(
    session: aiohttp.ClientSession,
    *,
    symbol: str,
) -> Optional[DistToOpenSignal]:
    # Need last ~16 1m candles to estimate vol and open_15m.
    kl = await fetch_binance_1m_klines(session, symbol=symbol, limit=16)
    if len(kl) < 2:
        return None

    try:
        open_15m = float(kl[0][1])
        last = float(kl[-1][4])
    except Exception:
        return None

    sigma_1m = _sigma_1m_from_klines(kl)
    t_rem = _t_rem_to_next_15m_boundary_s()
    p_hat = p_hat_from_dist_to_open(open_15m=open_15m, last=last, t_rem_s=t_rem, sigma_1m=sigma_1m)

    return DistToOpenSignal(
        ts=int(time.time() * 1000),
        type="cex_dist_to_open",
        symbol=symbol,
        venue="binance_spot",
        open_15m=float(open_15m),
        last=float(last),
        t_rem_s=float(t_rem),
        sigma_1m=float(sigma_1m),
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
