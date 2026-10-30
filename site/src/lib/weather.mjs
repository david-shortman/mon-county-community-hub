// Today's forecast for Morgantown, for the dateline in the header. Fetched
// once per build from the National Weather Service (api.weather.gov: free,
// public domain, no key), so visitors' browsers never contact a weather
// service. The site rebuilds every morning (site.yml) and on every merge, and
// the page script hides the forecast once it is from an earlier day.
// If the service is slow or down, the dateline shows the date only.
import { todayYmd } from './content.mjs';

// The NWS forecast grid for downtown Morgantown (from
// api.weather.gov/points/39.6295,-79.9559, office PBZ, Pittsburgh).
const API = 'https://api.weather.gov/gridpoints/PBZ/83,30/forecast';
export const FORECAST_PAGE = 'https://forecast.weather.gov/MapClick.php?lat=39.6295&lon=-79.9559';
const HEADERS = { 'User-Agent': 'mon-county-community-hub (github.com/david-shortman/mon-county-community-hub)', Accept: 'application/geo+json' };

const eastern = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(iso));

// A small icon (src/components/Icon.astro) for the NWS short forecast. The
// first match wins, so storms beat rain and rain beats clouds.
export function iconFor(short = '', day = true) {
  const f = short.split(' then ')[0].toLowerCase();
  if (/thunder|t-storm/.test(f)) return 'wx-storm';
  if (/snow|flurr|sleet|freezing|ice/.test(f)) return 'wx-snow';
  if (/rain|shower|drizzle/.test(f)) return 'wx-rain';
  if (/fog|haze|smoke|mist/.test(f)) return 'wx-fog';
  if (/partly|mostly sunny|mostly clear/.test(f)) return 'wx-partly';
  if (/cloud|overcast/.test(f)) return 'wx-cloud';
  return day ? 'wx-sun' : 'wx-moon';
}

let cached;
// { day: 'YYYY-MM-DD', icon: 'wx-sun', text: 'High 66°, mostly sunny' } or null.
export function todaysForecast(now = new Date()) {
  cached ??= (async () => {
    try {
      const res = await fetch(API, { headers: HEADERS, signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const periods = (await res.json()).properties?.periods ?? [];
      const today = todayYmd(now);
      // Today's daytime forecast while it lasts, then tonight's.
      const p = periods.find((x) => x.isDaytime && eastern(x.startTime) === today && new Date(x.endTime) > now)
        ?? periods.find((x) => new Date(x.endTime) > now);
      if (!p || typeof p.temperature !== 'number') return null;
      const sky = String(p.shortForecast ?? '').split(' then ')[0].toLowerCase();
      return { day: today, icon: iconFor(p.shortForecast, p.isDaytime), text: `${p.isDaytime ? 'High' : 'Low'} ${p.temperature}°${sky ? `, ${sky}` : ''}` };
    } catch (err) {
      console.warn(`weather: skipped (${err.message})`);
      return null;
    }
  })();
  return cached;
}
