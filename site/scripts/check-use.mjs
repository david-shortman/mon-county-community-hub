// Checks content/use/visits.yaml, the page views David copies by hand from
// the visit counter (Level 2: Use, #1432). Exits 1 on any error.
//
// Rules: aggregate counts only, any count from 1 to 9 is written as
// "fewer than 10" (docs/measurement-plans/README.md, "Small counts"), and
// every period has a start, an end and the day it was read.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const here = path.dirname(new URL(import.meta.url).pathname);
export const USE_FILE = path.join(here, '../../content/use/visits.yaml');
export const FEWER = 'fewer than 10';

const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '') && !Number.isNaN(Date.parse(d));
const ymd = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : d);

// A count is 0, a whole number of 10 or more, or "fewer than 10".
function countError(v) {
  if (v === FEWER) return null;
  if (!Number.isInteger(v) || v < 0) return `must be a whole number or "${FEWER}"`;
  if (v >= 1 && v <= 9) return `is under 10: write "${FEWER}" instead`;
  return null;
}

export function checkUse(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') return ['the file is empty or not YAML'];
  if (!Array.isArray(doc.periods)) return ['`periods` must be a list (use [] when there are none yet)'];
  let lastEnd = '';
  doc.periods.forEach((p, i) => {
    const at = `periods[${i}]`;
    const start = ymd(p?.start), end = ymd(p?.end), read = ymd(p?.read);
    for (const [k, v] of [['start', start], ['end', end], ['read', read]]) if (!isDate(v)) errors.push(`${at}.${k} must be a date like 2026-11-30`);
    if (isDate(start) && isDate(end) && start > end) errors.push(`${at}: start is after end`);
    if (isDate(end) && isDate(read) && read < end) errors.push(`${at}: read is before the period ended`);
    if (isDate(start) && lastEnd && start <= lastEnd) errors.push(`${at}: overlaps the period before it (list periods oldest first)`);
    if (isDate(end)) lastEnd = end;
    const e = countError(p?.total);
    if (e) errors.push(`${at}.total ${e}`);
    if (p?.pages != null) {
      if (typeof p.pages !== 'object' || Array.isArray(p.pages)) errors.push(`${at}.pages must map a site path to a count`);
      else for (const [route, v] of Object.entries(p.pages)) {
        if (!/^\/([a-z0-9-]+\/)*$/.test(route)) errors.push(`${at}.pages: "${route}" must be a site path like /help/food/`);
        const ce = countError(v);
        if (ce) errors.push(`${at}.pages["${route}"] ${ce}`);
      }
    }
    const extra = Object.keys(p ?? {}).filter((k) => !['start', 'end', 'read', 'total', 'pages'].includes(k));
    if (extra.length) errors.push(`${at}: unknown field ${extra.join(', ')} (only aggregate page views go here)`);
  });
  return errors;
}

export function loadUse(file = USE_FILE) {
  return YAML.parse(fs.readFileSync(file, 'utf8'));
}

// The newest period, with dates as strings, or null.
export function latestUse(doc) {
  const p = doc?.periods?.at(-1);
  if (!p) return null;
  return { ...p, start: ymd(p.start), end: ymd(p.end), read: ymd(p.read) };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function plainDate(d) {
  const [y, m, day] = d.split('-').map(Number);
  return `${MONTHS[m - 1]} ${day}, ${y}`;
}

// One line for the scorecard: the number, and the caveat the counting rules ask for.
export function useLine(p) {
  if (!p) return null;
  const n = p.total === FEWER ? FEWER : p.total.toLocaleString('en-US');
  const caveat = p.total === FEWER || p.total < 100 ? '; small numbers, so this could be chance' : '';
  return {
    ours: p.total === FEWER ? null : p.total,
    shown: `${n} page views`,
    note: `${plainDate(p.start)} to ${plainDate(p.end)}, copied by hand from the visit counter${caveat}; a floor, since ad blockers are not counted`,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const errors = checkUse(loadUse());
  if (errors.length) {
    console.error(`content/use/visits.yaml: ${errors.length} problem${errors.length === 1 ? '' : 's'}`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log('content/use/visits.yaml ok');
}
