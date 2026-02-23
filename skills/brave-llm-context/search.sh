#!/usr/bin/env bash
set -euo pipefail

# Brave LLM Context API search
# Usage: ./search.sh "query" [--tokens N] [--count N] [--freshness F] [--country CC] [--lang LL] [--raw]

API_KEY="${BRAVE_API_KEY:-}"
if [[ -z "$API_KEY" ]]; then
  echo "Error: BRAVE_API_KEY not set" >&2
  exit 1
fi

BASE_URL="https://api.search.brave.com/res/v1/llm/context"

# Defaults
TOKENS=4096
COUNT=5
FRESHNESS=""
COUNTRY=""
LANG=""
RAW=false
QUERY=""

# Parse args
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tokens)
      [[ $# -ge 2 ]] || { echo "Error: --tokens requires a value" >&2; exit 1; }
      TOKENS="$2"
      shift 2
      ;;
    --count)
      [[ $# -ge 2 ]] || { echo "Error: --count requires a value" >&2; exit 1; }
      COUNT="$2"
      shift 2
      ;;
    --freshness)
      [[ $# -ge 2 ]] || { echo "Error: --freshness requires a value" >&2; exit 1; }
      FRESHNESS="$2"
      shift 2
      ;;
    --country)
      [[ $# -ge 2 ]] || { echo "Error: --country requires a value" >&2; exit 1; }
      COUNTRY="$2"
      shift 2
      ;;
    --lang)
      [[ $# -ge 2 ]] || { echo "Error: --lang requires a value" >&2; exit 1; }
      LANG="$2"
      shift 2
      ;;
    --raw)
      RAW=true
      shift
      ;;
    -*)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
    *)
      if [[ -n "$QUERY" ]]; then
        QUERY+=" $1"
      else
        QUERY="$1"
      fi
      shift
      ;;
  esac
done

if [[ -z "$QUERY" ]]; then
  echo "Usage: ./search.sh \"query\" [--tokens N] [--count N] [--freshness F] [--country CC] [--lang LL] [--raw]" >&2
  exit 1
fi

if ! [[ "$TOKENS" =~ ^[0-9]+$ ]] || ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
  echo "Error: --tokens and --count must be integers" >&2
  exit 1
fi

# Build URL safely
ENCODED_Q=$(python3 - "$QUERY" <<'PY'
import sys, urllib.parse
print(urllib.parse.quote(sys.argv[1]))
PY
)

URL="${BASE_URL}?q=${ENCODED_Q}&maximum_number_of_tokens=${TOKENS}&count=${COUNT}"
[[ -n "$FRESHNESS" ]] && URL+="&freshness=${FRESHNESS}"
[[ -n "$COUNTRY" ]] && URL+="&country=${COUNTRY}"

# Normalize common locale aliases to Brave-supported language enums (bash 3.2 compatible)
LANG_LC=$(printf '%s' "$LANG" | tr '[:upper:]' '[:lower:]')
case "$LANG_LC" in
  zh-tw|zh-hk|zh-mo)
    LANG="zh-hant"
    ;;
  zh-cn|zh-sg)
    LANG="zh-hans"
    ;;
  zh)
    # Default to Traditional Chinese in this workspace
    LANG="zh-hant"
    ;;
esac

[[ -n "$LANG" ]] && URL+="&search_lang=${LANG}"

# Make request and keep HTTP status
TMP_BODY=$(mktemp)
HTTP_CODE=$(curl -sS --compressed \
  -H "Accept: application/json" \
  -H "X-Subscription-Token: ${API_KEY}" \
  -o "$TMP_BODY" \
  -w "%{http_code}" \
  "$URL")

RESPONSE=$(cat "$TMP_BODY")
rm -f "$TMP_BODY"

if [[ "$HTTP_CODE" -lt 200 || "$HTTP_CODE" -ge 300 ]]; then
  echo "Error: HTTP ${HTTP_CODE}" >&2
  if [[ -n "$RESPONSE" ]]; then
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE" >&2
  fi
  exit 1
fi

# Check API-level errors
if echo "$RESPONSE" | python3 - <<'PY' 2>/dev/null
import json, sys
try:
    d = json.load(sys.stdin)
except Exception:
    sys.exit(1)
err = d.get('error')
sys.exit(0 if err else 1)
PY
then
  echo "$RESPONSE" | python3 - <<'PY' >&2
import json, sys
try:
    d = json.load(sys.stdin)
    err = d.get('error')
    if isinstance(err, dict):
        print(f"Error: {err.get('detail') or err.get('message') or err}")
    else:
        print(f"Error: {err}")
except Exception:
    print('Error: Unknown API error')
PY
  exit 1
fi

if [[ "$RAW" == "true" ]]; then
  echo "$RESPONSE" | python3 -m json.tool
  exit 0
fi

# Format output
python3 - <<'PY' <<<"$RESPONSE"
import json, sys

data = json.loads(sys.stdin.read())
grounding = data.get('grounding', {})

# Brave currently returns grounding.generic entries with title/url/snippets
results = grounding.get('generic') or []
if not results:
    print('No results found.')
    sys.exit(0)

for i, result in enumerate(results, 1):
    url = result.get('url', '')
    title = result.get('title', 'Untitled')
    snippets = result.get('snippets') or []

    print(f'=== [{i}] {title} ===')
    print(f'URL: {url}')
    print()

    printed = False
    for snippet in snippets:
        s = (snippet or '').strip()
        if not s:
            continue
        # Skip structured JSON-LD-ish blobs
        if s.startswith('{"@type"') or s.startswith('{"title"'):
            continue
        if len(s) > 2000:
            s = s[:2000] + '...'
        print(s)
        print()
        printed = True

    if not printed:
        print('(No text chunks available)\n')

    print('---\n')

map_results = grounding.get('map') or []
if map_results:
    print('=== Map Results ===')
    for r in map_results:
        print(f"- {r.get('title', '')}: {r.get('url', '')}")
PY
