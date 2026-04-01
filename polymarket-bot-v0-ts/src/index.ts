import 'dotenv/config';
import { fetchActualHighTemps, buildCityQueries } from './actual_weather.js';
import fs from 'node:fs';
import path from 'node:path';
import WebSocket from 'ws';
import pino from 'pino';

// NOTE: v0 focus = wiring + paper trade logging.
// Execution (live orders) will be added after we confirm market ids/token ids.

const logger = pino(
  process.env.PINO_PRETTY
    ? { level: process.env.LOG_LEVEL || 'info', transport: { target: 'pino-pretty', options: { colorize: true } } }
    : { level: process.env.LOG_LEVEL || 'info' },
);

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
  ws.on('message', (raw: WebSocket.RawData) => {
    try {
      const m = JSON.parse(raw.toString());
      const bid = Number(m.b);
      const ask = Number(m.a);
      if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask <= 0) return;
      const mid = (bid + ask) / 2;
      onTick({ ts: Date.now(), source: 'binance', symbol, mid });
    } catch (e: any) {
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
  ws.on('message', (raw: WebSocket.RawData) => {
    try {
      const m = JSON.parse(raw.toString());
      if (m.type !== 'ticker' || m.product_id !== product) return;
      const price = Number(m.price);
      if (!Number.isFinite(price) || price <= 0) return;
      onTick({ ts: Date.now(), source: 'coinbase', symbol, mid: price });
    } catch (e: any) {
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

    const basePollMs = Number(process.env.PM_POLL_MS || 400);
    const maxPollMs = 5000;
    let currentPollMs = basePollMs;
    let consecutive429 = 0;

    function schedulePoll() {
      setTimeout(async () => {
        let got429 = false;
        for (const t of tokens) {
          try {
            const top = await fetchTopOfBook(client, t.id);
            appendJsonl(bookFile, { ...t, ...top });
          } catch (e: any) {
            const msg = String(e?.message || '');
            const status = e?.status ?? e?.response?.status ?? e?.statusCode;
            if (status === 429 || msg.includes('429')) {
              got429 = true;
            } else if (!msg.includes('404') && !msg.includes('No orderbook')) {
              logger.warn({ e, tokenId: t.id }, 'orderbook poll failed');
            }
          }
        }

        if (got429) {
          consecutive429++;
          const newPoll = Math.min(currentPollMs * 2, maxPollMs);
          if (newPoll !== currentPollMs) {
            logger.warn({ oldMs: currentPollMs, newMs: newPoll, consecutive429 }, 'orderbook 429: backing off');
            currentPollMs = newPoll;
          }
        } else if (consecutive429 > 0) {
          consecutive429 = 0;
          const newPoll = Math.max(Math.floor(currentPollMs / 2), basePollMs);
          if (newPoll !== currentPollMs) {
            logger.info({ oldMs: currentPollMs, newMs: newPoll }, 'orderbook: recovering poll rate');
            currentPollMs = newPoll;
          }
        }

        schedulePoll();
      }, currentPollMs);
    }
    schedulePoll();

    logger.info({ pollMs: basePollMs, nTokens: tokens.length }, 'polymarket orderbook polling enabled');

    // Structural arb scanner (single-market)
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

    // ---- P0: Cross-market combinatorial arb scanner ----
    const crossArbEnabled = (process.env.CROSS_ARB_ENABLED || '1') !== '0';
    if (crossArbEnabled) {
      const { fetchActiveMarkets, generateCandidates } = await import('./candidate_generator.js');
      const { scanCrossMarketArb } = await import('./cross_market_arb.js');

      const crossIntervalMs = Number(process.env.CROSS_ARB_INTERVAL_MS || 300_000); // 5 min default
      const crossMaxMarkets = Number(process.env.CROSS_ARB_MAX_MARKETS || 40);
      const crossMinSim = Number(process.env.CROSS_ARB_MIN_SIM || 0.5);
      const crossArbFile = path.join(logDir, `cross-arb-${new Date().toISOString().slice(0, 10)}.jsonl`);

      // Market graph cache: rebuilt every scan cycle
      let cachedMarkets: Awaited<ReturnType<typeof fetchActiveMarkets>> = [];
      let lastGraphBuild = 0;

      async function runCrossArbScan() {
        const now = Date.now();
        // Rebuild market graph if stale (> interval)
        if (now - lastGraphBuild > crossIntervalMs || cachedMarkets.length === 0) {
          cachedMarkets = await fetchActiveMarkets(client, crossMaxMarkets);
          lastGraphBuild = now;
          logger.info({ nMarkets: cachedMarkets.length }, 'cross-arb: rebuilt market graph');
        }

        const result = await scanCrossMarketArb({
          client,
          fetchMarkets: async () => cachedMarkets,
          generateCandidates: (markets) => {
            const cands = generateCandidates(markets, {
              minSimilarity: crossMinSim,
              max2Leg: 50,
              max3Leg: 10,
            });
            logger.info({ nCandidates: cands.length }, 'cross-arb: candidates generated');
            return cands;
          },
        });

        if (result.opps.length) {
          logger.info(
            {
              n: result.opps.length,
              nCandidates: result.nCandidates,
              nMarkets: result.nMarkets,
              best: result.opps[0],
            },
            'CROSS_ARB_FOUND',
          );
          for (const o of result.opps.slice(0, 20)) {
            appendJsonl(crossArbFile, { ...o, bucket: o.bucket });
          }
        } else {
          logger.info(
            { nCandidates: result.nCandidates, nMarkets: result.nMarkets },
            'cross-arb scan: none found',
          );
        }
      }

      // Initial scan after 10s (let other connections settle), with 120s timeout
      setTimeout(() => {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('cross-arb scan timeout (120s)')), 120_000),
        );
        Promise.race([runCrossArbScan(), timeout]).catch((e) =>
          logger.warn({ e }, 'cross-arb initial scan failed'),
        );
      }, 10_000);

      setInterval(() => {
        runCrossArbScan().catch((e) => logger.warn({ e }, 'cross-arb scan failed'));
      }, crossIntervalMs);

      logger.info(
        { crossIntervalMs, crossMaxMarkets, crossMinSim },
        'cross-market arb scanner enabled',
      );
    }
  } catch (e) {
    logger.warn({ e }, 'polymarket orderbook polling init failed');
  }

  // ---- Weather Oracle ----
  const weatherEnabled = (process.env.WEATHER_ENABLED || '1') !== '0';
  if (weatherEnabled) {
    const { WeatherTracker } = await import('./weather_oracle.js');
    const weatherPollMs = Number(process.env.WEATHER_POLL_MS || 600_000); // 10 min default
    const weatherFile = path.join(logDir, `weather-${new Date().toISOString().slice(0, 10)}.jsonl`);

    const tracker = new WeatherTracker();
    await tracker.init();

    const { scrapeWeatherContracts, calculateEdges } = await import('./weather_market_scraper.js');
    const { PaperTrader } = await import('./paper_trader.js');
    const edgeFile = path.join(logDir, `weather-edge-${new Date().toISOString().slice(0, 10)}.jsonl`);
    const paperTradeFile = path.join(logDir, `paper-trades-${new Date().toISOString().slice(0, 10)}.jsonl`);

    // Initialize paper trader with $100 starting capital
    const paperTrader = new PaperTrader(
      Number(process.env.PAPER_CAPITAL || 100),
      logDir,
    );

    async function runWeatherPoll() {
      const { shifts, signals } = await tracker.poll();
      for (const s of signals) {
        appendJsonl(weatherFile, s);
      }
      if (signals.length > 0) {
        logger.info({ n: signals.length, signals }, 'WEATHER_SIGNALS');
      }

      // Compare forecasts against Polymarket contracts
      try {
        const contracts = await scrapeWeatherContracts();
        const forecastMap = new Map<string, number>();
        for (const fc of tracker.getAllForecasts()) {
          forecastMap.set(`${fc.city}:${fc.date}`, fc.highTemp);
        }

        const edges = calculateEdges(contracts, forecastMap, 0.08);
        if (edges.length > 0) {
          logger.info(
            { n: edges.length, best: { q: edges[0]!.contract.question, edge: edges[0]!.edge, signal: edges[0]!.signal } },
            'WEATHER_EDGE_FOUND',
          );
          for (const e of edges.slice(0, 20)) {
            appendJsonl(edgeFile, e);
          }

          // Paper trade: open positions on edges
          const newTrades = paperTrader.processEdges(edges);
          for (const t of newTrades) {
            appendJsonl(paperTradeFile, { action: 'open', ...t });
          }
          if (newTrades.length > 0) {
            logger.info(
              { n: newTrades.length, cash: paperTrader.portfolio.cash.toFixed(2) },
              'PAPER_TRADES_OPENED',
            );
          }
        } else {
          logger.info({ nContracts: contracts.length }, 'weather edge scan: none found');
        }

        // Settle past positions using ACTUAL observed temperatures from Weather Underground
        const now = new Date();
        const todayIso = now.toISOString().slice(0, 10);
        const openPositions = paperTrader.portfolio.positions.filter(
          (p) => !p.settled && p.isoDate < todayIso,
        );
        let actualTemps = new Map<string, number>();
        if (openPositions.length > 0) {
          const queries = buildCityQueries(
            openPositions.map((p) => ({ city: p.city, isoDate: p.isoDate })),
          );
          if (queries.length > 0) {
            actualTemps = await fetchActualHighTemps(queries);
          }
        }
        if (actualTemps.size > 0) {
          const settled = paperTrader.settlePositions(actualTemps);
          for (const s of settled) {
            appendJsonl(paperTradeFile, { action: 'settle', ...s });
          }
          if (settled.length > 0) {
            logger.info(
              {
                n: settled.length,
                totalPnl: paperTrader.portfolio.totalPnl.toFixed(2),
                cash: paperTrader.portfolio.cash.toFixed(2),
              },
              'PAPER_TRADES_SETTLED',
            );
          }
        }

        // Log portfolio summary every poll
        const open = paperTrader.portfolio.positions.filter(p => !p.settled).length;
        const totalVal = paperTrader.portfolio.cash +
          paperTrader.portfolio.positions.filter(p => !p.settled).reduce((s, p) => s + p.cost, 0);
        logger.info(
          {
            cash: paperTrader.portfolio.cash.toFixed(2),
            openPositions: open,
            totalValue: totalVal.toFixed(2),
            trades: paperTrader.portfolio.trades,
            pnl: paperTrader.portfolio.totalPnl.toFixed(2),
          },
          'PAPER_PORTFOLIO',
        );
      } catch (e) {
        logger.warn({ e }, 'weather market scrape/edge calc failed');
      }
    }

    // Initial poll after 5s
    setTimeout(() => {
      runWeatherPoll().catch((e) => logger.warn({ e }, 'weather initial poll failed'));
    }, 5_000);

    setInterval(() => {
      runWeatherPoll().catch((e) => logger.warn({ e }, 'weather poll failed'));
    }, weatherPollMs);

    logger.info({ weatherPollMs, nCities: 10 }, 'weather oracle enabled');
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
