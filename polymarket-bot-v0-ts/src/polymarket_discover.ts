import { ClobClient } from '@polymarket/clob-client';

export type DiscoveredMarket = {
  conditionId: string;
  question: string;
  slug?: string;
  tokenIds: string[]; // outcome token ids
  outcomes?: string[];
  endDateIso?: string;
};

const WANT = ['Bitcoin', 'Ethereum', 'Solana'] as const;

export async function discover15mCrypto(host: string, chainId = 137): Promise<DiscoveredMarket[]> {
  const client = new ClobClient(host, chainId);

  const hits: DiscoveredMarket[] = [];

  let cursor: string | undefined = undefined;
  for (let i = 0; i < 80; i++) {
    // Full markets endpoint includes `question`/`market_slug` and token ids.
    // @ts-ignore
    const res = await client.getMarkets(cursor);
    const data = (res?.data ?? res) as any;
    const markets = data?.data ?? data?.markets ?? data ?? [];

    for (const m of markets) {
      const q: string = m.question || '';
      const slug: string | undefined = m.market_slug || m.slug;
      const conditionId: string = m.condition_id || m.conditionId || m.market;
      const endDateIso: string | undefined = m.end_date_iso;

      // Token ids are often present as `tokens` array with { token_id, outcome }
      const tokenIds: string[] = Array.isArray(m.tokens)
        ? m.tokens.map((t: any) => t.token_id).filter(Boolean)
        : (m.assets_ids || m.token_ids || []);
      const outcomes: string[] | undefined = Array.isArray(m.tokens)
        ? m.tokens.map((t: any) => t.outcome).filter(Boolean)
        : m.outcomes;

      const isUpDown = /Up or Down/i.test(q);
      const is15m = /\b15\s*minute\b|\b15m\b|\b5:00PM-5:15PM\b|\b-\s*\d{1,2}:\d{2}[AP]M-\d{1,2}:\d{2}[AP]M\b/i.test(q);
      const isCrypto = /Bitcoin|Ethereum|Solana|\bBTC\b|\bETH\b|\bSOL\b/i.test(q);

      if (isUpDown && isCrypto && is15m && tokenIds.length >= 2 && conditionId) {
        hits.push({ conditionId, question: q, slug, tokenIds, outcomes, endDateIso });
      }
    }

    // Stop early if we already have plenty (keeps startup fast)
    if (hits.length >= 30) break;

    cursor = data?.next_cursor || data?.nextCursor;
    if (!cursor || cursor === 'END') break;
  }

  // Keep only BTC/ETH/SOL markets, newest first if endDate exists
  const filtered = hits.filter((h) => WANT.some((w) => h.question.includes(w)));
  filtered.sort((a, b) => (b.endDateIso || '').localeCompare(a.endDateIso || ''));
  return filtered;
}
