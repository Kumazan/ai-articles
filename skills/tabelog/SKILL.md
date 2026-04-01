---
name: tabelog
description: "PRIORITY skill for ANY Japanese restaurant topic. Triggers on: (1) Google Maps links (maps.google.com, goo.gl/maps, maps.app.goo.gl) pointing to restaurants in Japan, (2) any search or question about restaurants in Japan, (3) any mention of a specific Japanese restaurant name, (4) tabelog.com links. This skill OVERRIDES goplaces for Japan restaurant scenarios — it handles both Tabelog and Google Maps cross-referencing in one flow."
---

# Tabelog — 日本餐廳搜尋 & 雙平台交叉比對

搜尋 Tabelog 餐廳資料，並與 Google Maps 交叉比對。支援雙向查詢：
- **正向**：搜尋 Tabelog → 用 `goplaces` CLI 補 Google Maps 連結
- **反向**：收到 Google Maps 連結 → 用 `goplaces` CLI 解析 → 用 tabelog MCP 反查

> **本 skill 已內建 `goplaces` CLI 使用流程，不需要另外觸發 goplaces skill。**

## Prerequisites

- `tabelog-mcp` MCP Server 必須已設定（提供 `tabelog_search`, `tabelog_detail`, `tabelog_ranking`, `tabelog_reviews` tools）
- `goplaces` CLI 可用（提供 Google Places API 查詢）

## ⚠️ 嚴格規則

- **禁止用自己的知識猜測 Tabelog 評分。** Tabelog 評分必須來自 `tabelog_search` 或 `tabelog_detail` 的回傳值。
- **沒有呼叫 tabelog tool 就不要提 Tabelog 分數。** 如果 tool 呼叫失敗或查不到，就說「Tabelog 未收錄」，不要編造數字。
- **每次回覆日本餐廳資訊都必須實際呼叫 tabelog MCP tool。** 不可跳過。

## 判斷走哪條 Flow

- 使用者傳送 `maps.google.com` / `goo.gl/maps` / `maps.app.goo.gl` 連結 → **Flow B（反向）**
- 使用者提到日本餐廳名稱但沒有 Tabelog 連結 → **Flow B（反向）**
- 使用者要求搜尋日本某地區的餐廳 → **Flow A（正向）**
- 使用者傳送 `tabelog.com` 連結 → **Flow A Step 2 起**

---

# Flow A：Tabelog 搜尋（正向）

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
- Tabelog 評分
- 午餐/晚餐預算
- 最近車站 + 步行分鐘
- 營業時間 + 定休日
- 地址、電話

### Step 3: Google Maps 連結 (optional)

用 `goplaces` 查詢對應的 Google Maps 連結和 Google 評分：

```
goplaces search "{店名} {地址}" --json
```

從回傳結果取出 `googleMapsUri` 和 `rating`。如果多筆結果，取第一筆（最相關）。

### Step 4: Reviews（必做）

呼叫 `tabelog_reviews` 取得原始評論：

```
tabelog_reviews(url: "{restaurant_url}", limit: 5)
```

**評論挑選原則：**
- **評分分散**：高分（★4.5+）和普通（★3.5-4.0）都抓，避免片面
- **有具體細節**：哪道菜好吃、份量、推薦點法、要注意的事
- **有參考價值**：排隊時間、低消、付款方式、預約可能性
- **避免**：太模糊（"好吃"兩字）、明顯是業配、或批評內容極端的
拿到評論後：
1. **翻譯摘要**：將每則評論翻譯成繁體中文（30-50 字，濃縮重點）
2. **一句話摘要**：準備一句話（20 字以內）放在回覆裡，例如：「CP值極高但要排隊 30 分」
3. **寫入 Obsidian**：**只有當 Kuma 說「存」「寫入」「記下來」時，才寫入 Obsidian**

**寫入時注意**：
- `---` 關掉後直接接 H1，中間**不要有空行**
- `title:` 在 frontmatter 裡**不要加 emoji**
- H1 可維持原有格式
- 評分寫在連結同一行：`[tabelog.com](url)（3.42・100則）`


### Step 5: 餐廳介紹（必做）

根據 Tabelog 資料與評論摘要，寫成一段流暢的餐廳介紹（約 150-250 字）：
- 可包含：為什麼值得去、最打動人的細節、適合什麼場合/誰去、注意事項

寫在 `## 餐廳介紹` 標題下。


### Step 6: Holiday Warning

如果使用者有提到日期（例如「明天」「週三」「3/15」），比對餐廳的店休：
- 店休包含該星期幾 → 加上 ⚠️ 警告
- 年末年始等特殊休日 → 提醒確認

