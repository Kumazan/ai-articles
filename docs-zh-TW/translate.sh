#!/usr/bin/env bash
set -euo pipefail

# Translate OpenClaw docs (English → zh-TW) using Gemini Flash
# References both English source and zh-CN translation for context

DOCS_ROOT="/opt/homebrew/lib/node_modules/openclaw/docs"
ZH_CN_ROOT="$DOCS_ROOT/zh-CN"
OUT_ROOT="/Users/kumax/.openclaw/workspace/docs-zh-TW/gateway"
GLOSSARY="/Users/kumax/.openclaw/workspace/docs-zh-TW/glossary.zh-TW.json"
SUBDIR="gateway"
MAX_PARALLEL=6
MODEL="gemini-2.5-flash"

mkdir -p "$OUT_ROOT"
mkdir -p "$OUT_ROOT/security"

GLOSSARY_TEXT=$(cat "$GLOSSARY")

translate_file() {
  local rel_path="$1"
  local en_file="$DOCS_ROOT/$SUBDIR/$rel_path"
  local cn_file="$ZH_CN_ROOT/$SUBDIR/$rel_path"
  local out_file="$OUT_ROOT/$rel_path"

  # Skip if already translated
  if [[ -f "$out_file" ]]; then
    echo "SKIP: $rel_path (already exists)"
    return 0
  fi

  local en_content
  en_content=$(cat "$en_file")

  local cn_ref=""
  if [[ -f "$cn_file" ]]; then
    cn_ref=$(cat "$cn_file")
  fi

  local prompt
  prompt="You are a professional translator for technical documentation.

Translate the following English Markdown document into **Traditional Chinese (zh-TW)** — using terminology and phrasing natural to Taiwan (not mainland China).

## RULES:
1. Output ONLY the translated Markdown. No explanations, no wrapping.
2. Preserve ALL Markdown formatting, frontmatter (YAML between ---), code blocks, links, and HTML tags exactly.
3. Do NOT translate: brand names (OpenClaw, Pi, Tailscale, etc.), code/commands, URLs, file paths, JSON keys.
4. Use the glossary below for preferred term translations.
5. Use Taiwan-standard technical terms (e.g. 檔案 not 文件, 訊息 not 消息, 伺服器 not 服务器, 設定 not 配置).
6. Keep the tone clear, concise, and developer-friendly.

## GLOSSARY:
$GLOSSARY_TEXT

## ENGLISH SOURCE:
$en_content"

  if [[ -n "$cn_ref" ]]; then
    prompt="$prompt

## SIMPLIFIED CHINESE REFERENCE (for context, adapt to zh-TW conventions):
$cn_ref"
  fi

  echo "TRANSLATING: $rel_path"
  if gemini --model "$MODEL" "$prompt" > "$out_file" 2>/dev/null; then
    echo "DONE: $rel_path"
  else
    echo "FAIL: $rel_path"
    rm -f "$out_file"
  fi
}

export -f translate_file
export DOCS_ROOT ZH_CN_ROOT OUT_ROOT GLOSSARY GLOSSARY_TEXT SUBDIR MODEL

# Collect all .md files under gateway/
files=()
while IFS= read -r f; do
  rel="${f#$DOCS_ROOT/$SUBDIR/}"
  files+=("$rel")
done < <(find "$DOCS_ROOT/$SUBDIR" -name "*.md" -type f | sort)

echo "Found ${#files[@]} files to translate (parallel=$MAX_PARALLEL)"
echo "---"

# Run in parallel
printf '%s\n' "${files[@]}" | xargs -P "$MAX_PARALLEL" -I {} bash -c 'translate_file "$@"' _ {}

echo "---"
echo "All done! Output: $OUT_ROOT"
