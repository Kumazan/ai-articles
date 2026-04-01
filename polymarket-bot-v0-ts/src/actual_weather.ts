/**
 * Actual Weather Module — Weather Underground (Weather Company API)
 *
 * Fetches real observed historical temperatures from the Weather Company API
 * (same data source as Wunderground, which is Polymarket's official resolution source).
 *
 * Each city maps to a specific ICAO airport station as specified in Polymarket contract rules.
 */

import pino from 'pino';
import { DEFAULT_CITIES, type CityConfig } from './weather_oracle.js';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Weather Company API key (public, embedded in Wunderground frontend)
const WU_API_KEY = 'e1f10a1e78da46f5b10a1e78da96f525';

/**
 * Wunderground station config per Polymarket contract rules.
 * locationId format: ICAO:9:COUNTRY_CODE (Weather Company API format)
 */
type StationConfig = {
  icao: string;
  /** Weather Company API location ID */
  locationId: string;
  /** API units param: 'e' = imperial (°F), 'm' = metric (°C) */
  apiUnits: 'e' | 'm';
};

const WUNDERGROUND_STATIONS: Record<string, StationConfig> = {
  NYC:     { icao: 'KLGA', locationId: 'KLGA:9:US', apiUnits: 'e' },
  Chicago: { icao: 'KORD', locationId: 'KORD:9:US', apiUnits: 'e' },
  Miami:   { icao: 'KMIA', locationId: 'KMIA:9:US', apiUnits: 'e' },
  Dallas:  { icao: 'KDFW', locationId: 'KDFW:9:US', apiUnits: 'e' },
  Atlanta: { icao: 'KATL', locationId: 'KATL:9:US', apiUnits: 'e' },
  Seattle: { icao: 'KSEA', locationId: 'KSEA:9:US', apiUnits: 'e' },
  London:  { icao: 'EGLC', locationId: 'EGLC:9:GB', apiUnits: 'm' },
  Toronto: { icao: 'CYYZ', locationId: 'CYYZ:9:CA', apiUnits: 'm' },
  Seoul:   { icao: 'RKSI', locationId: 'RKSI:9:KR', apiUnits: 'm' },  // Incheon Intl
  Ankara:  { icao: 'LTAC', locationId: 'LTAC:9:TR', apiUnits: 'm' },  // Esenboğa Intl
};

export type CityQuery = {
  city: string;
  date: string; // YYYY-MM-DD
  lat: number;
  lon: number;
  unit: 'F' | 'C';
};

/**
 * Fetch actual observed high temperatures from Weather Company historical API
 * (same data source as Wunderground — Polymarket's official resolution source).
 *
 * Returns Map<"city:YYYY-MM-DD", actualHighTemp>.
 * If data is unavailable or not yet finalized, that city+date is omitted.
 */
export async function fetchActualHighTemps(
  queries: CityQuery[],
): Promise<Map<string, number>> {
  const result = new Map<string, number>();

  // Group queries by city
  const byCityKey = new Map<string, { config: CityQuery; dates: string[] }>();
  for (const q of queries) {
    if (!byCityKey.has(q.city)) {
      byCityKey.set(q.city, { config: q, dates: [] });
    }
    byCityKey.get(q.city)!.dates.push(q.date);
  }

  for (const [cityName, { config, dates }] of byCityKey) {
    const station = WUNDERGROUND_STATIONS[cityName];
    if (!station) {
      logger.warn({ city: cityName }, 'no Wunderground station mapping, skipping');
      continue;
    }

    // Fetch each date separately (API uses startDate/endDate in YYYYMMDD format)
    for (const date of dates) {
      const yyyymmdd = date.replace(/-/g, '');
      const url =
        `https://api.weather.com/v1/location/${station.locationId}/observations/historical.json` +
        `?apiKey=${WU_API_KEY}&units=${station.apiUnits}&startDate=${yyyymmdd}&endDate=${yyyymmdd}`;

      try {
        logger.info({ city: cityName, date, station: station.icao }, 'fetching actual temps from Weather Company API');
        const res = await fetch(url);
        if (!res.ok) {
          logger.warn({ city: cityName, date, status: res.status }, 'Weather Company API error');
          continue;
        }
        const data: any = await res.json();
        const observations: any[] = data.observations ?? [];

        if (observations.length === 0) {
          logger.info({ city: cityName, date }, 'no observations yet (data not finalized)');
          continue;
        }

        // Find maximum temperature across all hourly observations for this day
        let maxTemp: number | null = null;
        for (const obs of observations) {
          const temp = obs.temp;
          if (temp !== null && temp !== undefined && Number.isFinite(temp)) {
            if (maxTemp === null || temp > maxTemp) {
              maxTemp = temp;
            }
          }
        }

        if (maxTemp !== null) {
          // Check if we have a full day's data (at least 20 observations = roughly every hour)
          // If fewer, the day may not be finalized yet
          if (observations.length < 20) {
            logger.info(
              { city: cityName, date, nObs: observations.length },
              'partial day data, skipping settlement (not finalized)',
            );
            continue;
          }

          result.set(`${cityName}:${date}`, Math.round(maxTemp));
          logger.info(
            { city: cityName, date, maxTemp: Math.round(maxTemp), nObs: observations.length, unit: config.unit },
            'actual high temp from Wunderground',
          );
        }
      } catch (e) {
        logger.warn({ city: cityName, date, error: e }, 'failed to fetch actual temps from Weather Company');
      }
    }
  }

  logger.info({ queriedCities: byCityKey.size, resultsFound: result.size }, 'actual temps fetched (Wunderground)');
  return result;
}

/**
 * Build CityQuery list from open paper positions.
 * Matches city names to DEFAULT_CITIES for coordinates.
 */
export function buildCityQueries(
  cityDatePairs: { city: string; isoDate: string }[],
): CityQuery[] {
  const cityMap = new Map<string, CityConfig>();
  for (const c of DEFAULT_CITIES) {
    cityMap.set(c.name, c);
  }

  const queries: CityQuery[] = [];
  const seen = new Set<string>();
  for (const { city, isoDate } of cityDatePairs) {
    const key = `${city}:${isoDate}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const cfg = cityMap.get(city);
    if (!cfg) {
      logger.warn({ city }, 'no config found for city, skipping settlement');
      continue;
    }
    queries.push({ city, date: isoDate, lat: cfg.lat, lon: cfg.lon, unit: cfg.unit });
  }
  return queries;
}
