from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"

app = FastAPI(title="Polymarket Bot v0 儀表板")


def tail_jsonl(path: Path, n: int = 200) -> list[dict[str, Any]]:
    """Return last N JSON objects from a jsonl file."""
    if not path.exists():
        return []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except Exception:
        return []
    out: list[dict[str, Any]] = []
    for line in lines[-n:]:
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
            if isinstance(obj, dict):
                out.append(obj)
        except Exception:
            continue
    return out


def latest_json(path: Path) -> Optional[dict[str, Any]]:
    if not path.exists():
        return None
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
        return obj if isinstance(obj, dict) else None
    except Exception:
        return None


def latest_15m_snapshot(day: str) -> Optional[dict[str, Any]]:
    rows = tail_jsonl(DATA / f"pm15m-{day}.jsonl", 200)
    # find last pm_15m_top
    for r in reversed(rows):
        if r.get("type") == "pm_15m_top":
            return r
    return None


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/api/status")
def api_status():
    # Latest autotune snapshot
    snap = latest_json(DATA / "autotune-status.json")

    # Recent scan summaries / signals
    day = __import__("time").strftime("%Y-%m-%d")
    arbscan = tail_jsonl(DATA / f"arbscan-{day}.jsonl", 200)
    signals = tail_jsonl(DATA / f"arb-signals-{day}.jsonl", 200)
    cex = tail_jsonl(DATA / f"cex-signal-{day}.jsonl", 50)
    cex_edge = tail_jsonl(DATA / f"cex-edge-{day}.jsonl", 50)

    pm15m = latest_15m_snapshot(day)
    daily = latest_json(DATA / f"daily-summary-{day}.json")

    return {
        "day": day,
        "autotune": snap,
        "arbscan_recent": arbscan[-60:],
        "signals_recent": signals[-60:],
        "pm15m_latest": pm15m,
        "daily_summary": daily,
        "cex_signals_recent": cex[-10:],
        "cex_edge_recent": cex_edge[-10:],
    }


