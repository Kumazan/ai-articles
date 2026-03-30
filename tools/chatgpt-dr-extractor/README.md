# ChatGPT Deep Research Extractor

一鍵複製 ChatGPT Deep Research 報告到剪貼簿。

## 解決的問題

ChatGPT Deep Research 完成後，報告顯示在一個跨 origin 的 iframe 裡（`connector_openai_deep_research.web-sandbox.oaiusercontent.com`），任何從外部 JS 或 CDP 讀取的嘗試都被 sandbox 封死。

Chrome Extension 是唯一能繞過這個限制的方法，因為 content scripts 有特殊權限可以注入跨 origin iframe。

## 安裝方式

1. 打開 Chrome，進入 `chrome://extensions/`
2. 右上角開啟「開發人員模式」
3. 點「載入未封裝項目」
4. 選擇這個資料夾：`/Users/kumax/.openclaw/workspace/tools/chatgpt-dr-extractor/`
5. 完成！

## 使用方式

1. 前往 ChatGPT，送出 Deep Research 查詢
2. 等研究完成後，頁面右下角會出現「📋 複製研究報告」浮動按鈕
3. 點一下按鈕，報告全文就會複製到剪貼簿
4. 出現「✅ 已複製！」即成功

## OpenClaw 整合（可選）

Extension 也會嘗試把報告 POST 到 `http://localhost:19999/deep-research-report`。

如果想啟用這個功能，在 OpenClaw 設定一個 webhook listener 監聽該 port，或用以下指令啟動簡易 server：

```bash
python3 -m http.server 19999
```

## 技術架構

```
chatgpt.com page
  └── content.js         # 浮動按鈕 UI，偵測 iframe 存在
        │
        ↕ chrome.runtime.sendMessage
        │
  background.js          # Service Worker，路由訊息
        │
        ↕ chrome.tabs.sendMessage
        │
iframe (connector_openai_deep_research)
  └── iframe_reader.js   # 讀取 document.body.innerText
```

## 檔案說明

- `manifest.json` — Extension 設定，宣告 host_permissions 讓 content script 可進入 iframe
- `content.js` — 注入 chatgpt.com，顯示按鈕
- `iframe_reader.js` — 注入 iframe，讀取報告文字
- `background.js` — 路由 iframe → content 訊息，可選傳送到 OpenClaw
