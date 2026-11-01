// Checks the schema.org JSON-LD on built pages (#37). Runs after `npm run build`.
// Every block must parse, every Event needs a name, a startDate and a location
// with an address (Google's required Event fields), and no Event may be made
// for a deadline (an entry with no place).
// Since #1044 it also checks the site-level data: WebSite on the home page,
// a BreadcrumbList that matches every visible breadcrumb, and the sitemap's
// last-changed dates.
import fs from 'node:fs';
import path from 'node:path';
import { crumbsFromHtml, SITE_NAME, SITE_ORIGIN } from '../src/lib/site-meta.mjs';

const dist = new URL('../dist/', import.meta.url).pathname;
const html = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? html(p) : p.endsWith('.html') ? [p] : [];
});
const errors = [];
let pages = 0, nodes = 0, events = 0, trails = 0;
for (const file of html(dist)) {
  const where = path.relative(dist, file);
  const page = fs.readFileSync(file, 'utf8');
  const blocks = [...page.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  if (blocks.length > 1) errors.push(`${where}: more than one JSON-LD block`);
  // Every visible breadcrumb has a matching BreadcrumbList (#1044).
  const crumbs = crumbsFromHtml(page);
  if (crumbs.length > 1) {
    trails++;
    let graph = [];
    try { graph = JSON.parse(blocks[0]?.[1] ?? '{}')['@graph'] ?? []; } catch { /* reported below */ }
    const list = graph.find((n) => n['@type'] === 'BreadcrumbList');
    const want = crumbs.map((c) => `${c.name} ${new URL(c.href, SITE_ORIGIN).href}`).join(' > ');
    const got = (list?.itemListElement ?? []).map((i) => `${i.name} ${i.item}`).join(' > ');
    if (!list) errors.push(`${where}: shows a breadcrumb but has no BreadcrumbList`);
    else if (got !== want) errors.push(`${where}: BreadcrumbList "${got}" does not match the breadcrumb "${want}"`);
    else if (list.itemListElement.some((it, i) => it.position !== i + 1)) errors.push(`${where}: BreadcrumbList positions should count from 1`);
  }
  if (where === 'index.html') {
    let graph = [];
    try { graph = JSON.parse(blocks[0]?.[1] ?? '{}')['@graph'] ?? []; } catch { /* reported below */ }
    const site = graph.find((n) => n['@type'] === 'WebSite');
    if (!site || site.name !== SITE_NAME || site.url !== `${SITE_ORIGIN}/`) errors.push(`index.html: needs WebSite data named "${SITE_NAME}" with url ${SITE_ORIGIN}/`);
  }
  for (const [, text] of blocks) {
    let data;
    try { data = JSON.parse(text); } catch { errors.push(`${where}: JSON-LD does not parse`); continue; }
    pages++;
    if (data['@context'] !== 'https://schema.org') errors.push(`${where}: @context should be https://schema.org`);
    for (const n of data['@graph'] ?? []) {
      nodes++;
      if (!n['@type'] || (!n.name && n['@type'] !== 'BreadcrumbList')) errors.push(`${where}: a node is missing @type or name`);
      if (n['@type'] === 'Event') {
        events++;
        if (!/^\d{4}-\d{2}-\d{2}/.test(n.startDate ?? '')) errors.push(`${where}: Event "${n.name}" needs a startDate`);
        if (!n.location?.address) errors.push(`${where}: Event "${n.name}" needs a location with an address`);
      }
      if (JSON.stringify(n).includes('—')) errors.push(`${where}: JSON-LD contains an em dash`);
    }
  }
}
// Sitemap last-changed dates (#1044): real dates, never in the future.
const today = new Date().toISOString().slice(0, 10);
let dated = 0, urls = 0;
for (const f of fs.readdirSync(dist).filter((f) => /^sitemap-\d+\.xml$/.test(f))) {
  const xml = fs.readFileSync(path.join(dist, f), 'utf8');
  urls += (xml.match(/<url>/g) ?? []).length;
  for (const [, d] of xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) {
    dated++;
    if (!/^\d{4}-\d{2}-\d{2}/.test(d) || Number.isNaN(Date.parse(d))) errors.push(`${f}: lastmod "${d}" is not a date`);
    else if (d.slice(0, 10) > today) errors.push(`${f}: lastmod ${d} is in the future`);
  }
}
if (errors.length) {
  console.error(`JSON-LD check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`JSON-LD check: ${pages} pages, ${nodes} items, ${events} in-person events, ${trails} breadcrumbs. Sitemap: ${dated} of ${urls} entries dated.`);