@app.get("/", response_class=HTMLResponse)
def index():
    # Single-page dashboard (ZH-TW), CDN-only.
    html = """<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset='utf-8'/>
  <meta name='viewport' content='width=device-width, initial-scale=1'/>
  <title>Polymarket Bot 儀表板</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --bg: #0b1020;
      --card: rgba(255,255,255,0.06);
      --card2: rgba(255,255,255,0.04);
      --text: rgba(255,255,255,0.92);
      --muted: rgba(255,255,255,0.65);
      --line: rgba(255,255,255,0.12);
      --good: #2dd4bf;
      --warn: #fbbf24;
      --bad: #fb7185;
      --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    body {
      margin: 0;
      background: radial-gradient(1200px 800px at 20% 10%, rgba(45,212,191,0.10), transparent 60%),
                  radial-gradient(900px 700px at 90% 0%, rgba(251,113,133,0.10), transparent 55%),
                  var(--bg);
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }
    header {
      padding: 22px 22px 14px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
    }
    h1 { font-size: 18px; margin: 0; letter-spacing: 0.2px; }
    .sub { color: var(--muted); font-size: 12px; }
    .wrap { padding: 18px 22px 40px; max-width: 1180px; margin: 0 auto; }
    .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 14px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .card {
      background: linear-gradient(180deg, var(--card), var(--card2));
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      overflow: hidden;
    }
    .chartWrap { height: 220px; }
    canvas { width: 100% !important; height: 100% !important; }
    .card h2 { margin: 0 0 10px; font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 600; }
    .kpis { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
    .kpi { border: 1px solid var(--line); border-radius: 12px; padding: 10px; }
    .kpi .label { color: var(--muted); font-size: 11px; }
    .kpi .value { font-size: 16px; margin-top: 4px; font-family: var(--mono); }
    .pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border: 1px solid var(--line); border-radius: 999px; font-size: 12px; color: var(--muted); }
    .dot { width: 8px; height: 8px; border-radius: 999px; background: var(--good); }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border-bottom: 1px solid var(--line); padding: 8px 6px; text-align: left; }
    th { color: var(--muted); font-weight: 600; }
    .mono { font-family: var(--mono); }
    .right { text-align: right; }
    .muted { color: var(--muted); }
    .small { font-size: 11px; }
    .badge { font-family: var(--mono); font-size: 11px; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); }
    .good { color: var(--good); }
    .warn { color: var(--warn); }
    .bad { color: var(--bad); }
    .footer { margin-top: 14px; color: var(--muted); font-size: 11px; }
    pre { white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow: auto; border: 1px solid var(--line); border-radius: 12px; padding: 10px; background: rgba(0,0,0,0.15); }
    @media (max-width: 980px) {
      .grid { grid-template-columns: 1fr; }
      .kpis { grid-template-columns: repeat(2, 1fr); }
      .grid2 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
<header>
  <div>
    <h1>Polymarket Bot 儀表板（v0）</h1>
    <div class="sub">全中文／每 10 秒自動更新。資料來源：本機 json/jsonl（不含任何密鑰）。</div>
  </div>
  <div class="pill"><span class="dot" id="dot"></span><span id="statusText">連線中</span> <span class="badge" id="now">--</span></div>
</header>

<div class="wrap">

  <div class="card" style="margin-bottom:14px;">
    <h2>今日總覽（Daily Summary）</h2>
    <div class="muted small" id="daily">載入中…</div>
    <div class="footer">由 <span class="mono">data/daily-summary-YYYY-MM-DD.json</span> 生成（若不存在會顯示載入中）。</div>
    <div class="muted small" style="margin-top:8px;" id="cex">CEX 外部訊號：載入中…</div>
    <div class="muted small" style="margin-top:6px;" id="cexEdge">Edge：載入中…</div>
    <div class="footer">CEX 外部訊號（Binance）：15m drift → p_hat_up（保守映射；僅供參考/紙上交易）。</div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>自動優化（Autotune）</h2>
      <div class="kpis">
        <div class="kpi"><div class="label">掃描耗時 took_s</div><div class="value" id="k_took">--</div></div>
        <div class="kpi"><div class="label">found（可執行套利）</div><div class="value" id="k_found">--</div></div>
        <div class="kpi"><div class="label">errors</div><div class="value" id="k_err">--</div></div>
        <div class="kpi"><div class="label">rate_limits</div><div class="value" id="k_rl">--</div></div>
        <div class="kpi"><div class="label">concurrency</div><div class="value" id="k_conc">--</div></div>
      </div>
      <div class="footer">提示：found=0 很常見；重點是 errors/429 別爆、took_s 穩定且夠快。</div>
    </div>

    <div class="card">
      <h2>掃描趨勢（最近 30 筆，已限幅）</h2>
      <div class="chartWrap"><canvas id="chart"></canvas></div>
      <div class="footer">顯示：took_s（左軸）與 errors（右軸），用來判斷併發調參是否有效。</div>
    </div>
  </div>

  <div class="grid2" style="margin-top:14px;">
    <div class="card">
      <h2>15 分鐘市場（最新 Top of Book）</h2>
      <table>
        <thead><tr><th>幣種</th><th class="right">UP (Bid/Ask)</th><th class="right">DOWN (Bid/Ask)</th><th class="right">UP Spread</th></tr></thead>
        <tbody id="pm15mRows"><tr><td colspan="4" class="muted">載入中…</td></tr></tbody>
      </table>
      <div class="footer">僅顯示最佳價；完整快照在 pm15m-YYYY-MM-DD.jsonl。</div>
    </div>

    <div class="card">
      <h2>套利訊號：sum(best bids) &gt; 1（僅訊號）</h2>
      <div class="muted small">這類通常需要庫存/反向腿才好執行；先用來觀察市場不一致。</div>
      <pre class="mono small" id="signals">載入中…</pre>
    </div>

    <div class="card">
      <h2>原始狀態（節選）</h2>
      <pre class="mono small" id="raw">載入中…</pre>
    </div>
  </div>
</div>

<script>
let chart;
function fmt(x){
  if(x === null || x === undefined) return '--';
  if(typeof x === 'number') return Number.isFinite(x) ? x.toFixed(3).replace(/\.000$/,'') : '--';
  return String(x);
}
function fmt2(x){
  if(x === null || x === undefined) return '--';
  if(typeof x === 'number') return Number.isFinite(x) ? x.toFixed(2) : '--';
  return String(x);
}
function safeSpread(bid, ask){
  if(typeof bid !== 'number' || typeof ask !== 'number' || !isFinite(bid) || !isFinite(ask) || ask<=0) return null;
  return ask - bid;
}

async function refresh(){
  try{
    const r = await fetch('/api/status', {cache:'no-store'});
    const j = await r.json();

    const now = new Date();
    document.getElementById('now').textContent = now.toISOString().replace('T',' ').slice(0,19)+'Z';

    const a = j.autotune || {};
    document.getElementById('k_took').textContent = fmt2(a.took_s);
    document.getElementById('k_found').textContent = fmt(a.found);
    document.getElementById('k_err').textContent = fmt(a.errors);
    document.getElementById('k_rl').textContent = fmt(a.rate_limits);
    document.getElementById('k_conc').textContent = fmt(a.concurrency);

    // daily summary (best-effort)
    const ds = j.daily_summary || null;
    if(ds){
      const el = document.getElementById('daily');
      if(el){
        el.textContent = `掃描 ${ds.arbscan_count} 次｜錯誤 ${ds.errors_sum}｜429 ${ds.rate_limits_sum}｜found ${ds.found_sum}｜took_s p50 ${Number(ds.took_s_p50||0).toFixed(2)}｜p95 ${Number(ds.took_s_p95||0).toFixed(2)}`;
      }
    }

    // Chart
    const rowsAll = j.arbscan_recent || [];
    const keepN = 30;
    const rows = rowsAll.slice(-keepN);
    const labels = rows.map((_,i)=>String(i-rows.length+1));
    // clamp to avoid "爆炸" scale from occasional spikes
    const took = rows.map(x=>Math.min(10, Number(x.took_s || 0)));
    const errs = rows.map(x=>Math.min(50, Number(x.errors || 0)));
    if(!chart){
      const ctx = document.getElementById('chart');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'took_s（秒，已上限10）', data: took, borderColor: 'rgba(45,212,191,0.9)', backgroundColor: 'rgba(45,212,191,0.15)', tension: 0.35, yAxisID:'y', pointRadius: 0 },
            { label: 'errors（已上限50）', data: errs, borderColor: 'rgba(251,113,133,0.9)', backgroundColor: 'rgba(251,113,133,0.10)', tension: 0.35, yAxisID:'y2', pointRadius: 0 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.08)' }, ticks:{ color:'rgba(255,255,255,0.7)'} },
            y2: { beginAtZero: true, position:'right', grid: { display:false }, ticks:{ color:'rgba(255,255,255,0.7)'} },
            x: { grid: { display:false }, ticks:{ display:false } }
          },
          plugins: {
            legend: { labels: { color:'rgba(255,255,255,0.7)' } },
            tooltip: { enabled: true }
          }
        }
      });
    } else {
      chart.data.labels = labels;
      chart.data.datasets[0].data = took;
      chart.data.datasets[1].data = errs;
      chart.update();
    }

    // 15m
    const pm = j.pm15m_latest;

    // CEX signals (latest)
    const cexr = (j.cex_signals_recent || []);
    const cexLatest = cexr.length ? cexr[cexr.length-1] : null;
    if(cexLatest && cexLatest.signals){
      const el = document.getElementById('cex');
      if(el){
        const parts = Object.keys(cexLatest.signals).map(sym=>{
          const s = cexLatest.signals[sym] || {};
          const drift = (typeof s.drift === 'number') ? (s.drift*100).toFixed(3)+'%' : '--';
          const ph = (typeof s.p_hat_up === 'number') ? s.p_hat_up.toFixed(3) : '--';
          return `${sym}: drift=${drift} p_hat_up=${ph}`;
        });
        el.textContent = parts.join(' ｜ ');
      }
    }

    // CEX edge vs PM15m (latest)
    const edger = (j.cex_edge_recent || []);
    const edgeLatest = edger.length ? edger[edger.length-1] : null;
    if(edgeLatest && edgeLatest.edges){
      const el2 = document.getElementById('cexEdge');
      if(el2){
        const parts2 = Object.keys(edgeLatest.edges).map(sym=>{
          const e = edgeLatest.edges[sym] || {};
          const eu = (typeof e.edge_up === 'number') ? (e.edge_up*100).toFixed(2)+'pp' : '--';
          const ed = (typeof e.edge_down === 'number') ? (e.edge_down*100).toFixed(2)+'pp' : '--';
          return `${sym}: edge_up=${eu} edge_down=${ed}`;
        });
        el2.textContent = 'Edge(僅參考,未含fee)：' + parts2.join(' ｜ ');
      }
    }
    const tbody = document.getElementById('pm15mRows');
    if(pm && pm.markets){
      const syms = Object.keys(pm.markets);
      const tr = syms.map(sym=>{
        const toks = pm.markets[sym].tokens || [];
        const up = toks.find(x=>String(x.outcome).toLowerCase()==='up') || {};
        const down = toks.find(x=>String(x.outcome).toLowerCase()==='down') || {};
        const upSpread = safeSpread(up.best_bid, up.best_ask);
        return `<tr>
          <td class='mono'>${sym}</td>
          <td class='right mono'>${fmt2(up.best_bid)} / ${fmt2(up.best_ask)}</td>
          <td class='right mono'>${fmt2(down.best_bid)} / ${fmt2(down.best_ask)}</td>
          <td class='right mono'>${upSpread===null?'--':upSpread.toFixed(3)}</td>
        </tr>`;
      }).join('');
      tbody.innerHTML = tr || `<tr><td colspan='4' class='muted'>沒有資料</td></tr>`;
    } else {
      tbody.innerHTML = `<tr><td colspan='4' class='muted'>尚無 15m 快照</td></tr>`;
    }

    // signals
    const sig = (j.signals_recent || []).slice(-6).reverse();
    document.getElementById('signals').textContent = sig.length ? JSON.stringify(sig, null, 2) : '最近沒有訊號';

    // raw
    document.getElementById('raw').textContent = JSON.stringify({day:j.day, autotune:j.autotune}, null, 2);

    document.getElementById('dot').style.background = 'var(--good)';
    document.getElementById('statusText').textContent = '已連線';

  } catch(e){
    document.getElementById('dot').style.background = 'var(--bad)';
    document.getElementById('statusText').textContent = '更新失敗';
  }
}

refresh();
setInterval(refresh, 10000);
</script>
</body>
</html>"""
    return HTMLResponse(html)
