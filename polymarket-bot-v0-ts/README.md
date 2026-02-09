# polymarket-bot-v0-ts

v0 goal: wire up reference price feeds + Polymarket CLOB connectivity + paper-trade logging.

## Setup

```bash
cd polymarket-bot-v0-ts
cp .env.example .env
# Put your key in /root/.openclaw/workspace/.secrets/polymarket.env (already done)
# Then either paste into .env or source it before running.

npm run dev
```

## Notes
- v0 currently logs external ticks to `./data/ticks-YYYY-MM-DD.jsonl`.
- Next step: implement Polymarket WS subscribe + map 15m markets to tokenIds.
