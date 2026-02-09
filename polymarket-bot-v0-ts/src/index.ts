import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import WebSocket from 'ws';
import pino from 'pino';

// NOTE: v0 focus = wiring + paper trade logging.
// Execution (live orders) will be added after we confirm market ids/token ids.

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.PINO_PRETTY
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

type Tick = {
  ts: number;
  source: 'binance' | 'coinbase';
  symbol: 'BTC' | 'ETH' | 'SOL';
  mid: number;
};

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function appendJsonl(file: string, obj: unknown) {
  fs.appendFileSync(file, JSON.stringify(obj) + '\n');
}

// ---------- External reference prices (WS) ----------

function startBinance(symbol: Tick['symbol'], onTick: (t: Tick) => void) {
  // Binance spot bookTicker streams: e.g. btcusdt@bookTicker
  const s = symbol.toLowerCase() + 'usdt';
  const url = `wss://stream.binance.com:9443/ws/${s}@bookTicker`;
  const ws = new WebSocket(url);

  ws.on('open', () => logger.info({ symbol, url }, 'binance ws open'));
  ws.on('message', (raw) => {
    try {
      const m = JSON.parse(raw.toString());
      const bid = Number(m.b);
      const ask = Number(m.a);
      if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask <= 0) return;
      const mid = (bid + ask) / 2;
      onTick({ ts: Date.now(), source: 'binance', symbol, mid });
    } catch (e) {
      logger.warn({ e }, 'binance parse error');
    }
  });
  ws.on('close', () => logger.warn({ symbol }, 'binance ws closed'));
  ws.on('error', (e) => logger.error({ symbol, e }, 'binance ws error'));
  return ws;
}

function startCoinbase(symbol: Tick['symbol'], onTick: (t: Tick) => void) {
  // Coinbase Advanced Trade WS is more involved; v0 use public exchange websocket (classic): ws-feed.exchange.coinbase.com
  const product = `${symbol}-USD`;
  const url = 'wss://ws-feed.exchange.coinbase.com';
  const ws = new WebSocket(url);
  ws.on('open', () => {
    logger.info({ symbol, url }, 'coinbase ws open');
    ws.send(
      JSON.stringify({
        type: 'subscribe',
        product_ids: [product],
        channels: ['ticker'],
      }),
    );
  });
  ws.on('message', (raw) => {
    try {
      const m = JSON.parse(raw.toString());
      if (m.type !== 'ticker' || m.product_id !== product) return;
      const price = Number(m.price);
      if (!Number.isFinite(price) || price <= 0) return;
      onTick({ ts: Date.now(), source: 'coinbase', symbol, mid: price });
    } catch (e) {
      logger.warn({ e }, 'coinbase parse error');
    }
  });
  ws.on('close', () => logger.warn({ symbol }, 'coinbase ws closed'));
  ws.on('error', (e) => logger.error({ symbol, e }, 'coinbase ws error'));
  return ws;
}

// ---------- Polymarket connectivity (v0) ----------
// Polymarket websocket hostnames may vary / be blocked by DNS in some environments.
// For v0 we focus on discovery + REST polling via the official clob-client.

// ---------- Main ----------

