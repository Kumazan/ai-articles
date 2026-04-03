# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

### STARLUX (JX) 哩程與規則 (2024/03 改表版)
- 亞洲區來回：商務 60,000 哩 / 經濟 35,000 哩 / 頭等 100,000 哩。
- 商務艙貴賓室：僅限本人使用，不可攜伴（不論現金票或哩程票，除非具備 Explorer 以上身分）。

### 縮寫速記
- **cc oet** = Claude Code (opus + extended thinking)
- **cc** = Claude Code

### Obsidian 筆記寫作規則

- **跨筆記一定要加 `[[wikilink]]`**：提到其他筆記、skill、專案時，用 `[[路徑/筆記名]]` 而非純文字
- 反例：寫「參考 OpenClaw/技能」→ 應改成 `[[OpenClaw/技能]]`

### Edit Tool Gotchas

- **`edits[]` 陣列模式 + 中文 = 失敗**：當 `edits[]` 的 `oldText` 含中文字，JSON 序列化可能轉成 Unicode escape（`\u5f88\u591a...`），導致 match 失敗，工具回傳誤導性錯誤 "Missing required parameters: oldText alias"。
  - **解法**：含中文的多段修改改用 `Write` 直接覆寫整個檔案，或拆成多次單獨 `Edit`（single-replacement 模式，不用 `edits[]`）。
  (Set 2026-03-31)

### Cron Job Gotchas

- **Isolated session 無 message tool**：Cron job 預設跑在 isolated session，該 session **沒有 message tool**。任何在 payload 裡叫代理人用 message tool 發 Discord/Telegram 的指令都會靜默失敗。
  - 正確做法：在 cron job 的 `delivery` 設定裡指定 `mode: "announce"` + `channel: "discord"` 或 `"telegram"` + `to: "<channel_id>"`，讓 OpenClaw 本身負責推送，不依賴 isolated session 的工具。
  - 修復後 payload 裡可以移除「用 message tool 發送」的指令，讓 delivery 統一處理。
  (Set 2026-03-30)

### Discord Gotchas
- 指令 silent fail 根本原因：`commands.useAccessGroups` 預設 `true`，guild 若沒設 `users` allowlist → 所有人都是 unauthorized sender，`/` 指令被靜默忽略
- 修法：在 `guilds.<guildId>.users` 加入 Discord user ID（Kuma: `"662155611232010251"`）
- `autoThreadName: "generated"`（v2026.3.24 新功能）：auto thread 改用 LLM 異步 rename，產生更精簡的標題（預設是取訊息第一行）
- **Discord exec approval DM button UI（v2026.3.31 新功能）**：
  - 需要 `channels.discord.execApprovals: { enabled: true, approvers: ["<discord-user-id>"] }` 才會發 DM 按鈕
  - `autoAllowSkills: true` 讓 skill CLI 自動白名單，不需要一筆筆加
  - `ask: "on-miss"` 只在指令不在白名單時才問
  - `openclaw browser *` pattern 涵蓋所有 browser 子指令（start/navigate/evaluate 都包）
  - shell chain（`&&` 串聯）會對每個指令分別觸發審批，要分開跑
  - 審批 DM 預設只發 Telegram，Discord 需要加 `approvers` 才會收到
  - **新指令 workflow（重要！）**：`openclaw approvals allowlist add <pattern>` 本身不需要 approval（直接寫檔），所以要**先加白名單，再執行**新指令；不要串聯在一起否則變成審批連環炮

### ChatGPT Deep Research 擷取

- Deep Research 報告在 cross-origin iframe（`connector_openai_deep_research.web-sandbox.oaiusercontent.com`），CDP / evaluate / peekaboo click 全部無效
- **正式解法（推薦）**：Chrome Extension 已建立，位於 `workspace/tools/chatgpt-dr-extractor/`
  - `all_frames: true` 讓 `iframe_reader.js` 注入 iframe 讀取 `document.body.innerText`
  - 安裝：`chrome://extensions/` → 開發人員模式 → 載入未封裝項目 → 選該資料夾
  - Deep Research 完成後頁面右下角出現「📋 複製研究報告」按鈕，點一下即可
- **臨時解法（已驗證）**：用 `openclaw browser evaluate` 在父頁面 dispatch MouseEvent 到 iframe 中的「匯出」按鈕座標 → `pbpaste` → python3 Big5 decode
  - iframe 位置：`getBoundingClientRect()` 取得（通常 left:92, top:292）
  - 匯出按鈕在 iframe 截圖的約 (178, 203)，`aria-label="匯出"`
  - decode 範例：`raw.decode('big5', errors='replace')`，並清除 `?entity?` / `?cite?` 標記
- **peekaboo 截圖 OCR**：備用方案，解析度低、準確率差，不推薦

### peekaboo (macOS UI Automation)

- `peekaboo click` 的坑：click 會打到**最前景視窗**，不是 focus 的視窗。OpenClaw browser 視窗在不同 Space 時完全無法操作
- 截圖方式：用 `--pid <PID>` 或 `--mode screen` 截全螢幕最可靠；OpenClaw browser 的 Chrome PID 通常是 25116（`ps aux | grep "remote-debugging-port=18800"` 確認）
- 截圖檔案大需壓縮才能送 image tool：`sips -s format jpeg -s formatOptions 60 input.png --out output.jpg`
- Screen Recording 權限要授權給 **node**（不是 peekaboo 本身），因為 OpenClaw gateway 是 node process
- Accessibility 權限：授權給 node 或 Terminal 均可

