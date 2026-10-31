// Tests for the languages groundwork (#1083): routes, hreflang, the
// language switcher's links, translation files and the staleness rules.
// Each test builds a small fake repo in a temp folder, so real content
// never changes the results. Run with `npm test` in site/.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PUBLISHED, localeOfPath, englishRoute, localeRoute, alternatesFor, switcherLinks, dirFor, astroI18n, sitemapI18n, inUnpublishedLocale, parseTranslationPath, englishFilesFor } from '../src/lib/i18n.mjs';
import { englishHash, pageText, numbersIn, readTranslation, translationProblems, translationState, loadTranslation, translatedField } from '../src/lib/translations.mjs';
import { checkTranslations } from '../scripts/check-translations.mjs';

function fakeRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-'));
  for (const [f, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true });
    fs.writeFileSync(path.join(root, f), text);
  }
  return root;
}

const BOOK_CLUB = 'title: Book club\nslug: book-club\ntopics: [arts]\nwho_it_is_for: Anyone who likes books.\nwhat_to_do: Come to the library at 6 p.m. Call 304-555-0100.\ncontact:\n  phone: "304-555-0100"\n';
const RENT = 'title: Rent help\nslug: rent-help\ntopics: [housing]\nwho_it_is_for: People behind on rent.\n';
const bookHash = englishHash('resources', BOOK_CLUB, ['title', 'what_to_do']);
const good = (extra = '') => `of: resources/book-club\nlang: es\nfields:\n  title: Club de lectura\n  what_to_do: Venga a la biblioteca. Llame al 304-555-0100.\nenglish_hash: ${bookHash}\nmethod: community-reviewed\ntranslated: 2026-11-10\nreviewed: 2026-11-12\nreviewer: es-reviewer-1\n${extra}`;

test('nothing is turned on yet, so residents see English only', () => {
  assert.deepEqual(PUBLISHED, []);
  assert.deepEqual(astroI18n().locales, ['en']);
  assert.equal(sitemapI18n(), undefined);
});

test('English URLs never change; other languages get a prefix', () => {
  assert.equal(localeOfPath('/es/help/food/'), 'es');
  assert.equal(localeOfPath('/help/food/'), 'en');
  assert.equal(localeOfPath('/estate-sales/'), 'en');
  assert.equal(englishRoute('/es/help/food/'), '/help/food/');
  assert.equal(englishRoute('/es'), '/');
  assert.equal(localeRoute('es', '/help/food/'), '/es/help/food/');
  assert.equal(localeRoute('en', '/es/help/food/'), '/help/food/');
  assert.equal(dirFor('en'), undefined);
});

test('hreflang links only appear when a page exists in a published language', () => {
  const root = fakeRepo({ 'site/src/pages/help-in-your-language.astro': '', 'site/src/pages/es/help-in-your-language.astro': '', 'site/src/pages/money.astro': '' });
  const site = 'https://everythingmorgantown.org';
  assert.deepEqual(alternatesFor('/help-in-your-language/', { site, root, published: [] }), []);
  assert.deepEqual(alternatesFor('/money/', { site, root, published: ['es'] }), []);
  const alt = alternatesFor('/es/help-in-your-language/', { site, root, published: ['es'] });
  assert.deepEqual(alt.map((a) => [a.hreflang, a.href]), [
    ['en', `${site}/help-in-your-language/`],
    ['es', `${site}/es/help-in-your-language/`],
    ['x-default', `${site}/help-in-your-language/`],
  ]);
  assert.deepEqual(switcherLinks('en', alt), [{ lang: 'es', href: `${site}/es/help-in-your-language/`, label: 'Español' }]);
  assert.deepEqual(switcherLinks('es', alt).map((l) => l.label), ['English']);
  assert.deepEqual(switcherLinks('en', []), []);
});

test('the sitemap leaves out pages in languages that are off', () => {
  assert.equal(inUnpublishedLocale('https://everythingmorgantown.org/es/x/', []), true);
  assert.equal(inUnpublishedLocale('https://everythingmorgantown.org/es/x/', ['es']), false);
  assert.equal(inUnpublishedLocale('https://everythingmorgantown.org/money/', []), false);
  assert.deepEqual(sitemapI18n(['es']), { defaultLocale: 'en', locales: { en: 'en', es: 'es' } });
});

test('translation paths map to their English source', () => {
  assert.deepEqual(parseTranslationPath('content/translations/es/resources/book-club.yaml'), { lang: 'es', kind: 'resources', of: 'resources/book-club' });
  assert.equal(parseTranslationPath('content/resources/book-club.yaml'), null);
  assert.ok(englishFilesFor('pages/help/food').includes('site/src/pages/help/food/index.astro'));
  assert.deepEqual(englishFilesFor('parts/SourceLine'), ['site/src/components/SourceLine.astro']);
});

test('the English hash covers only translated fields, so a phone change does not make it stale', () => {
  const newPhone = BOOK_CLUB.replace('phone: "304-555-0100"', 'phone: "304-555-0199"');
  assert.equal(englishHash('resources', newPhone, ['title']), englishHash('resources', BOOK_CLUB, ['title']));
  assert.notEqual(englishHash('resources', BOOK_CLUB.replace('Book club', 'Book group'), ['title']), englishHash('resources', BOOK_CLUB, ['title']));
  assert.equal(pageText('---\nconst a = 1;\n---\n<p class="x">Ask for {name} help.</p><style>p{}</style>'), 'Ask for help.');
});

test('numbersIn finds phone numbers, prices and long numbers, not small ones', () => {
  assert.deepEqual(numbersIn('Llame al 304-555-0100 o pague $5. Hay 2 sitios.'), ['304-555-0100', '$5']);
});

