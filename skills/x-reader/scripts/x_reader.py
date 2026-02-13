#!/usr/bin/env python3
"""
X Reader — State management & filtering CLI

Commands:
  status                  Show last scan time & stats
  filter                  Filter raw tweets JSON from stdin, output kept tweets
  mark-read               Mark tweet IDs as seen
  add-account             Add account to follow list
  remove-account          Remove account from follow list
  accounts                List all tracked accounts

Usage:
  echo '<raw_json>' | python3 x_reader.py filter
  python3 x_reader.py mark-read --ids id1,id2,id3
  python3 x_reader.py add-account --handle karpathy --tier s --desc "AI educator"
  python3 x_reader.py status
"""

import json
import sys
import os
import re
import argparse
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Paths
SKILL_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = SKILL_DIR / "data"
STATE_FILE = DATA_DIR / "state.json"
CONFIG_FILE = SKILL_DIR / "config.yaml"

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text())
    return {
        "seen_ids": [],
        "last_scan": None,
        "stats": {"total_fetched": 0, "total_kept": 0, "total_skipped": 0}
    }

def save_state(state: dict):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False))

# --- Filter logic ---

LINK_PATTERN = re.compile(r'https?://(?!x\.com|twitter\.com)[^\s]+')
THREAD_SIGNALS = ['🧵', 'thread', 'Thread', '1/', '1)', 'a thread']
CODE_SIGNALS = ['```', 'def ', 'func ', 'const ', 'import ', 'class ', '=> ', '->']
BENCHMARK_SIGNALS = ['benchmark', 'latency', 'throughput', 'ms', 'tokens/s', 'TTFT',
                     'req/s', 'QPS', 'p50', 'p99', '%', 'accuracy', 'F1']
SKIP_SIGNALS = ['ratio', 'like if you', 'retweet if', 'INSANE', 'GAME CHANGER',
                'OMG this', '🔥🔥🔥', 'unpopular opinion']

def has_external_link(text: str) -> bool:
    return bool(LINK_PATTERN.search(text))

def is_thread(text: str) -> bool:
    return any(s in text for s in THREAD_SIGNALS)

def has_code(text: str) -> bool:
    return any(s in text for s in CODE_SIGNALS)

def has_benchmark(text: str) -> bool:
    text_lower = text.lower()
    return any(s.lower() in text_lower for s in BENCHMARK_SIGNALS)

def is_noise(text: str) -> bool:
    return any(s.lower() in text.lower() for s in SKIP_SIGNALS)

def should_keep(tweet: dict) -> tuple[bool, str]:
    """Returns (keep, reason)."""
    text = tweet.get("text", "")

    # Skip check first
    if is_noise(text):
        return False, "engagement_bait_or_noise"

    # Must-collect checks
    if has_external_link(text):
        return True, "has_external_link"
    if is_thread(text):
        return True, "is_thread"
    if has_code(text):
        return True, "has_code_block"
    if has_benchmark(text):
        return True, "has_benchmark_data"

    # Default: skip (pure opinion or low signal)
    return False, "no_signal_match"

def cmd_filter(args):
    """Read raw tweets from stdin, output filtered ones."""
    raw = json.loads(sys.stdin.read())
    tweets = raw if isinstance(raw, list) else raw.get("tweets", [])

    state = load_state()
    seen = set(state["seen_ids"])

    kept = []
    skipped = 0
    for t in tweets:
        tid = t.get("id", t.get("url", ""))
        if tid in seen:
            skipped += 1
            continue
        keep, reason = should_keep(t)
        if keep:
            t["_filter_reason"] = reason
            kept.append(t)
        else:
            skipped += 1

    state["stats"]["total_fetched"] += len(tweets)
    state["stats"]["total_kept"] += len(kept)
    state["stats"]["total_skipped"] += skipped
    save_state(state)

    json.dump(kept, sys.stdout, indent=2, ensure_ascii=False)
    print(f"\n# Kept: {len(kept)} / Skipped: {skipped}", file=sys.stderr)

def cmd_mark_read(args):
    """Mark tweet IDs as seen."""
    state = load_state()
    ids = [i.strip() for i in args.ids.split(",") if i.strip()]
    state["seen_ids"].extend(ids)
    # Keep last 5000 IDs to avoid unbounded growth
    state["seen_ids"] = state["seen_ids"][-5000:]
    state["last_scan"] = datetime.now(timezone.utc).isoformat()
    save_state(state)
    print(f"Marked {len(ids)} tweets as read.")

def cmd_status(args):
    """Show scan status."""
    state = load_state()
    s = state["stats"]
    last = state["last_scan"] or "never"
    seen = len(state["seen_ids"])
    print(f"📊 X Reader Status")
    print(f"  Last scan:     {last}")
    print(f"  Seen tweets:   {seen}")
    print(f"  Total fetched: {s['total_fetched']}")
    print(f"  Total kept:    {s['total_kept']}")
    print(f"  Total skipped: {s['total_skipped']}")

def cmd_add_account(args):
    """Add account to config (prints instruction — config is YAML, managed by agent)."""
    print(f"Add to config.yaml under tier_{args.tier}:")
    print(f'  - handle: {args.handle}')
    print(f'    desc: "{args.desc}"')

def cmd_accounts(args):
    """List accounts from config."""
    # Simple YAML parse for accounts (no pyyaml dependency)
    if not CONFIG_FILE.exists():
        print("No config.yaml found.")
        return
    text = CONFIG_FILE.read_text()
    handles = re.findall(r'handle:\s*(\S+)', text)
    for h in handles:
        print(f"  @{h}")
    print(f"\nTotal: {len(handles)} accounts")

def main():
    parser = argparse.ArgumentParser(description="X Reader CLI")
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("status", help="Show scan status")
    sub.add_parser("filter", help="Filter tweets from stdin")
    sub.add_parser("accounts", help="List tracked accounts")

    p_mark = sub.add_parser("mark-read", help="Mark tweets as read")
    p_mark.add_argument("--ids", required=True, help="Comma-separated tweet IDs")

    p_add = sub.add_parser("add-account", help="Add account")
    p_add.add_argument("--handle", required=True)
    p_add.add_argument("--tier", default="a", choices=["s", "a", "b", "c"])
    p_add.add_argument("--desc", default="")

    args = parser.parse_args()

    cmds = {
        "status": cmd_status,
        "filter": cmd_filter,
        "mark-read": cmd_mark_read,
        "add-account": cmd_add_account,
        "accounts": cmd_accounts,
    }

    if args.command in cmds:
        cmds[args.command](args)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