### Bird (X/Twitter CLI)
- Installed via: `npm i -g @steipete/bird` (v0.8.0, deprecated but functional)
- Auth: env vars `AUTH_TOKEN` + `CT0` from OpenClaw browser profile
- Credentials stored in `~/.config/bird/env` (chmod 600)
- Usage: `export AUTH_TOKEN=... CT0=... && bird <command>`
- Commands: `whoami`, `search "query" -n N`, `read <url>`, `thread <url>`, `replies <url>`
- X account: @AI1982509738473
- If cookies expire: re-extract via CDP from OpenClaw browser (`ws://127.0.0.1:18800`)

### qmd (Quick Markdown Search)
- Installed via: `bun install -g https://github.com/tobi/qmd`
- Author: Tobi Lütke (Shopify founder)
- PATH: `$HOME/.bun/bin` (added to ~/.zshrc)
- Collections:
  - `workspace` → `/Users/kumax/.openclaw/workspace` (`**/*.md`, 426 files)
  - `obsidian` → `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Kuma` (`**/*.md`, 31 files)
- Commands:
  - `qmd search "query"` — BM25 關鍵字搜尋（快，需精確詞）
  - `qmd query "query"` — 語義搜尋 + reranker（跨語言，稍慢但強）
  - `qmd get "file"` — 取得特定檔案內容
- Reindex: `qmd update` / `qmd embed` (for vectors)
- Reranker model: Qwen3 reranker 0.6B（已下載到 ~/.cache/qmd/models/）
- 使用策略: 知道確切詞 → `qmd search`；語意/跨語言 → `qmd query`；記憶相關 → `memory_search`
- 上次 embed: 2026-03-29（1150 chunks, workspace + obsidian）

### Tabelog MCP / locale URL Gotcha
- 舊問題（2026-04-03 前）：`tabelog_detail` 對 `/tw/` 等 locale URL 可能只抓到殘缺資料，`tabelog_reviews` 甚至會回空陣列；同一間店改成日文主站 URL 才正常。
- 修復（2026-04-03）：`tabelog-mcp` 已在 fetch 前自動把 locale URL normalize 成日文主站，正規式吃任意兩碼語系前綴，例如 `/tw/`、`/en/`、`/cn/`、`/kr/`。
- 目前預期行為：看到 `https://tabelog.com/<locale>/...` 不用手動改網址；MCP 會自動轉成 `https://tabelog.com/...` 再抓 detail / reviews。
- 測試：已補 `normalizeTabelogUrl()` 的 UT，總測試 152 全綠後重啟 MCP。

### auto-skill (自進化知識系統)
- Installed via: `git clone https://github.com/toolsai/auto-skill` → `skills/auto-skill/`
- Knowledge base: `skills/auto-skill/knowledge-base/` (JSON index + md files)
- Experience: `skills/auto-skill/experience/` (per-skill experience logs)
- Core loop: keyword fingerprint → topic detection → experience read → knowledge read → auto-capture on success
- Note: The SKILL.md description tries to force itself as a dependency for all tasks — ignore that; use it selectively

### deep-research Skill Gotchas（2026-03-30）

- ChatGPT Deep Research 送出後有**兩個 tab**：`connector_openai_deep_research`（iframe，不可監控/截圖）和真正的 `chatgpt.com/c/<id>` conversation tab（才是要 polling 的那個）
- ChatGPT 直通 URL：`https://chatgpt.com/deep-research`（不用手動選 Research 模式）
- Gemini 報告擷取：`分享及匯出 → 複製內容` → `pbpaste` 取 bytes → `result.stdout.decode('utf-8', errors='replace')`（不能直接讀 str，會亂碼）
- Gemini 勿點「建立網頁」（會把報告變成 SPA iframe，要找 HTML source 才能讀文字）；直接用「複製內容」
- Claude artifact 是 isolated iframe 無法跨 origin 讀。要先**點開 Document 卡片**展開右側 panel，才會出現 split Copy button：左半邊直接複製全文，右半邊 ∨ 展開 Download 選單（點左半邊！）
- `openclaw browser status` 出現 `unknown method: browser.request`：browser plugin 未啟用，在 `plugins.entries` 加 `"browser": {"enabled": true}` 並 restart gateway

---

### Web Fetching

- **Always use `defuddle` skill** instead of `web_fetch` when reading web pages，無例外

---

Add whatever helps you do your job. This is your cheat sheet.

## image_generate (Gemini)

- Gemini 3 Pro 可以直接在圖片中渲染繁體中文文字，品質 OK，不需要 Pillow 疊字
- `aspectRatio: 16:9` 最接近 OG image 比例（1200×630 ≈ 1.9:1）
- 可用 size: 1024x1024, 1024x1536, 1536x1024, 1024x1792, 1792x1024
- subagent 無法呼叫 image_generate，只能在主 session 跑
- Prompt 中加 "No text" 可以拿到乾淨插圖；或直接在 prompt 中指定中文標題讓 Gemini 一次畫好
