# Polymarket 策略研究報告

> 撰寫日期：2026-02-14
> 研究員：AI Strategy Research Agent
> 目標：評估 5 個 Polymarket 交易策略，提供技術實作建議與優先級排序

---

## 目錄

1. [🌡️ 天氣預報套利優化](#1-️-天氣預報套利優化)
2. [⚡ 加密 15min 延遲套利](#2--加密-15min-延遲套利)
3. [🚫 NO-Maxi 偏誤偵測](#3--no-maxi-偏誤偵測)
4. [🛡️ 低風險領先者策略](#4-️-低風險領先者策略)
5. [💰 Fee 模型更新與做市策略](#5--fee-模型更新與做市策略)
6. [建議實作路線圖](#建議實作路線圖)
7. [現有檔案結構與修改計劃](#現有檔案結構與修改計劃)

---

## 1. 🌡️ 天氣預報套利優化

### 1.1 策略概述

**原理：** Polymarket 天氣市場的價格由散戶交易者設定，而 NOAA/GFS/ECMWF 等氣象模型的 1-2 天短期預測準確率高達 85-90%。當市場定價與最新預報模型不一致時，存在系統性套利空間。

**為什麼有效：**
- 散戶更新速度慢，模型跑完到市場反映有 30 分鐘至數小時延遲
- 多數交易者只看一個數據源，多模型整合有資訊優勢
- London 市場參與者少、流動性低，定價偏差更大
- 短窗口（1-2 天）預報準確率最高，edge 最穩定

### 1.2 實際案例與數據

| 案例 | 起始資金 | 最終收益 | 時間 | 來源 |
|------|---------|---------|------|------|
| London 天氣 bot | $1,000 | $24,000 | 2025.04 - 2026.02 (~10 個月) | Medium (Ezekiel Njuguna, 2026.02) |
| 多城市天氣 bot (NYC/London/Seoul) | 未知 | $65,000 利潤 | ~12 個月 | 同上 |
| $48 → $1000+ trader | $48 | $1,000+ | 數週 | Twitter/X 社群報導 |

**關鍵洞察（來自 Medium 文章）：**
- 策略極其簡單：比較 NOAA 預報 vs 市場價格，預報說 43°F 但市場只定價 15%→買入
- London 市場流動性低，bot 競爭少，利潤最高
- 1-2 天窗口內預報幾乎不會錯，但市場價格仍然偏離

### 1.3 風險分析

| 風險 | 嚴重度 | 說明 |
|------|--------|------|
| 預報翻轉 | 中 | 極端天氣事件可能讓預報在最後 12 小時翻轉 |
| 流動性不足 | 中 | London 市場有時掛單太薄，無法建立足夠倉位 |
| Bot 競爭加劇 | 高 | Medium 文章已公開策略，預計數月內競爭者增加 |
| 模型分歧 | 低 | GFS 和 ECMWF 偶爾會有不同預測，需要取加權共識 |
| 最大單筆虧損 | ~100% 該筆 | 二元合約歸零，但 Kelly 倉控可限制在 5-10% 資金 |

**失敗場景：** 突發極端天氣事件（暴風雪、熱浪邊界值），模型在結算前大幅修正。

### 1.4 技術實作建議

**目前狀態：** `weather_oracle.ts` 已實作 NOAA 單一來源。需要升級。

**需要的模組/功能：**

1. **多模型整合引擎** (`src/weather_multi_model.ts`)
   - NOAA GFS：已有（via weather.gov API）
   - ECMWF：Open-Meteo API（免費，提供 ECMWF 數據）`https://api.open-meteo.com/v1/ecmwf`
   - GFS 高解析度：Open-Meteo `https://api.open-meteo.com/v1/gfs`
   - 加權平均 / 共識機制：當 2+ 模型一致，信心加倍

2. **London 市場支持** — 修改 `weather_market_scraper.ts` 加入 London 城市設定
   - London 座標：51.5074, -0.1278
   - 注意：NOAA 只覆蓋美國，London 需改用 Open-Meteo 或 Met Office API

3. **縮短交易窗口** — 只在 T-1 到 T-2 天下注（目前可能覆蓋太寬）
   - 在 `candidate_generator.ts` 加入時間篩選邏輯

4. **API/數據源：**
   - Open-Meteo API（免費，無需 key）
   - Met Office DataPoint API（UK 天氣，免費 tier）
   - NOAA weather.gov（已整合）

### 1.5 與現有系統整合

- **修改** `src/weather_oracle.ts`：新增 `fetchOpenMeteo()` 和 `fetchECMWF()` 函數，與現有 `fetchNOAA()` 並行
- **修改** `src/weather_market_scraper.ts`：CityConfig 加入 London（和其他非美國城市）
- **新增** `src/weather_multi_model.ts`：多模型共識邏輯
- **修改** `src/paper_trader.ts`：確保支援新城市的結算驗證

### 1.6 優先級建議

**⭐ 最高優先級 — Phase 1 首選**

- 投入：2-3 天開發
- 產出：基於已驗證案例，$1K→$24K 級別回報可能
- ROI 評估：**極高**，我們已有 80% 基礎設施，只需加模型源和 London 支持
- 風險：低（已有 paper trading 驗證框架）

---

## 2. ⚡ 加密 15min 延遲套利

### 2.1 策略概述

**原理：** Polymarket 的 15 分鐘 BTC/ETH 價格市場存在 500ms-2s 的價格延遲。Bot 監控 Binance/Coinbase 即時價格，當現貨已經大幅移動但 Polymarket 賠率尚未更新時，搶先下單。

**為什麼有效（或曾經有效）：**
- Polymarket 的價格 feed 有延遲，不是即時反映交易所價格
- 15 分鐘窗口極短，價格趨勢確認後結果幾乎確定
- 自動化 bot 只在高確信度時出手（只需要現貨價差 > 閾值）

### 2.2 實際案例與數據

| 案例 | 起始資金 | 最終收益 | 勝率 | 時間 | 來源 |
|------|---------|---------|------|------|------|
| 0x8dxd | $313 | $359K-$438K | 96.3% | 29 天內 | Blake.ETH on X, Bitget News |
| 其他延遲套利 bots | 不明 | 數百萬美元利潤（合計） | ~95%+ | 2025 Q3-Q4 | Yahoo Finance |

**關鍵數據（Blake.ETH Twitter）：**
- 0x8dxd：$313 → $359K，29 天，5,637 筆交易，96.3% 勝率
- 在 $20/月 VPS 上運行
- 利用 Binance 價格移動後的 500ms-2s 窗口

### 2.3 風險分析

| 風險 | 嚴重度 | 說明 |
|------|--------|------|
| ⚠️ **Fee 已上線（2026.01.19）** | **致命** | Polymarket 已對 15min crypto 市場收取 taker fee（最高 1.56%），大幅壓縮利潤 |
| Bot 競爭激烈 | 極高 | Reddit 報導「Jan 2026 fee 變更殺死了印鈔的延遲套利 bot」 |
| 延遲縮小 | 高 | Polymarket 可能持續改善價格 feed |
| Flash crash 反轉 | 中 | 15min 內價格可能先漲後跌 |
| 最大單筆虧損 | 100%（binary） | 但高勝率通常能覆蓋 |

**⚠️ 重要更新：** 截至 2026 年 1 月 19 日，Polymarket 已正式對 15 分鐘加密市場收取 taker fee。Reddit 用戶報告「fee 變更殺死了曾經印鈔的延遲套利 bot（就是那個把 $300 變成 $438K 的）。現在所有人都在找 fee 後還能用的策略。」

### 2.4 技術實作建議

**即使 fee 已上線，仍可評估可行性：**

1. **新增** `src/crypto_latency_arb.ts`
   - WebSocket 連接 Binance/Coinbase 即時價格 feed
   - 每 100ms 輪詢 Polymarket 15min crypto 市場賠率
   - 計算 edge = |spotDirection - marketPrice| - fee
   - 只在 edge > fee + buffer (e.g., 3%) 時觸發

2. **API/數據源：**
   - Binance WebSocket API：`wss://stream.binance.com:9443/ws/btcusdt@trade`
   - Coinbase WebSocket：`wss://ws-feed.exchange.coinbase.com`
   - Polymarket CLOB API（已整合）

3. **架構：**
   - 超低延遲 event loop（避免 async/await 瓶頸）
   - 可能需要 VPS 部署（靠近 Polymarket 基礎設施）

### 2.5 與現有系統整合

- **新增** `src/crypto_latency_arb.ts`：核心延遲套利模組
- **新增** `src/exchange_feed.ts`：Binance/Coinbase WebSocket 價格 feed
- **修改** `src/index.ts`：加入 crypto arb 循環
- **修改** `src/paper_trader.ts`：支援 crypto 15min 市場的 paper trading

### 2.6 優先級建議

**⚠️ 低優先級 — 建議觀望**

- 投入：3-5 天開發
- 產出：**黃金期已過**，fee 上線後利潤大幅壓縮
- ROI 評估：**低到中**，需要極高頻率和精準度才能在 fee 後獲利
- 建議：先用 paper trading 測試 fee 後是否仍有 edge，再決定是否投入真金

---

## 3. 🚫 NO-Maxi 偏誤偵測

### 3.1 策略概述

**原理：** 預測市場中，散戶傾向於過度買入 YES（樂觀偏誤），尤其在政治、地緣政治、名人事件等情緒化市場。這導致 YES 被系統性高估，NO 被低估。策略是偵測這些偏誤，買入低估的 NO 合約。

**為什麼有效：**
- **「Nothing ever happens」效應：** Reddit 14 策略文章指出「90% 的地緣政治頭條最終都不了了之」
- **情緒驅動定價：** 新聞事件導致 YES 跳漲 10-20%，但基本面沒變
- **Mention 市場結構性偏誤：** YES 在短期 mention 市場中結構性高估（「所有人都覺得 Trump 會提到 crypto，但他其實不常提」）
- **散戶偏好長賠率：** 人們喜歡買便宜的 YES（期望 10x），導致不太可能發生的事件被高估

### 3.2 實際案例與數據

| 案例 | 策略細節 | 收益 | 來源 |
|------|---------|------|------|
| Reddit「Fade the Chaos」 | 地緣政治新聞衝擊時買 NO | 「最常見的機構策略之一」 | r/CryptoCurrency |
| Mention 市場 NO 默認 | YES 結構性高估，除非講者歷史上很愛提該詞 | 穩定正期望值 | r/CryptoCurrency 策略 #9 |
| 低概率事件 NO | 「Jesus 2026 年降臨」、「外星人」等 < 3% 事件買 NO | 類穩定幣收益（年化 3-5%） | r/CryptoCurrency 策略 #11 |
| @crypto_betty | NO-Maxi 策略 | 報導 +$200-400/天 | Twitter/X 社群 |

**Reddit 洞察：**
- 策略 #1「Nothing Ever Happens」：當 YES 因新聞跳 10-20%，專業人士立即買 NO
- 策略 #9「Mentions Markets Default to NO」：除非講者歷史上愛提某詞，否則默認買 NO
- 策略 #6「Positive EV Grinding」：90-95% 可能的結果被定價在 70-80%，買明顯結果等回歸

### 3.3 風險分析

| 風險 | 嚴重度 | 說明 |
|------|--------|------|
| 黑天鵝事件 | 高 | 偶爾「不可能的事」真的發生，單筆虧損 100% |
| 資金鎖定期長 | 中 | 長期市場（如 2028 選舉）資金可能鎖數月 |
| 判斷錯誤 | 中 | 誤判哪些市場有偏誤 |
| 流動性 | 低 | NO 側有時流動性較差 |
| 最大虧損估計 | 單筆 100% | 需要分散到多個市場降低風險 |

**失敗場景：** 在「Trump 會提到 crypto 嗎？」市場買 NO，結果他整場演講都在講 crypto。

### 3.4 技術實作建議

1. **新增** `src/bias_detector.ts`
   - 掃描所有活躍市場，偵測結構性偏誤指標：
     - YES 價格 vs 歷史基準率（同類事件多久發生一次？）
     - 短期價格跳升（新聞衝擊偵測）
     - Mention 市場：講者歷史行為分析
   - 輸出偏誤信號（bias score 0-100）

2. **新增** `src/news_sentiment.ts`（可選）
   - 監控 Twitter/新聞 API，偵測情緒驅動的價格跳升
   - 當情緒指標高但基本面不變，觸發 NO 買入信號

3. **API/數據源：**
   - Polymarket API（已有）
   - 歷史定價數據（Polymarket subgraph 或第三方如 polymarketanalytics.com）
   - 新聞 API（NewsAPI.org 或 Brave Search API）

### 3.5 與現有系統整合

- **新增** `src/bias_detector.ts`：偏誤偵測核心
- **新增** `src/news_sentiment.ts`：新聞情緒監控（Phase 2）
- **修改** `src/candidate_generator.ts`：加入偏誤分數作為候選排序依據
- **修改** `src/paper_trader.ts`：支援 NO 側交易邏輯（目前天氣策略可能偏重 YES）

### 3.6 優先級建議

**⭐ 高優先級 — Phase 2**

- 投入：3-4 天開發（基礎版），加新聞情緒 +2-3 天
- 產出：$200-400/天（基於 @crypto_betty 案例，但需更大資金）
- ROI 評估：**高**，但需要更多市場知識和手動校準
- 建議：先建基礎偏誤偵測（統計方法），paper trade 1-2 週驗證

---

## 4. 🛡️ 低風險領先者策略

### 4.1 策略概述

**原理：** 在單一結果市場（如「誰會贏得選舉？」）中，買入已經大幅領先的選項（如 90¢ YES），賺取剩餘 10¢ 的收益。勝率極高但利潤薄。

**為什麼有效：**
- 90¢ YES 意味著市場認為有 90% 機率發生
- 如果你的分析認為實際機率 > 90%，則有正期望值
- 類似於「賣保險」：大多數時候穩賺小錢，偶爾大虧
- Reddit 策略 #6「Positive EV Grinding」的核心思路

### 4.2 實際案例與數據

| 案例 | 策略 | 收益 | 來源 |
|------|------|------|------|
| Reddit「Positive EV Grinding」 | 買 90-95% 可能但市場定價 70-80% 的結果 | 穩定正期望值 | r/CryptoCurrency |
| 「Riskless Rate」市場 | 買極不可能事件的 NO（如外星人 97¢ NO）| 年化 ~3-5% | r/CryptoCurrency 策略 #11 |
| Leaderboard 分析 | 多個頂級交易者用此策略 | 穩定但利潤薄 | polymarketanalytics.com |

### 4.3 風險分析

| 風險 | 嚴重度 | 說明 |
|------|--------|------|
| 尾部風險（黑天鵝） | **高** | 90¢ YES 虧損時 = -90¢，贏時 = +10¢，需要 90% 以上勝率才能獲利 |
| 資金效率低 | 高 | $100 投入只賺 $10-11（如果贏），資金鎖定期間無法做其他交易 |
| 市場操控 | 中 | 大戶可能操控市場製造假信號 |
| 結算爭議 | 低 | Oracle 結算可能有爭議 |
| 最大虧損 | 單筆 -90%（買 90¢ YES 歸零） | 一次黑天鵝可能吃掉 9 次獲利 |

**數學：** 買 90¢ YES → 勝 +$0.10，敗 -$0.90。需要勝率 > 90% 才打平。如果真實機率是 95%，期望值 = 0.95×0.10 - 0.05×0.90 = $0.05（每 $0.90 投入賺 $0.05 = 5.6% ROI）。

### 4.4 技術實作建議

1. **新增** `src/frontrunner_strategy.ts`
   - 掃描所有市場，找到 YES > 85¢ 的選項
   - 評估「真實機率」是否高於市場定價（使用歷史校準、新聞分析）
   - 計算 edge = 估計機率 - 市場隱含機率
   - 只在 edge > 5% 時下注

2. **需要的組件：**
   - 市場篩選器（已有 `polymarket_discover.ts` 可改）
   - 機率校準器（新模組或整合現有 bias_detector）
   - 到期時間計算（短到期 > 長到期，資金效率考量）

### 4.5 與現有系統整合

- **新增** `src/frontrunner_strategy.ts`：領先者策略核心
- **修改** `src/candidate_generator.ts`：加入高概率市場篩選邏輯
- **修改** `src/paper_trader.ts`：支援非天氣市場的交易和結算

### 4.6 優先級建議

**中等優先級 — Phase 2/3**

- 投入：2-3 天開發
- 產出：穩定但薄利，年化約 5-15%（取決於選市場能力）
- ROI 評估：**中等**，更適合大資金（$10K+）
- 以我們目前 $100 paper trading 來說，收益太薄（每筆 ~$5-10）
- 建議：等資金池更大後再考慮，或作為分散風險的輔助策略

---

## 5. 💰 Fee 模型更新與做市策略

### 5.1 策略概述

**原理：** Polymarket 自 2026 年 1 月 19 日起對 15 分鐘加密市場收取 taker fee，fee 收入每日以 USDC 回饋給 market maker。做市商提供流動性（掛限價單），賺取 bid-ask spread + maker rebate。

**官方 Fee 結構（來自 Polymarket 文件）：**
- 15min Crypto：taker fee 最高 1.56%（在 50¢ 時），maker rebate 20%
- Sports (NCAAB, Serie A)：taker fee 最高 0.44%（在 50¢ 時），maker rebate 25%
- 費用在價格極端值（接近 0¢ 或 99¢）趨近零
- Rebate 每日以 USDC 結算，按 fee-curve weighted 分配

**為什麼做市可行：**
- 你掛限價單 = maker，不付 fee，還收到 rebate
- Spread 利潤 + rebate = 雙重收入
- 天氣市場等仍然免 fee，做市更有利

### 5.2 實際案例與數據

| 資訊來源 | 內容 |
|----------|------|
| Polymarket 官方文件 | 15min crypto taker fee 最高 1.56%，maker rebate 20% |
| The Block (2026.01.06) | 「Polymarket 對 15 分鐘加密市場新增 taker fee，資金回饋流動性提供者」 |
| Finance Magnates | 「Polymarket 推出動態 fee 以遏制延遲套利」 |
| Reddit (2026.02) | 「Jan 2026 fee 變更殺死了延遲套利 bot... 現在所有人在找 fee 後策略」 |
| 新市場擴展 | NCAAB（2/18 起）、Serie A（2/18 起）也加入 fee + rebate |

### 5.3 風險分析

| 風險 | 嚴重度 | 說明 |
|------|--------|------|
| 庫存風險 | 高 | 做市商持有的部位可能在市場結算時虧損 |
| 被知情交易者狙擊 | 高 | 延遲套利 bot 仍存在，可能針對你的掛單 |
| 技術複雜度 | 高 | 需要持續掛單、調整 spread、管理庫存 |
| 資金需求 | 中高 | 有效做市至少需要 $1K-5K |
| rebate 不確定性 | 中 | rebate 金額取決於市場總 fee 池和你的市佔率 |

**Fee 數學範例（15min crypto, 100 shares）：**
- 價格 50¢ → taker fee $0.78（1.56%）
- Maker rebate = $0.78 × 20% = $0.156
- 價格 90¢ → taker fee $0.18（0.20%）
- 價格 10¢ → taker fee $0.02（0.20%）

### 5.4 技術實作建議

1. **新增** `src/market_maker.ts`
   - 雙邊掛單引擎：同時掛 bid 和 ask
   - Spread 計算：基於波動率動態調整
   - 庫存管理：偏離中性時調整報價偏移
   - Rebate 追蹤：記錄每日 rebate 收入

2. **新增** `src/fee_calculator.ts`
   - 根據 Polymarket 官方 fee curve 計算 taker fee
   - 計算 breakeven spread（考慮 fee + rebate 後）

3. **API 需求：**
   - Polymarket CLOB API（已有）— 掛單/撤單
   - WebSocket orderbook（已有 `polymarket_books.ts`）
   - Maker Rebates Program API（如果有的話，否則手動追蹤）

4. **做市參數：**
   - 初始 spread：3-5%（保守）
   - 掛單量：每側 $10-50（初期）
   - 庫存上限：單一方向 < 30% 總資金
   - 重新報價頻率：每 10-30 秒

### 5.5 與現有系統整合

- **新增** `src/market_maker.ts`：做市核心引擎
- **新增** `src/fee_calculator.ts`：fee 計算工具
- **修改** `src/polymarket_books.ts`：加入持續 orderbook 監控
- **修改** `src/cross_market_arb.ts`：更新 fee 模型（目前假設 ~2% fee，實際 fee curve 更細緻）
- **修改** `src/index.ts`：加入做市循環

### 5.6 優先級建議

**中等優先級 — Phase 2/3**

- 投入：5-7 天開發（做市引擎複雜度高）
- 產出：spread + rebate 收入，但需要更大資金
- ROI 評估：**中等**，長期穩定但前期投入大
- 以 $100 paper trading 來說太小，至少需要 $1K+
- 建議：先在 paper trading 中模擬做市，同時追蹤 rebate program 的實際數據

---

## 建議實作路線圖

基於我們的現況：
- ✅ Paper trading $100 已上線
- ✅ Weather oracle 已運行
- ✅ 基礎架構（CLOB client, orderbook, arb scanner）已完成

### Phase 1：立即執行（1-2 週）

| 項目 | 優先級 | 預估時間 | 預期影響 |
|------|--------|---------|---------|
| 🌡️ 天氣多模型升級 | P0 | 2-3 天 | 提升預報準確率 5-10%，直接增加 edge |
| 🌡️ London 市場支持 | P0 | 1-2 天 | 開闢新市場，London 利潤最高 |
| 🌡️ 1-2 天窗口優化 | P0 | 0.5 天 | 只在高信心窗口下注 |
| 💰 fee_calculator.ts | P1 | 0.5 天 | 更新 cross_market_arb 的 fee 模型 |

**Phase 1 目標：** 天氣策略從單模型 NOAA 升級為多模型+多城市，最大化已驗證策略的收益。

### Phase 2：驗證階段（第 3-4 週）

| 項目 | 優先級 | 預估時間 | 預期影響 |
|------|--------|---------|---------|
| 🚫 bias_detector.ts | P1 | 3-4 天 | 開啟非天氣市場的 edge 來源 |
| 🚫 NO-Maxi paper trading | P1 | 1 天 | 用 paper trading 驗證偏誤策略 |
| ⚡ exchange_feed.ts | P2 | 2 天 | 即時價格 feed，為 crypto arb 評估做準備 |
| ⚡ crypto arb paper test | P2 | 1 天 | 測試 fee 後是否仍有 edge |

**Phase 2 目標：** 分散策略來源，驗證偏誤偵測在 paper trading 中的表現。

### Phase 3：擴展階段（第 5-8 週，需要更多資金）

| 項目 | 優先級 | 預估時間 | 前提條件 |
|------|--------|---------|---------|
| 🛡️ frontrunner_strategy.ts | P2 | 2-3 天 | 資金 > $500 |
| 💰 market_maker.ts | P3 | 5-7 天 | 資金 > $1K，做市知識 |
| 🌡️ 天氣策略上線真金 | P0 | 1 天 | Paper trading 勝率 > 70% 持續 2 週 |
| 🚫 NO-Maxi 上線真金 | P1 | 1 天 | Paper trading 驗證完成 |

**Phase 3 目標：** 在驗證完成後逐步投入真金，同時評估做市策略可行性。

---

## 現有檔案結構與修改計劃

### 當前 `src/` 結構

```
src/
├── index.ts                    # 主入口，orchestration
├── weather_oracle.ts           # NOAA 天氣預報模組
├── weather_market_scraper.ts   # Polymarket 天氣市場抓取
├── paper_trader.ts             # Paper trading 引擎
├── candidate_generator.ts      # 交易候選生成器
├── polymarket_discover.ts      # 市場發現/搜尋
├── polymarket_books.ts         # Orderbook 數據
├── arb_scanner.ts              # 套利掃描（單市場）
├── cross_market_arb.ts         # 跨市場套利
└── event_resolver.ts           # 事件結算邏輯
```

### 新增檔案計劃

```
src/
├── [修改] index.ts                     # 加入新策略循環
├── [修改] weather_oracle.ts            # 整合多模型（Open-Meteo, ECMWF）
├── [修改] weather_market_scraper.ts    # 加入 London 等非美城市
├── [修改] paper_trader.ts              # 支援非天氣市場、NO 側交易
├── [修改] candidate_generator.ts       # 加入偏誤分數、時間窗口篩選
├── [修改] cross_market_arb.ts          # 更新 fee curve 模型
├── [修改] polymarket_books.ts          # 持續 orderbook 監控（做市用）
├── [新增] weather_multi_model.ts       # 多天氣模型共識引擎
├── [新增] bias_detector.ts             # NO-Maxi 偏誤偵測
├── [新增] crypto_latency_arb.ts        # 加密延遲套利
├── [新增] exchange_feed.ts             # Binance/Coinbase WebSocket feed
├── [新增] frontrunner_strategy.ts      # 低風險領先者策略
├── [新增] market_maker.ts              # 做市引擎
├── [新增] fee_calculator.ts            # Fee curve 計算工具
└── [新增] news_sentiment.ts            # 新聞情緒監控（Phase 2+）
```

### 每個策略的檔案對照

| 策略 | 新增檔案 | 修改檔案 |
|------|---------|---------|
| 🌡️ 天氣優化 | `weather_multi_model.ts` | `weather_oracle.ts`, `weather_market_scraper.ts`, `candidate_generator.ts` |
| ⚡ Crypto 延遲 | `crypto_latency_arb.ts`, `exchange_feed.ts` | `index.ts`, `paper_trader.ts` |
| 🚫 NO-Maxi | `bias_detector.ts`, `news_sentiment.ts` | `candidate_generator.ts`, `paper_trader.ts` |
| 🛡️ 領先者 | `frontrunner_strategy.ts` | `candidate_generator.ts`, `paper_trader.ts` |
| 💰 做市 | `market_maker.ts`, `fee_calculator.ts` | `polymarket_books.ts`, `cross_market_arb.ts`, `index.ts` |

---

## 總結

| 策略 | ROI 潛力 | 風險 | 開發成本 | 推薦順序 |
|------|---------|------|---------|---------|
| 🌡️ 天氣優化 | ⭐⭐⭐⭐⭐ | 低 | 低 | **#1** |
| 🚫 NO-Maxi | ⭐⭐⭐⭐ | 中 | 中 | **#2** |
| 💰 Fee/做市 | ⭐⭐⭐ | 中高 | 高 | **#3** |
| 🛡️ 領先者 | ⭐⭐ | 中 | 低 | **#4** |
| ⚡ Crypto 延遲 | ⭐ | 高 | 中 | **#5**（觀望） |

**核心建議：** 天氣策略是我們的最大優勢——已有基礎設施、已驗證的市場、明確的案例數據。Phase 1 全力優化天氣策略，Phase 2 拓展到偏誤偵測多元化收入來源。