test('a good translation passes; facts, names, missing reviews and new numbers do not', () => {
  const root = fakeRepo({ 'content/resources/book-club.yaml': BOOK_CLUB, 'content/translations/es/resources/book-club.yaml': good() });
  const ok = translationProblems(readTranslation('content/translations/es/resources/book-club.yaml', { root }), { today: '2026-11-20' });
  assert.deepEqual(ok.errors, []);
  assert.deepEqual(ok.warnings, []);
  const bad = (text) => {
    fs.writeFileSync(path.join(root, 'content/translations/es/resources/book-club.yaml'), text);
    return translationProblems(readTranslation('content/translations/es/resources/book-club.yaml', { root }), { today: '2026-11-20' }).errors.join('\n');
  };
  assert.match(bad(good().replace('  title: Club de lectura\n', '  title: Club de lectura\n  contact: x\n')), /fields.contact is a fact/);
  assert.match(bad(good().replace('reviewer: es-reviewer-1', 'reviewer: Maria Lopez')), /role ID/);
  assert.match(bad(good().replace('reviewed: 2026-11-12\n', '')), /reviewed must be a date/);
  assert.match(bad(good().replace('304-555-0100', '304-555-0111')), /304-555-0111, which is not in the English/);
  assert.match(bad(good().replace('community-reviewed', 'machine-plus-review')), /off until David decides/);
  assert.match(bad(good().replace('lang: es', 'lang: fr')), /lang must be es/);
  assert.match(bad(good().replace('fields:', 'strings:')), /uses fields, not strings/);
});

test('a high-stakes translation needs a second reader', () => {
  const hash = englishHash('resources', RENT, ['title']);
  const text = `of: resources/rent-help\nlang: es\nfields:\n  title: Ayuda con la renta\nenglish_hash: ${hash}\nmethod: professional\ntranslated: 2026-11-10\nreviewed: 2026-11-12\nreviewer: es-reviewer-1\n`;
  const root = fakeRepo({ 'content/resources/rent-help.yaml': RENT, 'content/translations/es/resources/rent-help.yaml': text });
  const t = readTranslation('content/translations/es/resources/rent-help.yaml', { root });
  assert.equal(t.highStakes, true);
  assert.match(translationProblems(t, { today: '2026-11-20' }).errors.join('\n'), /needs second_review/);
  fs.writeFileSync(path.join(root, 'content/translations/es/resources/rent-help.yaml'), `${text}second_review:\n  reviewer: es-reviewer-2\n  reviewed: 2026-11-13\n`);
  assert.deepEqual(translationProblems(readTranslation('content/translations/es/resources/rent-help.yaml', { root }), { today: '2026-11-20' }).errors, []);
});

test('a stale translation is flagged, and hidden when high stakes', () => {
  const root = fakeRepo({ 'content/resources/book-club.yaml': BOOK_CLUB.replace('at 6 p.m.', 'at 7 p.m.'), 'content/translations/es/resources/book-club.yaml': good() });
  const p = translationProblems(readTranslation('content/translations/es/resources/book-club.yaml', { root }), { today: '2026-11-20' });
  assert.deepEqual(p.errors, []);
  assert.match(p.warnings.join('\n'), /stale: the English changed/);
  const base = { storedHash: 'aaaaaaaaaaaa', currentHash: 'bbbbbbbbbbbb', today: '2026-12-01' };
  assert.equal(translationState({ ...base, currentHash: 'aaaaaaaaaaaa', highStakes: true }), 'current');
  assert.equal(translationState({ ...base, highStakes: true, staleSince: '2026-11-30' }), 'hidden');
  assert.equal(translationState({ ...base, highStakes: false, staleSince: '2026-11-30' }), 'stale-shown');
  assert.equal(translationState({ ...base, highStakes: false, staleSince: '2026-10-01' }), 'hidden');
  assert.equal(translationState({ ...base, highStakes: false, staleSince: undefined }), 'hidden');
});

test('pages read a translation only when its language is on', () => {
  const root = fakeRepo({ 'content/resources/book-club.yaml': BOOK_CLUB, 'content/translations/es/resources/book-club.yaml': good() });
  assert.equal(loadTranslation('es', 'resources/book-club', { root, today: '2026-11-20' }), null);
  const t = loadTranslation('es', 'resources/book-club', { root, today: '2026-11-20', published: ['es'] });
  assert.equal(t.values.title, 'Club de lectura');
  assert.equal(t.stale, false);
  const record = { title: 'Book club', contact: { phone: '304-555-0100' }, _file: 'resources/book-club.yaml' };
  assert.equal(translatedField(record, 'es', 'title', { root, today: '2026-11-20' }), 'Book club');
  assert.equal(translatedField(record, 'es', 'title', { root, today: '2026-11-20', published: ['es'] }), 'Club de lectura');
  assert.deepEqual(translatedField(record, 'es', 'contact', { root, published: ['es'] }), { phone: '304-555-0100' });
});

test('no page can sit in a language folder until that language is on', () => {
  const root = fakeRepo({ 'site/src/pages/money.astro': '', 'site/src/pages/es/money.astro': '', 'site/src/pages/es/nothing.astro': '' });
  const off = checkTranslations({ root, published: [] }).errors.join('\n');
  assert.match(off, /es\/money.astro: Español pages are off/);
  const on = checkTranslations({ root, published: ['es'] }).errors.join('\n');
  assert.doesNotMatch(on, /pages are off/);
  assert.match(on, /es\/nothing.astro: has no English page/);
  assert.match(checkTranslations({ root, published: ['xx'] }).errors.join('\n'), /PUBLISHED has xx/);
});
