---
name: share-note
description: 把 Obsidian 筆記發佈到 HackMD 產生分享連結。Use when a user wants to share an Obsidian note with someone via a public link.
metadata: {"clawdbot":{"emoji":"🔗","os":["darwin"],"requires":{"bins":["obsidian-cli","jq","curl"],"env":["HACKMD_API_TOKEN"]}}}
---

# Share Note — Obsidian → HackMD

把指定的 Obsidian 筆記發佈到 HackMD，產生可分享的公開連結。

## Usage

```
share-note <筆記名稱或路徑>
```

Example: `share-note OpenClaw/總覽`

## Steps

### 1. Read the Obsidian note

```bash
CONTENT=$(obsidian-cli print "<note>" --vault Kuma 2>/dev/null)
```

If note name is ambiguous, search first:
```bash
obsidian-cli search "<query>" --vault Kuma
```

### 2. Strip frontmatter (optional)

Remove YAML frontmatter so the HackMD note looks clean:
```bash
CONTENT=$(echo "$CONTENT" | sed '/^---$/,/^---$/d')
```

### 3. Publish to HackMD

```bash
# Default permissions: guest can read, owner can write, comments disabled
RESPONSE=$(jq -n --arg title "$TITLE" --arg content "$CONTENT" \
  '{title: $title, content: $content, readPermission: "guest", writePermission: "owner", commentPermission: "disabled"}' \
| curl -s -X POST https://api.hackmd.io/v1/notes \
  -H "Authorization: Bearer $HACKMD_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @-)
```

### 4. Extract and return the link

```bash
echo "$RESPONSE" | jq -r '.publishLink // "https://hackmd.io/" + .shortId'
```

Reply format: `已發佈：<link>`

## Update an existing note

```bash
# Update content while maintaining permissions (read: guest, write: owner)
curl -s -X PATCH "https://api.hackmd.io/v1/notes/$NOTE_ID" \
  -H "Authorization: Bearer $HACKMD_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data-raw "$(jq -n --arg content "$CONTENT" '{content: $content, readPermission: "guest", writePermission: "owner"}')"
```

## Permissions

- `readPermission: "guest"` — anyone with the link can read
- `writePermission: "owner"` — only owner can edit
- `commentPermission: "disabled"` — no comments
