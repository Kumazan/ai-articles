# Polymarket Bot v0 (Python)

## Scanning Pools (Universe)

Structural arbitrage scanner builds a *bounded* market universe (list of condition_ids) using two sources:

1) Rewards markets (preferred, liquidity proxy)
- Endpoint: `GET https://clob.polymarket.com/rewards/markets/current?next_cursor=`
- Rationale: tends to include active / liquidity-incentivized markets.
- Controlled by env:
  - `ARB_USE_REWARDS_UNIVERSE` (default 1)
  - `ARB_REWARDS_MARKETS` (default 160)

2) Sampling markets (fallback / fill)
- Endpoint via py-clob-client: `get_sampling_markets(next_cursor)`
- Rationale: bounded + current-ish, used to fill up to `ARB_SCAN_MAX_MARKETS`.
- Controlled by env:
  - `ARB_SCAN_PAGES` (default 8)

Final universe is de-duplicated and capped:
- `ARB_SCAN_MAX_MARKETS` (default 200)

The universe is cached in-process for `ARB_UNIVERSE_TTL_S` (default 300s) to reduce API load.

## Execution feasibility
- Structural arb type: buy-all-outcomes (sum cost < payout)
- Uses orderbook depth (multiple ask levels)
- Uses fee model (taker_base_fee bps)
- Enforces minimum size (max of env + orderbook min_order_size)

## Outputs
- `data/pm15m-YYYY-MM-DD.jsonl`: 15m top-of-book snapshots
- `data/arbscan-YYYY-MM-DD.jsonl`: per-scan summaries
- `data/arb-YYYY-MM-DD.jsonl`: top opportunities (if any)
- `data/paper-fills-YYYY-MM-DD.jsonl`: simulated fills (if any)
- `data/autotune-status.json`: last autotune snapshot
- `data/autotune-status.jsonl`: append-only autotune history
