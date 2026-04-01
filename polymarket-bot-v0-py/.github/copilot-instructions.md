# Copilot Instructions

## 專案簡介

Polymarket 預測市場 Python 自動化腳本集，包含 autotune、套利執行、CEX 訊號、dashboard 等功能。

## 技術棧

- Python 3.10+
- 無框架，純 Python 腳本
- dotenv（環境變數）
- venv（虛擬環境）

## 程式碼風格偏好

- 所有註解使用**繁體中文**
- 遵循 PEP 8 風格
- 使用 type hints
- 函式與變數使用 snake_case
- 每個 `.py` 檔案為獨立功能模組

## 重要的架構/檔案說明

- `bot.py` — 主要 bot 邏輯
- `autotune_cron.py` — 自動調參 cron 腳本
- `optimizer.py` — 參數最佳化
- `arb_exec.py` — 套利執行
- `cex_signal.py` — CEX 訊號擷取
- `universe.py` — 市場 universe 定義
- `dashboard.py` — 監控 dashboard
- `daily_summary.py` — 每日摘要報告
- `data/` — 資料目錄
- `DESIGN.md` / `ROADMAP.md` — 設計文件與路線圖

## PR Review 注意事項

- 確認所有外部 API 呼叫有適當的 error handling 和 retry
- 套利與交易邏輯變更需仔細驗證數值計算
- 確認 cron 腳本的冪等性（重複執行不應產生副作用）
- 確認 type hints 完整

## 不要做的事

- ❌ 不要洩露 `.env` 中的 API keys 和私鑰
- ❌ 不要手動修改 `data/` 目錄下的檔案
- ❌ 不要在未經確認的情況下執行真實交易
- ❌ 不要把 `.venv/` 或 `__pycache__/` commit 進 repo
- ❌ 不要移除 `.env.example`（它是環境變數的文件）
