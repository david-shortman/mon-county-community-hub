// Short card text on phones (#1381). A long card field shows its first two
// sentences, and the rest goes behind "More details". Nothing is reworded or
// dropped; the words are only split. Text that names a crisis line is never
// folded, so safety lines always show.

export const FOLD_WORDS = 60; // a field longer than this gets folded
const KEEP = 2; // sentences that stay visible
const CRISIS = /\b(988|211|911)\b|crisis/i;

// Words that end with a period but do not end a sentence.
const ABBR = /(?:\b(?:a\.m|p\.m|St|Ave|Dr|Rd|Rt|Mt|Jr|Sr|Mr|Mrs|Ms|No|Inc|Co|U\.S|e\.g|i\.e|etc|vs|approx|Dept|Ext|ext|Hwy|Blvd|Ln|Ct|Ft|Univ))\.$/;

const words = (s) => (s ?? '').split(/\s+/).filter(Boolean).length;

export function sentences(text) {
  const parts = [];
  let buf = '';
  for (const tok of (text ?? '').split(/(\s+)/)) {
    buf += tok;
    if (/[.!?]["')]?$/.test(tok) && !ABBR.test(tok.replace(/["')]$/, ''))) {
      parts.push(buf.trim());
      buf = '';
    }
  }
  if (buf.trim()) parts.push(buf.trim());
  return parts;
}

// { short, rest }: rest is '' when the text is short enough or names a crisis line.
export function foldText(text, { force = false } = {}) {
  const t = (text ?? '').trim();
  if (!t) return { short: '', rest: '' };
  if (!force && (words(t) <= FOLD_WORDS || CRISIS.test(t))) return { short: t, rest: '' };
  const s = sentences(t);
  if (s.length <= KEEP) return { short: t, rest: '' };
  return { short: s.slice(0, KEEP).join(' '), rest: s.slice(KEEP).join(' ') };
}

export const longFields = (r, limit = FOLD_WORDS) =>
  ['who_it_is_for', 'what_to_do'].filter((k) => words(r?.[k]) > limit).map((k) => ({ field: k, words: words(r[k]) }));

// Lists and notes fold together when they run long (options are choices and
// notes are exceptions, so the actions in steps stay visible). Crisis text stays open.
export function foldExtras(r) {
  const extra = [...(r?.options ?? []), ...(r?.notes ?? [])];
  const text = extra.join(' ');
  return extra.length > 0 && words(text) > FOLD_WORDS && !CRISIS.test(text);
}

// "Passes: buy them..." -> { label: 'Passes', text: 'buy them...' } when the
// part before the first colon is a short label (1 to 5 words).
export function labelPart(item) {
  const m = /^([^:]{1,40}):\s+(.+)$/s.exec(item ?? '');
  if (!m || words(m[1]) > 5 || /\d:\d/.test(item.slice(0, m[1].length + 2))) return { label: '', text: item };
  return { label: m[1], text: m[2] };
}
