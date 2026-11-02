// Tonight's warming shelter status (#401): one file, content/tonight/
// warming-shelter.yaml, updated daily in winter. The rule that matters: never
// say "open" without a same-day check. `fresh` compares the check's date with
// today in Morgantown; the page repeats that test on the phone.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, todayYmd, ymd } from './content.mjs';

export const STATUSES = ['not-announced', 'open', 'closed-tonight', 'season-over'];
const FILE = path.join(CONTENT_DIR, 'tonight', 'warming-shelter.yaml');

export function loadTonight(now = new Date()) {
  const t = YAML.parse(fs.readFileSync(FILE, 'utf8'));
  const checkedDay = String(t.checked ?? '').slice(0, 10);
  return { ...t, checkedDay, fresh: checkedDay === todayYmd(now) };
}

// Problems for check-content. An open shelter needs where, hours and how to
// confirm, because those are what a person needs before they go.
export function tonightProblems(t, now = new Date()) {
  const p = [];
  if (!STATUSES.includes(t.status)) p.push(`status must be one of ${STATUSES.join(', ')}`);
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(String(t.checked ?? ''))) p.push('checked must be a quoted "YYYY-MM-DD HH:MM" in Morgantown time');
  else if (t.checkedDay > todayYmd(now)) p.push('checked is in the future');
  if (t.status === 'open') {
    for (const k of ['where', 'hours', 'confirm_phone']) if (!t[k]) p.push(`an open shelter needs ${k}`);
  }
  if (!Array.isArray(t.sources) || !t.sources.length) p.push('needs at least one source');
  for (const s of t.sources ?? []) {
    if (!/^https?:\/\//.test(s.url ?? '')) p.push('each source needs a web link');
    if (!ymd(s.checked)) p.push('each source needs a checked date');
  }
  if (JSON.stringify(t).includes('—')) p.push('contains an em dash');
  return p;
}
