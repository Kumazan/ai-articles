# polymarket-bot-v0-py

Python v0 bot using `py-clob-client`.

## Setup

```bash
cd /root/.openclaw/workspace/polymarket-bot-v0-py
cp .env.example .env

# Put your private key into /root/.openclaw/workspace/.secrets/polymarket.env (already exists)
# then export it or paste into .env (recommended: source secrets file)

. .venv/bin/activate
python bot.py
```

## What it does (v0)
- Checks geoblock status
- Derives (or creates) L2 API creds if missing
- Watches current BTC/ETH/SOL 15m UP/DOWN markets (auto-rotates every 15m)
- Scans a liquidity-proxy universe (rewards markets) for structural arbitrage: sum(best asks) < 1 - threshold

## Notes
- This is **paper only** right now; no live order posting implemented.
- Next steps: executable sizing (depth-aware), fee curve, and paper-fill simulator.
