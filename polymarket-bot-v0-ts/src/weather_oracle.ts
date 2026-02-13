/**
 * Weather Oracle Module
 *
 * Monitors NOAA NWS forecast data and compares against Polymarket
 * weather markets to detect edge when forecast models update.
 *
 * Strategy:
 *   1. Track NOAA forecasts for target cities (hourly updates)
 *   2. Detect forecast shifts (temperature change between model runs)
 *   3. Compare shifted forecast against Polymarket contract pricing
 *   4. Signal when market hasn't priced in the new forecast
 *
 * NOAA NWS API: https://api.weather.gov (free, no key needed)
 * - /points/{lat},{lon} → get forecast URLs
 * - /gridpoints/{office}/{x},{y}/forecast → 7-day forecast
 * - /gridpoints/{office}/{x},{y}/forecast/hourly → hourly forecast
 */

import { setTimeout as sleep } from 'node:timers/promises';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// ---- Types ----

export type CityConfig = {
  name: string;
  lat: number;
  lon: number;
  /** NOAA grid office + coords, resolved from /points endpoint */
  gridId?: string;
  gridX?: number;
  gridY?: number;
  /** Temperature unit used on Polymarket for this city */
  unit: 'F' | 'C';
};

export type ForecastSnapshot = {
  city: string;
  fetchedAt: number;
  /** Date string YYYY-MM-DD */
  date: string;
  /** Forecasted high temperature for that date */
  highTemp: number;
  unit: 'F' | 'C';
  /** Short description */
  shortForecast: string;
  /** Raw period name from NWS */
  periodName: string;
};

export type ForecastShift = {
  city: string;
  date: string;
  previousHigh: number;
  currentHigh: number;
  shiftDeg: number;
  unit: 'F' | 'C';
  ts: number;
};

export type WeatherSignal = {
  ts: number;
  kind: 'weather_forecast_shift';
  city: string;
  date: string;
  forecastHigh: number;
  forecastShift: number;
  unit: 'F' | 'C';
  marketQuestion?: string;
  marketMidPrice?: number;
  edge?: string;
};

// ---- Default cities tracked on Polymarket ----

export const DEFAULT_CITIES: CityConfig[] = [
  { name: 'NYC', lat: 40.7128, lon: -74.006, unit: 'F' },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298, unit: 'F' },
  { name: 'Dallas', lat: 32.7767, lon: -96.797, unit: 'F' },
  { name: 'Miami', lat: 25.7617, lon: -80.1918, unit: 'F' },
  { name: 'Atlanta', lat: 33.749, lon: -84.388, unit: 'F' },
  { name: 'Seattle', lat: 47.6062, lon: -122.3321, unit: 'F' },
  { name: 'London', lat: 51.5074, lon: -0.1278, unit: 'C' },
  { name: 'Seoul', lat: 37.5665, lon: 126.978, unit: 'C' },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832, unit: 'C' },
  { name: 'Ankara', lat: 39.9334, lon: 32.8597, unit: 'C' },
];

// ---- NWS API helpers ----

const NWS_BASE = 'https://api.weather.gov';
const USER_AGENT = 'polymarket-weather-bot (contact: bot@example.com)';

async function fetchJSON(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
  });
  if (!res.ok) throw new Error(`NWS API ${res.status}: ${url}`);
  return res.json();
}

/**
 * Resolve NWS grid coordinates from lat/lon.
 * NOTE: NWS API only covers US territories.
 * For international cities, we'll need alternative data sources.
 */
export async function resolveGrid(city: CityConfig): Promise<CityConfig> {
  if (city.gridId && city.gridX !== undefined && city.gridY !== undefined) return city;

  try {
    const data = await fetchJSON(`${NWS_BASE}/points/${city.lat},${city.lon}`);
    const props = data.properties;
    return {
      ...city,
      gridId: props.gridId,
      gridX: props.gridX,
      gridY: props.gridY,
    };
  } catch (e) {
    // Non-US city — NWS won't work
    logger.debug({ city: city.name, e }, 'NWS grid resolve failed (non-US city?)');
    return city;
  }
}

/**
 * Fetch 7-day forecast for a US city from NWS.
 * Returns high temps by date.
 */
export async function fetchNWSForecast(city: CityConfig): Promise<ForecastSnapshot[]> {
  if (!city.gridId) return [];

  const url = `${NWS_BASE}/gridpoints/${city.gridId}/${city.gridX},${city.gridY}/forecast`;
  const data = await fetchJSON(url);
  const periods: any[] = data.properties?.periods ?? [];

  const snapshots: ForecastSnapshot[] = [];
  for (const p of periods) {
    // Only care about daytime periods (isDaytime: true) for high temp
    if (!p.isDaytime) continue;

    const startDate = p.startTime?.slice(0, 10);
    if (!startDate) continue;

    let temp = p.temperature;
    const nwsUnit = p.temperatureUnit === 'F' ? 'F' : 'C';

    // Convert if needed
    if (city.unit === 'C' && nwsUnit === 'F') {
      temp = Math.round(((temp - 32) * 5) / 9);
    } else if (city.unit === 'F' && nwsUnit === 'C') {
      temp = Math.round((temp * 9) / 5 + 32);
    }

    snapshots.push({
      city: city.name,
      fetchedAt: Date.now(),
      date: startDate,
      highTemp: temp,
      unit: city.unit,
      shortForecast: p.shortForecast ?? '',
      periodName: p.name ?? '',
    });
  }
  return snapshots;
}

