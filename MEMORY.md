# MEMORY.md

## Kuma / Preferences
- Prefers Traditional Chinese (zh-tw); casual tone. (See USER.md)
- 偏好執行流程（特別是中大型改動）：先用 subagent（First Principles + Plan Mode）出 Plan → 我先 review 回報 → 你確認後再實作 → 最後開 PR。 (Set 2026-02-19)
- 對既有工作分支的正常開發節奏，Kuma 偏好直接 commit + push，不用每次先詢問。 (Set 2026-02-19)
- GitHub PR 合併偏好：使用 squash merge，並在合併後刪除分支（delete branch）。 (Set 2026-02-19)
- 股市分析偏好：每次做股市/盤勢分析時，優先使用 `stock-analysis` skill（搭配目前盤前/盤後分析框架）。 (Set 2026-02-24)
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

## Infrastructure
- Linode (Akamai) VPS used for OpenClaw gateway:
  - IP: 172.233.46.40
  - Region: Amsterdam, Netherlands
  - Plan: 4 CPU cores, 7.7 GB RAM, USD $24/month
  - Auto-renew: enabled
  - Expiry: 2026-03-08

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

## Archived Index
- 2026-02-23 清理歸檔（Projects / Model Config / Bangkok Travel）：`memory/archive/longterm-archive-2026-02-23.md`
