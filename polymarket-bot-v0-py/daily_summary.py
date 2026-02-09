#!/usr/bin/env python3
"""Generate daily summary artifacts from existing JSONL logs.

Outputs (in data/ by default):
- daily-summary-YYYY-MM-DD.json
- daily-summary-YYYY-MM-DD.txt

The goal is a stable review loop: quick "how did today go?" metrics without
reading raw JSONL.

Data sources (if present):
- arbscan-YYYY-MM-DD.jsonl
- arb-signals-YYYY-MM-DD.jsonl
- autotune-status.jsonl (optional; used only for last-known concurrency)

This script is intentionally dependency-free.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple


def _today_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _quantile(sorted_vals: List[float], q: float) -> float:
    if not sorted_vals:
        return 0.0
    if q <= 0:
        return float(sorted_vals[0])
    if q >= 1:
        return float(sorted_vals[-1])
    idx = int(round(q * (len(sorted_vals) - 1)))
    idx = max(0, min(len(sorted_vals) - 1, idx))
    return float(sorted_vals[idx])


def _read_jsonl(path: Path) -> Tuple[List[Dict[str, Any]], int]:
    """Return (records, bad_lines). Missing file => ([], 0)."""
    if not path.exists():
        return [], 0
    out: List[Dict[str, Any]] = []
    bad = 0
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                js = json.loads(line)
                if isinstance(js, dict):
                    out.append(js)
                else:
                    bad += 1
            except Exception:
                bad += 1
    return out, bad


@dataclass
class DailySummary:
    day: str
    generated_at: str
    files_present: Dict[str, bool]
    bad_lines: Dict[str, int]

    # arbscan
    arbscan_count: int
    scanned_sum: int
    took_s_avg: float
    took_s_p50: float
    took_s_p95: float
    errors_sum: int
    scans_with_errors: int
    errors_per_scan_avg: float
    errors_per_market_avg: float
    top_error_categories: List[Tuple[str, int]]
    top_error_categories_recent: List[Tuple[str, int]]
    top_error_categories_recent_15: List[Tuple[str, int]]
    rate_limits_sum: int
    found_sum: int

    # signals
    signals_count: int

    # autotune (best-effort)
    last_concurrency: Optional[int]


def summarize(day: str, data_dir: Path) -> DailySummary:
    paths = {
        "arbscan": data_dir / f"arbscan-{day}.jsonl",
        "signals": data_dir / f"arb-signals-{day}.jsonl",
        "autotune_jsonl": data_dir / "autotune-status.jsonl",
    }

    arbscan, bad_arbscan = _read_jsonl(paths["arbscan"])
    signals, bad_signals = _read_jsonl(paths["signals"])
    autotune_hist, bad_autotune = _read_jsonl(paths["autotune_jsonl"])

    took_vals: List[float] = []
    errors_sum = 0
    rl_sum = 0
    found_sum = 0
    scanned_sum = 0
    scans_with_errors = 0
    error_cats: Dict[str, int] = {}
    recent_error_cats: Dict[str, int] = {}
    recent_error_cats_15: Dict[str, int] = {}
    recent_window: List[Dict[str, Any]] = []

    for r in arbscan:
        # These keys exist in our arbscan log entries.
        recent_window.append(r)
        if len(recent_window) > 60:
            recent_window.pop(0)
        took = r.get("took_s")
        if isinstance(took, (int, float)):
            took_vals.append(float(took))
        scanned = r.get("scanned")
        if isinstance(scanned, int):
            scanned_sum += scanned
        err = r.get("errors")
        if isinstance(err, int):
            errors_sum += err
            if err > 0:
                scans_with_errors += 1
        # optional detail categories (capped list)
        det = r.get("errors_detail")
        if isinstance(det, list):
            for x in det:
                if isinstance(x, str) and x:
                    error_cats[x] = error_cats.get(x, 0) + 1
        rl = r.get("rate_limits")
        if isinstance(rl, int):
            rl_sum += rl
        found = r.get("found")
        if isinstance(found, int):
            found_sum += found

    took_vals_sorted = sorted(took_vals)
    took_avg = (sum(took_vals_sorted) / len(took_vals_sorted)) if took_vals_sorted else 0.0

    # signals log: count lines (each is a signal record)
    signals_count = len(signals)

    # last concurrency (best effort)
    last_conc: Optional[int] = None
    for r in reversed(autotune_hist):
        # only consider same-day entries if they include day
        rday = r.get("day")
        if rday and rday != day:
            continue
        c = r.get("concurrency")
        if isinstance(c, int):
            last_conc = c
            break

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # recent top categories (last 60 arbscan records)
    for r in recent_window:
        det = r.get("errors_detail")
        if isinstance(det, list):
            for x in det:
                if isinstance(x, str) and x:
                    recent_error_cats[x] = recent_error_cats.get(x, 0) + 1

    # ultra-recent (last 15)
    for r in recent_window[-15:]:
        det = r.get("errors_detail")
        if isinstance(det, list):
            for x in det:
                if isinstance(x, str) and x:
                    recent_error_cats_15[x] = recent_error_cats_15.get(x, 0) + 1

    top_cats = sorted(error_cats.items(), key=lambda kv: kv[1], reverse=True)[:10]
    top_cats_recent = sorted(recent_error_cats.items(), key=lambda kv: kv[1], reverse=True)[:10]
    top_cats_recent_15 = sorted(recent_error_cats_15.items(), key=lambda kv: kv[1], reverse=True)[:10]
    errors_per_scan = (errors_sum / len(arbscan)) if arbscan else 0.0
    errors_per_mkt = (errors_sum / scanned_sum) if scanned_sum else 0.0

    return DailySummary(
        day=day,
        generated_at=now,
        files_present={k: p.exists() for k, p in paths.items()},
        bad_lines={
            "arbscan": bad_arbscan,
            "signals": bad_signals,
            "autotune_jsonl": bad_autotune,
        },
        arbscan_count=len(arbscan),
        scanned_sum=int(scanned_sum),
        took_s_avg=float(took_avg),
        took_s_p50=_quantile(took_vals_sorted, 0.50),
        took_s_p95=_quantile(took_vals_sorted, 0.95),
        errors_sum=int(errors_sum),
        scans_with_errors=int(scans_with_errors),
        errors_per_scan_avg=float(errors_per_scan),
        errors_per_market_avg=float(errors_per_mkt),
        top_error_categories=top_cats,
        top_error_categories_recent=top_cats_recent,
        top_error_categories_recent_15=top_cats_recent_15,
        rate_limits_sum=int(rl_sum),
        found_sum=int(found_sum),
        signals_count=int(signals_count),
        last_concurrency=last_conc,
    )


def render_text(s: DailySummary) -> str:
    conc = "--" if s.last_concurrency is None else str(s.last_concurrency)
    return "\n".join(
        [
            f"Daily Summary {s.day}",
            "=" * 42,
            f"generated_at: {s.generated_at}",
            "",
            "Arbscan:",
            f"  scans:       {s.arbscan_count} (markets scanned total={s.scanned_sum})",
            f"  took_s:      avg={s.took_s_avg:.2f}  p50={s.took_s_p50:.2f}  p95={s.took_s_p95:.2f}",
            f"  errors:      sum={s.errors_sum}  scans_with_errors={s.scans_with_errors}  per_scan={s.errors_per_scan_avg:.2f}  per_market={s.errors_per_market_avg:.4f}",
            f"  rate_limits: {s.rate_limits_sum}",
            f"  found_sum:   {s.found_sum}",
            "",
            "Signals:",
            f"  count:       {s.signals_count}",
            "",
            "Top error categories (today sample):",
            "  " + (", ".join([f"{k}={v}" for k, v in s.top_error_categories]) if s.top_error_categories else "(none)"),
            "Top error categories (recent 60 scans):",
            "  " + (", ".join([f"{k}={v}" for k, v in s.top_error_categories_recent]) if s.top_error_categories_recent else "(none)"),
            "Top error categories (recent 15 scans):",
            "  " + (", ".join([f"{k}={v}" for k, v in s.top_error_categories_recent_15]) if s.top_error_categories_recent_15 else "(none)"),
            "",
            "Autotune (best-effort):",
            f"  last_concurrency: {conc}",
            "",
            "Notes:",
            "  - Missing files are normal on first run / quiet days.",
            "  - bad_lines>0 means some JSONL lines were malformed and ignored.",
        ]
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", default=_today_utc(), help="YYYY-MM-DD (UTC)")
    ap.add_argument("--data-dir", default=str(Path(__file__).resolve().parent / "data"))
    ap.add_argument("--out-dir", default=None, help="default: same as --data-dir")
    args = ap.parse_args()

    data_dir = Path(args.data_dir)
    out_dir = Path(args.out_dir) if args.out_dir else data_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    s = summarize(args.day, data_dir)

    json_path = out_dir / f"daily-summary-{s.day}.json"
    txt_path = out_dir / f"daily-summary-{s.day}.txt"

    json_path.write_text(json.dumps(asdict(s), ensure_ascii=False, indent=2), encoding="utf-8")
    txt_path.write_text(render_text(s) + "\n", encoding="utf-8")

    print(render_text(s))
    print(f"\nWrote: {json_path}\n      {txt_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
