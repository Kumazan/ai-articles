"""Extract X/Twitter cookies from OpenClaw browser via CDP. Prints export lines."""
import asyncio, json, os, sys, urllib.request

CDP_PORT = int(os.environ.get("CDP_PORT", 18800))

async def main():
    import websockets
    # Find x.com tab
    data = urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json").read()
    tabs = json.loads(data)
    tab_id = None
    for t in tabs:
        if "x.com" in t.get("url", ""):
            tab_id = t["id"]
            break
    if not tab_id:
        print("ERROR: No x.com tab found in the OpenClaw browser.", file=sys.stderr)
        print("Please open https://x.com in the OpenClaw browser and log in first, then retry.", file=sys.stderr)
        sys.exit(1)

    async with websockets.connect(f"ws://127.0.0.1:{CDP_PORT}/devtools/page/{tab_id}") as ws:
        await ws.send(json.dumps({"id": 1, "method": "Network.getCookies", "params": {"urls": ["https://x.com"]}}))
        resp = json.loads(await ws.recv())
        for c in resp.get("result", {}).get("cookies", []):
            if c["name"] in ("auth_token", "ct0"):
                print(f"export {c['name'].upper()}={c['value']}")

asyncio.run(main())
