import { setTimeout as sleep } from 'node:timers/promises';

export type ResolvedEvent = {
  symbol: 'BTC' | 'ETH' | 'SOL';
  eventUrl: string;
  conditionId: string;
};

function roundTo15mEpochSec(tsMs: number): number {
  const sec = Math.floor(tsMs / 1000);
  const window = 15 * 60;
  // event ids appear to use a window start epoch
  return Math.floor(sec / window) * window;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`fetch ${url} -> ${res.status}`);
  return await res.text();
}

function extractConditionId(html: string): string | null {
  const m = html.match(/"conditionId"\s*:\s*"(0x[0-9a-fA-F]{64})"/);
  return m?.[1] ?? null;
}

export async function resolveCurrent15mEvent(symbol: ResolvedEvent['symbol']): Promise<ResolvedEvent> {
  // Try a small range around current 15m epoch; markets can be created slightly ahead.
  const base = roundTo15mEpochSec(Date.now());
  // Prefer forward epochs first (new markets), then fallback backward.
  const candidates = [base + 1800, base + 900, base, base - 900, base - 1800, base + 2700];

  for (const epoch of candidates) {
    const slug = `${symbol.toLowerCase()}-updown-15m-${epoch}`;
    const url = `https://polymarket.com/event/${slug}`;
    try {
      const html = await fetchText(url);
      const cid = extractConditionId(html);
      if (!cid) continue;
      // Caller must verify market is active/open (CLOB can keep old event pages around)
      return { symbol, eventUrl: url, conditionId: cid };
    } catch {
      // ignore
    }
    await sleep(50);
  }

  throw new Error(`could not resolve current event for ${symbol}`);
}
