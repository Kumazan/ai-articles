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
    --tokens)  TOKENS="$2"; shift 2 ;;
    --count)   COUNT="$2"; shift 2 ;;
    --freshness) FRESHNESS="$2"; shift 2 ;;
    --country) COUNTRY="$2"; shift 2 ;;
    --lang)    LANG="$2"; shift 2 ;;
    --raw)     RAW=true; shift ;;
    -*)        echo "Unknown option: $1" >&2; exit 1 ;;
    *)         QUERY="$1"; shift ;;
  esac
done

if [[ -z "$QUERY" ]]; then
  echo "Usage: ./search.sh \"query\" [--tokens N] [--count N] [--freshness F] [--country CC] [--lang LL] [--raw]"
  exit 1
fi

# Build URL
ENCODED_Q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$QUERY'))")
URL="${BASE_URL}?q=${ENCODED_Q}&maximum_number_of_tokens=${TOKENS}&count=${COUNT}"

[[ -n "$FRESHNESS" ]] && URL="${URL}&freshness=${FRESHNESS}"
[[ -n "$COUNTRY" ]]   && URL="${URL}&country=${COUNTRY}"
[[ -n "$LANG" ]]      && URL="${URL}&search_lang=${LANG}"

# Make request
RESPONSE=$(curl -s --compressed \
  -H "Accept: application/json" \
  -H "X-Subscription-Token: ${API_KEY}" \
  "$URL")

# Check for errors
if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if 'error' in d else 1)" 2>/dev/null; then
  echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"Error: {d['error'].get('detail', d['error'])}\")" >&2
  exit 1
fi

if [[ "$RAW" == "true" ]]; then
  echo "$RESPONSE" | python3 -m json.tool
  exit 0
fi

# Format output
python3 -c "
import json, sys

data = json.loads(sys.stdin.read())
grounding = data.get('grounding', {})
sources = data.get('sources', {})

results = grounding.get('generic', [])
if not results:
    print('No results found.')
    sys.exit(0)

for i, result in enumerate(results, 1):
    url = result.get('url', '')
    title = result.get('title', 'Untitled')
    snippets = result.get('snippets', [])
    
    # Get source metadata
    src = sources.get(url, {})
    age = src.get('age', [])
    age_str = f' ({age[0]})' if age else ''
    
    print(f'=== [{i}] {title}{age_str} ===')
    print(f'URL: {url}')
    print()
    
    for snippet in snippets:
        # Skip JSON-LD structured data blocks
        if snippet.strip().startswith('{\"@type\"'):
            continue
        if snippet.strip().startswith('{\"title\"'):
            continue
        # Truncate very long snippets
        if len(snippet) > 2000:
            snippet = snippet[:2000] + '...'
        print(snippet)
        print()
    
    print('---')
    print()

# Map results
map_results = grounding.get('map', [])
if map_results:
    print('=== Map Results ===')
    for r in map_results:
        print(f\"- {r.get('title', '')}: {r.get('url', '')}\")
    print()
" <<< "$RESPONSE"
