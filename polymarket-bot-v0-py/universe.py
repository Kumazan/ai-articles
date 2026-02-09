from __future__ import annotations

import asyncio
from typing import List

import aiohttp


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
