from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse
import hashlib
import hmac
import urllib.parse

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
DATA_TS = Path("/Users/kumax/.openclaw/workspace/polymarket-bot-v0-ts/data")

BOT_TOKEN = "8526661122:AAH9SrCrbaZ62vOthdUUip8Jza9mKOAERfo"
ALLOWED_USER_ID = 1085354433

def validate_twa(init_data: str) -> bool:
    if not init_data: return False
    try:
        parsed = urllib.parse.parse_qs(init_data)
        if 'hash' not in parsed: return False
        hash_val = parsed.pop('hash')[0]
        # Sort and join
        data_check_string = '\n'.join(f'{k}={v[0]}' for k, v in sorted(parsed.items()))
        # HMAC
        secret_key = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
        calc_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
        if calc_hash != hash_val: return False
        # Check User ID
        if 'user' in parsed:
            user_data = json.loads(parsed['user'][0])
            if user_data.get('id') != ALLOWED_USER_ID: return False
        return True
    except Exception as e:
        print(f"Auth error: {e}")
        return False

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
    for r in reversed(rows):
        if r.get("type") == "pm_15m_top":
            return r
    return None


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/api/status")
def api_status(x_telegram_init_data: str = Header(default=None)):
    if not validate_twa(x_telegram_init_data or ""):
        raise HTTPException(status_code=401, detail="unauthorized")
    snap = latest_json(DATA / "autotune-status.json")
    day = __import__("time").strftime("%Y-%m-%d")
    arbscan = tail_jsonl(DATA / f"arbscan-{day}.jsonl", 200)
    signals = tail_jsonl(DATA / f"arb-signals-{day}.jsonl", 200)
    paper = tail_jsonl(DATA / f"paper-signals-{day}.jsonl", 200)
    cex = tail_jsonl(DATA / f"cex-signal-{day}.jsonl", 50)
    cex_edge = tail_jsonl(DATA / f"cex-edge-{day}.jsonl", 50)
    comb = tail_jsonl(DATA / f"comb-candidates-{day}.jsonl", 50)
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
        "paper_signals_recent": paper[-10:],
        "comb_candidates_recent": comb[-10:],
    }


@app.get("/api/weather")
def api_weather(x_telegram_init_data: str = Header(default=None)):
    if not validate_twa(x_telegram_init_data or ""):
        raise HTTPException(status_code=401, detail="unauthorized")
    import time
    day = time.strftime("%Y-%m-%d")

    portfolio = latest_json(DATA_TS / "paper-portfolio.json")
    edges = tail_jsonl(DATA_TS / f"weather-edge-{day}.jsonl", 500)
    trades = tail_jsonl(DATA_TS / f"paper-trades-{day}.jsonl", 500)

    # Deduplicate edges by conditionId, keep latest
    edge_map: dict[str, dict] = {}
    for e in edges:
        cid = e.get("contract", {}).get("conditionId", "")
        if cid:
            edge_map[cid] = e
    unique_edges = list(edge_map.values())

    # Sort by abs edge desc, take top 10
    top_edges = sorted(unique_edges, key=lambda x: abs(x.get("edge", 0)), reverse=True)[:10]

    # Last poll time
    last_ts = edges[-1].get("ts") if edges else None

    # Portfolio summary
    p_summary = None
    if portfolio:
        positions = portfolio.get("positions", [])
        open_pos = [p for p in positions if not p.get("settled")]
        settled_pos = [p for p in positions if p.get("settled")]
        total_cost = sum(p.get("cost", 0) for p in open_pos)
        total_value = portfolio.get("cash", 0) + total_cost  # approximate
        starting = portfolio.get("startingCapital", 100)
        ret_pct = ((total_value - starting) / starting) * 100 if starting else 0
        p_summary = {
            "startingCapital": starting,
            "cash": portfolio.get("cash", 0),
            "totalValue": total_value,
            "returnPct": ret_pct,
            "totalPnl": portfolio.get("totalPnl", 0),
            "trades": portfolio.get("trades", 0),
            "wins": portfolio.get("wins", 0),
            "losses": portfolio.get("losses", 0),
            "openPositions": open_pos,
            "settledPositions": settled_pos,
            "startedAt": portfolio.get("startedAt"),
        }

    # Edge distribution: buckets
    edge_vals = [e.get("edge", 0) for e in unique_edges]
    buckets = {}
    for v in edge_vals:
        b = round(v * 10) / 10  # round to nearest 0.1
        key = f"{b:+.1f}"
        buckets[key] = buckets.get(key, 0) + 1
    # Sort buckets
    sorted_buckets = dict(sorted(buckets.items(), key=lambda x: float(x[0])))

    # Portfolio value over time from trades
    value_timeline = []
    if portfolio and trades:
        cash = portfolio.get("startingCapital", 100)
        positions_cost = 0
        for t in trades:
            if t.get("action") == "open":
                cost = t.get("cost", 0)
                cash -= cost
                positions_cost += cost
            elif t.get("action") == "settle":
                pnl = t.get("pnl", 0)
                cost = t.get("cost", 0)
                cash += cost + pnl
                positions_cost -= cost
            value_timeline.append({
                "ts": t.get("openedAt") or t.get("settledAt") or t.get("ts", 0),
                "value": round(cash + positions_cost, 2),
            })

    return {
        "day": day,
        "portfolio": p_summary,
        "topEdges": top_edges,
        "totalEdges": len(unique_edges),
        "totalScanned": len(unique_edges),
        "lastPollTs": last_ts,
        "edgeDistribution": sorted_buckets,
        "valueTimeline": value_timeline,
        "recentTrades": trades[-10:],
    }


