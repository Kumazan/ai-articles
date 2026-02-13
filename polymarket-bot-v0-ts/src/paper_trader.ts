/**
 * Paper Trading Module
 *
 * Simulates trading weather contracts with a fixed starting capital.
 * Tracks positions, settlements, and P&L.
 *
 * Strategy:
 *   - Buy YES when forecastProb > marketProb (positive edge)
 *   - Buy NO when forecastProb < marketProb (negative edge)
 *   - Kelly criterion position sizing (fractional, capped)
 *   - Hold until market settles (binary outcome: 0 or 1)
 *
 * Settlement: uses actual temperature data from NWS/Open-Meteo after the date passes.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import pino from 'pino';
import type { WeatherEdge } from './weather_market_scraper.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// ---- Types ----

export type PaperPosition = {
  id: string;
  openedAt: number;
  conditionId: string;
  question: string;
  city: string;
  date: string; // "February 14"
  isoDate: string; // "2026-02-14"
  side: 'yes' | 'no';
  /** Price paid per share (0-1) */
  entryPrice: number;
  /** Number of shares bought */
  shares: number;
  /** Total cost (entryPrice * shares) */
  cost: number;
  /** Edge at entry */
  edge: number;
  /** Forecast probability at entry */
  forecastProb: number;
  /** Whether this position has been settled */
  settled: boolean;
  /** Settlement result */
  outcome?: 'win' | 'lose';
  /** Payout received */
  payout?: number;
  /** P&L (payout - cost) */
  pnl?: number;
  /** Actual temperature (filled at settlement) */
  actualTemp?: number;
  settledAt?: number;
};

export type PaperPortfolio = {
  startingCapital: number;
  cash: number;
  positions: PaperPosition[];
  totalPnl: number;
  trades: number;
  wins: number;
  losses: number;
  startedAt: number;
};

// ---- Constants ----

/** Max fraction of remaining cash per trade (half Kelly) */
const MAX_BET_FRACTION = 0.05; // 5% of cash per trade
/** Minimum edge to take a trade */
const MIN_EDGE = 0.10; // 10%
/** Polymarket taker fee */
const TAKER_FEE = 0.02;
/** Max positions per city+date to avoid over-concentration */
const MAX_POS_PER_MARKET = 3;
/** Minimum bet size in dollars */
const MIN_BET = 0.50;

// ---- Paper Trader ----

export class PaperTrader {
  portfolio: PaperPortfolio;
  private dataDir: string;
  private savePath: string;

  constructor(startingCapital: number, dataDir: string) {
    this.dataDir = dataDir;
    this.savePath = path.join(dataDir, 'paper-portfolio.json');

    // Try to load existing portfolio
    if (fs.existsSync(this.savePath)) {
      try {
        const raw = fs.readFileSync(this.savePath, 'utf-8');
        this.portfolio = JSON.parse(raw) as PaperPortfolio;
        logger.info(
          { cash: this.portfolio.cash.toFixed(2), positions: this.portfolio.positions.filter(p => !p.settled).length },
          'paper trader: loaded existing portfolio',
        );
        return;
      } catch {
        logger.warn('paper trader: failed to load portfolio, creating new');
      }
    }

    this.portfolio = {
      startingCapital,
      cash: startingCapital,
      positions: [],
      totalPnl: 0,
      trades: 0,
      wins: 0,
      losses: 0,
      startedAt: Date.now(),
    };
    this.save();
    logger.info({ startingCapital }, 'paper trader: initialized');
  }

