---
name: deep-research
description: 同時對 ChatGPT、Gemini、Claude 三個平台進行 Deep Research，背景執行等待完成，回報各家原文摘要＋整合報告。觸發關鍵字：deep research、深度研究、同時研究、多 LLM 研究、三個 LLM、並行研究。需要 OpenClaw browser tool（profile=openclaw）且三個平台均已登入。
---

# Deep Research Skill

同時對 ChatGPT、Gemini、Claude.ai 三平台送出 Deep Research 查詢，背景輪詢等待完成，最後輸出各家原文摘要 + 整合報告。

## 前置需求

- `openclaw browser --browser-profile openclaw status` 確認 browser 在跑
- 三個平台均已登入（`chatgpt.com`、`gemini.google.com`、`claude.ai`）
- 訂閱：ChatGPT Plus/Pro、Gemini Advanced、Claude Max/Pro

## 執行流程

### Step 0：釐清並確認 Prompt（必做）

收到研究主題後，**不要直接開始**。先起草 prompt 給使用者確認：

```
研究主題確認：
📝 Prompt：「[完整研究問題，包含年份、範圍、語言]」

這樣可以嗎？確認後我同時發送到三個平台。
```

等使用者說 OK 才進行 Step 1。

### Step 1：建立 state file

在 `~/workspace/deep-research/` 新建 `YYYYMMDD-HHMMSS.json`：

```json
{
  "query": "<查詢內容>",
  "startTime": "<ISO timestamp>",
  "status": { "chatgpt": "pending", "gemini": "pending", "claude": "pending" },
  "tabIds": { "chatgpt": "", "gemini": "", "claude": "" },
  "results": { "chatgpt": "", "gemini": "", "claude": "" }
}
```

### Step 2：開三個 Tab 並送出查詢

每個平台步驟見 `references/platforms.md`。

依序開三個 tab，記錄每個 tab 的 `targetId` 到 state file 的 `tabIds`，然後在各 tab 分別導航並送出查詢。送出後記錄每個平台的 **conversation URL**（包含對話 ID）到 state file 的 `conversationLinks`，確保報告不會遺失。

**重要：query prompt 末尾加上「請直接開始研究，不需要先問釐清問題。」** 避免 Claude 先問問題再開始。

**順序：**
1. 開 ChatGPT tab → 送查詢（Deep Research 模式）
2. 開 Gemini tab → 送查詢（Deep Research 模式）
3. 開 Claude tab → 送查詢（Research 模式）

### Step 3：設定背景輪詢 cron

建立 cron job，每 2 分鐘輪詢一次：
- payload 讀取 state file
- 對每個「pending」的 tab 做 snapshot，判斷是否完成（見 references/platforms.md 完成判斷條件）
- 完成就把結果存到 state file，status 改為 `done`
- 全部 done 或超過 45 分鐘 → 停止 cron、執行 Step 4

### Step 4：生成報告

讀取 state file 中三份 results，用以下格式輸出報告並發到 Discord：

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

## State File 管理

- 路徑：`~/workspace/deep-research/`（不存在就建）
- 命名：`YYYYMMDD-HHMMSS-<slug>.json`
- 輪詢 cron 的 job ID 也存進 state file 以便完成後刪除

## 擷取結果技巧

### ChatGPT
報告在主 conversation tab（不是 `connector_openai_deep_research` iframe tab）。
用 `openclaw browser snapshot` 取 ARIA tree，再 parse `- text:` 節點即可。

### Gemini
Deep Research 完成後會生成**研究報告面板**（右側 Canvas），用以下步驟擷取：

1. 找「分享及匯出」按鈕並點擊（在報告面板頂部）
2. 在下拉選單中找「複製內容」並點擊：
   ```python
   # 用 evaluate 找到並點擊（因為可能不在 ARIA tree）
   openclaw browser evaluate --fn '(function(){ var btn = Array.from(document.querySelectorAll("button")).find(function(b){ return b.textContent.trim() === "複製內容"; }); if(btn){ btn.click(); return "clicked!"; } return "not found"; })()'
   ```
3. 用 `pbpaste` 讀取剪貼簿（macOS），注意用 Python 解碼 bytes：
   ```python
   import subprocess
   result = subprocess.run(['pbpaste'], capture_output=True)
   gemini_text = result.stdout.decode('utf-8', errors='replace')
   ```

**注意**：如果 Gemini 報告右上角有「建立」按鈕且不小心點到，會生成 SPA 網頁（iframe），這不是原本的文字報告。直接用「分享及匯出 → 複製內容」即可取得原始 Markdown。

### Claude
報告通常生成為**Document Artifact**（isolated iframe），無法跨 origin 讀取。但 artifact panel 頂部有 **split button**：

- 左半邊「**Copy**」= 直接複製全文到 clipboard
- 右半邊「**∨**」= 展開選單（Download as Markdown / Download as PDF）

操作流程：
1. **必須先點開 artifact card**（對話裡的 Document 卡片，標題如「OpenClaw and Claude Code Deep Comparison...」），才會展開右側 artifact panel，Copy button 才可見。用 evaluate 找到並 click：
   ```bash
   openclaw browser evaluate --fn '(function(){ var divs = document.querySelectorAll("div"); var card = Array.from(divs).find(function(el){ return el.children.length < 5 && el.textContent.includes("Document") && el.textContent.length < 200; }); if(card){ card.click(); return "clicked card"; } return "not found"; })()'
   ```
   或直接點 artifact card 的標題文字所在的 div。
2. 在 snapshot 找 `Copy` button（在 `Close artifact` 附近，通常是 `Copy options` 旁邊那個）：
   ```bash
   openclaw browser snapshot --efficient | grep -E "Copy|Close artifact"
   # Copy = e43, Copy options = e44（舉例）
   ```
3. 點 Copy（不是 Copy options）：
   ```bash
   openclaw browser click <Copy-ref>
   ```
4. 用 `pbpaste` 讀取（bytes decode）：
   ```python
   import subprocess
   result = subprocess.run(['pbpaste'], capture_output=True)
   claude_text = result.stdout.decode('utf-8', errors='replace')
   ```

## 常見問題

- **Gemini 跳出確認 outline 步驟**：snapshot 確認有 "Confirm" 或 "Start" 按鈕，自動點擊
- **ChatGPT 沒有 Research 按鈕**：可能需要在輸入框右側找附加功能選單
- **Tab 超時（45min）**：取目前有完成的結果先輸出，未完成的標注 `⏳ 仍在執行中`
- **Browser 找不到 tab**：用 `openclaw browser tabs --json` 確認 targetId，重新 focus

詳細 UI 操作流程見 `references/platforms.md`。
