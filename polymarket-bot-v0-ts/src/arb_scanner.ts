import { ClobClient } from '@polymarket/clob-client';

export type ArbOpportunity = {
  ts: number;
  kind: 'sum_asks_lt_1';
  conditionId: string;
  question: string;
  nOutcomes: number;
  legs: Array<{ outcome: string; tokenId: string; bestAsk?: number; bestBid?: number }>;
  sumAsk?: number;
  note?: string;
};

function top(ob: any) {
  const bids = ob?.bids ?? [];
  const asks = ob?.asks ?? [];
  const bestBid = bids.length ? Number(bids[0].price) : undefined;
  const bestAsk = asks.length ? Number(asks[0].price) : undefined;
  return { bestBid, bestAsk };
}

export async function scanStructuralArb(params: {
  client: ClobClient;
  maxMarkets: number;
  maxOutcomes: number;
  minProfitPct: number; // e.g. 0.005 = 0.5%
}): Promise<ArbOpportunity[]> {
  const { client, maxMarkets, maxOutcomes, minProfitPct } = params;

  // Use rewards markets as a proxy for liquidity/activity.
  const rewards = await client.getCurrentRewards();
  const conditionIds = Array.from(
    new Set(rewards.map((r: any) => r.condition_id || r.conditionId || r.market || r.conditionId).filter(Boolean)),
  ).slice(0, maxMarkets);

  const opps: ArbOpportunity[] = [];

  for (const cid of conditionIds) {
    try {
      const m = await client.getMarket(cid);
      const tokens = (m as any)?.tokens ?? [];
      const question = (m as any)?.question ?? '';

      if (!Array.isArray(tokens) || tokens.length < 2) continue;
      if (tokens.length > maxOutcomes) continue;

      const legs: ArbOpportunity['legs'] = [];
      let sumAsk = 0;
      let missing = false;

      for (const t of tokens) {
        const tokenId = t.token_id;
        const outcome = t.outcome;
        const ob = await client.getOrderBook(tokenId);
        const { bestAsk, bestBid } = top(ob);
        legs.push({ outcome, tokenId, bestAsk, bestBid });
        if (bestAsk === undefined) {
          missing = true;
        } else {
          sumAsk += bestAsk;
        }
      }

      if (missing) continue;

      // Structural arb: buy all outcomes for < 1
      if (sumAsk < 1 - minProfitPct) {
        opps.push({
          ts: Date.now(),
          kind: 'sum_asks_lt_1',
          conditionId: cid,
          question,
          nOutcomes: tokens.length,
          legs,
          sumAsk,
        });
      }
    } catch {
      // ignore per-market errors in v0
    }
  }

  // Best opportunities first
  opps.sort((a, b) => (a.sumAsk ?? 999) - (b.sumAsk ?? 999));
  return opps;
}
