import { ClobClient } from '@polymarket/clob-client';

export type BookTop = {
  tokenId: string;
  bestBid?: number;
  bestAsk?: number;
  ts: number;
};

export async function fetchTopOfBook(client: ClobClient, tokenId: string): Promise<BookTop> {
  const ob = await client.getOrderBook(tokenId);
  const data = (ob as any)?.data ?? ob;

  // clob returns { bids: [{price,size}], asks: [...] }
  const bids = data?.bids ?? [];
  const asks = data?.asks ?? [];
  const bestBid = bids.length ? Number(bids[0].price) : undefined;
  const bestAsk = asks.length ? Number(asks[0].price) : undefined;

  const result: BookTop = { tokenId, ts: Date.now() };
  if (bestBid !== undefined) result.bestBid = bestBid;
  if (bestAsk !== undefined) result.bestAsk = bestAsk;
  return result;
}
