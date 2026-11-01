// Languages other than English (plan: docs/plans/2026-10-31-languages.md, #1067).
//
// Today the site is English only. Everything here is ready for a Spanish
// pilot, but nothing changes for residents until a language is added to
// PUBLISHED below. How to add a translation: docs/process/translations.md.
//
// This file has no Astro imports, so astro.config.mjs, the checks and the
// tests can all use it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
// The repository root (this file is site/src/lib/i18n.mjs).
export const REPO_ROOT = path.resolve(here, '../../..');

export const DEFAULT_LOCALE = 'en';

// Languages the site is set up for. `name` is the language's name in that
// language (never a flag). `dir` is 'rtl' for right-to-left scripts such as
// Arabic, which need layout testing before they are turned on.
// `english` is its name in English, for lines staff read (the interpreter card).
export const LOCALES = {
  en: { name: 'English', english: 'English', dir: 'ltr' },
  es: { name: 'Español', english: 'Spanish', dir: 'ltr' },
};

// THE FLAG. Languages that may have pages. Empty means English only. Spanish
// is on since David's go on November 1, 2026 (#1067, decision 1). Even so, a
// Spanish page builds only once a fluent reader marks its words reviewed
// (src/lib/locale-pages.mjs), so drafts never reach residents. Changing this
// is David's call and the High stakes check labels that PR for:david.
export const PUBLISHED = ['es'];

// Translation methods from the plan. 'machine-plus-review' is a Claude draft
// that a fluent person corrects and marks reviewed. David allowed it on
// November 1, 2026 (#1067, decision 3). It is never machine-only: nothing
// shows until a reviewer signs off, and high-stakes files (crisis, shelter,
// food, benefits) also need a second reader.
export const METHODS = ['official-link', 'professional', 'community-reviewed', 'machine-plus-review'];
export const ALLOW_MACHINE_DRAFTS = true;

// Every language code that could have a folder (all but English).
export const OTHER_LOCALES = Object.keys(LOCALES).filter((l) => l !== DEFAULT_LOCALE);

// '/es/help/food/' -> 'es'; '/help/food/' -> 'en'. Only known languages count.
export function localeOfPath(pathname) {
  const first = pathname.replace(/^\/+/, '').split('/')[0];
  return OTHER_LOCALES.includes(first) ? first : DEFAULT_LOCALE;
}

// The English route for any route: '/es/help/food/' -> '/help/food/'.
export function englishRoute(pathname) {
  const lang = localeOfPath(pathname);
  const route = lang === DEFAULT_LOCALE ? pathname : pathname.replace(new RegExp(`^/+${lang}(?=/|$)`), '');
  const withSlash = route.endsWith('/') ? route : `${route}/`;
  return withSlash.startsWith('/') ? withSlash : `/${withSlash}`;
}

// The route of a page in a language: ('es', '/help/food/') -> '/es/help/food/'.
// English routes never get a prefix, so English URLs never change.
export function localeRoute(lang, route) {
  const en = englishRoute(route);
  return lang === DEFAULT_LOCALE ? en : `/${lang}${en}`;
}

// The page files that could build a route, relative to the repo root.
export function pageFilesFor(route) {
  const r = route.replace(/^\/+|\/+$/g, '');
  if (!r) return ['site/src/pages/index.astro'];
  return [`site/src/pages/${r}.astro`, `site/src/pages/${r}/index.astro`];
}

// Does a page exist for this route in this language?
export function pageExists(lang, route, { root = REPO_ROOT } = {}) {
  return pageFilesFor(localeRoute(lang, route)).some((f) => fs.existsSync(path.join(root, f)));
}

