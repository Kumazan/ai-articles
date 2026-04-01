# MEMORY.md

## Top Rules（最高優先）
- **飯店房價與房況驗證（必讀）**：
  - 嚴禁誤報：飯店網頁顯示「已售罄」時，頁面顯示的價格通常是其他日期或參考起價，絕對不能當作搜尋日期的價格。
  - 必備檢查：必須確認頁面不含「無空房」紅字警告，且價格確實對應指定日期。
  - 回報格式：若無房，必須明確回報「❌ 已售罄」或「❌ 該日期不接受預訂」。 (Set 2026-03-29)
- **機票票價邏輯 (星宇官網)**：官網搜尋結果中，回程顯示的價格通常是「在去程基礎上的加價差額」，並非獨立票價。計算總價時需加總兩段金額。 (Set 2026-03-29)

## Kuma / Preferences
- Prefers Traditional Chinese (zh-tw); casual tone. (See USER.md)
- 偏好執行流程（特別是中大型改動）：先用 subagent（First Principles + Plan Mode）出 Plan → 我先 review 回報 → 你確認後再實作 → 最後開 PR。 (Set 2026-02-19)
- 對既有工作分支的正常開發節奏，Kuma 偏好直接 commit + push，不用每次先詢問。 (Set 2026-02-19)
- GitHub PR 合併偏好：使用 squash merge，並在合併後刪除分支（delete branch）。 (Set 2026-02-19)
- `gh pr create` 規則：所有 PR 建立指令必須加上 `--reviewer @copilot`，自動觸發 Copilot code review。 (Set 2026-03-28)
- Copilot Review Loop（Set 2026-03-29）：PR 建立後自動進入 review loop，最多 3 輪。每輪流程：background polling 等回覆（間隔 60s，不要 sleep 空等燒 token）→ 讀取未 resolve 的 comments → 修 code + commit + push → 回覆每個 comment（`gh api .../comments/{id}/replies`）→ resolve thread（GraphQL `resolveReviewThread`）→ re-add reviewer（`gh pr edit --add-reviewer @copilot`）。退出條件：新 review 的 comments = 0 或第 3 輪。
- 股市分析偏好：每次做股市/盤勢分析時，優先使用 `stock-analysis` skill（搭配目前盤前/盤後分析框架）。 (Set 2026-02-24)
- 股市報告流程偏好：先 `stock-analysis`（決策/信心/風險），再 `stock-market-pro`（價格/基本面/圖表佐證）；結論以 `stock-analysis` 為主。 (Set 2026-02-24)
- 財經新聞分析報告格式（Set 2026-02-25）：Kuma 貼財經新聞時，自動用「資深交易員」框架輸出完整報告。結構：⏱️ 時間框架（前置判斷）→ 📋 交易核心 → 🔍 背後意義 → 📊 投資策略（看多標的＋看空/迴避標的，各含利多/風險/觀點/工具）→ 風險情境（🟢🟡🔴）→ 整體判斷 → ⏰ 催化劑時間線（條列）→ 📌 相關個股清單（一行一個，美股優先，台股僅直接相關）→ 💰 估值參考（1-2個最高優先標的）。風格：直接有觀點、結論先行、美股為主＋台股供應鏈。
- OpenClaw 工作流新偏好（Issue-First + 主線/外包分離 + Review分類）：
  - Issue-First 規則：任何預估 >15 分鐘、跨多步驟、或需要留決策脈絡的任務，一律先開 issue 再做；<15 分鐘且一次可完成的小修可免開。
  - Issue 模板最少包含：目標、驗收條件、決策紀錄、下一步（卡住時）。
  - 主線 vs 外包：主 agent 專注決策/審查/排序優先級；sub-agent 專注執行（寫、查、改、測）。判準：需要判斷留主線，只需產出就外包。
  - Review 結果分類：每次 review 後必分為「可直接 merge」或「需補件（1~3個最小補件）」。
  - Review 留痕：review 結果直接 comment 在 PR 上，保留決策與補件紀錄。
  (Set 2026-02-21)
