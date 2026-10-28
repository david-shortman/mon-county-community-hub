// Checks content/ entries before they reach the site. Exits 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { loadCalendar } from '../src/lib/content.mjs';
import { ADAPTERS, SNAPSHOT_DIR, entryProblems } from '../src/lib/feeds/index.mjs';

const errors = [];
const warnings = [];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };
const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const stale = sixMonthsAgo.toISOString().slice(0, 10);

const slugs = new Set();
for (const e of loadCalendar()) {
  const where = e._file;
  for (const f of ['title', 'slug', 'starts', 'org_name', 'who_it_is_for', 'what_to_do', 'url']) {
    if (!e[f]) errors.push(`${where}: missing ${f}`);
  }
  if (slugs.has(e.slug)) errors.push(`${where}: duplicate slug ${e.slug}`);
  slugs.add(e.slug);
  if (!isDate(e.starts)) errors.push(`${where}: starts must be YYYY-MM-DD`);
  if (!isDate(e.ends)) errors.push(`${where}: ends must be YYYY-MM-DD`);
  if (e.ends < e.starts) errors.push(`${where}: ends is before starts`);
  const isTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t ?? '');
  if (e.start_time != null && !isTime(e.start_time)) errors.push(`${where}: start_time must be quoted 24-hour HH:MM`);
  if (e.end_time != null && !isTime(e.end_time)) errors.push(`${where}: end_time must be quoted 24-hour HH:MM`);
  if (e.end_time && !e.start_time) errors.push(`${where}: end_time needs start_time`);
  if (e.start_time && e.ends !== e.starts) errors.push(`${where}: times are only for single-day entries`);
  if (e.start_time && e.end_time && e.end_time <= e.start_time) errors.push(`${where}: end_time must be after start_time`);
  if (e.url && !isUrl(e.url)) errors.push(`${where}: url is not a web link`);
  if (!e.sources?.length) errors.push(`${where}: needs at least one source`);
  for (const s of e.sources ?? []) {
    if (!isUrl(s.url)) errors.push(`${where}: source url is not a web link`);
    if (!isDate(s.checked)) errors.push(`${where}: source needs a checked date (YYYY-MM-DD)`);
    else if (s.checked < stale) warnings.push(`${where}: source last checked ${s.checked}, re-verify`);
  }
  if (JSON.stringify(e).includes('\u2014')) errors.push(`${where}: contains an em dash`);
}

// Saved feed snapshots are committed too, so check them the same way.
let feedCount = 0;
for (const a of ADAPTERS) {
  const file = path.join(SNAPSHOT_DIR, `${a.id}.json`);
  if (!fs.existsSync(file)) { warnings.push(`feeds/${a.id}: no saved snapshot yet (run npm run update-feeds)`); continue; }
  let snap;
  try { snap = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { errors.push(`feeds/${a.id}: snapshot is not valid JSON`); continue; }
  if (!snap.fetched || Number.isNaN(Date.parse(snap.fetched))) errors.push(`feeds/${a.id}: snapshot needs a fetched time`);
  for (const e of snap.entries ?? []) {
    feedCount++;
    for (const p of entryProblems(e)) errors.push(`feeds/${a.id}: ${e.slug ?? e.title}: ${p}`);
    if (e.url && !isUrl(e.url)) errors.push(`feeds/${a.id}: ${e.slug}: url is not a web link`);
  }
}

for (const w of warnings) console.warn(`warning: ${w}`);
for (const e of errors) console.error(`error: ${e}`);
console.log(`Checked ${slugs.size} calendar entries and ${feedCount} saved feed entries: ${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
