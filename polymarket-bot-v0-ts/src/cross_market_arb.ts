/**
 * P0: Cross-Market Executable Arb Checker
 *
 * Fee model: Polymarket ~2% taker fee on winning side.
 * Conservative fee + buffer applied.
 *
 * Arb types:
 *   1. Cross-complement: two related binary markets, buy opposite outcomes
 *   2. Single-market rebalance: sum(asks) < 1 - fee (fee-aware version)
 */

import { setTimeout as sleep } from 'node:timers/promises';
import type { ClobClient } from '@polymarket/clob-client';
import type { CandidateGroup, MarketInfo } from './candidate_generator.js';

export type CrossArbOpportunity = {
  ts: number;
  kind: 'cross_2leg' | 'cross_3leg' | 'single_rebalance';
  bucket: 'cross_market_comb_arb' | 'single_market_arb' | 'signal_only';
  reason: string;
  netEdgePct: number;
  legs: Array<{
    conditionId: string;
    question: string;
    outcome: string;
    tokenId: string;
    side: 'buy';
    price: number;
  }>;
};

// ---- config ----
const TAKER_FEE = 0.02;
const BUFFER = 0.005;

type BookEntry = { bestBid: number | undefined; bestAsk: number | undefined };
type BookCache = Map<string, BookEntry>;

async function getBookWithRetry(client: ClobClient, tokenId: string): Promise<any> {
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await client.getOrderBook(tokenId);
    } catch (e: any) {
      const status = e?.status ?? e?.response?.status ?? e?.statusCode;
      const msg = String(e?.message || '');
      const isRetryable = status === 502 || status === 429 || msg.includes('502') || msg.includes('429');
      if (!isRetryable || attempt === MAX_RETRIES - 1) throw e;
      const delayMs = 1000 * Math.pow(2, attempt);
      await sleep(delayMs);
    }
  }
  throw new Error('unreachable');
}

async function getBook(
  client: ClobClient,
  tokenId: string,
  cache: BookCache,
): Promise<BookEntry> {
  const cached = cache.get(tokenId);
  if (cached !== undefined) return cached;
  try {
    const ob = await getBookWithRetry(client, tokenId);
    const data = (ob as any)?.data ?? ob;
    const bids = data?.bids ?? [];
    const asks = data?.asks ?? [];
    const bestBid: number | undefined = bids.length ? Number(bids[0].price) : undefined;
    const bestAsk: number | undefined = asks.length ? Number(asks[0].price) : undefined;
    const entry: BookEntry = { bestBid, bestAsk };
    cache.set(tokenId, entry);
    return entry;
  } catch {
    const entry: BookEntry = { bestBid: undefined, bestAsk: undefined };
    cache.set(tokenId, entry);
    return entry;
  }
}

/**
 * Check a candidate group for executable cross-market arb.
 */
export async function checkCandidateGroup(
  client: ClobClient,
  group: CandidateGroup,
  cache: BookCache,
): Promise<CrossArbOpportunity[]> {
  const { markets } = group;
  const opps: CrossArbOpportunity[] = [];

  // Fetch all books (with rate limit protection)
  let fetchCount = 0;
  for (const m of markets) {
    for (const t of m.tokens) {
      if (!cache.has(t.tokenId)) {
        await getBook(client, t.tokenId, cache);
        fetchCount++;
        if (fetchCount % 5 === 0) await sleep(100);
      }
    }
  }

  // ---- Pair-based complement check ----
  for (let i = 0; i < markets.length; i++) {
    for (let j = i + 1; j < markets.length; j++) {
      const mA = markets[i]!;
      const mB = markets[j]!;

      if (mA.tokens.length !== 2 || mB.tokens.length !== 2) continue;

      for (const [aIdx, bIdx] of [[0, 1], [1, 0]] as const) {
        const tA = mA.tokens[aIdx]!;
        const tB = mB.tokens[bIdx]!;
        const bookA = cache.get(tA.tokenId);
        const bookB = cache.get(tB.tokenId);
        if (bookA?.bestAsk == null || bookB?.bestAsk == null) continue;

        const cost = bookA.bestAsk + bookB.bestAsk;
        const netPayout = 1 - TAKER_FEE;
        const netEdge = netPayout - cost - BUFFER;

        if (netEdge > 0) {
          opps.push({
            ts: Date.now(),
            kind: group.kind === '2-leg' ? 'cross_2leg' : 'cross_3leg',
            bucket: 'cross_market_comb_arb',
            reason: `complement_pair:${group.reason}`,
            netEdgePct: netEdge,
            legs: [
              {
                conditionId: mA.conditionId,
                question: mA.question,
                outcome: tA.outcome,
                tokenId: tA.tokenId,
                side: 'buy',
                price: bookA.bestAsk,
              },
              {
                conditionId: mB.conditionId,
                question: mB.question,
                outcome: tB.outcome,
                tokenId: tB.tokenId,
                side: 'buy',
                price: bookB.bestAsk,
              },
            ],
          });
        }
      }
    }
  }

  // ---- Single-market rebalancing (fee-aware) ----
  for (const m of markets) {
    if (m.tokens.length < 2) continue;
    let sumAsk = 0;
    let allValid = true;
    const mLegs: CrossArbOpportunity['legs'] = [];
    for (const t of m.tokens) {
      const book = cache.get(t.tokenId);
      if (book?.bestAsk == null) { allValid = false; break; }
      sumAsk += book.bestAsk;
      mLegs.push({
        conditionId: m.conditionId,
        question: m.question,
        outcome: t.outcome,
        tokenId: t.tokenId,
        side: 'buy',
        price: book.bestAsk,
      });
    }
    if (!allValid) continue;

    const netPayout = 1 - TAKER_FEE;
    const netEdge = netPayout - sumAsk - BUFFER;
    if (netEdge > 0) {
      opps.push({
        ts: Date.now(),
        kind: 'single_rebalance',
        bucket: 'single_market_arb',
        reason: 'single_market_rebalance',
        netEdgePct: netEdge,
        legs: mLegs,
      });
    }
  }

  opps.sort((a, b) => b.netEdgePct - a.netEdgePct);
  return opps;
}

/**
 * Full scan: fetch markets → generate candidates → check each.
 */
export async function scanCrossMarketArb(params: {
  client: ClobClient;
  fetchMarkets: () => Promise<MarketInfo[]>;
  generateCandidates: (markets: MarketInfo[]) => CandidateGroup[];
}): Promise<{ opps: CrossArbOpportunity[]; nCandidates: number; nMarkets: number }> {
  const markets = await params.fetchMarkets();
  const candidates = params.generateCandidates(markets);
  const cache: BookCache = new Map();
  const allOpps: CrossArbOpportunity[] = [];

  for (const group of candidates) {
    try {
      const opps = await checkCandidateGroup(params.client, group, cache);
      allOpps.push(...opps);
    } catch {
      // skip
    }
  }

  allOpps.sort((a, b) => b.netEdgePct - a.netEdgePct);
  return { opps: allOpps, nCandidates: candidates.length, nMarkets: markets.length };
}
