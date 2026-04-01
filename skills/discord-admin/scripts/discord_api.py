#!/usr/bin/env python3
"""
Discord Admin API Script
Token 從環境變數 DISCORD_BOT_TOKEN 讀取（fallback: openclaw.json）
"""
import json
import os
import sys
import argparse
import urllib.request
import urllib.error

API_BASE = "https://discord.com/api/v10"
USER_AGENT = "DiscordBot (https://openclaw.ai, 1.0)"


def get_token() -> str:
    token = os.environ.get("DISCORD_BOT_TOKEN")
    if token:
        return token
    config_path = os.path.expanduser("~/.openclaw/openclaw.json")
    with open(config_path) as f:
        d = json.load(f)
    return d["channels"]["discord"]["token"]


def make_request(url: str, method: str = "GET", payload: dict = None) -> dict:
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bot {get_token()}")
    req.add_header("User-Agent", USER_AGENT)
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()}", file=sys.stderr)
        sys.exit(1)


def list_channels(guild_id: str) -> list:
    url = f"{API_BASE}/guilds/{guild_id}/channels"
    channels = make_request(url)
    type_map = {0: "text", 2: "voice", 4: "category", 5: "announce", 15: "forum", 16: "media"}
    for c in sorted(channels, key=lambda x: (x.get("position", 0), x["type"])):
        t = type_map.get(c["type"], str(c["type"]))
        print(f"{t:10} | {c['name']:30} | {c['id']} | parent: {c.get('parent_id', '-')}")
    return channels


def create_channel(guild_id: str, name: str, channel_type: int = 0,
                   category_id: str = None, topic: str = None) -> dict:
    url = f"{API_BASE}/guilds/{guild_id}/channels"
    payload = {"name": name, "type": channel_type}
    if category_id:
        payload["parent_id"] = category_id
    if topic:
        payload["topic"] = topic
    result = make_request(url, method="POST", payload=payload)
    print(f"Created channel: {result['name']} (ID: {result['id']})")
    return result


def move_channel(channel_id: str, category_id: str) -> dict:
    url = f"{API_BASE}/channels/{channel_id}"
    result = make_request(url, method="PATCH", payload={"parent_id": category_id})
    print(f"Moved channel {channel_id} to parent: {result.get('parent_id')}")
    return result


def update_channel(channel_id: str, name: str = None, topic: str = None) -> dict:
    url = f"{API_BASE}/channels/{channel_id}"
    payload = {}
    if name:
        payload["name"] = name
    if topic is not None:
        payload["topic"] = topic
    result = make_request(url, method="PATCH", payload=payload)
    print(f"Updated channel {channel_id}: name={result.get('name')}, topic={result.get('topic')}")
    return result


def delete_channel(channel_id: str) -> dict:
    url = f"{API_BASE}/channels/{channel_id}"
    result = make_request(url, method="DELETE")
    print(f"Deleted channel {channel_id}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Discord Admin API CLI")
    parser.add_argument("--action", required=True,
                        choices=["list", "create", "move", "update", "delete"],
                        help="Action to perform")
    parser.add_argument("--guild-id", default="1385879900031942766",
                        help="Guild (Server) ID (default: Kuma's server)")
    parser.add_argument("--channel-id", help="Target channel ID")
    parser.add_argument("--name", help="Channel name")
    parser.add_argument("--type", type=int, default=0,
                        help="Channel type (0=text, 2=voice, 4=category, 5=announce, 15=forum)")
    parser.add_argument("--category-id", help="Parent category ID")
    parser.add_argument("--topic", help="Channel topic/description")

    args = parser.parse_args()

    if args.action == "list":
        list_channels(args.guild_id)

    elif args.action == "create":
        if not args.name:
            parser.error("--name is required for create")
        create_channel(args.guild_id, args.name, args.type, args.category_id, args.topic)

    elif args.action == "move":
        if not args.channel_id or not args.category_id:
            parser.error("--channel-id and --category-id are required for move")
        move_channel(args.channel_id, args.category_id)

    elif args.action == "update":
        if not args.channel_id:
            parser.error("--channel-id is required for update")
        update_channel(args.channel_id, args.name, args.topic)

    elif args.action == "delete":
        if not args.channel_id:
            parser.error("--channel-id is required for delete")
        confirm = input(f"Delete channel {args.channel_id}? [y/N] ")
        if confirm.lower() == "y":
            delete_channel(args.channel_id)
        else:
            print("Cancelled.")
