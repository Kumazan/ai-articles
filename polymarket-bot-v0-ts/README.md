# 🌤️ Polymarket Weather Oracle Bot

自動化 Polymarket 天氣市場交易 bot，含 paper trading、cross-market arbitrage 掃描、即時天氣預報整合。

## Features

- **Weather Oracle**：整合多來源天氣預報（Open-Meteo、NWS 等），產生機率預測
- **Paper Trading**：模擬下單系統，追蹤持倉、P&L、勝率
- **Cross-Market Arbitrage Scanner**：
  - Jaccard similarity + expiry window 候選生成
  - Fee-aware executable checker（2% taker + 0.5% buffer）
  - 5 分鐘掃描循環 + market graph cache
- **Dashboard**：即時狀態面板（bot.kumax.dev）
- **Forecast Shift Detection**：偵測 ≥2° 溫度預報偏移

## Tech Stack

- **Runtime**: Node.js + TypeScript (tsx)
- **Data**: JSONL tick/book/trade logs
- **Scheduling**: OpenClaw cron (15min autotune, hourly health check)

## Architecture

```
src/
  index.ts              # Main bot loop
  candidate_generator.ts # Cross-market arb candidate generation
  cross_market_arb.ts    # Fee-aware arb execution checker
  weather_oracle.ts      # Multi-source weather forecast aggregation
  weather_market_scraper.ts # Polymarket weather market data
data/                    # Runtime data (gitignored)
  paper-portfolio.json
  paper-trades-*.jsonl
  ticks-*.jsonl
```

## Running

```bash
npm install
npm run dev
```

## Related

- `polymarket-bot-v0-py` — Python autotune companion
- `polymarket-strategies` — Strategy research & backtesting

## License

Private project.
