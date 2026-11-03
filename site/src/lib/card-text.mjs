// Short card text on phones (#1381). A long card field shows its first two
// sentences, plus any sentence with a cost, a deadline, what to bring or
// "call first" (#1393), and the rest goes behind "More details". Nothing is
// reworded or dropped; the words are only split. Text that names a crisis line is never
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

// Sentences that stay in sight even past the fold (#1393): an amount of money,
// a fee or cost, a deadline or last day, what to bring, or "call first".
// "Questions, call ..." is not one: the card's Call button already shows the number.
export const KEY = /\$\s?\d|\b(fees?|costs?|charges?|tuition|deadlines?|last day|due (on|by)|bring|call (first|ahead|before)|before you (go|come|visit))\b/i;
// A sentence that points back ("That is $31,920 for 1 person") keeps the one before it.
const REFERS = /^(?:\S+\s+){0,3}(it|this|that|these|those|they|then)\b/i;

// { short, rest }: rest is '' when the text is short enough or names a crisis line.
// The first two sentences and every KEY sentence stay visible, in their
// original order; the other sentences go behind "More details".
export function foldText(text, { force = false } = {}) {
  const t = (text ?? '').trim();
  if (!t) return { short: '', rest: '' };
  if (!force && (words(t) <= FOLD_WORDS || CRISIS.test(t))) return { short: t, rest: '' };
  const s = sentences(t);
  if (s.length <= KEEP) return { short: t, rest: '' };
  const show = new Set(s.map((_, i) => i).filter((i) => i < KEEP));
  for (let i = s.length - 1; i >= KEEP; i -= 1) {
    if (KEY.test(s[i]) || (show.has(i) && i > 0 && REFERS.test(s[i]))) {
      show.add(i);
      if (REFERS.test(s[i])) show.add(i - 1);
    }
  }
  const rest = s.filter((_, i) => !show.has(i));
  if (!rest.length) return { short: t, rest: '' };
  return { short: s.filter((_, i) => show.has(i)).join(' '), rest: rest.join(' ') };
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
