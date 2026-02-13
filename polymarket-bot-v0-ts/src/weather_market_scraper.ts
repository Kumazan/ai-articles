/**
 * Weather Market Scraper
 *
 * Scrapes Polymarket weather contracts from the climate-science/weather page.
 * Extracts conditionId, question, and outcome prices.
 * Parses city, date, and temperature range from each contract.
 *
 * Then compares against NOAA/Open-Meteo forecast data to find edge.
 */

import { setTimeout as sleep } from 'node:timers/promises';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// ---- Types ----

export type WeatherContract = {
  conditionId: string;
  question: string;
  city: string;
  date: string; // "February 14" etc.
  /** Parsed temperature threshold/range */
  tempRange: { type: 'lte' | 'eq' | 'gte' | 'range'; low?: number; high?: number; unit: 'F' | 'C' };
  /** Yes price (probability) */
  yesPrice: number;
  /** No price */
  noPrice: number;
};

export type WeatherEdge = {
  ts: number;
  contract: WeatherContract;
  forecastHigh: number;
  forecastUnit: 'F' | 'C';
  /** Estimated probability from forecast */
  forecastProb: number;
  /** Market-implied probability (yesPrice) */
  marketProb: number;
  /** Edge = forecastProb - marketProb (positive = market underpriced) */
  edge: number;
  signal: 'buy_yes' | 'buy_no' | 'none';
};

// ---- Scraping ----

const WEATHER_URL = 'https://polymarket.com/climate-science/weather';

/**
 * Fetch and parse weather contracts from Polymarket.
 */
export async function scrapeWeatherContracts(): Promise<WeatherContract[]> {
  const res = await fetch(WEATHER_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (polymarket-weather-bot)' },
  });
  if (!res.ok) throw new Error(`Polymarket scrape failed: ${res.status}`);
  const html = await res.text();

  // Extract conditionId + question + prices from embedded data
  const segments = html.split('"conditionId"');
  const contracts: WeatherContract[] = [];

  for (const seg of segments.slice(1)) {
    const cidMatch = seg.match(/^:"(0x[0-9a-fA-F]+)"/);
    const qMatch = seg.match(/"question":"(Will the highest temperature[^"]+)"/);
    const priceMatch = seg.match(/"outcomePrices":"?\[([^\]]+)\]/);

    if (!cidMatch || !qMatch) continue;

    const cid = cidMatch[1]!;
    const question = qMatch[1]!;
    const priceStr = priceMatch?.[1] ?? '';

    // Parse prices
    const priceParts = priceStr.replace(/"/g, '').split(',').map(Number);
    const yesPrice = priceParts[0] ?? 0;
    const noPrice = priceParts[1] ?? 0;

    // Parse question: "Will the highest temperature in {city} be {range} on {date}?"
    const parsed = parseQuestion(question);
    if (!parsed) continue;

    contracts.push({
      conditionId: cid,
      question,
      city: parsed.city,
      date: parsed.date,
      tempRange: parsed.tempRange,
      yesPrice,
      noPrice,
    });
  }

  logger.info({ n: contracts.length }, 'scraped weather contracts');
  return contracts;
}

function parseQuestion(q: string): {
  city: string;
  date: string;
  tempRange: WeatherContract['tempRange'];
} | null {
  // Pattern: "Will the highest temperature in {city} be {condition} on {date}?"
  const m = q.match(
    /Will the highest temperature in (.+?) be (.+?) on (.+)\?/,
  );
  if (!m) return null;

  const city = m[1]!;
  const condition = m[2]!;
  const date = m[3]!;

  const unit: 'F' | 'C' = condition.includes('°F') ? 'F' : 'C';

  // Parse temperature condition
  let tempRange: WeatherContract['tempRange'];

  // "33°F or below"
  const lteMatch = condition.match(/(\d+)°[FC] or below/);
  if (lteMatch) {
    tempRange = { type: 'lte', high: Number(lteMatch[1]), unit };
    return { city, date, tempRange };
  }

  // "80°F or higher"
  const gteMatch = condition.match(/(\d+)°[FC] or higher/);
  if (gteMatch) {
    tempRange = { type: 'gte', low: Number(gteMatch[1]), unit };
    return { city, date, tempRange };
  }

  // "between 34-35°F" or "between 70-71°F"
  const rangeMatch = condition.match(/between (\d+)-(\d+)°[FC]/);
  if (rangeMatch) {
    tempRange = { type: 'range', low: Number(rangeMatch[1]), high: Number(rangeMatch[2]), unit };
    return { city, date, tempRange };
  }

  // "6°C" (exact)
  const exactMatch = condition.match(/^(\d+)°[FC]$/);
  if (exactMatch) {
    tempRange = { type: 'eq', low: Number(exactMatch[1]), high: Number(exactMatch[1]), unit };
    return { city, date, tempRange };
  }

  return null;
}

