// Which translated pages build, and their hreflang links (#1099).
//
// A translated page has two parts:
//   - a template: site/src/pages/<lang>/_pages/<route>.astro (or
//     <route>/index.astro). Astro skips folders that start with "_", so a
//     template never builds by itself.
//   - its words: content/translations/<lang>/pages/<route>.yaml.
// The router, site/src/pages/<lang>/[...page].astro, builds a page only when
// the language is in PUBLISHED and its words are reviewed and current
// (loadTranslation returns them). A draft (reviewed: false), a page with
// errors, or a high-stakes page whose English changed builds nothing: no
// page, no sitemap entry, no hreflang link, no language switcher.
//
// Kept apart from i18n.mjs so that file stays free of imports that lead back
// to it (translations.mjs and the High stakes rules both import i18n.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, DEFAULT_LOCALE, PUBLISHED, englishRoute, alternatesFor } from './i18n.mjs';
import { loadTranslation } from './translations.mjs';

export const TEMPLATE_DIR = '_pages';

// '/help-in-your-language/' -> 'help-in-your-language'; '/' -> 'index'.
const routeKey = (route) => englishRoute(route).replace(/^\/+|\/+$/g, '') || 'index';

// The template files that could hold a page, relative to the repo root.
export function templateFiles(lang, route) {
  const key = routeKey(route);
  const dir = `site/src/pages/${lang}/${TEMPLATE_DIR}`;
  return key === 'index' ? [`${dir}/index.astro`] : [`${dir}/${key}.astro`, `${dir}/${key}/index.astro`];
}

// The English route a template file is for:
// 'site/src/pages/es/_pages/help/food/index.astro' -> '/help/food/'.
export function templateRoute(file) {
  const m = file.match(/^site\/src\/pages\/[a-z]{2,3}\/_pages\/(.*)\.astro$/);
  if (!m) return null;
  return englishRoute(`/${m[1].replace(/(^|\/)index$/, '')}`);
}

// The translation file id for a page: 'pages/help-in-your-language'.
export const pageTranslationOf = (route) => `pages/${routeKey(route)}`;

// Is this page ready for residents in this language? Only when the language
// is on, the template exists, and the words are reviewed and not hidden.
export function pageReady(lang, route, { root = REPO_ROOT, published = PUBLISHED, today } = {}) {
  if (lang === DEFAULT_LOCALE || !published.includes(lang)) return false;
  if (!templateFiles(lang, route).some((f) => fs.existsSync(path.join(root, f)))) return false;
  return loadTranslation(lang, pageTranslationOf(route), { root, published, today }) != null;
}

// Every template in a language folder, with its English route.
export function templatesIn(lang, { root = REPO_ROOT } = {}) {
  const dir = path.join(root, 'site/src/pages', lang, TEMPLATE_DIR);
  if (!fs.existsSync(dir)) return [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  return walk(dir).filter((f) => f.endsWith('.astro')).map((f) => {
    const file = path.relative(root, f).split(path.sep).join('/');
    return { file, route: templateRoute(file) };
  }).sort((a, b) => a.file.localeCompare(b.file));
}

// The pages the router builds for a language: [{ file, route, slug }], where
// slug is the route without slashes (undefined for the home page).
export function readyPages(lang, opts = {}) {
  return templatesIn(lang, opts)
    .filter((t) => pageReady(lang, t.route, opts))
    .map((t) => ({ ...t, slug: routeKey(t.route) === 'index' ? undefined : routeKey(t.route) }));
}

// hreflang links for a page, counting only translated pages that build.
export function pageAlternates(route, { site, published = PUBLISHED, root = REPO_ROOT, today } = {}) {
  return alternatesFor(route, { site, published, root, exists: (lang, en) => pageReady(lang, en, { root, published, today }) });
}
