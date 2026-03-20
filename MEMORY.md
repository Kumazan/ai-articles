# MEMORY.md

## Top Rules（最高優先）
- **任何 repo 開發改動前，必先讀該 repo 的 CLAUDE.md**（如果存在）。這是 Kuma 常用 CC 自行開發的前提，違反此規則視為任務失敗。(Set 2026-03-20)

## Kuma / Preferences
- Prefers Traditional Chinese (zh-tw); casual tone. (See USER.md)
- 偏好執行流程（特別是中大型改動）：先用 subagent（First Principles + Plan Mode）出 Plan → 我先 review 回報 → 你確認後再實作 → 最後開 PR。 (Set 2026-02-19)
- 對既有工作分支的正常開發節奏，Kuma 偏好直接 commit + push，不用每次先詢問。 (Set 2026-02-19)
- GitHub PR 合併偏好：使用 squash merge，並在合併後刪除分支（delete branch）。 (Set 2026-02-19)
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
- Uber Eats 優惠碼回報偏好（Set 2026-03-02）：每月 1 號主動搜尋一次「非新用戶、非青少年」可用碼；回覆格式固定為【`優惠code`】 - 優惠內容。
- Google Workspace CLI 偏好（Set 2026-03-09）：改用 `gws` 作為 Google Workspace 主力工具；`gog` 已卸載，不再依賴。
- OpenClaw 遠端 Gateway 固定做法（Set 2026-03-09）：Mac mini 走 Tailscale Serve + `gateway.trustedProxies: ["127.0.0.1", "::1"]` + device pairing；常駐背景服務用 `openclaw gateway install/start`（LaunchAgent）。新裝置若看到 `pairing required`，在 Mac 上跑 `openclaw devices list` → `openclaw devices approve <requestId>`。
- OpenClaw / AI agent 情報偏好（Set 2026-03-10）：Kuma 偏好「實用技巧／實戰流程／踩坑修法」類型的整理，價值高於單純新功能列表；訂閱模式為「每日更新，但只有有料才推」+「每週整理」。
- STARLUX / COSMILE 亞洲－歐洲／美洲線獎勵票速記（Set 2026-03-11）：經濟艙單程 50,000 哩／來回 100,000 哩；豪華經濟艙單程 60,000 哩／來回 120,000 哩；商務艙單程 90,000 哩／來回 180,000 哩。共通：改票免手續費、退票 USD 50、未登機（2024-06-01 含後）USD 100。之後 Kuma 問星宇長程哩程兌換時可直接用這組基準先估值。

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
- Kuma 報名 4/18 搖滾路跑 肌肉組（HYROX），訓練站：`https://kumazan.github.io/hyrox-training/`。3/18-3/24 出國曼谷。 (Set 2026-03-12)

## Bangkok Trip 3/18–3/24（進行中）
- 去程 JX745 3/18 13:25 TPE → 16:30 BKK；回程 JX742 3/24 13:45 BKK → 18:25 TPE
- 住宿：Silom Serene（3/18–3/22）→ Kimpton Maa-Lai（3/22–3/24，Conf: 64079311）
- 關鍵訂位：3/19 大城一日遊、3/20 Tingly Thai 烹飪課 13:00、3/21 寺廟半日遊 13:00、3/22 Inddee 生日晚餐 19:30（訂位 RWZTH3HCBYK，訂金已付）、3/22 Ruby's Experience 16:00、3/23 泰拳 13:30、3/23 Copper Beyond Buffet 17:00
- 小郭 3/22 生日（31 歲），Kimpton 有詢問布置，Copper 已備注
- TDAC 電子入境卡需在入境前 72h 內填：https://tdac.immigration.go.th
- 3/22 回程選位開放（13:45 前 48h）
- 旅平險已附（刷星宇世界卡）。(Set 2026-03-16)
- 實際狀況更新（2026-03-19）：已抵達，入住 Silom Serene。TDAC 兩人均填妥（Kuma 卡號 BEDA0A1）。3/18 嘗試大麻（Papaya Cake），一口即有感，約 10 分鐘起效。3/19 大城一日遊完成，含邦芭茵夏宮、樹根佛頭、炭烤大蝦市場午餐。

## Fitness / Health
- 跑步實測基準（2026-03-12）：16 分鐘跑 1.86K，配速 ~8'34"/km，心率 169 avg / 194 max。策略：保守配速、跑走交替、控心率。
- 農夫走路 25kg×2 可走 ~40 步，非主要弱項；主攻跑步/波比跳前進/弓箭步。
- 上斜啞鈴臥推 24kg 為 12 下工作重量，目標 4 組。
- World Gym 啞鈴以 2kg 為級距（24/26/28kg），不要建議 25/27.5kg。
- Kuma 曾被啞鈴夾傷小拇指（2026-03-12），短期避免重握力訓練。

## Web / CSS Lessons

- **iOS Safari 慣性滾動失效**：`overflow-x: hidden` 同時設在 `html` + `body` 上，iOS 會把 body 當獨立 scroll container，慣性滾動死掉。解法：只設在 `body`，`html` 不動。(2026-03-18)
- **Jekyll theme viewport 覆蓋**：theme 自己輸出 `<meta viewport>` 沒有 `maximum-scale`，後加的第二個 meta 被瀏覽器忽略。唯一有效做法是用 JS 在 `head-custom.html` 裡直接 `querySelector` 修改第一個 meta 的 content。(2026-03-18)

## Tools & Techniques
- claude.ai 用量監控：用 `openclaw browser navigate` + `openclaw browser evaluate` 打 `/api/organizations/.../subscription_details`，比直接 CDP 簡單，且 Cloudflare cookie 正確。(2026-03-14)
- OpenClaw gateway 維護：升級後若 embed token 異常，用 `openclaw gateway install --force` + bootstrap 修復。目前版本 2026.3.8，pid 80538。(2026-03-19)

## Known Blockers
- Kanban API: 間歇性 500 error（missing ./331.js），非關鍵。(Since ~2026-03-01)

## Messaging / Platform Quirks
- **Telegram Markdown bug**：冒號後緊接 backtick code block，Telegram 解析器會靜默吃掉後半段。修法：code 另起一行獨立傳，不接在行尾冒號後。(2026-03-17)

## Archived Index
- 2026-02-23 清理歸檔（Projects / Model Config / Bangkok Travel）：`memory/archive/longterm-archive-2026-02-23.md`