- 在 `Kumazan/ai-articles` 發文流程：先檢查既有 repo 格式/風格（frontmatter、hero-badge、原文連結、分隔線、日期資料夾與 index 列表），再翻譯上稿、更新 index、commit + push。 (Set 2026-02-19)
- Timezone: Asia/Taipei (UTC+8). (Set 2026-02-09)
- When Kuma sends voice notes: auto-transcribe to Traditional Chinese first, then treat the transcript as the command/input for routing and replying. (Set 2026-02-10)
- Prefers sharing the trip site via the custom domain: https://trip.kumax.dev/bangkok/ (Set 2026-02-10)

- 人物關係備註：小郭（Guo）是 Kuma 的男朋友（男），提及時勿使用女性代稱。 (Set 2026-03-02)
- Discord 頻道模型分配偏好（Set 2026-03-31）：Default model 改為 `minimax-plus`（MiniMax-M2.7-High-Speed）。`#一般`、`#notifications`、`#2026日本慶生之旅`、`#深度研究` 走 MiniMax；`#stock-台股`、`#pr-autopilot`、`#ai文章摘要`、`#pokopia`、`#fix-something` 走 Sonnet。只有複雜 PR review、架構設計、核心 debug、多檔案重構等高價值／高風險任務才升到 `opus` + thinking max。
- 開發流程偏好（Set 2026-03-31）：非輕度開發一律走 `cc + oec + remote control`；只有小修、小改、單檔低風險調整可直接在主線處理。
- Uber Eats 優惠碼回報偏好（Set 2026-03-02）：每月 1 號主動搜尋一次「非新用戶、非青少年」可用碼；回覆格式固定為【`優惠code`】 - 優惠內容。
- Google Workspace CLI 偏好（Set 2026-03-09）：改用 `gws` 作為 Google Workspace 主力工具；`gog` 已卸載，不再依賴。
- OpenClaw 遠端 Gateway 固定做法（Set 2026-03-09）：Mac mini 走 Tailscale Serve + `gateway.trustedProxies: ["127.0.0.1", "::1"]` + device pairing；常駐背景服務用 `openclaw gateway install/start`（LaunchAgent）。新裝置若看到 `pairing required`，在 Mac 上跑 `openclaw devices list` → `openclaw devices approve <requestId>`。
- OpenClaw 更新方式（Set 2026-03-28）：**永遠用 `npm update -g openclaw`**，不要用 `openclaw update`（會在重啟後掉連線、拿不到結果、讓人很煩）。更新後用 `openclaw --version` 確認版本。
- OpenClaw / AI agent 情報偏好（Set 2026-03-10）：Kuma 偏好「實用技巧／實戰流程／踩坑修法」類型的整理，價值高於單純新功能列表；訂閱模式為「每日更新，但只有有料才推」+「每週整理」。
- ai-articles Discord 通知偏好（Set 2026-03-31）：**六個 AI 文章翻譯 cron 全部必須完全對齊此格式。** 主文標題固定用 `📰 **{文章標題}**`，禁止寫「AI 文章翻譯：」。主文摘要用精煉條列點，結尾固定 `🔗 {GitHub Pages 連結}` + `📎 原文：{原文連結}`。若附 Kuma 視角，必須在 thread 中以**第二則獨立訊息**發送，且不要寫「🧠 Kuma 個人視角」標題，直接進入四個主題：值得一讀的亮點／批判性分析／跟你的現況／可以做的事。整體仍遵循 `kuma-perspective` skill 的分析結構，不要退化成短評。之後若有新增同類 cron，也必須沿用同一格式。
- STARLUX 哩程兌換速記 → 已歸檔至 Obsidian `Projects/STARLUX 哩程兌換.md`

## Infrastructure
- Linode (Akamai) VPS used for OpenClaw gateway:
  - IP: 172.233.46.40
  - Region: Amsterdam, Netherlands
  - Plan: 4 CPU cores, 7.7 GB RAM, USD $24/month
  - Auto-renew: enabled
  - Last known expiry: 2026-03-08 (auto-renew should have renewed; confirm next billing cycle)

### Telegram / 股市群組 Topic 路由
- 股市報告目標群：`-1003815026231`。
- 股市分析 topic threadId：`51`（需帶 threadId 才會進入該 topic，否則會落到 General）。
- 適用任務：`台股盤前報告`、`台股盤後報告` cron。
- 春節國際盤勢追蹤已停用（enabled=false）。

### Cloudflare / Scanner Access
- Cloudflare Zero Trust Apps page (account-specific):
  - https://one.dash.cloudflare.com/f6628b05c86b58bf21991282f2950950/access-controls/apps
