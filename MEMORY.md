# MEMORY.md

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

## Known Blockers
- Kanban API: 間歇性 500 error（missing ./331.js），非關鍵。(Since ~2026-03-01)

## Archived Index
- 2026-02-23 清理歸檔（Projects / Model Config / Bangkok Travel）：`memory/archive/longterm-archive-2026-02-23.md`