/**
 * For international cities, use Open-Meteo API (free, no key).
 * Returns daily high temperature forecast.
 */
export async function fetchOpenMeteoForecast(city: CityConfig): Promise<ForecastSnapshot[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&daily=temperature_2m_max&temperature_unit=${city.unit === 'F' ? 'fahrenheit' : 'celsius'}` +
    `&timezone=auto&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data: any = await res.json();

  const dates: string[] = data.daily?.time ?? [];
  const temps: number[] = data.daily?.temperature_2m_max ?? [];

  const snapshots: ForecastSnapshot[] = [];
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    const t = temps[i];
    if (d === undefined || t === undefined) continue;
    snapshots.push({
      city: city.name,
      fetchedAt: Date.now(),
      date: d,
      highTemp: Math.round(t),
      unit: city.unit,
      shortForecast: '',
      periodName: `Day ${i + 1}`,
    });
  }
  return snapshots;
}

// ---- Forecast tracker ----

export class WeatherTracker {
  private cities: CityConfig[];
  private previousForecasts = new Map<string, ForecastSnapshot>(); // key: city:date
  private shifts: ForecastShift[] = [];
  private signals: WeatherSignal[] = [];

  constructor(cities: CityConfig[] = DEFAULT_CITIES) {
    this.cities = cities;
  }

  /** Initialize: resolve NWS grids for US cities */
  async init(): Promise<void> {
    const resolved: CityConfig[] = [];
    for (const city of this.cities) {
      const r = await resolveGrid(city);
      resolved.push(r);
      await sleep(100); // rate limit
    }
    this.cities = resolved;
    const usCities = resolved.filter((c) => c.gridId).map((c) => c.name);
    const intlCities = resolved.filter((c) => !c.gridId).map((c) => c.name);
    logger.info({ usCities, intlCities }, 'weather tracker initialized');
  }

  /** Fetch all forecasts and detect shifts */
  async poll(): Promise<{ shifts: ForecastShift[]; signals: WeatherSignal[] }> {
    const newShifts: ForecastShift[] = [];
    const newSignals: WeatherSignal[] = [];

    for (const city of this.cities) {
      try {
        // Use NWS for US cities, Open-Meteo for international
        const forecasts = city.gridId
          ? await fetchNWSForecast(city)
          : await fetchOpenMeteoForecast(city);

        for (const fc of forecasts) {
          const key = `${fc.city}:${fc.date}`;
          const prev = this.previousForecasts.get(key);

          if (prev && prev.highTemp !== fc.highTemp) {
            const shift: ForecastShift = {
              city: fc.city,
              date: fc.date,
              previousHigh: prev.highTemp,
              currentHigh: fc.highTemp,
              shiftDeg: fc.highTemp - prev.highTemp,
              unit: fc.unit,
              ts: Date.now(),
            };
            newShifts.push(shift);
            this.shifts.push(shift);

            // Generate signal if shift is significant (>= 2 degrees)
            if (Math.abs(shift.shiftDeg) >= 2) {
              const signal: WeatherSignal = {
                ts: Date.now(),
                kind: 'weather_forecast_shift',
                city: fc.city,
                date: fc.date,
                forecastHigh: fc.highTemp,
                forecastShift: shift.shiftDeg,
                unit: fc.unit,
              };
              newSignals.push(signal);
              this.signals.push(signal);

              logger.info(
                {
                  city: fc.city,
                  date: fc.date,
                  prev: prev.highTemp,
                  curr: fc.highTemp,
                  shift: shift.shiftDeg,
                  unit: fc.unit,
                },
                'WEATHER_FORECAST_SHIFT',
              );
            }
          }

          this.previousForecasts.set(key, fc);
        }

        await sleep(200); // rate limit between cities
      } catch (e) {
        logger.warn({ city: city.name, e }, 'weather forecast fetch failed');
      }
    }

    if (newShifts.length === 0) {
      logger.info({ nCities: this.cities.length }, 'weather poll: no shifts');
    }

    return { shifts: newShifts, signals: newSignals };
  }

  /** Get recent signals */
  getSignals(since?: number): WeatherSignal[] {
    if (!since) return this.signals;
    return this.signals.filter((s) => s.ts >= since);
  }

  /** Get current forecast snapshot for a city+date */
  getForecast(city: string, date: string): ForecastSnapshot | undefined {
    return this.previousForecasts.get(`${city}:${date}`);
  }

  /** Get all current forecasts */
  getAllForecasts(): ForecastSnapshot[] {
    return Array.from(this.previousForecasts.values());
  }
}
