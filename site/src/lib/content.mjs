// Loads the YAML entries in ../content so pages can render them.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
export const CONTENT_DIR = path.resolve(here, '../../../content');

export function loadDir(name) {
  const dir = path.join(CONTENT_DIR, name);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
    .sort()
    .map((f) => ({ ...YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')), _file: `${name}/${f}` }));
}

// Dates in YAML parse as Date objects or strings; normalize to YYYY-MM-DD.
export function ymd(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

// Today in Eastern time, since that is where the county is.
export function todayYmd(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now);
}

export function loadCalendar() {
  return loadDir('calendar').map((e) => ({
    ...e,
    starts: ymd(e.starts),
    ends: ymd(e.ends) || ymd(e.starts),
    sources: (e.sources || []).map((s) => ({ ...s, checked: ymd(s.checked) })),
  }));
}

// Entries still worth showing: not over yet, and starting within `days`.
export function upcoming(entries, today = todayYmd(), days = 62) {
  const limit = new Date(`${today}T12:00:00Z`);
  limit.setUTCDate(limit.getUTCDate() + days);
  const limitYmd = limit.toISOString().slice(0, 10);
  return entries
    .filter((e) => e.ends >= today && e.starts <= limitYmd)
    .sort((a, b) => (a.starts < b.starts ? -1 : a.starts > b.starts ? 1 : a.title.localeCompare(b.title)));
}

const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export function prettyDate(d) {
  return fmt.format(new Date(`${d}T12:00:00Z`));
}
export function prettyRange(starts, ends) {
  return starts === ends ? prettyDate(starts) : `${prettyDate(starts)} to ${prettyDate(ends)}`;
}
