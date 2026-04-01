---
name: tabelog
description: Search and read Japanese restaurant data from Tabelog. Use when the user asks about restaurants in Japan, wants to find restaurants by area/genre/budget, or needs restaurant details like ratings, hours, and holidays.
---

# Tabelog — 日本餐廳搜尋

搜尋 Tabelog 餐廳資料，支援地區、類型、預算篩選，回傳結構化資訊。

## Prerequisites

- `tabelog-mcp` MCP Server 必須已設定（提供 `tabelog_search`, `tabelog_detail`, `tabelog_ranking`, `tabelog_reviews` tools）

## Input

從使用者訊息中提取：
- **地區**：東京、大阪、京都等，加上細分區域（澀谷、新宿、銀座）
- **類型**：拉麵、壽司、燒肉、居酒屋等
- **預算**：每人預算範圍
- **用途**：午餐 or 晚餐（影響顯示哪個預算）
- **日期**：用於定休日比對（optional）

## Area Code Mapping

常用地區對照：

| 地區 | area 參數 |
|------|----------|
| 東京 澀谷 | tokyo/A1303/A130301 |
| 東京 新宿 | tokyo/A1304/A130401 |
| 東京 銀座 | tokyo/A1301/A130101 |
| 東京 池袋 | tokyo/A1305/A130501 |
| 東京 上野 | tokyo/A1311/A131101 |
| 東京 六本木 | tokyo/A1307/A130701 |
| 大阪 難波 | osaka/A2701/A270202 |
| 大阪 梅田 | osaka/A2701/A270101 |
| 京都 河原町 | kyoto/A2601/A260201 |
| 福岡 博多 | fukuoka/A4001/A400101 |

如果使用者說的地區不在上面，用 web_search 搜尋「tabelog {地區名} area code」找到正確的路徑。

## Genre Mapping

| 中文 | genre 參數 |
|------|-----------|
| 拉麵 | ramen |
| 壽司 | sushi |
| 燒肉 | yakiniku |
| 和食 | washoku |
| 居酒屋 | izakaya |
| 咖啡廳 | cafe |
| 法式 | french |
| 義式 | italian |
| 中華 | chinese |
| 咖哩 | curry |

## Flow

### Step 1: Search

呼叫 `tabelog_search` 取得搜尋結果：

```
tabelog_search(area: "{area_code}", genre: "{genre}", sort: "rating")
```

### Step 2: Detail (optional)

對使用者感興趣的餐廳，呼叫 `tabelog_detail` 取得完整資訊：

```
tabelog_detail(url: "{restaurant_url}")
```

回傳包含：
- Tabelog 評分 + Google Maps 評分（如有設定 API key）
- 午餐/晚餐預算
- 最近車站 + 步行分鐘
- 營業時間 + 定休日
- 地址、電話

### Step 3: Reviews + LLM Summary (optional)

呼叫 `tabelog_reviews` 取得原始評論：

```
tabelog_reviews(url: "{restaurant_url}", limit: 5)
```

拿到評論文字後，用 LLM 做一句話摘要（20 字以內），例如：
- 「CP值極高但要排隊 30 分」
- 「食材新鮮，服務普通」
- 「氛圍佳適合約會，價位偏高」

### Step 4: Holiday Warning

如果使用者有提到日期（例如「明天」「週三」「3/15」），比對餐廳的定休日：
- 定休日包含該星期幾 → 加上 ⚠️ 警告
- 年末年始等特殊休日 → 提醒確認

## Tabelog 評分指南

回覆時簡短說明評分水準，幫助使用者理解分數的意義：

| 分數 | 等級 | 全體佔比 | 說明 |
|------|------|---------|------|
| ~3.0 | 一般 | 大部分 | 評論不夠多、新店、或普通 |
| 3.0-3.5 | 好店 | — | 有穩定評價，不會踩雷 |
| 3.5-4.0 | 名店 | TOP 3% | 食客公認的好店，滿意率很高 |
| 4.0+ | 頂級 | TOP 0.07% | 幾乎不可能失望，通常需預約 |

搜尋結果中如果有 3.5+ 的店要標記「名店」，4.0+ 標記「頂級」。

## Output Rules

- **每間餐廳必須附上 Tabelog 連結（URL）。** 絕對不能省略。URL 來自 `tabelog_search` 回傳的 `url` 欄位。
- **Discord / Telegram 不要用 markdown table。** 等寬文字表格在手機上會跑版。一律用 list format。
- 多間餐廳用 list format，每間一個 block，店名直接是連結。

## Output Format

所有環境統一用 list format（Claude Code / Discord / Telegram 都適用）：

```
🍽 澀谷 燒肉 推薦 Top 3

1️⃣ [炭火焼 ゆうじ](https://tabelog.com/tokyo/A1303/A130301/13001794/)
⭐ 4.19（2,238 筆評論）
💰 晚餐 ￥6,000～￥7,999
🚶 澀谷駅 10分
💬 CP值高要排隊

2️⃣ [赤坂 らいもん](https://tabelog.com/tokyo/A1308/A130801/13012345/)
⭐ 4.57（549 筆評論）
💰 晚餐 ￥15,000～
🚶 赤坂駅 5分
💬 激素燒肉名店

3️⃣ [スタミナ苑](https://tabelog.com/tokyo/A1324/A132401/13006789/)
⭐ 4.32（2,622 筆評論）
💰 晚餐 ￥6,000～
🚶 足立區
💬 平價大份量
⚠️ 週三定休（你的行程日 3/15 是週三）
```
