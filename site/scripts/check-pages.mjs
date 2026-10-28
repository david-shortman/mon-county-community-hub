// Checks built pages in dist/ for the basics search engines need. Exits 1 on any error.
// Runs automatically after `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const errors = [];
const seenTitles = new Map();
// Residents search with the place name ("shelter Morgantown WV"), so guide titles carry it (#143).
const placeName = /Morgantown|Mon County|Monongalia/;
const noPlaceNeeded = new Set(['404.html', 'about/index.html']);

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });
}

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
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) errors.push(`${where}: missing canonical link`);
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  // A canonical URL that redirects (folder without its trailing slash) wastes the crawl.
  if (canonical && !/(\/|\.\w+)$/.test(canonical)) errors.push(`${where}: canonical ${canonical} should end with /`);
  if (!/<meta property="og:image" content="https?:\/\//.test(html)) errors.push(`${where}: missing og:image`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${where}: needs exactly one <h1>, found ${h1s}`);
  if (/—/.test(`${title} ${desc}`)) errors.push(`${where}: title or description has an em dash`);
}

for (const f of ['robots.txt', 'llms.txt']) {
  if (!fs.existsSync(path.join(dist, f))) errors.push(`${f}: missing from dist/`);
}
if (!fs.existsSync(path.join(dist, 'sitemap-index.xml'))) errors.push('sitemap-index.xml: missing from dist/');

// llms.txt should list every page in the sitemap, so AI tools see new guides too.
const sitemapFile = path.join(dist, 'sitemap-0.xml');
const llmsFile = path.join(dist, 'llms.txt');
if (fs.existsSync(sitemapFile) && fs.existsSync(llmsFile)) {
  const llms = fs.readFileSync(llmsFile, 'utf8');
  for (const [, loc] of fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!llms.includes(`(${loc})`)) errors.push(`llms.txt: does not list ${loc}`);
  }
}

if (errors.length) {
  console.error(`Page checks failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Page checks passed for ${pages.length} pages.`);
