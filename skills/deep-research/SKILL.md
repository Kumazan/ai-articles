---
name: deep-research
description: 同時對 ChatGPT、Gemini、Claude 三個平台進行 Deep Research，背景執行等待完成，回報各家原文摘要＋整合報告。觸發關鍵字：deep research、深度研究、同時研究、多 LLM 研究、三個 LLM、並行研究。需要 OpenClaw browser tool（profile=openclaw）且三個平台均已登入。
---

# Deep Research Skill

同時對 ChatGPT、Gemini、Claude.ai 三平台送出 Deep Research，背景等待完成，輸出各家摘要 + 整合報告。

## 前置需求

- `openclaw browser --browser-profile openclaw status` 確認 browser 在跑
- 三平台均已登入：`chatgpt.com`、`gemini.google.com`、`claude.ai`
- 訂閱：ChatGPT Plus/Pro、Gemini Advanced、Claude Max/Pro

## 執行流程

### Step 0：釐清並確認 Prompt（必做）
起草完整研究問題（含年份、範圍、語言）給使用者確認，等 OK 才繼續。

### Step 1：建立 State File
在 `~/.openclaw/workspace/deep-research/` 新建 `YYYYMMDD-HHMMSS-<slug>.json`。Schema 見 `references/state-schema.json`。

### Step 2：開三個 Tab 並送出查詢
依序開 ChatGPT → Gemini → Claude 三個 tab，記錄 `targetId` 和 conversation URL 到 state file。UI 操作細節見 `references/platforms.md`。
**重要：query 末尾加「請直接開始研究，不需要先問釐清問題。」**

### Step 3：spawn 背景 subagent 輪詢
主 agent 回覆使用者「已送出，背景監控中」，spawn subagent 每 2 分鐘 snapshot 各 tab：完成則擷取結果存 state file（status → `done`）；全部完成或超 45 分鐘則生成報告發到觸發 channel。擷取腳本見 `scripts/extract-results.md`。

### Step 4：生成報告
讀取 state file 三份 results，輸出三平台摘要 + 整合分析（共識/差異/結論/信心度）。報告格式見 `references/report-template.md`。

### Step 5：存到 Obsidian
報告發 Discord 後，同時用 `obsidian-cli` 存筆記到 Kuma vault。路徑與 frontmatter 格式見 `references/report-template.md`。

## State File 管理

- 路徑：`~/.openclaw/workspace/deep-research/`（不存在就建）
- 命名：`YYYYMMDD-HHMMSS-<slug>.json`
- 頂層 `reportStatus` 完成後改為 `reported`

## 常見問題

- **Gemini 跳出確認 outline**：snapshot 找 "Confirm"/"Start" 按鈕，自動點擊
- **ChatGPT 沒有 Research 按鈕**：在輸入框附加功能選單中選 Deep Research
- **超過 45 分鐘未完成**：取已完成的結果先出報告，未完成標注 ⏳ 仍在執行中
- **Browser 找不到 tab**：用 `openclaw browser tabs --json` 確認 targetId，重新 focus
- **查詢進度**：使用者問「進度？」時，讀 state file 回報各平台 ✅/⏳ 狀態
