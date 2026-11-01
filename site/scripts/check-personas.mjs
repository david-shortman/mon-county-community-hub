// Persona path check (#1042). Runs after the build, in postbuild.
// Reads content/personas.yaml (the persona list from #1036) and, for each
// persona, checks against the built site in dist/ that:
//   - its landing page exists, and
//   - each next-step page exists and is linked from the landing page, or from
//     a page the landing page links to (two taps). Only links in each page's
//     <main> count, not the header, menu or footer.
// Exits 1 with the persona and the missing page or link, so a rename or a
// dropped link cannot quietly break a persona's path.
// Warnings, not failures:
//   - a persona whose landing page is a known gap (it has `gap: <issue>`) is
//     skipped and listed;
//   - a persona whose `last_reviewed` date is more than six months old is
//     listed, the same rule check-needs.mjs uses.
// Until content/personas.yaml exists, it says so and passes.
//
// Fields it reads, per persona (other fields are left to #1036):
//   slug: short-id          (or `name`, used in messages)
//   landing: /page/          the page search should land them on
//   next_steps: [/a/, /b/]   two or three next-step pages
//   gap: 1234                optional: open issue when the landing page is a known gap
//   last_reviewed: 2026-11-01
// The file can be a list, or have the list under `personas:`.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const here = path.dirname(new URL(import.meta.url).pathname);
const FILE = path.join(here, '../../content/personas.yaml');
const DIST = path.join(here, '../dist');
const SITE = 'https://everythingmorgantown.org';

// A site path as a route with a trailing slash: '/help/food' -> '/help/food/'.
export function route(href) {
  let u = String(href ?? '').trim();
  if (u.startsWith(SITE)) u = u.slice(SITE.length) || '/';
  if (!u.startsWith('/') || u.startsWith('//')) return null;
  u = u.replace(/[?#].*$/, '').replace(/index\.html$/, '').replace(/\.html$/, '/');
  return u.endsWith('/') ? u : `${u}/`;
}

// The built page for a route, as a file in dist/, or null.
function pageFile(r, dist) {
  for (const f of [path.join(dist, r, 'index.html'), path.join(dist, `${r.replace(/\/$/, '')}.html`)]) {
    if (fs.existsSync(f)) return f;
  }
  return null;
}

// Links in a built page's main content, as routes. The header, menu and
// footer are left out: they link almost everywhere, so counting them would let
// any path pass in two taps.
function linksFrom(file) {
  const page = fs.readFileSync(file, 'utf8');
  const html = page.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? page;
  return new Set([...html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((m) => route(m[1])).filter(Boolean));
}

export function siteGraph(dist = DIST) {
  const cache = new Map();
  return {
    exists: (r) => pageFile(r, dist) != null,
    links: (r) => {
      if (!cache.has(r)) {
        const f = pageFile(r, dist);
        cache.set(r, f ? linksFrom(f) : new Set());
      }
      return cache.get(r);
    },
  };
}

// The date six months before `today` (YYYY-MM-DD), like check-needs.mjs.
export function sixMonthsBefore(today) {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - 6);
  return d.toISOString().slice(0, 10);
}

// Check every persona. `graph` has exists(route) and links(route).
// Returns { errors, warnings, checked }.
export function checkPersonas(personas, graph, today = new Date().toISOString().slice(0, 10)) {
  const errors = [];
  const warnings = [];
  const stale = sixMonthsBefore(today);
  let checked = 0;
  personas.forEach((p, i) => {
    const who = p?.slug || p?.name || `persona ${i + 1}`;
    const reviewed = p?.last_reviewed == null ? null : String(p.last_reviewed instanceof Date ? p.last_reviewed.toISOString().slice(0, 10) : p.last_reviewed);
    if (!reviewed) warnings.push(`${who}: no last_reviewed date`);
    else if (reviewed < stale) warnings.push(`${who}: last reviewed ${reviewed}, more than six months ago. Review it.`);
    if (p?.gap) { warnings.push(`${who}: skipped, its landing page is a known gap (#${String(p.gap).replace(/^#/, '')})`); return; }
    const landing = route(p?.landing);
    if (!landing) { errors.push(`${who}: no landing page (add \`landing: /page/\`, or \`gap: <issue>\` if there is none yet)`); return; }
    if (!graph.exists(landing)) { errors.push(`${who}: landing page ${landing} is not on the built site`); return; }
    checked += 1;
    const oneTap = graph.links(landing);
    for (const step of [].concat(p.next_steps ?? [])) {
      const r = route(step);
      if (!r) { errors.push(`${who}: next step "${step}" is not a site path like /page/`); continue; }
      if (!graph.exists(r)) { errors.push(`${who}: next step ${r} is not on the built site`); continue; }
      if (r === landing || oneTap.has(r)) continue;
      if ([...oneTap].some((mid) => graph.links(mid).has(r))) continue;
      errors.push(`${who}: next step ${r} is not linked from ${landing}, or from any page it links to (two taps)`);
    }
  });
  return { errors, warnings, checked };
}

function main() {
  if (!fs.existsSync(FILE)) {
    console.log('\nPersona paths: content/personas.yaml does not exist yet (#1036), nothing to check.');
    return;
  }
  const data = YAML.parse(fs.readFileSync(FILE, 'utf8'));
  const personas = Array.isArray(data) ? data : data?.personas ?? [];
  const { errors, warnings, checked } = checkPersonas(personas, siteGraph());
  console.log(`\nPersona paths: ${checked} of ${personas.length} personas checked against the built site.`);
  for (const w of warnings) console.log(`  warning: ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`  error: ${e}`);
    console.error(`\ncheck-personas: ${errors.length} broken persona path(s). Fix the link or page, or update content/personas.yaml (#1042).`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
