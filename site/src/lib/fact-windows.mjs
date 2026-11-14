// Re-check windows by kind of fact (#1093, docs/playbook/freshness-by-fact.md).
// content/recheck-windows.yaml says how long each kind of fact stays fresh.
// A listing's window is the shortest among the facts it states, capped by its
// risk tier (recheckDaysFor). A report only: cards still use staleDaysFor().
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, recheckDaysFor, oldestChecked, isStale, todayYmd, ymd } from './content.mjs';

export function loadWindows(file = path.join(CONTENT_DIR, 'recheck-windows.yaml')) {
  return YAML.parse(fs.readFileSync(file, 'utf8')) || {};
}

const get = (r, dotted) => dotted.split('.').reduce((v, k) => (v == null ? v : v[k]), r);
const has = (v) => v != null && v !== '' && !(Array.isArray(v) && !v.length);

// The fact kinds a record states, with their windows.
export function factKinds(r, windows) {
  return (windows.kinds ?? []).filter((k) => k.fields.some((f) => has(get(r, f))));
}

// { days, because } for a record: the shortest window, never above its tier.
export function factWindow(r, windows) {
  const tier = recheckDaysFor(r);
  let days = tier;
  let because = 'its risk tier';
  for (const k of factKinds(r, windows)) if (k.days < days) { days = k.days; because = k.kind; }
  return { days, because };
}

const addDays = (d, n) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

// Why a record is past its fact window today, or null.
export function factLate(r, windows, today = todayYmd()) {
  const c = oldestChecked((r?.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) })));
  if (!c) return null;
  const up = windows.upcoming_event;
  const starts = ymd(r?.starts);
  if (up && starts && starts >= today && starts <= addDays(today, up.within_days) && isStale(c, today, up.checked_within_days)) {
    return { checked: c, days: up.checked_within_days, because: `starts ${starts}, within ${up.within_days} days` };
  }
  const w = factWindow(r, windows);
  return isStale(c, today, w.days) ? { checked: c, days: w.days, because: w.because } : null;
}

// Problems with the windows file, for check-content.
export function windowProblems(windows) {
  const out = [];
  for (const k of windows.kinds ?? []) {
    if (!k.kind || !Array.isArray(k.fields) || !k.fields.length) out.push('recheck-windows.yaml: each kind needs kind and fields');
    if (!Number.isInteger(k.days) || k.days < 1 || k.days > 365) out.push(`recheck-windows.yaml: ${k.kind}: days must be a whole number from 1 to 365`);
  }
  const up = windows.upcoming_event;
  if (up && (!Number.isInteger(up.within_days) || !Number.isInteger(up.checked_within_days))) out.push('recheck-windows.yaml: upcoming_event needs whole numbers');
  return out;
}