- Polymarket Bond Scanner Access app:
  - Name: Polymarket Bond Scanner
  - URL/domain: scanner.kumax.dev
  - Type: SELF-HOSTED
  - Application ID: a3044a2d-2ef8-4790-98fb-7c0a7123c024
  - Policies assigned: 1
Source: user message 2026-02-19.

Source: user message 2026-02-09.

## Security
- ClawJacked WebSocket 劫持漏洞（2026-03-01 發現）：已修復，OpenClaw 升級至 2026.3.2（修復版為 2026.2.25）。 (Resolved 2026-03-09)

## Projects
- pokopia-zh：寶可夢 Pokopia 中文整理站，private repo + Cloudflare Pages，方向 `play.kumax.dev/pokopia`，主色百變怪紫。翻譯基準：wiki.52poke.com；專長官方用語已確認為「專長」（共 17 種）；進化機制無練等，棲息地直接招募。 (Updated 2026-03-14)
- 搖滾路跑 肌肉組（HYROX）備賽：4/18 比賽，訓練細節 → Obsidian `Projects/搖滾路跑肌肉組.md`
- Bangkok 曼谷之旅（3/18–3/24）：已完成，詳情 → Obsidian `Projects/2026 曼谷慶生之旅/`

## Web / CSS Lessons

- **iOS Safari 慣性滾動失效**：`overflow-x: hidden` 同時設在 `html` + `body` 上，iOS 會把 body 當獨立 scroll container，慣性滾動死掉。解法：只設在 `body`，`html` 不動。(2026-03-18)
- **Jekyll theme viewport 覆蓋**：theme 自己輸出 `<meta viewport>` 沒有 `maximum-scale`，後加的第二個 meta 被瀏覽器忽略。唯一有效做法是用 JS 在 `head-custom.html` 裡直接 `querySelector` 修改第一個 meta 的 content。(2026-03-18)

## AI Industry Highlights（2026-03 重要動態）
- **Nvidia GTC（3/16）**：Jensen Huang 稱 OpenClaw 為「人類史上最受歡迎開源專案」，Nvidia 推出 OpenClaw 專屬隱私/安全工具組，Peter Steinberger 被 OpenAI 挖角。
- **Claude Dispatch（3/20）**：Anthropic 新功能，手機遠端控制桌面 Claude，持久對話，Max 訂閱已開放。
- **OpenAI GPT-5.4（3/5）**：百萬 token context，OSWorld-V 得分 75%（略超人類基準 72.4%），標誌 AI 從聊天轉向自主數位工作者。
- **Meta + Manus**：收購後 AI agents 整合進 Ads Manager、Instagram、WhatsApp Business。

## Skills
- **deep-research skill**（2026-03-30 建立）：同時對 ChatGPT / Gemini / Claude 三平台送 Deep Research，背景 cron 輪詢，完成後回報各家摘要＋整合報告。State file 存在 `~/workspace/deep-research/`。**使用規則**：收到主題先起草 prompt 給 Kuma 確認再發。各平台擷取細節在 TOOLS.md `## deep-research Skill Gotchas`。
- **ChatGPT Deep Research 擷取解法**（2026-03-30 確認）：iframe 是 cross-origin sandbox，唯一正式解法是 Chrome Extension（`workspace/tools/chatgpt-dr-extractor/`）。臨時解法：MouseEvent dispatch → pbpaste → Big5 decode。下次執行 deep-research 前，優先確認 Extension 已安裝。

## Tools & Techniques
- qmd Obsidian 整合（2026-03-29）：`obsidian` collection 已加入 qmd，31 個筆記 + 1150 chunks 向量嵌入。用 `qmd query` 做語義搜尋（跨語言）。bundled obsidian skill 已 disable，改用官方 obsidian-cli（需 app 在跑）。learn skill 已加 `qmd update` 步驟。
- HackMD API 發長篇 Markdown（2026-03-31）：不要用 shell `jq --arg` 直接包多行內容，容易因控制字元/換行造成 JSON parse error。穩定做法是把內容先寫檔，再用 Python `json.dumps`（或等價 JSON serializer）送 API。
- **Exec Approvals（v2026.3.31，2026-04-01 設定）**：`autoAllowSkills: true` 在 `exec-approvals.json` 的 `defaults`；Discord exec approval DM 按鈕需要 `channels.discord.execApprovals.approvers: ["662155611232010251"]` 否則按鈕不會出現；qmd 路徑在 `~/.bun/bin/`，allowlist pattern 用絕對路徑 `/Users/kumax/.bun/bin/qmd` 而非 `qmd *`（pattern glob matching 有爭議）。