  /** Process weather edges and open new positions */
  processEdges(edges: WeatherEdge[]): PaperPosition[] {
    const newPositions: PaperPosition[] = [];

    for (const e of edges) {
      // Skip if edge too small after fees
      const absEdge = Math.abs(e.edge);
      if (absEdge < MIN_EDGE) continue;

      const side: 'yes' | 'no' = e.signal === 'buy_yes' ? 'yes' : 'no';
      const entryPrice = side === 'yes' ? e.contract.yesPrice : e.contract.noPrice;

      // Skip if price is too extreme (likely already settled or illiquid)
      if (entryPrice < 0.01 || entryPrice > 0.99) continue;

      // Check position limits
      const isoDate = this.toIsoDate(e.contract.date);
      const marketKey = `${e.contract.city}:${isoDate}`;
      const existingCount = this.portfolio.positions.filter(
        p => !p.settled && `${p.city}:${p.isoDate}` === marketKey,
      ).length;
      if (existingCount >= MAX_POS_PER_MARKET) continue;

      // Check if we already have this exact contract
      const alreadyHave = this.portfolio.positions.some(
        p => !p.settled && p.conditionId === e.contract.conditionId && p.side === side,
      );
      if (alreadyHave) continue;

      // Half-Kelly position sizing
      // Kelly fraction = edge / odds
      // For binary market: f = (p * b - q) / b where b = (1/entryPrice - 1), p = forecastProb
      const prob = side === 'yes' ? e.forecastProb : (1 - e.forecastProb);
      const odds = (1 / entryPrice) - 1;
      const kellyFraction = Math.max(0, (prob * odds - (1 - prob)) / odds);
      const halfKelly = kellyFraction / 2;
      const betFraction = Math.min(halfKelly, MAX_BET_FRACTION);

      let betAmount = this.portfolio.cash * betFraction;
      // Apply taker fee
      const effectiveCost = betAmount * (1 + TAKER_FEE);

      if (effectiveCost > this.portfolio.cash || betAmount < MIN_BET) continue;

      const shares = betAmount / entryPrice;
      const cost = effectiveCost;

      const position: PaperPosition = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        openedAt: Date.now(),
        conditionId: e.contract.conditionId,
        question: e.contract.question,
        city: e.contract.city,
        date: e.contract.date,
        isoDate,
        side,
        entryPrice,
        shares,
        cost,
        edge: e.edge,
        forecastProb: e.forecastProb,
        settled: false,
      };

      this.portfolio.cash -= cost;
      this.portfolio.positions.push(position);
      this.portfolio.trades++;
      newPositions.push(position);

      logger.info(
        {
          city: position.city,
          date: position.date,
          side: position.side,
          price: entryPrice.toFixed(3),
          shares: shares.toFixed(1),
          cost: cost.toFixed(2),
          edge: e.edge.toFixed(3),
          cashLeft: this.portfolio.cash.toFixed(2),
        },
        'PAPER_TRADE_OPEN',
      );
    }

    if (newPositions.length > 0) {
      this.save();
    }

