// Community numbers from free public data (#15). No API keys.
//
// At build time we fetch each source. If one is down, we use the last good
// copy in ./snapshots/<id>.json, which also keeps a dated record of what
// was shown. `npm run update-indicators` in site/ refreshes the saved copies.
// The build never fails because of a source.
//
// We show numbers as the source states them, with its own labels, the period
// they cover, and a link. We never say whether a number is good or bad, and
// never claim the project changed one (#15, Results-Based Accountability note).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_DIR = fs.existsSync(path.join(here, 'snapshots'))
  ? path.join(here, 'snapshots')
  : path.resolve(process.cwd(), 'src/lib/live-indicators/snapshots');
const UA = 'MonCountyCommunityHub/1.0 (+https://github.com/david-shortman/mon-county-community-hub)';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// CDC PLACES measures we show, by CDC's measure id.
export const PLACES_MEASURES = ['FOODINSECU', 'HOUSINSECU', 'SHUTUTILITY', 'LACKTRPT', 'ACCESS2', 'CHECKUP', 'MHLTH', 'CSMOKING'];

export const SOURCES = [
  {
    id: 'bls-laus-monongalia',
    name: 'Unemployment rate, Monongalia County',
    publisher: 'U.S. Bureau of Labor Statistics, Local Area Unemployment Statistics',
    page_url: 'https://data.bls.gov/timeseries/LAUCN540610000000003',
    feed_url: 'https://api.bls.gov/publicAPI/v1/timeseries/data/LAUCN540610000000003',
    parse(json) {
      const data = json?.Results?.series?.[0]?.data ?? [];
      // M13 is the yearly average; "-" means no estimate for that month.
      const points = data
        .filter((d) => /^M(0[1-9]|1[0-2])$/.test(d.period) && /^\d+(\.\d+)?$/.test(d.value))
        .map((d) => ({
          month: `${d.year}-${d.period.slice(1)}`,
          label: `${MONTHS[Number(d.period.slice(1)) - 1]} ${d.year}`,
          value: Number(d.value),
          preliminary: (d.footnotes ?? []).some((f) => f?.code === 'P'),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
      if (!points.length) throw new Error('no monthly values');
      return { points };
    },
  },
  {
    id: 'cdc-places-monongalia',
    name: 'CDC PLACES estimates, Monongalia County',
    publisher: 'Centers for Disease Control and Prevention, PLACES: Local Data for Better Health, County Data, 2025 release',
    page_url: 'https://data.cdc.gov/d/swc5-untb',
    feed_url: 'https://data.cdc.gov/resource/swc5-untb.json?locationid=54061&datavaluetypeid=CrdPrv&$limit=200',
    parse(json) {
      const rows = (Array.isArray(json) ? json : []).filter((r) => r.locationid === '54061' && r.datavaluetypeid === 'CrdPrv');
      const measures = PLACES_MEASURES.map((id) => rows.find((r) => r.measureid === id)).filter(Boolean).map((r) => ({
        id: r.measureid,
        measure: r.measure,
        year: r.year,
        value: Number(r.data_value),
        low: Number(r.low_confidence_limit),
        high: Number(r.high_confidence_limit),
        unit: r.data_value_unit,
      }));
      if (!measures.length) throw new Error('no measures for Monongalia County');
      return { measures };
    },
  },
];

const file = (src) => path.join(SNAPSHOT_DIR, `${src.id}.json`);
const readSnap = (src) => { try { return JSON.parse(fs.readFileSync(file(src), 'utf8')); } catch { return null; } };

async function fetchJson(url) {
  let last;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      last = err;
      if (i < 2) await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
  throw last;
}

// { ...source, data, fetched, status } for one source. Never throws.
export async function loadIndicator(src, { live = true, save = false, log = console } = {}) {
  if (live) {
    try {
      const data = src.parse(await fetchJson(src.feed_url));
      const fetched = new Date().toISOString();
      if (save) {
        fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
        fs.writeFileSync(file(src), JSON.stringify({ id: src.id, feed_url: src.feed_url, fetched, data }, null, 2) + '\n');
      }
      return { ...src, data, fetched, status: 'live' };
    } catch (err) {
      log.warn(`indicators: ${src.id}: could not load (${err.message}). Using the saved copy if there is one.`);
    }
  }
  const snap = readSnap(src);
  if (!snap) return { ...src, data: null, fetched: null, status: 'skipped' };
  return { ...src, data: snap.data, fetched: snap.fetched, status: 'snapshot' };
}

let cached;
export function loadIndicators() {
  cached ??= Promise.all(SOURCES.map((s) => loadIndicator(s))).then((all) => Object.fromEntries(all.map((x) => [x.id, x])));
  return cached;
}
