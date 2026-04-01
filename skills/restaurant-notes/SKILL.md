---
name: restaurant-notes
description: 將餐廳資料寫入 Obsidian「想去的餐廳」資料夾。觸發條件：當 Kuma 說「存」「寫入」「記下來」「記錄」「存起來」「寫到 Obsidian」「加到筆記」「想去的餐廳」等任何表示要儲存的語句時。平常查完餐廳可主動問「要存到『想去的餐廳』嗎？」。需先完成 Tabelog 資料查詢（評分、評論）和 goplaces 交叉確認（地址、電話、Google Maps）。
---

# Obsidian 餐廳筆記建立

收到 Kuma 的「存」指令時，將餐廳資料寫入 Obsidian。

## 寫入路徑

```
~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Kuma/Projects/2026 日本慶生之旅/想去的餐廳/
```

## 檔案命名

```
{類型}｜{店名}（{地點}）.md
```

- 例：`印度料理｜SpiceBar モンカリー（澀谷）.md`
- 例：`流行｜AMI Paris Café（表參道）.md`
- 例：`燒肉｜蕃 YORONIKU（惠比壽）.md`

## Frontmatter 格式

```yaml
---
title: {類型}｜{店名}（{地點}）
tags:
  - 2026日本慶生之旅
  - {類型}
---
```

**注意**：`title:` **不要加 emoji**，用純文字。

## H1 格式

H1 可以加 emoji：

```
# 🍽️ {類型}｜{店名}（{地點}）
```

## 寫入規則

### 1. `---` 關掉後直接接 H1
中間**不要有空行**。寫完後用 Python 確認：

```python
import re, os
path = "..."
with open(path) as f:
    c = f.read()
# 確保沒有 --- 後緊跟空行再 H1
if re.search(r'^---\n\n^# ', c, re.MULTILINE):
    print("有空行，需要修復")
```

### 2. 評分寫在連結同一行

```
- **Tabelog：** [tabelog.com/...](URL)（3.42・100則）
- **Google Maps：** [maps.app.goo.gl](URL)（3.8）
```

### 3. 餐廳介紹（約 150-250 字）

寫在 `## 餐廳介紹` 標題下。

結合這間店的定位/風格、評論觀察、亮點，寫成一段流暢的介紹。可包含：
- 為什麼值得去
- 最打動人的細節
- 適合什麼場合/誰去
- 注意事項

**不要另外建立「特色」區塊**，這些內容已經融合在「餐廳介紹」裡。

### 4. 完整筆記區塊順序

```markdown
## 餐廳介紹
（150-250字流暢段落）

## 基本資訊
- **店名：** ...
- **Tabelog：** [url](url)（評分）
- **Google Maps：** [maps.app.goo.gl](url)（評分）
- **電話：** ...
- **地址：** ...

## 交通
- 最近車站 徒步X分

## 營業時間
- 每日 11:00～22:00
- 定休：週X

## 預算
- 晚餐：¥X,000～
- 午餐：¥X,000～

## 招牌菜色
- 品項 1 ¥X,XXX
- 品項 2 ¥X,XXX

## 付款方式
- 刷卡可 / PayPay / 現金

## 備註
- 特殊規則（如有）
- 排隊建議
- 預約方式

## Tabelog 評論（翻譯）
**評論者（★X.X）**
翻譯摘要（30-50字）

**評論者（★X.X）**
翻譯摘要（30-50字）

## 狀態
- ⏳ 待排入行程
```

## 模板檔案

參考：`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Kuma/Projects/2026 日本慶生之旅/想去的餐廳/📋 餐廳筆記範本.md`

## 寫入後動作

1. 寫完後用 Python 確認無空行問題（見規則 1）
2. 執行 `qmd update` 同步索引
3. 回報已寫入，告知檔案路徑

## 注意

- **只有當 Kuma 說「存」「寫入」「記下來」時才寫入**，平常查餐廳只回覆不寫入
- **title: 不要加 emoji**（但 H1 可以）
- **`---` 和 H1 中間不能有空行**
- **評分寫在連結同一行括號內**，不用另外的評分表格
- **刪掉「特色」區塊**，融合進「餐廳介紹」

## ⚠️ 每次建立新筆記前必讀

**每次寫入 Obsidian 前**，必須先讀取最新範本：

```bash
obsidian vault="Kuma" read path="Projects/2026 日本慶生之旅/想去的餐廳/📋 餐廳筆記範本"
```

然後根據範本格式寫入。新建出來的筆記格式必須與範本完全一致。
