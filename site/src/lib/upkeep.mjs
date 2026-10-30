// The "not being kept up" notice (#497). If nobody has re-checked a listing
// for UPKEEP_NOTICE_DAYS, every page says so and points to 211 and the groups
// themselves. It only adds a warning; nothing else on the site changes.
// The page also checks in the browser, so the notice still turns on if the
// daily rebuild stops too. To turn it off, set UPKEEP_NOTICE_DAYS to 0.
// See docs/sustainability.md.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, ymd, todayYmd } from './content.mjs';

export const UPKEEP_NOTICE_DAYS = 30;

// Every `checked` date in content/ (any record type, hidden or not), plus the
// dates of Corrections entries. The newest one is the last time someone
// looked after the listings.
const FOLDERS_SKIPPED = new Set(['findability', 'schemas']);
function walk(value, out) {
  if (Array.isArray(value)) value.forEach((v) => walk(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (k === 'checked') { const d = ymd(v); if (/^\d{4}-\d{2}-\d{2}$/.test(d ?? '')) out.push(d); } else walk(v, out);
    }
  }
}
let cached;
export function lastUpkeep() {
  if (cached !== undefined) return cached;
  const dates = [];
  for (const dir of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory() || FOLDERS_SKIPPED.has(dir.name)) continue;
    for (const f of fs.readdirSync(path.join(CONTENT_DIR, dir.name)).filter((x) => /\.ya?ml$/.test(x))) {
      let data;
      try { data = YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, dir.name, f), 'utf8')); } catch { continue; }
      walk(data, dates);
      if (dir.name === 'corrections' && data?.date) dates.push(ymd(data.date));
    }
  }
  const today = todayYmd();
  cached = dates.filter((d) => d <= today).sort().pop() ?? null;
  return cached;
}

export function upkeepLapsed(today = todayYmd(), last = lastUpkeep()) {
  if (!UPKEEP_NOTICE_DAYS || !last) return false;
  return (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${last}T12:00:00Z`)) / 86400000 > UPKEEP_NOTICE_DAYS;
}
