// The rules for what is high stakes: what residents see about shelter, crisis
// help, food and benefits. A PR that changes any of it waits for David
// (docs/COORDINATION.md, "When a PR waits for David"). The High stakes check
// (site/scripts/high-stakes.mjs) and the translation check
// (site/scripts/check-translations.mjs) both use these rules.
import YAML from 'yaml';
import { OTHER_LOCALES, englishRoute, pageFilesFor, parseTranslationPath, englishFilesFor, RECORD_KINDS } from '../src/lib/i18n.mjs';

// Pages and parts that show shelter, crisis help, food or benefits. Any page
// file also counts if it is in the Help now or Get through this month door, has
// one of TOPICS, or names a crisis line (see pageHit below).
export const PAGES = [
  'site/src/pages/help/food/',
  'site/src/components/CrisisStrip.astro',
  'site/src/components/CrisisLine.astro',
];
export const DOORS = ['help-now', 'this-month'];
// Entries with these topics feed those pages.
export const TOPICS = ['housing', 'money', 'food'];
// Crisis lines, matched in an entry's text.
const CRISIS = /\b(988|211|911)\b|crisis/i;
// Other crisis numbers the site uses, and the slugs of the records that hold
// crisis lines, so code that pulls one in by slug counts too (#776): 211's
// text line, the Veterans Crisis Line's text line, the RDVIC 24-hour hotline,
// and the VA line for homeless veterans.
const CRISIS_MORE = /\b(898-211|838255|304-292-5100|877-424-3838)\b|\b(988-lifeline|veterans-crisis-line|wv-211|rdvic-hotline|va-homeless-veterans-line)\b/;
export const mentionsCrisis = (text) => CRISIS.test(text) || CRISIS_MORE.test(text);
// Records that feed listings. Places (content/places, schema v2) say what
// they are about in `interests` (for example a free meal has `food`), so both
// `topics` and `interests` are read.
export const CONTENT = new RegExp(`^content/(${RECORD_KINDS.join('|')})/[^/]+\\.ya?ml$`);

// Why a record file is high stakes, or null: a topic or interest in TOPICS,
// or a crisis line in its text.
export function contentHit(text) {
  let data = null;
  try { data = YAML.parse(text); } catch { /* bad YAML is check-content's job */ }
  const tags = [].concat(data?.topics ?? [], data?.interests ?? []);
  const hit = tags.find((t) => TOPICS.includes(t));
  if (hit) return `topic ${hit}`;
  if (mentionsCrisis(text)) return 'mentions a crisis line';
  return null;
}

// A page file's path with any language folder taken out, so
// 'site/src/pages/es/help/food/index.astro' follows the same rules as
// 'site/src/pages/help/food/index.astro'. So does a template for the router,
// 'site/src/pages/es/_pages/help/food/index.astro' (#1099).
export function withoutLocale(file) {
  const m = file.match(/^site\/src\/pages\/([a-z]{2,3})\/(?:_pages\/)?(.*)$/);
  return m && OTHER_LOCALES.includes(m[1]) ? `site/src/pages/${m[2]}` : file;
}

// The English page file for a page in a language folder, as candidates.
export function englishPageFiles(file) {
  const route = withoutLocale(file).replace(/^site\/src\/pages/, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '/');
  return pageFilesFor(englishRoute(route));
}

// Why a page or part file is high stakes, or null. `text` is the file.
export function pageHit(file, text) {
  const plain = withoutLocale(file);
  if (PAGES.some((p) => (p.endsWith('/') ? plain.startsWith(p) : plain === p))) return 'a shelter, crisis, food or benefits page';
  const door = text.match(/door:\s*["']([a-z-]+)["']/)?.[1];
  const topic = text.match(/topic:\s*["']([a-z-]+)["']/)?.[1];
  if (DOORS.includes(door)) return `in the ${door} door`;
  if (TOPICS.includes(topic)) return `page topic ${topic}`;
  if (mentionsCrisis(text)) return 'names a crisis line';
  return null;
}

// Why a translation file is high stakes, or null. `read(file)` returns a
// repo file's text, or '' if it is missing. A translation counts when its
// English source does, or when the translation itself names a crisis line.
export function translationHit(file, text, read) {
  const t = parseTranslationPath(file);
  if (!t) return null;
  const candidates = englishFilesFor(t.of);
  const source = candidates.find((f) => read(f));
  const english = source ? read(source) : '';
  let why = null;
  if (RECORD_KINDS.includes(t.kind)) why = english ? contentHit(english) : null;
  else if (t.kind === 'pages' || t.kind === 'parts') why = pageHit(source ?? candidates[0] ?? file, english);
  if (why) return `a translation of ${t.of} (${why})`;
  if (mentionsCrisis(text)) return 'a translation that mentions a crisis line';
  return null;
}

// The lines a diff adds or removes, without the file headers.
export function changedLines(diff) {
  return diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l)).map((l) => l.slice(1));
}

// The flag that turns a language on for residents (site/src/lib/i18n.mjs).
// `diff` is that file's diff. True when the value of PUBLISHED or
// ALLOW_MACHINE_DRAFTS changes; a new file with the defaults does not count.
export const I18N_FILE = 'site/src/lib/i18n.mjs';
const FLAGS = { PUBLISHED: '[]', ALLOW_MACHINE_DRAFTS: 'false' };
export function flipsLanguage(diff) {
  const lines = diff.split('\n').filter((l) => !/^(\+\+\+|---) /.test(l));
  const value = (sign, name) => {
    const line = lines.find((l) => l.startsWith(sign) && new RegExp(`\\b${name}\\s*=`).test(l));
    return line ? line.split('=').slice(1).join('=').replace(/;.*$/, '').replace(/\s+/g, '') : null;
  };
  return Object.entries(FLAGS).some(([name, dflt]) => {
    const before = value('-', name);
    const after = value('+', name);
    if (before === null && after === null) return false;
    return (before ?? dflt) !== (after ?? dflt);
  });
}