async function main() {
  const mode = (process.env.MODE || 'paper').toLowerCase();
  const logDir = process.env.LOG_DIR || './data';
  ensureDir(logDir);

  // Keep key optional for paper mode.
  if (mode !== 'paper') {
    mustEnv('POLYMARKET_PRIVATE_KEY');
  }

  const prices: Record<string, number> = {};

  const tickFile = path.join(logDir, `ticks-${new Date().toISOString().slice(0, 10)}.jsonl`);

  const onTick = (t: Tick) => {
    prices[`${t.source}:${t.symbol}`] = t.mid;
    appendJsonl(tickFile, t);
  };

  // Start reference feeds
  const b1 = startBinance('BTC', onTick);
  const b2 = startBinance('ETH', onTick);
  const b3 = startBinance('SOL', onTick);
  const c1 = startCoinbase('BTC', onTick);
  const c2 = startCoinbase('ETH', onTick);
  const c3 = startCoinbase('SOL', onTick);

  // Polymarket orderbook polling (public)
  try {
    const { ClobClient } = await import('@polymarket/clob-client');
    const { fetchTopOfBook } = await import('./polymarket_books.js');
    const { scanStructuralArb } = await import('./arb_scanner.js');

    const host = process.env.CLOB_HOST || 'https://clob.polymarket.com';
    const client = new ClobClient(host, 137);

    const bookFile = path.join(logDir, `pm-books-${new Date().toISOString().slice(0, 10)}.jsonl`);
    const arbFile = path.join(logDir, `arb-${new Date().toISOString().slice(0, 10)}.jsonl`);

    // Resolve the *current* 15m events on startup (new market every 15m; old event pages persist)
    const { resolveCurrent15mEvent } = await import('./event_resolver.js');

    async function resolveActiveEvent(symbol: 'BTC' | 'ETH' | 'SOL') {
      // Try multiple times because we might hit a stale event slug first.
      // We just re-run resolver (which tries a range of epochs).
      for (let attempt = 0; attempt < 6; attempt++) {
        const ev = await resolveCurrent15mEvent(symbol);
        const m = await client.getMarket(ev.conditionId);
        if (!(m as any)?.closed && (m as any)?.accepting_orders && (m as any)?.enable_order_book) {
          return { symbol, conditionId: ev.conditionId, market: m };
        }
      }
      throw new Error(`could not resolve active market for ${symbol}`);
    }

    async function resolveTokens() {
      const events = await Promise.all([
        resolveActiveEvent('BTC'),
        resolveActiveEvent('ETH'),
        resolveActiveEvent('SOL'),
      ]);

      const out: Array<{ sym: string; side: string; id: string; conditionId: string }> = [];
      for (const ev of events) {
        const tokens = (ev.market as any)?.tokens ?? [];
        for (const t of tokens) {
          out.push({
            sym: ev.symbol,
            side: String(t.outcome).toUpperCase(),
            id: String(t.token_id),
            conditionId: ev.conditionId,
          });
        }
      }
      return out;
    }

    let tokens = await resolveTokens();
    logger.info({ tokens }, 'resolved current 15m token ids');

    // Refresh token ids periodically (new market every 15m)
    setInterval(async () => {
      try {
        tokens = await resolveTokens();
        logger.info({ tokens }, 'refreshed 15m token ids');
      } catch (e) {
        logger.warn({ e }, 'failed to refresh 15m token ids');
      }
    }, 60_000);

    const pollMs = Number(process.env.PM_POLL_MS || 400);

    setInterval(async () => {
      for (const t of tokens) {
        try {
          const top = await fetchTopOfBook(client, t.id);
          appendJsonl(bookFile, { ...t, ...top });
        } catch (e: any) {
          // If a market just expired, /book can 404; ignore and wait for refresh.
          const msg = String(e?.message || '');
          if (!msg.includes('404') && !msg.includes('No orderbook')) {
            logger.warn({ e, tokenId: t.id }, 'orderbook poll failed');
          }
        }
      }
    }, pollMs);

    logger.info({ pollMs, nTokens: tokens.length }, 'polymarket orderbook polling enabled');

    // Structural arb scanner
    const arbEnabled = (process.env.ARB_SCAN_ENABLED || '1') !== '0';
    if (arbEnabled) {
      const intervalMs = Number(process.env.ARB_SCAN_INTERVAL_MS || 30000);
      const maxMarkets = Number(process.env.ARB_SCAN_MAX_MARKETS || 120);
      const maxOutcomes = Number(process.env.ARB_SCAN_MAX_OUTCOMES || 12);
      const minProfitPct = Number(process.env.ARB_MIN_PROFIT_PCT || 0.005);

      setInterval(async () => {
        try {
          const opps = await scanStructuralArb({ client, maxMarkets, maxOutcomes, minProfitPct });
          if (opps.length) {
            logger.info({ n: opps.length, best: opps[0] }, 'STRUCTURAL_ARB_FOUND');
            for (const o of opps.slice(0, 10)) appendJsonl(arbFile, o);
          } else {
            logger.debug('structural arb scan: none');
          }
        } catch (e) {
          logger.warn({ e }, 'structural arb scan failed');
        }
      }, intervalMs);

      logger.info({ intervalMs, maxMarkets, maxOutcomes, minProfitPct }, 'structural arb scanner enabled');
    }
  } catch (e) {
    logger.warn({ e }, 'polymarket orderbook polling init failed');
  }

  // Simple heartbeat log
  setInterval(() => {
    logger.info(
      {
        mode,
        ref: {
          BTC: {
            binance: prices['binance:BTC'],
            coinbase: prices['coinbase:BTC'],
          },
          ETH: {
            binance: prices['binance:ETH'],
            coinbase: prices['coinbase:ETH'],
          },
          SOL: {
            binance: prices['binance:SOL'],
            coinbase: prices['coinbase:SOL'],
          },
        },
      },
      'heartbeat',
    );
  }, 10_000);

  const shutdown = () => {
    logger.info('shutting down');
    for (const w of [b1, b2, b3, c1, c2, c3]) {
      try {
        w.close();
      } catch {}
    }
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((e) => {
  logger.error({ e }, 'fatal');
  process.exit(1);
});
