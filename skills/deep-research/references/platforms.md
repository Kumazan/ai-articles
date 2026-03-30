# Platform UI 操作指南

每個平台的具體操作步驟、完成判斷條件。

> **重要**：每次操作前都要先 `openclaw browser snapshot --interactive --compact` 取最新 snapshot 找 ref，不要用記憶中的舊 ref。

---

## ChatGPT（chatgpt.com）

### 1. 開 Tab 並導航

ChatGPT 有**直通 URL**：

```bash
openclaw browser tab new
openclaw browser navigate "https://chatgpt.com/deep-research"
```

這樣會直接進入 Deep Research 頁面，不需要額外點選。

### 2. 送出 Deep Research 查詢

方法 A（直接輸入，通常 GPT-4o 預設有 Research 工具）：

```bash
# 找輸入框
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 點輸入框
openclaw browser --browser-profile openclaw click <textarea-ref>
# 輸入查詢
openclaw browser --browser-profile openclaw type <textarea-ref> "<查詢內容>"
```

接著找並點 Deep Research / Research 按鈕（通常在輸入框附近）：

```bash
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 找 "Research" 或 "Deep research" button/label
openclaw browser --browser-profile openclaw click <research-button-ref>
# 確認後送出
openclaw browser --browser-profile openclaw click <send-button-ref>
```

### 3. 完成判斷

輪詢時 snapshot 並檢查：
- **完成信號**：出現含大量文字的回應區塊，且沒有 spinner / loading 動畫
- **仍在執行**：有 "Researching..." 文字、或 loading indicator、或 "Searching the web" 狀態
- **抓取方式**：`openclaw browser --browser-profile openclaw snapshot --selector "article" --compact` 或直接 evaluate：

```bash
openclaw browser --browser-profile openclaw evaluate --fn 'document.querySelector("article")?.innerText?.slice(0, 20000)' 
```

---

## Gemini（gemini.google.com）

### 1. 開 Tab 並導航

```bash
openclaw browser --browser-profile openclaw tab new
openclaw browser --browser-profile openclaw navigate "https://gemini.google.com"
```

### 2. 送出 Deep Research 查詢

```bash
# 取 snapshot 找輸入框
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 點輸入框，輸入查詢
openclaw browser --browser-profile openclaw click <textarea-ref>
openclaw browser --browser-profile openclaw type <textarea-ref> "<查詢內容>"
```

找 Deep Research 按鈕（在輸入框附近，通常有 "Deep Research" 或放大鏡＋書本圖示）：

```bash
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 找 deep-research toggle 或 button
openclaw browser --browser-profile openclaw click <deep-research-ref>
openclaw browser --browser-profile openclaw click <send-button-ref>
```

### 3. 確認 Outline（若出現）

Gemini Deep Research 有時會先顯示研究計畫要確認：

```bash
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 找 "Start research" 或 "Confirm" 按鈕
openclaw browser --browser-profile openclaw click <confirm-ref>
```

### 4. 完成判斷

```bash
openclaw browser --browser-profile openclaw evaluate --fn 'document.querySelector("[data-message-id]")?.innerText?.slice(0, 20000)'
```

- **完成信號**：response 容器存在且 spinner class 消失、有完整段落文字
- **仍在執行**：有 `mat-progress-spinner` 或 "Researching" 狀態文字

---

## Claude（claude.ai）

### 1. 開 Tab 並導航

```bash
openclaw browser --browser-profile openclaw tab new
openclaw browser --browser-profile openclaw navigate "https://claude.ai/new"
```

### 2. 啟用 Research 模式並送出查詢

```bash
# 取 snapshot 找輸入框
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 點輸入框
openclaw browser --browser-profile openclaw click <textarea-ref>
# 輸入查詢
openclaw browser --browser-profile openclaw type <textarea-ref> "<查詢內容>"
```

找 Research 按鈕（通常在輸入框下方工具列，圖示為書本/放大鏡）：

```bash
openclaw browser --browser-profile openclaw snapshot --interactive --compact
# 找 "Research" toggle 或 button
openclaw browser --browser-profile openclaw click <research-ref>
openclaw browser --browser-profile openclaw click <send-button-ref>
```

### 3. 完成判斷

```bash
openclaw browser --browser-profile openclaw evaluate --fn 'document.querySelector(".font-claude-message")?.innerText?.slice(0, 20000)'
```

- **完成信號**：`font-claude-message` 有完整回應文字，且沒有 streaming cursor
- **仍在執行**：有 streaming indicator、或文字還在增加中（短時間內兩次 snapshot 結果不同）

---

## 輪詢策略

```
每 2 分鐘 cron → focus tab → snapshot → 判斷 done/pending
超過 45 分鐘 → timeout，取現有結果
```

完成判斷的簡易流程：

```
snapshot 結果長度 > 1000 字 AND 無 loading spinner → done
```
