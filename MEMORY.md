# MEMORY.md

## Projects

### Polymarket Bot (`polymarket-bot-v0-ts`)
- Cross-market combinatorial arb scanner (P0) implemented 2026-02-13
  - `candidate_generator.ts`: heuristic grouping (Jaccard similarity + expiry window)
  - `cross_market_arb.ts`: fee-aware executable checker (2% taker + 0.5% buffer)
  - Wired into `index.ts` with 5-min scan cycle + market graph cache
  - Reference paper: arXiv 2508.03474 "Unravelling the Probabilistic Forest: Arbitrage in Prediction Markets"
- Next: P1 (graph cache neighbor-only scan, result bucketing) → P2 (partial fill, leg risk)
- Python autotune cron running every 15m since 2026-02-13; consistently no output (no opportunities found)
- Bot process has been stable; auto-restarted once on 2026-02-13 14:41, otherwise healthy

### Kanban Mini App (`kanban-app`)
- Next.js Kanban board with JSON file backend
- Columns: 💡 Backlog / 📋 待辦 / 🔨 進行中 / 👀 審查 / ✅ 完成 / 📦 封存
- **Multi-board support (2026-02-14)**: `boards.json` + `boards/{id}/kanban.json`
  - All API routes accept `?boardId=` param
  - Three boards: 🦐 主看板, ✈️ 曼谷旅行, 📈 Polymarket Bot
  - Header dropdown to switch/create boards
- API endpoints: GET/PUT board, POST cards, PATCH/DELETE cards/[id], move, comments
- **Mobile UX (2026-02-14)**:
  - Card modal: read mode (default) + edit mode (button). Swipe-down to close.
  - Mobile drag disabled → long-press bottom sheet (column picker + edit + delete)
  - Tailwind v4 gotcha: CSS resets must be inside `@layer` or they override utilities
- **Kanban automation (KANBAN.md)**:
  - Strategy 1: Task lifecycle auto-tracking (建卡→進行中→完成+留言)
  - Strategy 2: Heartbeat patrol (stale cards, auto-pickup, overdue alerts)
  - Strategy 3: Conversation intent detection → auto-create cards

### SDD Learn Site (`sdd-learn`)
- Static single-page learning guide for SDD × OpenSpec (12 chapters)
- Deployed to GitHub Pages: https://kumazan.github.io/sdd-learn/
- Created 2026-02-13, repo: Kumazan/sdd-learn
- Kuma interested in learning SDD/OpenSpec for project management

### Trip Bangkok Site (`trip-bangkok`)
- 2026-02-13: Fixed Lon Lon Local Diner card layout (image not filling container)
  - `<picture>` tag needed `block h-[58%]`, inner img changed to `h-full`
- 3 open FR PRs are all auto-generated stubs with no actionable specs; skipping

## Kuma / Preferences
- Prefers Traditional Chinese (zh-tw); casual tone. (See USER.md)
- 偏好執行流程（特別是中大型改動）：先用 subagent（First Principles + Plan Mode）出 Plan → 我先 review 回報 → 你確認後再實作 → 最後開 PR。 (Set 2026-02-19)
- 對既有工作分支的正常開發節奏，Kuma 偏好直接 commit + push，不用每次先詢問。 (Set 2026-02-19)
- GitHub PR 合併偏好：使用 squash merge，並在合併後刪除分支（delete branch）。 (Set 2026-02-19)
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

## Model Config (as of 2026-02-13)
- Primary: anthropic/claude-opus-4-6 (alias: opus)
- Fallback 1: openai-codex/gpt-5.3-codex
- Fallback 2: github-copilot/gpt-4o
- Audio transcription: Groq whisper-large-v3-turbo (language: zh)
- Image generation: nano-banana-pro skill (Gemini 3 Pro Image, needs GEMINI_API_KEY)
- `uv` installed via brew for running nano-banana-pro scripts
- Config gotcha: `${...}` interpolation does NOT work in env.vars — use literal values
- Peekaboo CLI installed (v3.0.0-beta3) via `brew install steipete/tap/peekaboo` on 2026-02-13
  - Screen Recording: Granted ✅ / Accessibility: Granted ✅ (triggered via CLI commands)
  - Peekaboo skill was already present; CLI was missing until manual install

## Infrastructure
- Linode (Akamai) VPS used for OpenClaw gateway:
  - IP: 172.233.46.40
  - Region: Amsterdam, Netherlands
  - Plan: 4 CPU cores, 7.7 GB RAM, USD $24/month
  - Auto-renew: enabled
  - Expiry: 2026-03-08

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

## Travel: Bangkok 2026/3/18–3/24 (Kuma + boyfriend Guo)
### Silom hotel booking (current/original)
- Hotel: Silom Serene, a Boutique Hotel（是隆塞琳飯店 / โรงแรมสีลม ศิรีนทร์）
- Address: 7, 3 Phiphat 2, Si Lom, Bang Rak, Bangkok 10500, Thailand
- Dates: 2026-03-18 → 2026-03-22 (4 nights)
- Check-in: after 14:00
- Check-out: before 12:00
- Room: One Bedroom Suite / 一臥室套房, 60 m², 1 king bed, non-smoking, free Wi‑Fi
- Breakfast: buffet 06:00–10:00; included in current booking as "2 breakfasts per room" for 3/19–3/22; otherwise adult THB 400/person (child ≤17 THB 200)
- Price: approx THB 1,500 per person per night (shown); total pay-later TWD 10,940; scheduled charge on 2026-03-13 (hotel local time)
- Cancellation: free cancellation until 2026-03-15 12:00 (hotel local time); after that non-refundable
- Facilities noted: outdoor pool, gym, luggage storage, free parking, bar, restaurant, "吸菸區" listed in public area
Source: user screenshots 2026-02-10.

### Massage
- The Prime Massage (Silom): user has been there before and confirmed it's totally OK for them.
Source: user message 2026-02-10.