// The hreflang links for a page: one per language the page exists in, plus
// x-default (English). Empty unless the page exists in at least one
// published language, so English-only pages get nothing.
// `exists(lang, englishRoute)` says whether the page is there in a language;
// the site passes pageReady from locale-pages.mjs, which counts only
// reviewed pages that build.
export function alternatesFor(route, { site, published = PUBLISHED, root = REPO_ROOT, exists = (l, en) => pageExists(l, en, { root }) } = {}) {
  const en = englishRoute(route);
  const langs = published.filter((l) => LOCALES[l] && l !== DEFAULT_LOCALE && exists(l, en));
  if (!langs.length) return [];
  const href = (lang) => (site ? new URL(localeRoute(lang, en), site).href : localeRoute(lang, en));
  return [
    { hreflang: DEFAULT_LOCALE, lang: DEFAULT_LOCALE, href: href(DEFAULT_LOCALE) },
    ...langs.map((l) => ({ hreflang: l, lang: l, href: href(l) })),
    { hreflang: 'x-default', lang: DEFAULT_LOCALE, href: href(DEFAULT_LOCALE) },
  ];
}

// The links a language switcher shows: the same page in each other
// language, named in that language. Empty when there is nothing to switch to.
export function switcherLinks(currentLang, alternates) {
  return alternates
    .filter((a) => a.hreflang !== 'x-default' && a.lang !== currentLang)
    .map((a) => ({ lang: a.lang, href: a.href, label: LOCALES[a.lang].name }));
}

// The `dir` attribute for <html>, or undefined for left-to-right (so English
// pages keep exactly the markup they have today).
export const dirFor = (lang) => (LOCALES[lang]?.dir === 'rtl' ? 'rtl' : undefined);

// Astro's i18n routing. English stays at the root with no prefix. There is
// no fallback: a /es/ page exists only when someone wrote and reviewed it.
export function astroI18n(published = PUBLISHED) {
  return {
    locales: [DEFAULT_LOCALE, ...published],
    defaultLocale: DEFAULT_LOCALE,
    routing: { prefixDefaultLocale: false },
  };
}

// Options for @astrojs/sitemap: pages in a language that is not published
// never go in the sitemap, and once one is, each URL lists its pairs.
export function sitemapI18n(published = PUBLISHED) {
  if (!published.length) return undefined;
  return {
    defaultLocale: DEFAULT_LOCALE,
    locales: Object.fromEntries([DEFAULT_LOCALE, ...published].map((l) => [l, l])),
  };
}
export function inUnpublishedLocale(url, published = PUBLISHED) {
  const lang = localeOfPath(new URL(url, 'https://x.invalid').pathname);
  return lang !== DEFAULT_LOCALE && !published.includes(lang);
}

// Translation files: content/translations/<lang>/<kind>/<path>.yaml.
// `kind` says what the English source is:
//   resources, orgs, calendar, places: a record in content/<kind>/
//   pages: a page in site/src/pages/ ('pages/help/food' -> /help/food/)
//   parts: a component in site/src/components/ ('parts/SourceLine')
export const RECORD_KINDS = ['resources', 'orgs', 'calendar', 'places'];
export const TRANSLATION_KINDS = [...RECORD_KINDS, 'pages', 'parts'];
const TRANSLATION_FILE = /^content\/translations\/([a-z]{2,3})\/([a-z]+)\/(.+)\.ya?ml$/;

// 'content/translations/es/resources/x.yaml' -> { lang: 'es', kind: 'resources', of: 'resources/x' }
export function parseTranslationPath(file) {
  const m = file.match(TRANSLATION_FILE);
  if (!m) return null;
  const [, lang, kind, rest] = m;
  return { lang, kind, of: `${kind}/${rest}` };
}

// The files that could hold the English source of a translation, relative
// to the repo root. The first one that exists is the source.
export function englishFilesFor(of) {
  const [kind, ...restParts] = of.split('/');
  const rest = restParts.join('/');
  if (!rest) return [];
  if (RECORD_KINDS.includes(kind)) return [`content/${kind}/${rest}.yaml`, `content/${kind}/${rest}.yml`];
  if (kind === 'pages') return pageFilesFor(`/${rest}/`);
  if (kind === 'parts') return [`site/src/components/${rest}.astro`];
  return [];
}
