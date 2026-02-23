#!/bin/bash
set -euo pipefail

SRC="$HOME/.openclaw/"
BACKUP_DIR="$HOME/.openclaw/workspace/tmp/openclaw-backup"
LOG_DIR="$HOME/.openclaw/workspace/memory"
LOG_FILE="$LOG_DIR/nightly-dev-log.md"

mkdir -p "$BACKUP_DIR" "$LOG_DIR"

if [ ! -d "$BACKUP_DIR/.git" ]; then
  rm -rf "$BACKUP_DIR"
  git clone https://github.com/Kumazan/openclaw-backup "$BACKUP_DIR"
fi

cd "$BACKUP_DIR"

# Keep local branch on main
if git rev-parse --verify main >/dev/null 2>&1; then
  git checkout main >/dev/null 2>&1 || true
fi

git pull --rebase origin main >/dev/null 2>&1 || true

# Sync sanitized content
rsync -a --delete \
  --exclude '.DS_Store' \
  --exclude '.git/' \
  --exclude '**/.git/' \
  --exclude '.secrets/' \
  --exclude '**/.secrets/' \
  --exclude 'secrets/' \
  --exclude '**/secrets/' \
  --exclude '**/*.pem' \
  --exclude '**/*.key' \
  --exclude '**/*.p12' \
  --exclude '**/*.pfx' \
  --exclude '**/.env' \
  --exclude '**/.env.*' \
  --exclude '**/credentials*.json' \
  --exclude '**/token*.json' \
  --exclude '**/node_modules/' \
  --exclude '**/.next/' \
  --exclude '**/.venv*/' \
  --exclude '**/venv/' \
  --exclude '**/__pycache__/' \
  --exclude '**/*.log' \
  --exclude '**/tmp/' \
  --exclude '**/cache/' \
  --exclude 'workspace/tmp/' \
  --exclude 'workspace/.openclaw/' \
  "$SRC" "$BACKUP_DIR/"

# Enforce backup repo ignore rules
cat > "$BACKUP_DIR/.gitignore" <<'EOF'
# secrets / credentials
**/.env
**/.env.*
**/*secret*
**/*token*
**/*credential*
**/*.pem
**/*.key
**/*.p12
**/*.pfx

# vcs / caches / deps
**/.git/
**/node_modules/
**/.next/
**/.cache/
**/__pycache__/
**/.venv*/
**/venv/
**/*.log

# local scratch
workspace/tmp/
tmp/
EOF

# Ensure commit identity
if ! git config user.name >/dev/null; then
  git config user.name "Kai-Qi Xiong"
fi
if ! git config user.email >/dev/null; then
  git config user.email "bear24ice@gmail.com"
fi

git add -A

if git diff --cached --quiet; then
  TS=$(date '+%Y-%m-%d %H:%M:%S')
  echo "- [$TS] openclaw backup: no changes" >> "$LOG_FILE"
  exit 0
fi

TS_COMMIT=$(date '+%Y-%m-%d %H:%M:%S %z')
git commit -m "backup: daily sanitized snapshot ($TS_COMMIT)" >/dev/null
git push origin main >/dev/null

TS=$(date '+%Y-%m-%d %H:%M:%S')
SHA=$(git rev-parse --short HEAD)
echo "- [$TS] openclaw backup: pushed $SHA" >> "$LOG_FILE"
