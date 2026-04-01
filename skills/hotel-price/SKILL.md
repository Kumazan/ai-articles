---
name: hotel-price
description: Use Playwright to query real-time hotel prices from Booking.com, Agoda, and Trip.com simultaneously. Use when the user asks about hotel prices, room rates, or wants to compare accommodation costs across platforms.
---

# Hotel Price — OTA 跨平台房價查詢

## Prerequisites

- Playwright MCP 必須可用（`browser_navigate`, `browser_snapshot`, `browser_click`）
- `web_search` 必須可用

## Input

從使用者訊息中提取：
- **飯店名**：單間或多間（逗號/換行分隔）
- **check-in / check-out**：YYYY-MM-DD 格式
- **人數**：預設 2
- **幣別**：預設 TWD

## Flow

對每間飯店依序執行：

### Step 1: 搜尋各平台 URL
平行執行三組 `web_search`（`site:booking.com/agoda.com/trip.com {飯店名} hotel`），取第一個符合的飯店頁 URL。**不猜 URL slug**。

### Step 2: 帶日期參數開頁面
用 `browser_navigate` 加日期與人數參數。URL 格式詳見 `references/url-formats.md`。

### Step 3: 提取價格
用 `browser_snapshot` + grep（關鍵字：`TWD|NT\$|每晚|price|total|房型`）。只讀價格區塊。提取：房型名、含餐、價格、含稅狀態、取消政策。

### Step 3.5: Trip.com 展開更多房型
找「顯示其他X個房型價格」按鈕 `browser_click` 展開，再重新 snapshot。

### Step 4: 驗證頁面正確性
Page Title 或 heading 須包含飯店名；否則標示該平台「未找到」，退回搜尋 URL。

### Step 5: 統一計算每晚含稅均價
將三平台統一換算為 TWD 每晚含稅均價以便比較。計算規則詳見 `scripts/price-calculator.md`。

### Step 6: 整理輸出
按輸出環境選格式，各房型標記最低價，**必須附各平台直達連結**。格式詳見 `references/output-templates.md`。

## Fallback 決策表

| 狀況 | 處理 |
|------|------|
| 搜尋找不到某平台 URL | 給 Fallback 搜尋 URL，標示「搜尋連結」|
| Playwright 載入失敗 / WAF | 標示「無法查詢」，給搜尋 URL |
| 售罄 / 不接受預訂 | 標示「已售罄」|
| 全部失敗 | 只給官網 + 搜尋 URL |

Fallback URL 格式詳見 `references/url-formats.md`。
平台注意事項詳見 `references/gotchas.md`。

## Batch Mode

多間飯店時：
1. 逐間執行 Step 1~6，每間完成後立即輸出（不等全部完成）
2. 全部完成後加總覽比較（最便宜標記）
3. 最後執行 `browser_close` + 清暫存 snapshot 檔案
