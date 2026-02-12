# ROADMAP（Polymarket Bot v0 / Python）

> 目標：長期穩定運行的 Polymarket 掃描／模擬交易（paper）系統。
> 原則：先做「可執行、費用感知、可驗證」的結構性套利；再談策略 alpha。

## 現況（已完成）
- 15m crypto Up/Down 市場解析與有效性 gate（accepting_orders / enable_order_book / !closed）
- 結構性套利掃描（深度/費用/最小下單量）+ paper fills
- JSONL 日誌（pm15m / arbscan / signals / autotune）
- systemd 長跑 + 15m autotune cron
- 外網儀表板（bot.kumax.dev）

---

## 下一步（短期：1–3 天）

### 1) Universe 先過濾再掃描（減少無效 API / 提升穩定）
- [x] 在 `universe.py` 建立 universe 時先過濾：`accepting_orders==true && enable_order_book==true && closed==false`
- [x] Universe cache 記錄過濾統計（reason counts）
- [x] 遇到 429/1015 不 crash，並啟用 cooldown 降頻

### 2) Daily summary / Review loop（把資料變成決策）
- [x] 每日產物：`data/daily-summary-YYYY-MM-DD.json` + `.txt`
- [x] 指標：scans / took_s 分位數 / errors / rate_limits / found
- [x] 錯誤分佈：today + recent 60 + recent 15
- [x] systemd timer 每日自動產生

### 3) Dashboard 下一輪（更像交易台）
- [x] 今日摘要卡片（daily summary）
- [x] CEX 外部訊號（drift + dist-to-open）
- [x] CEX vs PM15m edge（raw + net，含 fee + buffer）
- [x] Paper signals（去重後）
- [ ] found>0 時置頂「機會卡片」（profit、size、conditionId、腿資訊）
- [ ] 把 `signals_sum_bids_gt_1` 畫成小趨勢（或 KPI）

### 4) 論文驅動：Combinatorial 候選縮減器（P0）
> 來源：arXiv 2508.03474（Unravelling the Probabilistic Forest）
- [ ] 建立 market 關係候選（同時間窗 + 同標的 + 問題語意重疊）
- [ ] 先限制 2-leg / 3-leg 候選，避免組合爆炸
- [ ] 輸出 `data/comb-candidates-YYYY-MM-DD.jsonl`（先 signal-only）
- [ ] 對候選跑可執行檢查（ask/bid + fee + buffer），分類 executable / signal_only

---

## 中期（1–2 週）

### 4) 二元市場（n=2）快速路徑（效能）
- [ ] 在 `arb_exec.py` 針對 2-outcome 寫 fast-path：更少計算、更少分配
- [ ] arbscan 記錄 fast-path 命中率與節省的 took_s

### 5) 可執行套利型態擴充（嚴格分「可執行」vs「僅訊號」）
- [ ] 維持目前 buy-all-outcomes 之外，逐一加入「可驗證可成交」的 pattern
- [ ] 每個 pattern 都要有：
  - 充要條件（可成交價、深度）
  - fee model
  - paper fill 驗證
  - 清楚分類：executable / signal-only

### 6) Wallet / 帳號研究工具（不做 copy trade，做 edge 研究）
> 影片提到「複製地址→分析模式」，我們把它做成研究模組。
- [ ] CLI：輸入地址 → 拉交易/持倉資料（取決於可用資料源）
- [ ] 輸出：`data/wallet-report-<addr>-YYYY-MM-DD.json`
  - 持倉時間分佈、進出場時段（是否偏好最後幾分鐘）
  - 偏好市場類型（15m/政治/體育…）
  - 回撤/勝率（能算則算，不能就做 proxy 指標）
- [ ] Dashboard：可選地址報表頁

---

## 系統與安全（隨時可做，但需要你點頭）

### 7) 定期安全稽核（OpenClaw / Host）
- [ ] OpenClaw（只讀）：每天或每週跑 `openclaw security audit --deep`，只存摘要
- [ ] 需要時再評估 `--fix`（會改 OpenClaw 相關權限/預設，但不碰 OS firewall/SSH）
- [ ] Host 層（Linux）：另外做 ufw/ssh/自動更新/備份 等 hardening（逐步、可回滾）

---

## 來源（影片摘要）
- 影片主旨：OpenClaw 的價值在工作流＋排程＋review loop；策略 edge 需要反覆迭代，不是一句「make money」就會出現。
