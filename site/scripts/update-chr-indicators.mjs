#!/usr/bin/env node
// Refreshes content/indicators/ from County Health Rankings (#15). Free, no
// key, no account: it reads the same public files a person can download.
//   - values: Monongalia County, West Virginia and the US, from the data file
//   - history: Monongalia County and West Virginia by year, from the trends
//     file, only years after County Health Rankings' last "trend break" for
//     that measure (their rule: do not compare across a break)
// Each indicator names its measure under `chr:`. The source URLs are the
// indicator's own first two sources, so a new yearly release is a change to
// those URLs plus a run of this script.
// Supplements (#1357): CHR&R made no 2026 annual release. Its March 2026
// supplemental file refreshed 34 measures, has no label row and no year
// column. An indicator that reads it sets `chr.data_year` to the year the
// supplement's codebook gives for that measure, since the trends file stops
// at the last annual release. History still comes from the trends file.
// Some measures (life expectancy, overdose deaths) are not in the trends file
// at all: those leave out `chr.trend_name`, get no history and no chart, and
// take their year from `chr.data_year`.
//
// Usage (from site/):
//   node scripts/update-chr-indicators.mjs --check   # exit 1 and list what differs
//   node scripts/update-chr-indicators.mjs --write   # update the files, set checked to today
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, todayYmd } from '../src/lib/content.mjs';
import { robotsCheck } from '../src/lib/robots.mjs';
import { savedCopy } from '../src/lib/saved-copies.mjs';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const DIR = path.join(CONTENT_DIR, 'indicators');
const HISTORY_YEARS = 10;
const mode = process.argv.includes('--write') ? 'write' : 'check';

// A small CSV reader for the quoted, comma-separated files CHR publishes.
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const UA = 'everything-morgantown-indicators (+https://github.com/david-shortman/mon-county-community-hub)';

// Reads one file's bytes. Live first; if the live file is gone (any answer
// but 200, or no answer), the saved copy listed in
// content/sources/chr/saved-copies.yaml (#1906), which must match the
// checksum we recorded. `notes` collects a line for each fallback, so the
// output (and the monthly Indicators issue) says where the numbers came from.
export async function readChrFile(url, { fetchImpl = fetch, robots = robotsCheck, lookup = savedCopy, notes = [] } = {}) {
  const get = async (u) => {
    // Same robots.txt rule as every automated read (docs/operations/automated-reads.md).
    const rc = await robots(u);
    if (!rc.allowed) throw new Error(rc.reason);
    const res = await fetchImpl(u, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(120000) });
    if (!res.ok) throw new Error(`${u}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  };
  try {
    return await get(url);
  } catch (liveErr) {
    const saved = lookup(url);
    if (!saved?.saved_copy_raw) throw liveErr;
    const buf = await get(saved.saved_copy_raw);
    const sum = crypto.createHash('sha256').update(buf).digest('hex');
    if (sum !== saved.sha256) throw new Error(`${liveErr.message}; saved copy ${saved.saved_copy_raw} does not match the recorded checksum`);
    notes.push(`${saved.file_name}: live file unavailable (${liveErr.message}); read the saved copy from ${saved.captured} (${saved.saved_copy}), checksum matches.`);
    return buf;
  }
}

const cache = new Map();
const notes = [];
async function csv(url) {
  if (!cache.has(url)) cache.set(url, parseCsv((await readChrFile(url, { notes })).toString('latin1')));
  return cache.get(url);
}

const num = (s) => (s === '' || s == null ? null : Number(String(s).replace(/,/g, '')));
const PLACES = { monongalia: ['54', '061'], west_virginia: ['54', '000'], united_states: ['00', '000'] };

export async function freshValues(ind) {
  const [dataUrl, trendsUrl] = ind.sources.map((s) => s.url);
  const data = await csv(dataUrl);
  // The annual file has a label row first and variable names second; the
  // supplement has only the variable names.
  const want = `${ind.chr.measure}_rawvalue`;
  const col = data[0].includes(want) ? data[0].indexOf(want) : data[1].indexOf(want);
  if (col < 0) throw new Error(`${ind.slug}: measure ${ind.chr.measure} not in ${dataUrl}`);
  const values = {};
  for (const [k, [st, co]] of Object.entries(PLACES)) {
    const row = data.find((r) => r[0] === st && r[1] === co);
    if (row && num(row[col]) != null) values[k] = num(row[col]);
  }
  if (!ind.chr.trend_name) return { values, history: null, data_year: String(ind.chr.data_year) };
  const trends = await csv(trendsUrl);
  const th = trends[0];
  const at = (r, name) => r[th.indexOf(name)];
  const history = {};
  let dataYear = null;
  for (const key of ['monongalia', 'west_virginia']) {
    const [st, co] = PLACES[key];
    const rows = trends.filter((r) => at(r, 'measurename') === ind.chr.trend_name && at(r, 'statecode') === st && at(r, 'countycode') === co)
      .sort((a, b) => at(a, 'yearspan').localeCompare(at(b, 'yearspan')));
    const lastBreak = rows.map((r) => at(r, 'trendbreak') === '1').lastIndexOf(true);
    const usable = rows.slice(lastBreak < 0 ? 0 : lastBreak).slice(-HISTORY_YEARS);
    history[key] = usable.map((r) => ({ year: at(r, 'yearspan'), value: num(at(r, 'rawvalue')) })).filter((p) => p.value != null);
    if (key === 'monongalia') dataYear = rows.at(-1) ? at(rows.at(-1), 'yearspan') : null;
  }
  return { values, history, data_year: ind.chr.data_year ? String(ind.chr.data_year) : dataYear };
}

// Run only as a script, so tests can import readChrFile.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const files = fs.readdirSync(DIR).filter((f) => /\.ya?ml$/.test(f)).sort();
  let differs = 0;
  for (const f of files) {
    const file = path.join(DIR, f);
    const doc = YAML.parseDocument(fs.readFileSync(file, 'utf8'));
    const ind = doc.toJS();
    if (!ind.chr) continue;
    const fresh = await freshValues(ind);
    const same = JSON.stringify(ind.values) === JSON.stringify(fresh.values) && JSON.stringify(ind.history ?? null) === JSON.stringify(fresh.history) && String(ind.data_year) === String(fresh.data_year);
    console.log(`${f}: ${same ? 'same as the source' : 'differs from the source'}`);
    if (same) continue;
    differs++;
    if (mode === 'write') {
      doc.set('values', fresh.values);
      if (fresh.history) doc.set('history', fresh.history);
      doc.set('data_year', String(fresh.data_year));
      for (const s of doc.get('sources').items.slice(0, fresh.history ? 2 : 1)) s.set('checked', todayYmd());
      fs.writeFileSync(file, doc.toString());
    }
  }
  for (const n of notes) console.log(`Saved copy used: ${n}`);
  console.log(differs ? `${differs} indicator files ${mode === 'write' ? 'updated' : 'differ from County Health Rankings'}.` : 'All indicators match County Health Rankings.');
  if (mode === 'check' && differs) process.exit(1);
}
