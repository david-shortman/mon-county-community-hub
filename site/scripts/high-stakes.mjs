// Lists the high-stakes files a pull request changes: what residents see about
// shelter, crisis help, food and benefits. A PR that changes any of them waits
// for David (docs/COORDINATION.md, "When a PR waits for David").
// Usage: node scripts/high-stakes.mjs <base-ref>   (run from site/)
//        node scripts/high-stakes.mjs --self-test (also run by npm run check-content)
// Prints one line per file with the reason. Exit code is always 0.
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';

// Pages and parts that show shelter, crisis help, food or benefits. Any page
// file also counts if it is in the Help now or Get through this month door, has
// one of TOPICS, or names a crisis line (see pageHit below).
const PAGES = [
  'site/src/pages/help/food/',
  'site/src/components/CrisisStrip.astro',
  'site/src/components/CrisisLine.astro',
];
const DOORS = ['help-now', 'this-month'];
// Entries with these topics feed those pages.
const TOPICS = ['housing', 'money', 'food'];
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
const CONTENT = /^content\/(resources|orgs|calendar|places)\/[^/]+\.ya?ml$/;

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
// Other files residents see through the site: code under site/src (lib,
// components, layouts, data) and other content folders (doors, places...).
// For these only the changed lines are read, so a small edit to a shared
// component that already shows 911 does not wait for David, but adding or
// changing a crisis line anywhere does.
const OTHER = /^(site\/src\/|content\/)/;

// The lines a diff adds or removes, without the file headers.
export function changedLines(diff) {
  return diff.split('\n').filter((l) => /^[+-]/.test(l) && !/^(\+\+\+|---) /.test(l)).map((l) => l.slice(1));
}

// node scripts/high-stakes.mjs --self-test: checks the rules above on samples.
if (process.argv[2] === '--self-test') {
  const fails = [];
  const expect = (cond, msg) => { if (!cond) fails.push(msg); };
  expect(mentionsCrisis("{ resource: 'wv-211', text: 'Call 211.' }"), 'a 211 step in a lib file should count');
  expect(mentionsCrisis("{ resource: '988-lifeline' }"), 'a crisis record slug should count');
  expect(mentionsCrisis('Text 838255'), "the Veterans Crisis Line's text line should count");
  expect(mentionsCrisis('Call 304-292-5100'), 'the RDVIC hotline should count');
  expect(!mentionsCrisis('Call 304-296-8356 to book a pavilion.'), 'an ordinary phone number should not count');
  expect(!mentionsCrisis('Seats 2110 people'), 'a longer number that contains 211 should not count');
  const diff = ['diff --git a/x b/x', '--- a/site/src/lib/x.mjs', '+++ b/site/src/lib/x.mjs', '@@ -1 +1 @@', '-const a = 1;', "+const b = 'Call 911';", ' unchanged 988 line'].join('\n');
  const lines = changedLines(diff);
  expect(lines.length === 2, 'changedLines should keep only added and removed lines');
  expect(mentionsCrisis(lines.join('\n')), 'an added 911 line should count');
  expect(!mentionsCrisis(changedLines(diff.replace("'Call 911'", "'hi'")).join('\n')), 'an unchanged crisis line should not count');
  expect(contentHit('name: Free lunch\nkind: group\ninterests: [food, social]\n') === 'topic food', 'a place with the food interest should count');
  expect(contentHit('title: Rent help\ntopics: [housing]\n') === 'topic housing', 'a record with the housing topic should count');
  expect(contentHit('name: Hall\nkind: fire-hall\nnotes:\n  - In an emergency, call 911.\n') === 'mentions a crisis line', 'a place that names 911 should count');
  expect(contentHit('name: Book club\nkind: group\ninterests: [books, social]\n') === null, 'a book club should not count');
  expect(CONTENT.test('content/places/smithtown.yaml'), 'content/places files should be read as records');
  if (fails.length) { console.error(`high-stakes self-test failed:\n- ${fails.join('\n- ')}`); process.exit(1); }
  console.log('high-stakes self-test passed.');
  process.exit(0);
}

const base = process.argv[2] || 'origin/main';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', cwd: '..', stdio: ['ignore', 'pipe', 'ignore'] });
const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);

// Read a file as it is on this branch, or as it was on the base if it was deleted.
const read = (file) => {
  for (const ref of ['HEAD', base]) {
    try { return git('show', `${ref}:${file}`); } catch { /* not on this ref */ }
  }
  return '';
};

// Hiding an item is not deleting it (#519, #520): a content file whose only
// change is adding or editing its `hidden` block does not wait for David.
// Un-hiding does, since the facts come back on the site.
const forkPoint = (() => { try { return git('merge-base', base, 'HEAD').trim(); } catch { return base; } })();
const showAt = (ref, file) => { try { return git('show', `${ref}:${file}`); } catch { return null; } };
const withoutHidden = ({ hidden, ...rest }) => JSON.stringify(rest);
function onlyHides(file) {
  try {
    const before = YAML.parse(showAt(forkPoint, file) ?? '');
    const after = YAML.parse(showAt('HEAD', file) ?? '');
    return Boolean(before && after?.hidden) && withoutHidden(before) === withoutHidden(after);
  } catch { return false; }
}

for (const file of changed) {
  const page = PAGES.find((p) => (p.endsWith('/') ? file.startsWith(p) : file === p));
  if (page) { console.log(`${file}: a shelter, crisis, food or benefits page`); continue; }
  if (/^site\/src\/pages\/.+\.astro$/.test(file)) {
    const text = read(file);
    const door = text.match(/door:\s*["']([a-z-]+)["']/)?.[1];
    const topic = text.match(/topic:\s*["']([a-z-]+)["']/)?.[1];
    if (DOORS.includes(door)) console.log(`${file}: in the ${door} door`);
    else if (TOPICS.includes(topic)) console.log(`${file}: page topic ${topic}`);
    else if (mentionsCrisis(text)) console.log(`${file}: names a crisis line`);
    continue;
  }
  if (!CONTENT.test(file)) {
    if (OTHER.test(file) && mentionsCrisis(changedLines(git('diff', '-U0', `${base}...HEAD`, '--', file)).join('\n'))) console.log(`${file}: changes a line that names a crisis line`);
    continue;
  }
  if (onlyHides(file)) continue;
  const why = contentHit(read(file));
  if (why) console.log(`${file}: ${why}`);
}
