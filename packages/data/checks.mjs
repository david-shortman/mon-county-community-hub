// Shared checks for content/ records (#69). site/scripts/check-content.mjs
// runs these on every record; any other tool that writes records (a feed
// importer, a later app) can run the same ones before it saves.
// Each check returns plain messages; the caller adds the file name.
import { HIDDEN_REASONS, todayYmd, ymd } from './index.mjs';

export const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
export const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };

// 211 and 988 show on every page, so the site cannot build without them. If
// one looks wrong, fix it from the line's own page the same day instead.
export const NEVER_HIDE = ['resources/wv-211.yaml', 'resources/988-lifeline.yaml'];
export const HIDDEN_FIELDS = ['reason', 'since', 'note'];

// Problems with a record's `hidden` block (#519). Hidden records are checked
// like any other, so taking the block off puts back a record that is valid.
export function hiddenProblems(e, today = todayYmd()) {
  const errors = [];
  const warnings = [];
  if (e?.hidden == null) return { errors, warnings };
  const h = e.hidden;
  if (NEVER_HIDE.includes(e._file)) errors.push('this line shows on every page and cannot be hidden; fix it from its own page instead');
  if (typeof h !== 'object' || Array.isArray(h)) {
    errors.push('hidden needs reason and since under it (see content/README.md)');
    return { errors, warnings };
  }
  if (!HIDDEN_REASONS.includes(h.reason)) errors.push(`hidden.reason must be one of ${HIDDEN_REASONS.join(', ')}`);
  const since = ymd(h.since);
  if (!isDate(since)) errors.push('hidden.since must be a date (YYYY-MM-DD)');
  else if (since > today) errors.push(`hidden.since ${since} is in the future`);
  if (h.note != null && typeof h.note !== 'string') errors.push('hidden.note must be text');
  for (const k of Object.keys(h)) if (!HIDDEN_FIELDS.includes(k)) warnings.push(`unknown hidden field ${k}`);
  return { errors, warnings };
}