    return newPositions;
  }

  /**
   * Settle positions for dates that have passed.
   * actualTemps: Map<"city:YYYY-MM-DD", actualHighTemp>
   */
  settlePositions(actualTemps: Map<string, number>): PaperPosition[] {
    const settled: PaperPosition[] = [];

    for (const pos of this.portfolio.positions) {
      if (pos.settled) continue;

      const key = `${pos.city}:${pos.isoDate}`;
      const actualTemp = actualTemps.get(key);
      if (actualTemp === undefined) continue;

      // Determine if YES outcome won
      const yesWon = this.didYesWin(pos, actualTemp);
      const posWon = (pos.side === 'yes' && yesWon) || (pos.side === 'no' && !yesWon);

      pos.settled = true;
      pos.settledAt = Date.now();
      pos.actualTemp = actualTemp;
      pos.outcome = posWon ? 'win' : 'lose';
      pos.payout = posWon ? pos.shares * 1.0 * (1 - TAKER_FEE) : 0; // winner gets $1/share minus fee
      pos.pnl = pos.payout - pos.cost;

      this.portfolio.cash += pos.payout;
      this.portfolio.totalPnl += pos.pnl;
      if (posWon) this.portfolio.wins++;
      else this.portfolio.losses++;

      settled.push(pos);

      logger.info(
        {
          city: pos.city,
          date: pos.date,
          side: pos.side,
          outcome: pos.outcome,
          actualTemp,
          entryPrice: pos.entryPrice.toFixed(3),
          payout: pos.payout.toFixed(2),
          pnl: pos.pnl.toFixed(2),
          totalPnl: this.portfolio.totalPnl.toFixed(2),
          cash: this.portfolio.cash.toFixed(2),
        },
        'PAPER_TRADE_SETTLED',
      );
    }

    if (settled.length > 0) {
      this.save();
    }

    return settled;
  }

  /** Check if the YES outcome won based on actual temperature */
  private didYesWin(pos: PaperPosition, actualTemp: number): boolean {
    // Re-parse the question to get the condition
    const m = pos.question.match(/Will the highest temperature in .+? be (.+?) on .+\?/);
    if (!m) return false;
    const condition = m[1]!;

    const unit: 'F' | 'C' = condition.includes('°F') ? 'F' : 'C';

    // "33°F or below"
    const lteMatch = condition.match(/(\d+)°[FC] or below/);
    if (lteMatch) return actualTemp <= Number(lteMatch[1]);

    // "80°F or higher"
    const gteMatch = condition.match(/(\d+)°[FC] or higher/);
    if (gteMatch) return actualTemp >= Number(gteMatch[1]);

    // "between 34-35°F"
    const rangeMatch = condition.match(/between (\d+)-(\d+)°[FC]/);
    if (rangeMatch) return actualTemp >= Number(rangeMatch[1]) && actualTemp <= Number(rangeMatch[2]);

    // "6°C" (exact)
    const exactMatch = condition.match(/^(\d+)°[FC]$/);
    if (exactMatch) return actualTemp === Number(exactMatch[1]);

    return false;
  }

  /** Get portfolio summary */
  summary(): string {
    const p = this.portfolio;
    const openPositions = p.positions.filter(pos => !pos.settled);
    const settledPositions = p.positions.filter(pos => pos.settled);
    const unrealizedValue = openPositions.reduce((sum, pos) => sum + pos.cost, 0);
    const totalValue = p.cash + unrealizedValue;
    const returnPct = ((totalValue - p.startingCapital) / p.startingCapital * 100).toFixed(2);
    const winRate = p.trades > 0 ? ((p.wins / (p.wins + p.losses)) * 100 || 0).toFixed(1) : 'N/A';

    return [
      `📊 Paper Portfolio`,
      `💰 Starting: $${p.startingCapital.toFixed(2)}`,
      `💵 Cash: $${p.cash.toFixed(2)}`,
      `📈 Open positions: ${openPositions.length} (value: $${unrealizedValue.toFixed(2)})`,
      `📊 Total value: $${totalValue.toFixed(2)} (${returnPct}%)`,
      `✅ Settled: ${settledPositions.length} | W/L: ${p.wins}/${p.losses} | Win rate: ${winRate}%`,
      `💹 Realized P&L: $${p.totalPnl.toFixed(2)}`,
      `📅 Running since: ${new Date(p.startedAt).toISOString().slice(0, 10)}`,
    ].join('\n');
  }

  private toIsoDate(dateStr: string): string {
    const year = new Date().getUTCFullYear();
    const months: Record<string, string> = {
      January: '01', February: '02', March: '03', April: '04',
      May: '05', June: '06', July: '07', August: '08',
      September: '09', October: '10', November: '11', December: '12',
    };
    const parts = dateStr.split(' ');
    const month = months[parts[0] ?? ''] ?? '01';
    const day = (parts[1] ?? '01').padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private save(): void {
    try {
      fs.writeFileSync(this.savePath, JSON.stringify(this.portfolio, null, 2));
    } catch (e) {
      logger.warn({ e }, 'paper trader: failed to save portfolio');
    }
  }
}