- claude.ai 用量監控：用 `openclaw browser navigate` + `openclaw browser evaluate` 打 `/api/organizations/.../subscription_details`，比直接 CDP 簡單，且 Cloudflare cookie 正確。(2026-03-14)
- OpenClaw gateway 維護：升級後若 embed token 異常，用 `openclaw gateway install --force` + bootstrap 修復。目前版本 2026.3.8，pid 80538。(2026-03-19)

## Known Blockers
- Kanban API: 間歇性 500 error（missing ./331.js），非關鍵。(Since ~2026-03-01)

## Messaging / Platform Quirks
- **Telegram MarkdownV2 冒號+backtick bug**（2026-03-17，confirmed 2026-03-28）：冒號後緊接 backtick，MarkdownV2 解析器誤判格式邊界，靜默吃掉後半段。根本原因是 MarkdownV2 對特殊字元極敏感。
  - 方向 1（已執行，2026-03-28 實測有效）：
    - code block 前後要有換行（不能緊貼在同一行），不需要完整空行
    - inline code 正常行內使用，沒問題
    - 2026-03-28 實測確認：緊貼文字的 code block 也能正常顯示
    - 不用「→」代替冒號（Kuma 偏好空行，不用箭頭）
    - Kuma 在對話中親眼確認格式正確顯示（2026-03-28 verified）
  - 方向 2（已查，2026-03-28）：OpenClaw **已經在用 HTML parse_mode**（官方文件確認）。不需要開 issue。問題根源是 Markdown → HTML 轉換層遇到特殊字元組合可能產出不合法 HTML，Telegram 拒絕後退回純文字。方向 1 依然有效，寫乾淨的 Markdown 能減少轉換層踩雷機率。

## Archived Index
- 2026-02-23 清理歸檔（Projects / Model Config / Bangkok Travel）：`memory/archive/longterm-archive-2026-02-23.md`

## Obsidian 餐廳筆記標準格式（2026-04-02）

- **Skill**：`restaurant-notes`（description 含關鍵字：「存」「寫入」「加到筆記」「想去的餐廳」）
- **觸發**：Kuma 說「存」等關鍵字才寫入；平常只回覆不主動寫
- **範本**：`Projects/2026 日本慶生之旅/想去的餐廳/📋 餐廳筆記範本.md`
- **每次建立前必讀範本**：obsidian vault="Kuma" read path="Projects/...📋 餐廳筆記範本"
- **格式**：title 無 emoji；H1 可有 emoji；---後直接接 H1 無空行；評分寫連結同行括號；刪「特色」區塊融合進「餐廳介紹」
- **餐廳介紹**：150-250 字，結合定位/風格/評論亮點
- **評論**：3-5則，翻譯成繁體中文（30-50字），評分分散（★4.5+ 和 3.5-4.0 都有）

## Tabelog Workflow（2026-04-02）

- **subagent 最佳**：5支×5間，超過必超時；避免15間塞1支
- **評論**：抓3-5則，翻譯+一句話摘要；挑選原則：評分分散、有具體細節、有參考價值
- **流程**：tabelog_search → detail → reviews(3-5則) → 翻譯 → 回覆 → Kuma說「存」才寫入 Obsidian
- **Tabelog skill**：`skills/tabelog/SKILL.md`，restaurant-notes skill：`skills/restaurant-notes/SKILL.md`


## Discord Topic 格式（2026-04-02）

Kuma 提供標準格式，頻道頂端顯示：

```
📓 Projects/2026 日本慶生之旅/

目錄：住宿資料/攻略/每日行程/想去的餐廳/機票資訊

行程：6/19 新宿→6/24 河口湖→6/25 新宿→6/28 池袋→6/29 回程

常用技能: hotel-price, weather, tabelog, goplaces, restaurant-notes
```

- Topic 可用 API PATCH 更新（channel ID: 1487494659012825142）
- Token 從 `~/.openclaw/openclaw.json` 的 `channels.discord.token` 取得
