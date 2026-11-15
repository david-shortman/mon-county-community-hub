// Tonight's warming shelter status (#401): one file, content/tonight/
// warming-shelter.yaml, updated daily in winter. /tonight/ and the warming
// shelter box on /stay-tonight/ both read it, so one refresh updates both
// pages and their checked date (#219). The rule that matters: never
// say "open" without a same-day check. `fresh` compares the check's date with
// today in Morgantown; the page repeats that test on the phone.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, todayYmd, ymd, prettyDate } from './content.mjs';

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

// "November 14, 2026 at 10:40 p.m.", from `checked` ("YYYY-MM-DD HH:MM").
export function checkedWhen(t) {
  const [h, m] = String(t.checked ?? '').slice(11).split(':').map(Number);
  const clock = h === 12 && m === 0 ? 'noon' : `${((h + 11) % 12) + 1}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
  return `${prettyDate(t.checkedDay)} at ${clock}`;
}

// Winter freshness (#219, #863): from November 1 to March 31 the status must
// be re-read at least every 7 days, the window for shelter details in
// docs/playbook/freshness-by-fact.md. Outside winter, or once the season is
// over, there is nothing to warn about.
export const WINTER_MAX_DAYS = 7;
export const inWinter = (day) => { const m = Number(String(day).slice(5, 7)); return m >= 11 || m <= 3; };
const dayNumber = (day) => Date.UTC(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10))) / 86_400_000;

export function tonightStaleness(t, now = new Date()) {
  const today = todayYmd(now);
  if (!inWinter(today) || t.status === 'season-over' || !ymd(t.checkedDay)) return null;
  const age = dayNumber(today) - dayNumber(t.checkedDay);
  if (age <= WINTER_MAX_DAYS) return null;
  return `last checked ${t.checkedDay}, ${age} days ago. From November to March, re-read a source and update it at least every ${WINTER_MAX_DAYS} days (#219, #863). /tonight/ and /stay-tonight/ both show it.`;
}
