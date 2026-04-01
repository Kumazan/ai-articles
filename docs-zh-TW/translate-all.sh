#!/usr/bin/env bash
set -euo pipefail

DOCS_ROOT="/opt/homebrew/lib/node_modules/openclaw/docs"
OUT_ROOT="/Users/kumax/.openclaw/workspace/docs-zh-TW"
GLOSSARY="$OUT_ROOT/glossary.zh-TW.json"
MAX_PARALLEL=6
MODEL="gemini-3-flash-preview"

GLOSSARY_TEXT=$(cat "$GLOSSARY")

translate_file() {
  local rel_path="$1"
  local en_file="$DOCS_ROOT/$rel_path"
  local out_file="$OUT_ROOT/$rel_path"

  # Skip if already translated
  if [[ -f "$out_file" ]]; then
    echo "SKIP: $rel_path"
    return 0
  fi

  mkdir -p "$(dirname "$out_file")"

  local en_content
  en_content=$(cat "$en_file")

  local prompt="You are a professional translator for technical documentation.

Translate the following English Markdown document into **Traditional Chinese (zh-TW)** — using terminology and phrasing natural to Taiwan (not mainland China).

## RULES:
1. Output ONLY the translated Markdown. No explanations, no code fences wrapping the output.
2. Preserve ALL Markdown formatting, frontmatter (YAML between ---), code blocks, links, and HTML/JSX tags exactly.
3. Do NOT translate: brand names (OpenClaw, Pi, Tailscale, Gateway, etc.), code/commands, URLs, file paths, JSON keys, JSX component names.
4. Keep 'Gateway' as-is (do NOT translate to 閘道).
5. Use Taiwan-standard technical terms (e.g. 檔案 not 文件, 訊息 not 消息, 伺服器 not 服务器, 設定 not 配置, 通道 not 隧道).
6. Keep the tone clear, concise, and developer-friendly.

## GLOSSARY:
$GLOSSARY_TEXT

## ENGLISH SOURCE:
$en_content"

  echo "TRANSLATING: $rel_path"
  if gemini --model "$MODEL" "$prompt" > "$out_file" 2>/dev/null; then
    # Clean gemini CLI noise
    sed -i '' '/^Loaded cached credentials\.$/d' "$out_file" 2>/dev/null || true
    sed -i '' '/^Hook registry initialized with/d' "$out_file" 2>/dev/null || true
    if head -1 "$out_file" | grep -q '^```markdown$'; then
      sed -i '' '1d' "$out_file" 2>/dev/null || true
      if tail -1 "$out_file" | grep -q '^```$'; then
        sed -i '' '$ d' "$out_file" 2>/dev/null || true
      fi
    fi
    echo "DONE: $rel_path"
  else
    echo "FAIL: $rel_path"
    rm -f "$out_file"
  fi
}

export -f translate_file
export DOCS_ROOT OUT_ROOT GLOSSARY_TEXT MODEL

# Collect all English .md files (exclude other locales and .i18n)
files=()
while IFS= read -r f; do
  rel="${f#$DOCS_ROOT/}"
  files+=("$rel")
done < <(find "$DOCS_ROOT" -name "*.md" -type f \
  -not -path "*/zh-CN/*" -not -path "*/ja-JP/*" -not -path "*/.i18n/*" \
  -not -path "*/zh-TW/*" | sort)

echo "═══════════════════════════════════════════"
echo "  OpenClaw docs → zh-TW (全站翻譯)"
echo "  Model: $MODEL | Parallel: $MAX_PARALLEL"
echo "  Total: ${#files[@]} files"
echo "═══════════════════════════════════════════"

printf '%s\n' "${files[@]}" | xargs -P "$MAX_PARALLEL" -I {} bash -c 'translate_file "$@"' _ {}

echo "═══════════════════════════════════════════"
echo "  Done! Output: $OUT_ROOT"
echo "═══════════════════════════════════════════"