@app.get("/", response_class=HTMLResponse)
def index():
    html = r"""<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset='utf-8'/>
  <meta name='viewport' content='width=device-width, initial-scale=1'/>
  <title>Polymarket Bot 儀表板</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script>
    // Init Telegram Mini App
    if(window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      // Theme handling
      if(window.Telegram.WebApp.colorScheme === 'dark') {
         document.documentElement.style.setProperty('--bg', '#101010');
         document.documentElement.style.setProperty('--card', 'rgba(255,255,255,0.08)');
      }
    }
  </script>
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
    .section-title { font-size: 15px; margin: 24px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
    .kpis4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .kpis6 { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
    @media (max-width: 980px) {
      .grid { grid-template-columns: 1fr; }
      .kpis { grid-template-columns: repeat(2, 1fr); }
      .kpis4 { grid-template-columns: repeat(2, 1fr); }
      .kpis6 { grid-template-columns: repeat(2, 1fr); }
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

      <h2 style="margin-top:12px;">Paper signals（CEX edge，未下單）</h2>
      <div class="muted small">當 edge_net 超過門檻會寫入一筆（只做 paper 訊號）。</div>
      <pre class="mono small" id="paper">載入中…</pre>
    </div>

    <div class="card">
      <h2>原始狀態（節選）</h2>
      <pre class="mono small" id="raw">載入中…</pre>
    </div>
  </div>

  <!-- ====== Weather Oracle Section ====== -->
  <div class="section-title">🌤️ 天氣預言機（Weather Oracle）</div>

  <div class="card" style="margin-bottom:14px;">
    <h2>天氣 Edge 總覽</h2>
    <div class="kpis4">
      <div class="kpi"><div class="label">掃描合約數</div><div class="value" id="w_scanned">--</div></div>
      <div class="kpi"><div class="label">今日 Edge 數</div><div class="value" id="w_edges">--</div></div>
      <div class="kpi"><div class="label">最大 Edge</div><div class="value" id="w_best">--</div></div>
      <div class="kpi"><div class="label">最後輪詢</div><div class="value" id="w_poll">--</div></div>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px;">
    <h2>Top 10 Edge（按絕對值排序）</h2>
    <table>
      <thead><tr><th>城市</th><th>日期</th><th class="right">預報溫度</th><th class="right">市場價格</th><th class="right">Edge %</th><th>訊號</th></tr></thead>
      <tbody id="wEdgeRows"><tr><td colspan="6" class="muted">載入中…</td></tr></tbody>
    </table>
  </div>

  <div class="grid" style="margin-bottom:14px;">
    <div class="card">
      <h2>Edge 分佈</h2>
      <div class="chartWrap"><canvas id="edgeDistChart"></canvas></div>
    </div>
    <div class="card">
      <h2>投資組合價值走勢</h2>
      <div class="chartWrap"><canvas id="valueChart"></canvas></div>
    </div>
  </div>

  <!-- ====== Paper Trading Section ====== -->
  <div class="section-title">📊 紙上交易（Paper Trading）</div>

  <div class="card" style="margin-bottom:14px;">
    <h2>投資組合摘要</h2>
    <div class="kpis6">
      <div class="kpi"><div class="label">初始資金</div><div class="value" id="p_start">$100</div></div>
      <div class="kpi"><div class="label">現金餘額</div><div class="value" id="p_cash">--</div></div>
      <div class="kpi"><div class="label">總價值</div><div class="value" id="p_total">--</div></div>
      <div class="kpi"><div class="label">報酬率</div><div class="value" id="p_ret">--</div></div>
      <div class="kpi"><div class="label">勝/敗</div><div class="value" id="p_wl">--</div></div>
      <div class="kpi"><div class="label">勝率</div><div class="value" id="p_wr">--</div></div>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px;">
    <h2>持倉中（Open Positions）</h2>
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>城市</th><th>日期</th><th>方向</th><th class="right">進場價</th><th class="right">股數</th><th class="right">成本</th><th class="right">Edge</th></tr></thead>
      <tbody id="openPosRows"><tr><td colspan="7" class="muted">載入中…</td></tr></tbody>
    </table>
    </div>
  </div>

  <div class="card" style="margin-bottom:14px;">
    <h2>已結算（Settled Positions）</h2>
    <div style="overflow-x:auto;">
    <table>
      <thead><tr><th>城市</th><th>日期</th><th>方向</th><th>結果</th><th class="right">實際溫度</th><th class="right">P&amp;L</th></tr></thead>
      <tbody id="settledRows"><tr><td colspan="6" class="muted">載入中…</td></tr></tbody>
    </table>
    </div>
  </div>

</div>

<script>
let chart, edgeDistChart, valueChart;
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
function fmtPct(x){
  if(typeof x !== 'number' || !isFinite(x)) return '--';
  return (x*100).toFixed(1) + '%';
}
function safeSpread(bid, ask){
  if(typeof bid !== 'number' || typeof ask !== 'number' || !isFinite(bid) || !isFinite(ask) || ask<=0) return null;
  return ask - bid;
}
function tsToTime(ts){
  if(!ts) return '--';
  const d = new Date(ts);
  return d.toLocaleTimeString('zh-TW', {hour12:false});
}

async function refreshWeather(){
  try {
    const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
    const initData = tg ? tg.initData : '';
    const r = await fetch('api/weather', {cache:'no-store', headers: {'X-Telegram-Init-Data': initData}});
    if(r.status === 401){
      document.getElementById('statusText').textContent = '未授權（請用 Telegram 打開）';
      return;
    }
    const w = await r.json();

    // KPI cards
    document.getElementById('w_scanned').textContent = w.totalScanned || 0;
    document.getElementById('w_edges').textContent = w.totalEdges || 0;

    // Best edge
    if(w.topEdges && w.topEdges.length){
      const best = w.topEdges[0];
      const city = best.contract?.city || '?';
      const edge = best.edge;
      document.getElementById('w_best').innerHTML = `<span class="${edge>0?'good':'bad'}">${city} ${fmtPct(edge)}</span>`;
    }

    // Last poll
    document.getElementById('w_poll').textContent = tsToTime(w.lastPollTs);

    // Edge table
    const tbody = document.getElementById('wEdgeRows');
    if(w.topEdges && w.topEdges.length){
      tbody.innerHTML = w.topEdges.map(e => {
        const c = e.contract || {};
        const edgeCls = e.edge > 0 ? 'good' : 'bad';
        const signal = e.signal === 'buy_yes' ? '<span class="good">買 YES</span>' : '<span class="bad">買 NO</span>';
        return `<tr>
          <td>${c.city||'?'}</td>
          <td class="mono small">${c.date||'?'}</td>
          <td class="right mono">${e.forecastHigh||'?'}°${e.forecastUnit||'F'}</td>
          <td class="right mono">${fmt2(c.yesPrice)}</td>
          <td class="right mono ${edgeCls}">${fmtPct(e.edge)}</td>
          <td>${signal}</td>
        </tr>`;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">尚無資料</td></tr>';
    }

    // Edge distribution chart
    if(w.edgeDistribution){
      const labels = Object.keys(w.edgeDistribution);
      const data = Object.values(w.edgeDistribution);
      const colors = labels.map(l => parseFloat(l) >= 0 ? 'rgba(45,212,191,0.7)' : 'rgba(251,113,133,0.7)');
      if(!edgeDistChart){
        edgeDistChart = new Chart(document.getElementById('edgeDistChart'), {
          type: 'bar',
          data: { labels, datasets: [{ label: '合約數', data, backgroundColor: colors }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              y: { beginAtZero:true, grid:{color:'rgba(255,255,255,0.08)'}, ticks:{color:'rgba(255,255,255,0.7)'} },
              x: { grid:{display:false}, ticks:{color:'rgba(255,255,255,0.7)', font:{size:10}} }
            },
            plugins: { legend:{display:false} }
          }
        });
      } else {
        edgeDistChart.data.labels = labels;
        edgeDistChart.data.datasets[0].data = data;
        edgeDistChart.data.datasets[0].backgroundColor = colors;
        edgeDistChart.update();
      }
    }

    // Value timeline chart
    if(w.valueTimeline && w.valueTimeline.length){
      const tl = w.valueTimeline;
      const vlabels = tl.map((_,i)=>String(i+1));
      const vdata = tl.map(t=>t.value);
      if(!valueChart){
        valueChart = new Chart(document.getElementById('valueChart'), {
          type: 'line',
          data: { labels: vlabels, datasets: [{
            label: '總價值 ($)',
            data: vdata,
            borderColor: 'rgba(45,212,191,0.9)',
            backgroundColor: 'rgba(45,212,191,0.15)',
            tension: 0.3, pointRadius: 1, fill: true
          }] },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              y: { grid:{color:'rgba(255,255,255,0.08)'}, ticks:{color:'rgba(255,255,255,0.7)'} },
              x: { grid:{display:false}, ticks:{display:false} }
            },
            plugins: { legend:{labels:{color:'rgba(255,255,255,0.7)'}} }
          }
        });
      } else {
        valueChart.data.labels = vlabels;
        valueChart.data.datasets[0].data = vdata;
        valueChart.update();
      }
    }

    // Portfolio summary
    const p = w.portfolio;
    if(p){
      document.getElementById('p_start').textContent = '$' + fmt2(p.startingCapital);
      document.getElementById('p_cash').textContent = '$' + fmt2(p.cash);
      document.getElementById('p_total').textContent = '$' + fmt2(p.totalValue);
      const retEl = document.getElementById('p_ret');
      retEl.textContent = fmt2(p.returnPct) + '%';
      retEl.className = 'value ' + (p.returnPct >= 0 ? 'good' : 'bad');
      document.getElementById('p_wl').textContent = `${p.wins}W / ${p.losses}L`;
      const total = p.wins + p.losses;
      document.getElementById('p_wr').textContent = total > 0 ? fmt2(p.wins/total*100)+'%' : 'N/A';

      // Open positions table
      const openTb = document.getElementById('openPosRows');
      if(p.openPositions && p.openPositions.length){
        openTb.innerHTML = p.openPositions.map(pos => {
          const edgeCls = pos.edge > 0 ? 'good' : 'bad';
          return `<tr>
            <td>${pos.city||'?'}</td>
            <td class="mono small">${pos.date||'?'}</td>
            <td class="mono">${pos.side?.toUpperCase()||'?'}</td>
            <td class="right mono">${fmt2(pos.entryPrice)}</td>
            <td class="right mono">${fmt2(pos.shares)}</td>
            <td class="right mono">$${fmt2(pos.cost)}</td>
            <td class="right mono ${edgeCls}">${fmtPct(pos.edge)}</td>
          </tr>`;
        }).join('');
      } else {
        openTb.innerHTML = '<tr><td colspan="7" class="muted">無持倉</td></tr>';
      }

      // Settled positions table
      const setTb = document.getElementById('settledRows');
      if(p.settledPositions && p.settledPositions.length){
        setTb.innerHTML = p.settledPositions.map(pos => {
          const won = pos.pnl > 0;
          return `<tr>
            <td>${pos.city||'?'}</td>
            <td class="mono small">${pos.date||'?'}</td>
            <td class="mono">${pos.side?.toUpperCase()||'?'}</td>
            <td>${won ? '✅' : '❌'}</td>
            <td class="right mono">${pos.actualTemp != null ? pos.actualTemp + '°' : '--'}</td>
            <td class="right mono ${won?'good':'bad'}">$${fmt2(pos.pnl)}</td>
          </tr>`;
        }).join('');
      } else {
        setTb.innerHTML = '<tr><td colspan="6" class="muted">尚無結算</td></tr>';
      }
    }

  } catch(e){
    console.error('weather refresh error', e);
  }
}

async function refresh(){
  try{
    const tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
    const initData = tg ? tg.initData : '';
    const r = await fetch('api/status', {cache:'no-store', headers: {'X-Telegram-Init-Data': initData}});
    if(r.status === 401){
      document.getElementById('statusText').textContent = '未授權（請用 Telegram 打開）';
      return;
    }
    const j = await r.json();

    const now = new Date();
    document.getElementById('now').textContent = now.toISOString().replace('T',' ').slice(0,19)+'Z';

    const a = j.autotune || {};
    document.getElementById('k_took').textContent = fmt2(a.took_s);
    document.getElementById('k_found').textContent = fmt(a.found);
    document.getElementById('k_err').textContent = fmt(a.errors);
    document.getElementById('k_rl').textContent = fmt(a.rate_limits);
    document.getElementById('k_conc').textContent = fmt(a.concurrency);

    const ds = j.daily_summary || null;
    if(ds){
      const el = document.getElementById('daily');
      if(el){
        el.textContent = `掃描 ${ds.arbscan_count} 次｜錯誤 ${ds.errors_sum}｜429 ${ds.rate_limits_sum}｜found ${ds.found_sum}｜took_s p50 ${Number(ds.took_s_p50||0).toFixed(2)}｜p95 ${Number(ds.took_s_p95||0).toFixed(2)}`;
      }
    }

    const rowsAll = j.arbscan_recent || [];
    const keepN = 30;
    const rows = rowsAll.slice(-keepN);
    const labels = rows.map((_,i)=>String(i-rows.length+1));
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

    const pm = j.pm15m_latest;

    const cexr = (j.cex_signals_recent || []);
    const cexLatest = cexr.length ? cexr[cexr.length-1] : null;
    if(cexLatest){
      const el = document.getElementById('cex');
      if(el){
        const driftS = cexLatest.signals_drift || {};
        const distS = cexLatest.signals_dist || {};
        const syms = Array.from(new Set([...Object.keys(driftS), ...Object.keys(distS)]));
        const parts = syms.map(sym=>{
          const sd = driftS[sym] || {};
          const ss = distS[sym] || {};
          const drift = (typeof sd.drift === 'number') ? (sd.drift*100).toFixed(3)+'%' : '--';
          const p1 = (typeof sd.p_hat_up === 'number') ? sd.p_hat_up.toFixed(3) : '--';
          const p2 = (typeof ss.p_hat_up === 'number') ? ss.p_hat_up.toFixed(3) : '--';
          const tr = (typeof ss.t_rem_s === 'number') ? Math.round(ss.t_rem_s)+'s' : '--';
          return `${sym}: drift=${drift} p_drift=${p1} p_dist=${p2} t_rem=${tr}`;
        });
        el.textContent = parts.join(' ｜ ');
      }
    }

    const edger = (j.cex_edge_recent || []);
    const edgeLatest = edger.length ? edger[edger.length-1] : null;
    if(edgeLatest && edgeLatest.edges){
      const el2 = document.getElementById('cexEdge');
      if(el2){
        const parts2 = Object.keys(edgeLatest.edges).map(sym=>{
          const e = edgeLatest.edges[sym] || {};
          const enu1 = (typeof e.edge_up_net_drift === 'number') ? (e.edge_up_net_drift*100).toFixed(2)+'pp' : '--';
          const end1 = (typeof e.edge_down_net_drift === 'number') ? (e.edge_down_net_drift*100).toFixed(2)+'pp' : '--';
          const enu2 = (typeof e.edge_up_net_dist === 'number') ? (e.edge_up_net_dist*100).toFixed(2)+'pp' : '--';
          const end2 = (typeof e.edge_down_net_dist === 'number') ? (e.edge_down_net_dist*100).toFixed(2)+'pp' : '--';
          return `${sym}: net up(d/d)=${enu1}/${enu2} net down(d/d)=${end1}/${end2}`;
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

    const sig = (j.signals_recent || []).slice(-6).reverse();
    document.getElementById('signals').textContent = sig.length ? JSON.stringify(sig, null, 2) : '最近沒有訊號';

    const ps = (j.paper_signals_recent || []).slice(-3).reverse();
    const elps = document.getElementById('paper');
    if(elps){
      elps.textContent = ps.length ? JSON.stringify(ps, null, 2) : '最近沒有 paper signal';
    }

    document.getElementById('raw').textContent = JSON.stringify({
      day:j.day,
      autotune:j.autotune,
      paper_signals_recent_len:(j.paper_signals_recent||[]).length,
      comb_candidates_recent_len:(j.comb_candidates_recent||[]).length
    }, null, 2);

    document.getElementById('dot').style.background = 'var(--good)';
    document.getElementById('statusText').textContent = '已連線';

  } catch(e){
    document.getElementById('dot').style.background = 'var(--bad)';
    document.getElementById('statusText').textContent = '更新失敗';
  }
}

async function refreshAll(){
  await Promise.all([refresh(), refreshWeather()]);
}

refreshAll();
setInterval(refreshAll, 10000);
</script>
</body>
</html>"""
    return HTMLResponse(html)
