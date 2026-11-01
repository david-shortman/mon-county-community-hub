// Lists the high-stakes files a pull request changes: what residents see about
// shelter, crisis help, food and benefits. A PR that changes any of them waits
// for David (docs/COORDINATION.md, "When a PR waits for David").
// Usage: node scripts/high-stakes.mjs <base-ref>   (run from site/)
//        node scripts/high-stakes.mjs --self-test (also run by npm run check-content)
// Prints one line per file with the reason. Exit code is always 0.
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
// The rules themselves live in scripts/high-stakes-rules.mjs, so the
// translation check can use them too (#1083).
import { PAGES, CONTENT, contentHit, mentionsCrisis, changedLines, pageHit, translationHit, englishPageFiles, withoutLocale, I18N_FILE, flipsLanguage } from './high-stakes-rules.mjs';
import { parseTranslationPath } from '../src/lib/i18n.mjs';

// Other files residents see through the site: code under site/src (lib,
// components, layouts, data) and other content folders (doors, places...).
// For these only the changed lines are read, so a small edit to a shared
// component that already shows 911 does not wait for David, but adding or
// changing a crisis line anywhere does.
const OTHER = /^(site\/src\/|content\/)/;

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
  // Translations (#1083): a translation counts when its English source does.
  const files = {
    'content/resources/rent-help.yaml': 'title: Rent help\ntopics: [housing]\n',
    'content/resources/book-club.yaml': 'title: Book club\ntopics: [arts]\n',
    'site/src/pages/help-in-your-language.astro': "export const page = { door: 'new-here', label: 'Help in your language' };\n<p>Ask for an interpreter.</p>",
    'site/src/pages/help/food/index.astro': '<p>Food</p>',
    'site/src/components/CrisisStrip.astro': '<p>Call or text 988</p>',
  };
  const readFake = (f) => files[f] ?? '';
  expect(translationHit('content/translations/es/resources/rent-help.yaml', 'fields: {}', readFake)?.includes('topic housing'), 'a translation of a housing record should count');
  expect(translationHit('content/translations/es/resources/book-club.yaml', 'fields:\n  title: Club de lectura\n', readFake) === null, 'a translation of a book club should not count');
  expect(translationHit('content/translations/es/resources/book-club.yaml', 'fields:\n  title: Llame al 988\n', readFake)?.includes('crisis'), 'a translation that adds 988 should count');
  expect(translationHit('content/translations/es/parts/CrisisStrip.yaml', 'strings: {}', readFake)?.includes('parts/CrisisStrip'), 'a translation of the crisis strip should count');
  expect(translationHit('content/translations/es/pages/help/food.yaml', 'strings: {}', readFake)?.includes('pages/help/food'), 'a translation of a food page should count');
  expect(translationHit('content/translations/es/pages/help-in-your-language.yaml', 'strings: {}', readFake) === null, 'a translation of a low-stakes page should not count');
  expect(translationHit('content/resources/rent-help.yaml', '', readFake) === null, 'an English record is not a translation');
  expect(pageHit('site/src/pages/es/help/food/index.astro', '<p>Comida</p>'), 'a Spanish food page should count like the English one');
  expect(withoutLocale('site/src/pages/es/money.astro') === 'site/src/pages/money.astro', 'withoutLocale should drop the language folder');
  expect(withoutLocale('site/src/pages/events/x.astro') === 'site/src/pages/events/x.astro', 'withoutLocale should leave other folders alone');
  expect(englishPageFiles('site/src/pages/es/money.astro').includes('site/src/pages/money.astro'), 'a Spanish page should map to its English page');
  expect(englishPageFiles('site/src/pages/es/help/food/index.astro').includes('site/src/pages/help/food/index.astro'), 'a Spanish index page should map to its English page');
  expect(withoutLocale('site/src/pages/es/_pages/help/food/index.astro') === 'site/src/pages/help/food/index.astro', 'a Spanish template should follow its English page');
  expect(englishPageFiles('site/src/pages/es/_pages/money.astro').includes('site/src/pages/money.astro'), 'a Spanish template should map to its English page');
  expect(flipsLanguage("-export const PUBLISHED = [];\n+export const PUBLISHED = ['es'];"), 'turning a language on should count');
  expect(flipsLanguage("-export const PUBLISHED = ['es'];\n+export const PUBLISHED = [];"), 'turning a language off should count');
  expect(flipsLanguage('-export const ALLOW_MACHINE_DRAFTS = false;\n+export const ALLOW_MACHINE_DRAFTS = true;'), 'allowing machine drafts should count');
  expect(!flipsLanguage('+export const PUBLISHED = [];\n+export const ALLOW_MACHINE_DRAFTS = false;'), 'a new i18n.mjs with the defaults should not count');
  expect(!flipsLanguage('-// old comment\n+// a comment about languages'), 'other edits to i18n.mjs should not count');
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

const diffLines = (file) => changedLines(git('diff', '-U0', `${base}...HEAD`, '--', file));

for (const file of changed) {
  // Turning a language on, or allowing machine drafts, changes what
  // residents see (#1067), so it waits for David.
  if (file === I18N_FILE && flipsLanguage(git('diff', '-U0', `${base}...HEAD`, '--', file))) { console.log(`${file}: turns a language or machine drafts on or off`); continue; }
  // A translation file counts when its English source does (#1083).
  if (parseTranslationPath(file)) {
    const why = translationHit(file, read(file), read);
    if (why) console.log(`${file}: ${why}`);
    continue;
  }
  // Listed pages and parts (the food pages, the crisis strip), in any language.
  const plain = withoutLocale(file);
  if (PAGES.some((p) => (p.endsWith('/') ? plain.startsWith(p) : plain === p))) { console.log(`${file}: a shelter, crisis, food or benefits page`); continue; }
  if (/^site\/src\/pages\/.+\.astro$/.test(file)) {
    // A page in a language folder also follows the rules of its English page.
    const english = plain !== file ? englishPageFiles(file).map((f) => [f, read(f)]).find(([, t]) => t) : null;
    const why = pageHit(file, read(file)) ?? (english ? pageHit(english[0], english[1]) : null);
    if (why) console.log(`${file}: ${why}`);
    continue;
  }
  if (!CONTENT.test(file)) {
    if (OTHER.test(file) && mentionsCrisis(diffLines(file).join('\n'))) console.log(`${file}: changes a line that names a crisis line`);
    continue;
  }
  if (onlyHides(file)) continue;
  const why = contentHit(read(file));
  if (why) console.log(`${file}: ${why}`);
}
