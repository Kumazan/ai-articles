#!/usr/bin/env python3
"""Autotune runner for cron.

Goals:
- Read last JSON objects from today jsonl files (arbscan/arb/paper-fills)
- Run optimizer.py (may update .env ARB_CONCURRENCY)
- If concurrency changed, restart polymarket-bot-v0.service
- Write data/autotune-status.json (short machine snapshot)
- If opportunity found, write data/LAST_OPPORTUNITY.txt (human snapshot)

Never print secrets (do not dump env contents).
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
ENV_PATH = BASE / ".env"
STATUS_PATH = DATA / "autotune-status.json"          # latest snapshot (overwritten)
STATUS_LOG_PATH = DATA / "autotune-status.jsonl"      # append-only history
LAST_OPP_PATH = DATA / "LAST_OPPORTUNITY.txt"
SERVICE_NAME = "polymarket-bot-v0.service"


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def today_utc_day() -> str:
    # keep consistent with existing scripts
    return os.popen("date -u +%F").read().strip()


def read_env_kv(path: Path) -> dict[str, str]:
    d: dict[str, str] = {}
    if not path.exists():
        return d
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        d[k.strip()] = v.strip()
    return d


def get_concurrency(env: dict[str, str]) -> int:
    v = env.get("ARB_CONCURRENCY", "10")
    try:
        return int(v)
    except Exception:
        return 10


def last_jsonl_obj(path: Path) -> Optional[dict[str, Any]]:
    if not path.exists():
        return None
    last: Optional[dict[str, Any]] = None
    try:
        with path.open() as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                    if isinstance(obj, dict):
                        last = obj
                except Exception:
                    continue
    except Exception:
        return None
    return last


def safe_num(x: Any) -> Optional[float]:
    if x is None:
        return None
    try:
        return float(x)
    except Exception:
        return None


def safe_int(x: Any, default: int = 0) -> int:
    try:
        if x is None:
            return default
        return int(x)
    except Exception:
        return default


def run_optimizer() -> tuple[int, str, str, float]:
    t0 = time.time()
    p = subprocess.run(
        [sys.executable, str(BASE / "optimizer.py")],
        cwd=str(BASE),
        capture_output=True,
        text=True,
        timeout=90,
    )
    dt = time.time() - t0
    return p.returncode, (p.stdout or "").strip(), (p.stderr or "").strip(), dt


def restart_service() -> tuple[bool, str]:
    # Return (ok, message)
    try:
        p = subprocess.run(
            ["systemctl", "restart", SERVICE_NAME],
            cwd=str(BASE),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if p.returncode == 0:
            return True, "restarted"
        msg = (p.stderr or p.stdout or "").strip()
        return False, (msg[:500] if msg else f"systemctl restart failed rc={p.returncode}")
    except Exception as e:
        return False, f"exception: {type(e).__name__}: {e}"


def write_json(path: Path, obj: dict[str, Any]) -> None:
    """Write a single JSON object atomically (used for latest snapshot)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, sort_keys=True) + "\n")
    tmp.replace(path)


