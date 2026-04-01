#!/bin/bash
# Fetch X cookies from OpenClaw browser via CDP on-the-fly, then run bird.
# Cookies are only held in memory for the duration of the command.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

eval "$(uv run --with websockets python3 "$SCRIPT_DIR/cdp_cookies.py" 2>/dev/null)"

if [ -z "${AUTH_TOKEN:-}" ] || [ -z "${CT0:-}" ]; then
  echo "❌ Failed to extract cookies from CDP" >&2
  exit 1
fi

exec bird "$@"
