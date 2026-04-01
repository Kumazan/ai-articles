# Copilot Instructions

## 專案簡介

Polymarket 天氣預測市場交易 bot，自動抓取天氣資料、分析 edge 並執行 paper trading。

## 技術棧

- TypeScript 5（strict mode）
- tsx（開發時執行）
- Zod v4（schema 驗證）
- Pino（structured logging）
- @polymarket/clob-client（Polymarket API）
- WebSocket（ws）即時行情
- dotenv（環境變數）

## 程式碼風格偏好

- 所有註解使用**繁體中文**
- TypeScript strict mode，禁用 `any`
- 使用 Zod 定義所有外部資料 schema
- 使用 Pino logger，不用 `console.log`
- ES module（`"type": "module"`）
- 函式優先，避免不必要的 class

## 重要的架構/檔案說明

- `src/index.ts` — 主入口
- `src/weather_oracle.ts` — 天氣資料抓取與分析
- `src/paper_trader.ts` — Paper trading 邏輯
- `src/polymarket_books.ts` — Polymarket order book 資料
- `src/arb_scanner.ts` — 套利掃描
- `src/cross_market_arb.ts` — 跨市場套利
- `data/` — 交易日誌、行情快照、portfolio（JSONL 格式）
- `docs/` — 策略研究文件

## PR Review 注意事項

- 確認所有外部 API 回應都有 Zod validation
- 交易邏輯變更需特別謹慎，確認 edge 計算正確性
- 確認 error handling 完整，bot 不應因單一錯誤而停止
- Log 輸出要有足夠資訊以利 debug

## 不要做的事

- ❌ 不要洩露 `.env` 中的 API keys（Polymarket private key 等）
- ❌ 不要手動修改 `data/` 目錄下的交易日誌和 portfolio 檔案
- ❌ 不要在未經確認的情況下從 paper trading 切換到 live trading
- ❌ 不要移除或跳過 Zod schema 驗證
- ❌ 不要使用 `console.log`，一律使用 Pino logger
