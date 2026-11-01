// Site search test (#529): does the site's own search find the right page
// for the words residents use?
//
//   npm run search-test                 # uses dist/ if built, else builds it
//   npm run search-test -- --build      # always rebuild the site and index first
//   npm run search-test -- --plain      # old behavior: raw words, no plan (for before/after)
//   npm run search-test -- --save       # also save content/findability/search-runs/<date>.json
//   npm run search-test -- --summary f  # also write a Markdown report to file f
//   npm run search-test -- --show-misses
//
// It loads the real Pagefind index from dist/pagefind in Node and runs each
// query in content/findability/search-queries.yaml through the same plan the
// search page uses (src/lib/search-plan.mjs). A query is a hit when one of its
// expected pages is in the top 3. It never fails the build: it is a report.
// See docs/operations/search-test.md.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import YAML from 'yaml';
import { SPELLING, STOP, planWords, searchPlan } from '../src/lib/search-plan.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const repo = resolve(site, '..');
const dist = join(site, 'dist');
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const value = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
const TOP = 3;

if (flag('--build') || !existsSync(join(dist, 'pagefind', 'pagefind.js'))) {
  // Only the pages and the index; the full `npm run build` also runs every check.
  console.log('Building the site and search index...');
  execSync('npx astro build && npx pagefind --site dist', { cwd: site, stdio: 'inherit' });
}

// Pagefind fetches its index files by URL. In Node, answer file:// URLs from disk.
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts) => {
  const u = String(url);
  if (u.startsWith('file:')) {
    const body = readFileSync(fileURLToPath(u));
    return new Response(body, { status: 200 });
  }
  return realFetch(url, opts);
};
const pf = await import(pathToFileURL(join(dist, 'pagefind', 'pagefind.js')).href);
await pf.options({ basePath: pathToFileURL(join(dist, 'pagefind') + '/').href, baseUrl: '/' });
await pf.init();

const { queries } = YAML.parse(readFileSync(join(repo, 'content/findability/search-queries.yaml'), 'utf8'));
const routeOf = (url) => url.replace(/index\.html$/, '').replace(/\.html$/, '/').replace(/\/?$/, '/');

const plain = flag('--plain');
const results = [];
for (const item of queries) {
  let res;
  if (plain) {
    const r = await pf.search(item.q);
    res = { results: r.results, searched: item.q, fixed: false, loose: false };
  } else {
    res = await searchPlan(pf, item.q, SPELLING, STOP, planWords);
  }
  const top = await Promise.all(res.results.slice(0, 10).map((r) => r.data()));
  const routes = top.map((d) => routeOf(d.url));
  const rank = routes.findIndex((r) => item.expect.includes(r));
  results.push({
    q: item.q, kind: item.kind, expect: item.expect,
    hit: rank >= 0 && rank < TOP, rank: rank >= 0 ? rank + 1 : null,
    count: res.results.length, top3: routes.slice(0, TOP),
    ...(res.searched !== item.q ? { searched: res.searched } : {}),
    ...(res.loose ? { loose: true } : {}),
  });
}

const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : 0);
const score = (list) => ({ queries: list.length, hits: list.filter((r) => r.hit).length, top3_percent: pct(list.filter((r) => r.hit).length, list.length), zero_results: list.filter((r) => !r.count).length });
const kinds = [...new Set(queries.map((q) => q.kind))];
const summary = { all: score(results), ...Object.fromEntries(kinds.map((k) => [k, score(results.filter((r) => r.kind === k))])) };

const date = new Date().toISOString();
const report = { date, mode: plain ? 'plain' : 'plan', top: TOP, summary, results };

const line = (k, s) => `| ${k} | ${s.queries} | ${s.hits} | ${s.top3_percent}% | ${s.zero_results} |`;
const misses = results.filter((r) => !r.hit);
const md = [
  `## Site search test (${plain ? 'plain words' : 'search plan'})`,
  '',
  `Expected page in the top ${TOP}: **${summary.all.hits} of ${summary.all.queries} (${summary.all.top3_percent}%)**. Queries with no results: ${summary.all.zero_results}.`,
  '',
  '| Kind | Queries | Hits | Top 3 | No results |',
  '|---|---|---|---|---|',
  ...['all', ...kinds].map((k) => line(k, summary[k])),
  '',
  `### Misses (${misses.length})`,
  '',
  '| Query | Expected | Got (top 3) |',
  '|---|---|---|',
  ...misses.map((r) => `| ${r.q} | ${r.expect[0]} | ${r.top3.join(' ') || '(no results)'} |`),
  '',
  'This is a report, not a gate. How to read and improve it: docs/operations/search-test.md',
].join('\n');

console.log(md.split('### Misses')[0]);
if (flag('--show-misses')) console.log(md.slice(md.indexOf('### Misses')));
if (value('--summary')) writeFileSync(value('--summary'), md + '\n');
if (flag('--save')) {
  const dir = join(repo, 'content/findability/search-runs');
  mkdirSync(dir, { recursive: true });
  const stamp = date.slice(0, 16).replace(/[-:]/g, '').replace('T', '-');
  const file = join(dir, `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}-${stamp.slice(9)}${plain ? '-plain' : ''}.json`);
  // One line per query keeps the file short and easy to diff between runs.
  const { results: rows, ...head } = report;
  const text = JSON.stringify(head, null, 1).replace(/\n}$/, `,\n "results": [\n${rows.map((r) => `  ${JSON.stringify(r)}`).join(',\n')}\n ]\n}`);
  writeFileSync(file, text + '\n');
  console.log(`Saved ${file.slice(repo.length + 1)}`);
}
