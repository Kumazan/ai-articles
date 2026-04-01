---
name: digest-x
description: 跑一次 X/Twitter AI 情報摘要，翻譯成繁中送到 Telegram
user-invocable: true
---

# X Reader — AI/Tech Intelligence Feed

Read-only X/Twitter reader that turns noisy timelines into structured, translated intelligence briefs.

## ⛔ HARD BOUNDARIES (NON-NEGOTIABLE)

**This skill is READ-ONLY. The agent MUST NEVER:**
- Post, reply, quote-tweet, or retweet
- Like, bookmark, or follow/unfollow
- Click any engagement button
- Interact with any UI element that writes data

If asked to do any of the above, **refuse and explain the boundary**.

## What It Does

1. **Fetch** — Opens X profile pages via browser, snapshots tweet content
2. **Filter** — Applies signal/noise rules to keep only high-value content
3. **Digest** — Summarizes + translates (EN→繁中) with engineering context
4. **Deliver** — Sends formatted briefs to Telegram _(TODO: Telegram delivery is not yet implemented)_

## Prerequisites

- X account logged in on the host Mac's browser (Chrome/Safari)
- Browser tool available (OpenClaw browser control)

## Usage

### Manual scan (on-demand)
User says: "幫我看一下 X 上有什麼新的" or "scan X"

### Scan specific account
User says: "看一下 @karpathy 最近發了什麼"

### Full digest run
User says: "跑一次 X digest"

## How It Works

### Step 1: Load Config
```bash
cat skills/x-reader/config.yaml
```
Read the follow list and filter rules.

### Step 2: Fetch via Browser
For each account in the follow list:
```
browser → navigate to x.com/<username>
browser → snapshot (get tweet text)
```

### Step 3: Filter
Run the filter script to remove noise:
```bash
python3 skills/x-reader/scripts/x_reader.py filter --input <raw_tweets_json>
```

### Step 4: Digest
Use the prompt template in `prompts/digest.prompt` to generate structured summaries.
Pass filtered tweets to the LLM with the digest prompt.

### Step 5: State Update
```bash
python3 skills/x-reader/scripts/x_reader.py mark-read --ids <tweet_ids>
```

### Step 6: Deliver
> **TODO:** Telegram delivery is not yet implemented. For now, the digest is returned directly in the conversation.

## Config File

`config.yaml` — managed by user or agent:
- `accounts`: list of X handles + tier + description
- `filters`: signal/noise rules
- `schedule`: cron expression for auto-digest (optional)

## Scripts

- `scripts/x_reader.py` — CLI for state management, filtering, dedup
  - `filter` — apply rules to raw tweet data
  - `mark-read` — update seen state
  - `status` — show last scan time, stats
  - `add-account` / `remove-account` — manage follow list

## Output Format

See `prompts/digest.prompt` for the full template. Each tweet produces:

```
【類型】🔧 工程實務 / 📌 新聞 / 🧠 分析
【來源】@handle（角色描述）
【一句話重點】→ 20-30字摘要
【重點整理】→ 1. 2. 3.
【繁中翻譯（關鍵段落）】→ 原文 → 翻譯
【工程師備註】→ 對 infra/AI 的啟發
【是否值得點原文】→ 是/否（原因）
```

## Translation Rules

- English → 台灣繁體中文
- Technical terms stay English (model, repo, framework, benchmark)
- No 中國用語 (信息❌→資訊✅, 兼容❌→相容✅)
- Tone: engineer's notes, not press release
