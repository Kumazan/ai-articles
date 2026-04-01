# Report Template — Deep Research

## Discord 輸出格式

```
## 🔬 Deep Research 完成：<query>

### 📊 ChatGPT 研究摘要
<300-500字摘要，保留關鍵數據、觀點、結論>

### 📊 Gemini 研究摘要
<300-500字摘要>

### 📊 Claude 研究摘要
<300-500字摘要>

---

### 🧠 整合分析報告
**共識觀點：**
<三家共同認同的核心發現>

**差異與互補：**
<各家獨特觀點或側重點>

**綜合結論：**
<整合三家研究的最終判斷>

**信心度：** ⭐⭐⭐⭐☆（4/5）
```

---

## Obsidian 筆記格式

路徑：`~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Kuma/Deep Research/<標題>.md`
標題：研究主題的簡短中文摘要（如「2026 台灣地方選舉藍白合分析」）

```markdown
---
tags:
  - deep-research
date: <YYYY-MM-DD>
query: "<原始查詢>"
platforms:
  - chatgpt
  - gemini
  - claude
---
# <研究主題>

<完整報告內容，包含三家摘要 + 整合分析>

## 原始連結

- ChatGPT: <conversation URL>
- Gemini: <conversation URL>
- Claude: <conversation URL>
```

用 `obsidian-cli` 建立筆記；`Deep Research/` 資料夾不存在就建。

---

## 進度回報格式

使用者問「進度？」時，主 agent 讀 state file 回報：

```
深度研究進度：
- ChatGPT: ✅ 完成
- Gemini: ⏳ 研究中（已 12 分鐘）
- Claude: ⏳ 研究中（已 12 分鐘）
```
