# Platform UI Operations — Deep Research

## ChatGPT (chatgpt.com)

### 送出查詢
1. 導航到 `https://chatgpt.com`
2. 在輸入框左側找「深入研究」或「Research」按鈕（或附加功能選單中選 Deep Research）
3. 輸入 prompt 並送出

### 完成判斷
- Snapshot ARIA tree 中出現完整研究報告段落
- 不再有「正在研究中」或 loading spinner 文字

### 擷取結果
- 報告在主 conversation tab（**非** `connector_openai_deep_research` iframe tab）
- 用 `openclaw browser snapshot` 取 ARIA tree，parse `- text:` 節點

---

## Gemini (gemini.google.com)

### 送出查詢
1. 導航到 `https://gemini.google.com`
2. 在 Deep Research 模式下輸入 prompt 並送出
3. 若跳出確認 outline 步驟：snapshot 確認有 "Confirm" 或 "Start" 按鈕，自動點擊

### 完成判斷
- 右側 Canvas 出現研究報告面板
- 不再有進度條或「正在研究」文字

### 擷取結果
1. 找「分享及匯出」按鈕並點擊（在報告面板頂部）
2. 在下拉選單中找「複製內容」並點擊（見 scripts/extract-results.md）
3. 用 `pbpaste` 讀取剪貼簿（見 scripts/extract-results.md）

**注意**：不要點「建立」按鈕，會生成 SPA 網頁 iframe 而非文字報告。

---

## Claude (claude.ai)

### 送出查詢
1. 導航到 `https://claude.ai`
2. 選擇 Research 模式
3. Prompt 末尾加「請直接開始研究，不需要先問釐清問題。」避免 Claude 先確認
4. 送出查詢

### 完成判斷
- 對話出現 Document Artifact 卡片（有「Document」標籤）
- 不再有 thinking/loading 狀態

### 擷取結果
1. 點開對話中的 Document Artifact 卡片（才會展開右側 artifact panel）
2. 在 snapshot 找 `Copy` button（在 `Close artifact` 附近）
3. 點 Copy（不是 Copy options）
4. 用 `pbpaste` 讀取（見 scripts/extract-results.md）

詳細 JS 程式碼見 `scripts/extract-results.md`。
