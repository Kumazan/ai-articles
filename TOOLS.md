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

### Discord Gotchas
- 指令 silent fail 根本原因：`commands.useAccessGroups` 預設 `true`，guild 若沒設 `users` allowlist → 所有人都是 unauthorized sender，`/` 指令被靜默忽略
- 修法：在 `guilds.<guildId>.users` 加入 Discord user ID（Kuma: `"662155611232010251"`）
- `autoThreadName: "generated"`（v2026.3.24 新功能）：auto thread 改用 LLM 異步 rename，產生更精簡的標題（預設是取訊息第一行）

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

### auto-skill (自進化知識系統)
- Installed via: `git clone https://github.com/toolsai/auto-skill` → `skills/auto-skill/`
- Knowledge base: `skills/auto-skill/knowledge-base/` (JSON index + md files)
- Experience: `skills/auto-skill/experience/` (per-skill experience logs)
- Core loop: keyword fingerprint → topic detection → experience read → knowledge read → auto-capture on success
- Note: The SKILL.md description tries to force itself as a dependency for all tasks — ignore that; use it selectively

---

Add whatever helps you do your job. This is your cheat sheet.
