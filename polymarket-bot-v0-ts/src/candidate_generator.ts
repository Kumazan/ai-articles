/**
 * P0: Heuristic Candidate Generator
 *
 * Groups Polymarket markets into 2-leg / 3-leg candidate sets for
 * combinatorial arbitrage checking.
 *
 * Heuristics:
 *   1. Same expiry window (±30 min)
 *   2. Same underlying topic (token overlap in question text)
 *   3. Small combos only (2-leg, 3-leg)
 */

import { setTimeout as sleep } from 'node:timers/promises';
import type { ClobClient } from '@polymarket/clob-client';

export type MarketInfo = {
  conditionId: string;
  question: string;
  slug: string | undefined;
  endDateIso: string | undefined;
  tokens: Array<{ tokenId: string; outcome: string }>;
  closed: boolean;
};

export type CandidateGroup = {
  kind: '2-leg' | '3-leg';
  reason: string;
  markets: MarketInfo[];
};

// ---- helpers ----

/** Extract meaningful tokens from a question string (lowercase, deduped). */
function questionTokens(q: string): Set<string> {
  const stop = new Set([
    'will', 'the', 'be', 'a', 'an', 'or', 'and', 'to', 'of', 'in', 'on',
    'at', 'by', 'for', 'is', 'it', 'its', 'this', 'that', 'from', 'with',
    'up', 'down', 'above', 'below', 'over', 'under', 'yes', 'no', 'if',
    'than', 'more', 'less', 'between', 'before', 'after', 'not', 'do',
    'does', 'did', 'has', 'have', 'had', 'was', 'were', 'are', 'been',
    'being', 'which', 'what', 'when', 'where', 'who', 'how', 'can',
  ]);
  return new Set(
    q.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !stop.has(w)),
  );
}

/** Jaccard similarity between two token sets. */
function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Are two ISO dates within `windowMs` of each other? */
function withinWindow(a: string | undefined, b: string | undefined, windowMs = 30 * 60_000): boolean {
  if (a == null || b == null) return false;
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) <= windowMs;
}

// ---- main logic ----

/**
 * Fetch a batch of active markets from the CLOB and return structured info.
 */
async function fetchWithRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
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

export async function fetchActiveMarkets(
  client: ClobClient,
  maxMarkets = 200,
): Promise<MarketInfo[]> {
  const rewards = await fetchWithRetry(() => client.getCurrentRewards(), 'getCurrentRewards');
  const conditionIds = Array.from(
    new Set(
      rewards
        .map((r: any) => r.condition_id || r.conditionId || r.market)
        .filter(Boolean) as string[],
    ),
  ).slice(0, maxMarkets);

  const markets: MarketInfo[] = [];
  // Fetch in small batches to avoid rate-limiting / hanging
  const BATCH = 5;
  const DELAY_MS = 200;
  for (let i = 0; i < conditionIds.length; i += BATCH) {
    const batch = conditionIds.slice(i, i + BATCH);
    const results = await Promise.allSettled(
      batch.map((cid) =>
        Promise.race([
          client.getMarket(cid),
          sleep(8000).then(() => { throw new Error('timeout'); }),
        ]),
      ),
    );
    for (let j = 0; j < results.length; j++) {
      const r = results[j]!;
      if (r.status !== 'fulfilled') continue;
      const m: any = r.value;
      if (m?.closed) continue;
      const cid = batch[j]!;
      const tokens = (m?.tokens ?? []).map((t: any) => ({
        tokenId: String(t.token_id),
        outcome: String(t.outcome),
      }));
      if (tokens.length < 2) continue;
      markets.push({
        conditionId: cid,
        question: m?.question ?? '',
        slug: m?.market_slug || m?.slug || undefined,
        endDateIso: m?.end_date_iso || undefined,
        tokens,
        closed: !!m?.closed,
      });
    }
    if (i + BATCH < conditionIds.length) await sleep(DELAY_MS);
  }
  return markets;
}

/**
 * Generate candidate groups from a list of markets.
 */
export function generateCandidates(
  markets: MarketInfo[],
  opts: {
    minSimilarity?: number;
    expiryWindowMs?: number;
    max2Leg?: number;
    max3Leg?: number;
  } = {},
): CandidateGroup[] {
  const minSim = opts.minSimilarity ?? 0.3;
  const expWin = opts.expiryWindowMs ?? 30 * 60_000;
  const max2 = opts.max2Leg ?? 200;
  const max3 = opts.max3Leg ?? 50;

  // Pre-compute tokens
  const tokenMap = new Map<string, Set<string>>();
  for (const m of markets) {
    tokenMap.set(m.conditionId, questionTokens(m.question));
  }

  const pairs: CandidateGroup[] = [];
  const triples: CandidateGroup[] = [];

  for (let i = 0; i < markets.length; i++) {
    const a = markets[i]!;
    const tA = tokenMap.get(a.conditionId)!;

    for (let j = i + 1; j < markets.length; j++) {
      const b = markets[j]!;
      const tB = tokenMap.get(b.conditionId)!;

      const sim = jaccard(tA, tB);
      const sameWindow = withinWindow(a.endDateIso, b.endDateIso, expWin);

      if (sim < minSim && !sameWindow) continue;

      const reason = [
        sim >= minSim ? `sim=${sim.toFixed(2)}` : '',
        sameWindow ? 'same_window' : '',
      ]
        .filter(Boolean)
        .join('+');

      if (pairs.length < max2) {
        pairs.push({ kind: '2-leg', reason, markets: [a, b] });
      }

      // Extend to 3-leg
      if (triples.length < max3) {
        for (let k = j + 1; k < markets.length; k++) {
          const c = markets[k]!;
          const tC = tokenMap.get(c.conditionId)!;
          const simAC = jaccard(tA, tC);
          const simBC = jaccard(tB, tC);
          const winAC = withinWindow(a.endDateIso, c.endDateIso, expWin);
          const winBC = withinWindow(b.endDateIso, c.endDateIso, expWin);

          if ((simAC >= minSim || winAC) && (simBC >= minSim || winBC)) {
            triples.push({
              kind: '3-leg',
              reason: `tri:sim_ac=${simAC.toFixed(2)},bc=${simBC.toFixed(2)}`,
              markets: [a, b, c],
            });
            if (triples.length >= max3) break;
          }
        }
      }
    }
  }

  return [...pairs, ...triples];
}