def append_jsonl(path: Path, obj: dict[str, Any]) -> None:
    """Append one JSON object as a line (history log)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(obj, ensure_ascii=False, sort_keys=True) + "\n")


def write_last_opportunity(
    *,
    day: str,
    arbscan_last: Optional[dict[str, Any]],
    arb_last: Optional[dict[str, Any]],
    fills_last: Optional[dict[str, Any]],
    conc_before: int,
    conc_after: int,
    restart_happened: bool,
) -> None:
    lines: list[str] = []
    lines.append(f"UTC: {utc_now_iso()}")
    lines.append(f"day: {day}")
    if arbscan_last:
        found = arbscan_last.get("found")
        best_u = arbscan_last.get("best_profit_usdc")
        best_p = arbscan_last.get("best_profit_pct")
        took_s = arbscan_last.get("took_s")
        lines.append(f"arbscan: found={found} best_profit_usdc={best_u} best_profit_pct={best_p} took_s={took_s}")
    else:
        lines.append("arbscan: (missing)")

    if arb_last:
        # Keep this short to avoid accidental secret leakage
        lines.append(f"arb(last): type={arb_last.get('type')} ts={arb_last.get('ts')} profit_usdc={arb_last.get('profit_usdc')}")
    else:
        lines.append("arb(last): (missing)")

    if fills_last:
        lines.append(f"paper-fills(last): type={fills_last.get('type')} ts={fills_last.get('ts')} side={fills_last.get('side')} size={fills_last.get('size')}")
    else:
        lines.append("paper-fills(last): (missing)")

    lines.append(f"concurrency: {conc_before} -> {conc_after} (restart={restart_happened})")

    LAST_OPP_PATH.parent.mkdir(parents=True, exist_ok=True)
    LAST_OPP_PATH.write_text("\n".join(lines).strip() + "\n")


def main() -> int:
    t0 = time.time()
    DATA.mkdir(parents=True, exist_ok=True)

    day = today_utc_day()
    arbscan_path = DATA / f"arbscan-{day}.jsonl"
    arb_path = DATA / f"arb-{day}.jsonl"
    fills_path = DATA / f"paper-fills-{day}.jsonl"

    arbscan_last = last_jsonl_obj(arbscan_path)
    arb_last = last_jsonl_obj(arb_path)
    fills_last = last_jsonl_obj(fills_path)

    env_before = read_env_kv(ENV_PATH)
    conc_before = get_concurrency(env_before)

    errors: list[str] = []
    optimizer_rc, optimizer_out, optimizer_err, optimizer_dt = 0, "", "", 0.0
    try:
        optimizer_rc, optimizer_out, optimizer_err, optimizer_dt = run_optimizer()
        if optimizer_rc != 0:
            errors.append(f"optimizer rc={optimizer_rc}")
        if optimizer_err:
            # trim
            errors.append(f"optimizer stderr: {optimizer_err[:300]}")
    except Exception as e:
        errors.append(f"optimizer exception: {type(e).__name__}: {e}")

    env_after = read_env_kv(ENV_PATH)
    conc_after = get_concurrency(env_after)

    restart_happened = False
    if conc_after != conc_before:
        ok, msg = restart_service()
        restart_happened = ok
        if not ok:
            errors.append(f"restart failed: {msg}")

    # Pull key stats primarily from arbscan summary (already contains rate limit/error counts)
    found = safe_int(arbscan_last.get("found") if arbscan_last else 0, 0)
    best_profit_usdc = safe_num(arbscan_last.get("best_profit_usdc") if arbscan_last else None)
    best_profit_pct = safe_num(arbscan_last.get("best_profit_pct") if arbscan_last else None)
    took_s = safe_num(arbscan_last.get("took_s") if arbscan_last else None)
    rate_limits = safe_int(arbscan_last.get("rate_limits") if arbscan_last else 0, 0)
    scan_errors = safe_int(arbscan_last.get("errors") if arbscan_last else 0, 0)

    status = {
        "timestamp": utc_now_iso(),
        "took_s": took_s,
        "found": found,
        "best_profit_usdc": best_profit_usdc,
        "best_profit_pct": best_profit_pct,
        "errors": scan_errors,
        "rate_limits": rate_limits,
        "concurrency": conc_after,
        "restart_happened": restart_happened,
        "optimizer_took_s": round(optimizer_dt, 3),
        "optimizer_rc": optimizer_rc,
        "took_total_s": round(time.time() - t0, 3),
        "errors_detail": errors[:10],
    }

    # Write latest snapshot + append history
    write_json(STATUS_PATH, status)
    append_jsonl(STATUS_LOG_PATH, status)

    if (best_profit_usdc is not None) or (found > 0):
        write_last_opportunity(
            day=day,
            arbscan_last=arbscan_last,
            arb_last=arb_last,
            fills_last=fills_last,
            conc_before=conc_before,
            conc_after=conc_after,
            restart_happened=restart_happened,
        )

    # Only print if there's something worth surfacing in logs.
    if errors or (best_profit_usdc is not None) or (found > 0):
        msg = {
            "found": found,
            "best_profit_usdc": best_profit_usdc,
            "best_profit_pct": best_profit_pct,
            "concurrency": conc_after,
            "restart_happened": restart_happened,
            "errors": errors,
        }
        print(json.dumps(msg, ensure_ascii=False))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
