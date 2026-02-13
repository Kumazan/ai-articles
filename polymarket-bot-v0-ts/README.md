# polymarket-bot-v0-ts

v0 goal: wire up reference price feeds + Polymarket CLOB connectivity + paper-trade logging.

## Setup

```bash
cd polymarket-bot-v0-ts
cp .env.example .env
# Put your key in /Users/kumax/.openclaw/workspace/.secrets/polymarket.env (already done)
# Then either paste into .env or source it before running.

npm run dev
```

## Notes
- v0 logs external ticks to `./data/ticks-YYYY-MM-DD.jsonl`.
- Single-market structural arb scanner runs every 30s (configurable).
- **P0 (cross-market arb)** added 2026-02-13:
  - `candidate_generator.ts` — heuristic grouping by topic similarity + expiry window
  - `cross_market_arb.ts` — fee-aware executable check (2% taker + 0.5% buffer)
  - Market graph cache rebuilt every scan cycle (default 5 min)
  - Results logged to `./data/cross-arb-YYYY-MM-DD.jsonl`
  - Buckets: `single_market_arb`, `cross_market_comb_arb`, `signal_only`
- Next steps (P1): market graph cache with neighbor-only scanning, result bucketing refinement
- P2: partial fill simulation, leg risk modeling