// ---- Edge calculation ----

/**
 * Estimate probability that the actual high temperature falls in a given range,
 * given a forecast high and typical forecast error (std dev).
 *
 * Uses a simple normal distribution approximation.
 * NWS forecast error for next-day high is typically ±2-3°F (std dev ~2°F).
 */
function normalCDF(x: number): number {
  // Abramowitz & Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x / 2);
  return 0.5 * (1 + sign * y);
}

function estimateProb(
  forecastHigh: number,
  range: WeatherContract['tempRange'],
  stdDev = 2.0, // °F for US, °C for intl
): number {
  switch (range.type) {
    case 'lte':
      return normalCDF((range.high! + 0.5 - forecastHigh) / stdDev);
    case 'gte':
      return 1 - normalCDF((range.low! - 0.5 - forecastHigh) / stdDev);
    case 'eq':
      return normalCDF((range.high! + 0.5 - forecastHigh) / stdDev) -
        normalCDF((range.low! - 0.5 - forecastHigh) / stdDev);
    case 'range':
      return normalCDF((range.high! + 0.5 - forecastHigh) / stdDev) -
        normalCDF((range.low! - 0.5 - forecastHigh) / stdDev);
    default:
      return 0;
  }
}

// ---- City name mapping ----

const CITY_MAP: Record<string, string> = {
  'New York City': 'NYC',
  'NYC': 'NYC',
  'Chicago': 'Chicago',
  'Dallas': 'Dallas',
  'Miami': 'Miami',
  'Atlanta': 'Atlanta',
  'Seattle': 'Seattle',
  'London': 'London',
  'Seoul': 'Seoul',
  'Toronto': 'Toronto',
  'Ankara': 'Ankara',
  'Wellington': 'Wellington',
  'Buenos Aires': 'Buenos Aires',
};

/**
 * Compare weather contracts against forecast data.
 * Returns actionable edges.
 */
export function calculateEdges(
  contracts: WeatherContract[],
  forecasts: Map<string, number>, // key: "cityName:YYYY-MM-DD" → forecast high
  minEdge = 0.10, // minimum edge to report (10%)
): WeatherEdge[] {
  const edges: WeatherEdge[] = [];

  for (const c of contracts) {
    const cityKey = CITY_MAP[c.city] ?? c.city;
    // Try to match forecast by city name and date
    // Date in contract is like "February 14" — we need to match to YYYY-MM-DD
    const forecastHigh = findForecast(cityKey, c.date, forecasts);
    if (forecastHigh === undefined) continue;

    const stdDev = c.tempRange.unit === 'F' ? 2.5 : 1.5;
    const forecastProb = estimateProb(forecastHigh, c.tempRange, stdDev);
    const marketProb = c.yesPrice;
    const edge = forecastProb - marketProb;

    if (Math.abs(edge) >= minEdge) {
      edges.push({
        ts: Date.now(),
        contract: c,
        forecastHigh,
        forecastUnit: c.tempRange.unit,
        forecastProb: Math.round(forecastProb * 1000) / 1000,
        marketProb,
        edge: Math.round(edge * 1000) / 1000,
        signal: edge > minEdge ? 'buy_yes' : edge < -minEdge ? 'buy_no' : 'none',
      });
    }
  }

  edges.sort((a, b) => Math.abs(b.edge) - Math.abs(a.edge));
  return edges;
}

function findForecast(
  city: string,
  dateStr: string, // "February 14"
  forecasts: Map<string, number>,
): number | undefined {
  // Convert "February 14" to YYYY-MM-DD for current year
  const year = new Date().getUTCFullYear();
  const months: Record<string, string> = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };
  const parts = dateStr.split(' ');
  const month = months[parts[0] ?? ''];
  const day = parts[1]?.padStart(2, '0');
  if (!month || !day) return undefined;

  const isoDate = `${year}-${month}-${day}`;
  return forecasts.get(`${city}:${isoDate}`);
}
