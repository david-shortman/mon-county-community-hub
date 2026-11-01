// Today's forecast for Morgantown, for the dateline in the header. Fetched
// once per build from the National Weather Service (free, public domain, no
// key), so visitors' browsers never contact a weather service. The site
// rebuilds every morning (site.yml) and on every merge, and the page script
// hides the forecast once it is from an earlier day.
// If the service is slow or down, the dateline shows the date only.
//
// We read the forecast page's JSON on forecast.weather.gov, which has no
// robots.txt rule against it. The api.weather.gov address we used before is
// one its robots.txt asks robots to stay out of (Disallow: /), so we stopped
// on 2026-11-01. Reads go through fetchWithRetry, which checks robots.txt
// every time. Policy: docs/operations/automated-reads.md.
import { todayYmd } from './content.mjs';
import { fetchWithRetry } from './ingest.mjs';

// Downtown Morgantown (NWS office PBZ, Pittsburgh).
export const FORECAST_PAGE = 'https://forecast.weather.gov/MapClick.php?lat=39.6295&lon=-79.9559';
export const WEATHER_API = `${FORECAST_PAGE}&FcstType=json`;

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

// The forecast page's JSON as a list of periods like the NWS API's:
// { startTime, endTime, isDaytime, temperature, shortForecast }.
export function periodsFromForecastJson(json) {
  const starts = json?.time?.startValidTime ?? [];
  const labels = json?.time?.tempLabel ?? [];
  const temps = json?.data?.temperature ?? [];
  const sky = json?.data?.weather ?? [];
  return starts.map((startTime, i) => ({
    startTime,
    endTime: starts[i + 1] ?? new Date(new Date(startTime).getTime() + 12 * 3_600_000).toISOString(),
    isDaytime: labels[i] === 'High',
    temperature: temps[i] === undefined || temps[i] === null || temps[i] === '' ? NaN : Number(temps[i]),
    shortForecast: String(sky[i] ?? ''),
  }));
}

// { day: 'YYYY-MM-DD', icon: 'wx-sun', text: 'High 66°, mostly sunny' } or null.
export function pickForecast(periods, now = new Date()) {
  const today = todayYmd(now);
  // Today's daytime forecast while it lasts, then tonight's.
  const p = periods.find((x) => x.isDaytime && eastern(x.startTime) === today && new Date(x.endTime) > now)
    ?? periods.find((x) => new Date(x.endTime) > now);
  if (!p || !Number.isFinite(p.temperature)) return null;
  const sky = String(p.shortForecast ?? '').split(' then ')[0].toLowerCase();
  return { day: today, icon: iconFor(p.shortForecast, p.isDaytime), text: `${p.isDaytime ? 'High' : 'Low'} ${p.temperature}°${sky ? `, ${sky}` : ''}` };
}

let cached;
export function todaysForecast(now = new Date()) {
  cached ??= (async () => {
    try {
      const json = await fetchWithRetry(WEATHER_API, { format: 'json', timeoutMs: 8000, tries: 2 });
      return pickForecast(periodsFromForecastJson(json), now);
    } catch (err) {
      console.warn(`weather: skipped (${err.message})`);
      return null;
    }
  })();
  return cached;
}
