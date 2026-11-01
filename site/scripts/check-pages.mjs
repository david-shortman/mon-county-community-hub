// Checks built pages in dist/ for the basics search engines need. Exits 1 on any error.
// Runs automatically after `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { OTHER_LOCALES, localeOfPath } from '../src/lib/i18n.mjs';

const dist = new URL('../dist/', import.meta.url).pathname;
const errors = [];
const seenTitles = new Map();
const noindexed = new Set();
// Residents search with the place name ("shelter Morgantown WV"), so guide titles carry it (#143).
const placeName = /Morgantown|Mon County|Monongalia/;
const noPlaceNeeded = new Set(['404.html', 'about/index.html']);
// Pages allowed to keep a GitHub new issue link (#1079). Keep it empty.
const githubAskPending = new Set([]);

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

// Folders that hold translated pages (site/src/lib/i18n.mjs).
const translatedLangs = OTHER_LOCALES;

const pages = htmlFiles(dist);
if (!pages.length) errors.push('no pages found in dist/ (run npm run build first)');

for (const file of pages) {
  const where = path.relative(dist, file);
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  if (!title) errors.push(`${where}: missing <title>`);
  else if (seenTitles.has(title)) errors.push(`${where}: same <title> as ${seenTitles.get(title)}`);
  else seenTitles.set(title, where);
  if (title && !noPlaceNeeded.has(where) && !placeName.test(title.split(' | ')[0])) {
    errors.push(`${where}: <title> should name Morgantown or Mon County, the way residents search`);
  }
  if (!desc) errors.push(`${where}: missing meta description`);
  if (!/<html[^>]*\slang="/.test(html)) errors.push(`${where}: missing lang on <html>`);
  // A translated page (#1099) says its language and links to the English
  // page and back, so search engines show the right one.
  const lang = where.match(/^([a-z]{2,3})\//)?.[1];
  if (lang && translatedLangs.includes(lang)) {
    if (!new RegExp(`<html[^>]*\\slang="${lang}"`).test(html)) errors.push(`${where}: a ${lang} page needs lang="${lang}" on <html>`);
    for (const h of ['en', lang, 'x-default']) {
      if (!new RegExp(`<link rel="alternate" hreflang="${h}" href="https?://`).test(html)) errors.push(`${where}: missing the hreflang="${h}" link`);
    }
    if (/data-pagefind-body/.test(html)) errors.push(`${where}: site search is English only for now, so a ${lang} page stays out of it`);
  }
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (noindex) noindexed.add(where);
  if (!noindex && !/<link rel="canonical" href="https?:\/\//.test(html)) errors.push(`${where}: missing canonical link`);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  // A canonical URL that redirects (folder without its trailing slash) wastes the crawl.
  if (canonical && !/(\/|\.\w+)$/.test(canonical)) errors.push(`${where}: canonical ${canonical} should end with /`);
  if (!/<meta property="og:image" content="https?:\/\//.test(html)) errors.push(`${where}: missing og:image`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${where}: needs exactly one <h1>, found ${h1s}`);
  if (/—/.test(`${title} ${desc}`)) errors.push(`${where}: title or description has an em dash`);
  // A missing field (for example a hidden record a page reads directly, #519)
  // must never ship as "undefined" or an empty call link.
  const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  if (/\b(undefined|Invalid Date|NaN)\b/.test(body)) errors.push(`${where}: page text says "${body.match(/\b(undefined|Invalid Date|NaN)\b/)[0]}"; a field is missing`);
  if (/href="tel:"/.test(html)) errors.push(`${where}: a call link has no number`);
  // Residents report and suggest through the fix form (fixFormUrl), never a
  // GitHub "new issue" link that needs an account (#1079).
  if (/href="https:\/\/github\.com\/[^"]*\/issues\/new/.test(html) && !githubAskPending.has(where)) {
    errors.push(`${where}: links residents to a GitHub new issue form; use fixFormUrl from src/lib/group-requests.mjs`);
  }
}

for (const f of ['robots.txt', 'llms.txt']) {
  if (!fs.existsSync(path.join(dist, f))) errors.push(`${f}: missing from dist/`);
}
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) errors.push('sitemap-index.xml: missing from dist/');

// llms.txt should list every page in the sitemap, so AI tools see new guides too.
// It stays English only for the language pilot (#1099), so translated pages are left out.
const sitemapFile = path.join(dist, 'sitemap-0.xml');
const llmsFile = path.join(dist, 'llms.txt');
if (fs.existsSync(sitemapFile) && fs.existsSync(llmsFile)) {
  const llms = fs.readFileSync(llmsFile, 'utf8');
  for (const [, loc] of fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (localeOfPath(new URL(loc).pathname) !== 'en') continue;
    if (!llms.includes(`(${loc})`)) errors.push(`llms.txt: does not list ${loc}`);
  }
}

// Every page is either in the sitemap or marked noindex, never both and never
// neither, so search engines see exactly the pages we mean them to (#89).
if (fs.existsSync(sitemapFile)) {
  const site = 'https://everythingmorgantown.org/';
  const inMap = new Set([...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc));
  for (const file of pages) {
    const where = path.relative(dist, file);
    const url = site + where.replace(/index\.html$/, '');
    if (noindexed.has(where) && inMap.has(url)) errors.push(`${where}: marked noindex but listed in the sitemap`);
    if (!noindexed.has(where) && !inMap.has(url)) errors.push(`${where}: not in the sitemap; add it, or pass noindex to Base if it should stay out of search`);
  }
}

if (errors.length) {
  console.error(`Page checks failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Page checks passed for ${pages.length} pages.`);
