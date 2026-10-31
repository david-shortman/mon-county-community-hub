#!/usr/bin/env node
// Watched pages (#166, tier 3 of ADR 0007). A closer watch on the few pages
// whose facts change most: food pantry and meal hours, then small groups.
//
// The daily Source check (check-sources.mjs) already fetches every source and
// notes when a page's text changes. That check ignores digits on purpose, so a
// clock or a date does not count as a change. For hours that is wrong: "9 a.m."
// becoming "10 a.m." is the change we care about. So for each page listed in
// content/watch/*.yaml this module:
//   - reads only the part of the page between `start` and `end` (the hours
//     block), so banners and news elsewhere on the page do not raise alarms
//   - hashes that part with digits kept
//   - checks that the hours text we saved (`quote`) is still on the page
//   - notices when a `start` marker disappears (the page was rebuilt)
// Changes go into one grouped issue per watch file (source-issue.mjs). A
// person re-reads the page and decides. Nothing here edits content or the
// site: changed hours are never published automatically.
//
// No Claude calls, no extra packages. Fetching, politeness and robots.txt are
// check-sources.mjs's job; this module only reads what it fetched.
//
// Usage (from site/): node scripts/watch.mjs --self-test   (validates the files too)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';
import { CONTENT_DIR } from '../src/lib/content.mjs';

export const WATCH_DIR = path.join(CONTENT_DIR, 'watch');
export const KINDS = ['page', 'pdf', 'facebook', 'none', 'blocked'];
const FETCHED = new Set(['page', 'pdf']);
const ENTRY_FIELDS = ['name', 'org', 'kind', 'url', 'start', 'end', 'quote', 'checked', 'note', 'also_lists'];
const FILE_FIELDS = ['group', 'title', 'issue_title', 'entries'];

// ---------- loading ----------
export function loadWatch(dir = WATCH_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).sort().map((f) => {
    const data = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) || {};
    return { ...data, _file: `content/watch/${f}`, entries: data.entries || [] };
  });
}

const ymd = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d ?? ''));

export function validateWatch(groups) {
  const errors = [];
  const seen = new Set();
  for (const g of groups) {
    const at = g._file;
    for (const k of Object.keys(g)) if (k !== '_file' && !FILE_FIELDS.includes(k)) errors.push(`${at}: unknown field ${k}`);
    if (!g.group || !/^[a-z0-9-]+$/.test(g.group)) errors.push(`${at}: group must be a short slug`);
    if (seen.has(g.group)) errors.push(`${at}: group ${g.group} is used twice`);
    seen.add(g.group);
    if (!g.title) errors.push(`${at}: needs a title`);
    if (!g.issue_title) errors.push(`${at}: needs an issue_title`);
    g.entries.forEach((e, i) => {
      const w = `${at} entry ${i + 1} (${e?.name || 'no name'})`;
      for (const k of Object.keys(e || {})) if (!ENTRY_FIELDS.includes(k)) errors.push(`${w}: unknown field ${k}`);
      if (!e?.name) errors.push(`${w}: needs a name`);
      if (!KINDS.includes(e?.kind)) errors.push(`${w}: kind must be one of ${KINDS.join(', ')}`);
      if (FETCHED.has(e?.kind) && !/^https?:\/\//.test(e?.url || '')) errors.push(`${w}: a ${e.kind} needs a url`);
      if (e?.end && !e?.start) errors.push(`${w}: end needs a start`);
      if ((e?.start || e?.quote) && e?.kind !== 'page') errors.push(`${w}: start, end and quote work only on a page`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd(e?.checked))) errors.push(`${w}: needs a checked date (YYYY-MM-DD)`);
      if (/[—]/.test(JSON.stringify(e))) errors.push(`${w}: no em dashes`);
    });
  }
  return errors;
}

// URLs the Source check should keep the page text for.
export function watchedUrls(groups) {
  return new Set(groups.flatMap((g) => g.entries).filter((e) => FETCHED.has(e.kind) && e.url).map((e) => e.url));
}

// ---------- reading a page ----------
// Lower case, one kind of dash, one kind of quote, single spaces. Digits stay.
const ENTITIES = { ndash: '-', mdash: '-', rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', quot: '"', apos: "'", amp: '&', nbsp: ' ', hellip: '...' };
export function decode(s) {
  return String(s ?? '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}

export function norm(s) {
  return decode(s)
    .toLowerCase()
    .replace(/[‐-―−]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Looser form for matching saved hours text: also ignores punctuation and
// spaces around it, so "9:00 a.m. - 12 p.m." matches "9:00 am-12 pm".
export function loose(s) {
  return norm(s).replace(/[^a-z0-9:]+/g, ' ').replace(/\b([ap]) m\b/g, '$1m').trim();
}

// The part of the page text between start and end (both kept out). With no
// start, the whole text. found is false when the start marker is missing.
export function section(text, start, end) {
  const t = norm(text);
  if (!start) return { text: t, found: true };
  const i = t.indexOf(norm(start));
  if (i < 0) return { text: '', found: false };
  const from = i + norm(start).length;
  const j = end ? t.indexOf(norm(end), from) : -1;
  return { text: t.slice(from, j < 0 ? undefined : j).trim(), found: true, endFound: !end || j >= 0 };
}

export const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

export function quoteFound(text, quote) {
  return !quote || loose(text).includes(loose(quote));
}

// ---------- comparing with the last run ----------
// results: Map url -> the Source check's result for that url, where watched
// pages carry `text` (page text) and every fetched file a `fingerprint`.
// prev: { [url]: { h, since, miss } } from the last run.
// Returns rows for the report, alerts for the grouped issue, and new state.
export function evaluateWatch(groups, results, prev = {}, { now = new Date() } = {}) {
  const today = now.toISOString().slice(0, 10);
  const state = {};
  const out = [];
  for (const g of groups) {
    const rows = [];
    for (const e of g.entries) {
      if (!FETCHED.has(e.kind)) { rows.push({ ...e, status: e.kind === 'facebook' ? 'by-hand' : 'call' }); continue; }
      const r = results.get(e.url);
      const p = prev[e.url];
      const keep = () => { if (p) state[e.url] = p; };
      if (!r || !r.fingerprint) {
        keep();
        rows.push({ ...e, status: 'unread', why: r ? (r.state === 'robots' ? 'robots.txt' : r.error || String(r.status || r.state)) : 'not fetched' });
        continue;
      }
      let h;
      let miss = '';
      let excerpt = '';
      if (e.kind === 'pdf' || r.kind === 'pdf') {
        h = r.fingerprint;
      } else {
        const s = section(r.text || '', e.start, e.end);
        if (!s.found) miss = 'start';
        else if (!quoteFound(s.text, e.quote)) miss = 'quote';
        h = hash(s.text);
        excerpt = s.text.slice(0, 500);
      }
      state[e.url] = { h, since: p?.h === h ? p.since : today, ...(miss ? { miss } : {}) };
      const reasons = [];
      if (p?.h && p.h !== h) reasons.push(e.kind === 'pdf' ? 'The file changed.' : e.start ? 'The hours part of the page changed.' : 'The page text changed.');
      if (miss === 'start' && p?.miss !== 'start') reasons.push(`The marker "${e.start}" is no longer on the page, so the page may have been rebuilt.`);
      if (miss === 'quote' && p?.miss !== 'quote') reasons.push('The hours text we saved is no longer on the page.');
      const status = reasons.length ? 'alert' : !p ? 'new' : miss ? 'still-missing' : 'same';
      rows.push({ ...e, status, reasons, excerpt });
    }
    out.push({ group: g.group, title: g.title, issue_title: g.issue_title, file: g._file, rows, alerts: rows.filter((x) => x.status === 'alert') });
  }
  return { groups: out, state };
}

// ---------- writing ----------
const short = (s, n) => (s.length > n ? `${s.slice(0, n)}...` : s);

// A few lines for the standing Source check issue.
export function watchMd(watch) {
  const L = [];
  for (const g of watch.groups) {
    const c = (st) => g.rows.filter((r) => r.status === st).length;
    const fetched = g.rows.filter((r) => FETCHED.has(r.kind)).length;
    L.push(`### Watched: ${g.title}`, '');
    L.push(`${fetched} pages watched, ${c('alert')} changed this run, ${c('unread')} could not be read, ${c('call') + c('by-hand')} need a call or a look by hand. List: \`${g.file}\`.`);
    const unread = g.rows.filter((r) => r.status === 'unread');
    if (unread.length) L.push('', ...unread.map((r) => `- Could not read: ${r.name}, ${r.url} (${r.why})`));
    L.push('');
  }
  return L.join('\n');
}

// Body for the grouped issue (or the comment added to it) for one watch file.
export function alertMd(g, { runUrl = '', today = '' } = {}) {
  const L = [
    `**${g.alerts.length} watched ${g.alerts.length === 1 ? 'page' : 'pages'} changed** (${today}). ${runUrl ? `Run: ${runUrl}` : ''}`.trim(),
    '',
    'What to do: open each page and read the hours. If they changed, update the record with the new hours, the quoted text and a new `checked` date in a PR (food and shelter PRs wait for David). If they did not change, update `start`, `end` or `quote` in the watch list so the alarm stops. If the page no longer gives hours, say "Call before you go" and add the place to the call queue (#156). Never copy hours from this issue onto the site without reading the page.',
    '',
  ];
  for (const a of g.alerts) {
    L.push(`#### ${a.name}`, '', `- Page: ${a.url}`);
    for (const r of a.reasons) L.push(`- ${r}`);
    if (a.quote) L.push(`- Hours we saved on ${ymd(a.checked)}: "${a.quote}"`);
    if (a.excerpt) L.push(`- What that part of the page says now: "${short(a.excerpt, 400)}"`);
    L.push('');
  }
  L.push(`Watch list: \`${g.file}\`. How it works: \`site/scripts/watch.mjs\` and \`docs/plans/2026-10-31-pantry-watch.md\`.`);
  return L.join('\n');
}

// ---------- self-test ----------
function selfTest() {
  const fails = [];
  const expect = (cond, msg) => { if (!cond) fails.push(msg); };
  const page = 'Welcome! News: Oct 3 bake sale. Food Pantry Hours Monday to Wednesday, 9:00 a.m. – 12:00 p.m. Thursday 1 to 3 pm Contact us';
  const s = section(page, 'Food Pantry Hours', 'Contact us');
  expect(s.found && s.text.startsWith('monday to wednesday'), 'section should start after the start marker');
  expect(!s.text.includes('contact'), 'section should stop before the end marker');
  expect(!section(page, 'Pantry Schedule').found, 'a missing start marker should be reported');
  expect(quoteFound(s.text, 'Monday to Wednesday, 9:00 am - 12:00 pm'), 'quotes should match across dash and a.m. styles');
  expect(!quoteFound(s.text, 'Monday to Wednesday, 10:00 am - 12:00 pm'), 'a changed hour should not match');
  expect(quoteFound('Fairchance Road: Mon - Wed 8:30 am &ndash; 4:30 pm', 'Fairchance Road: Mon - Wed 8:30 am - 4:30 pm'), 'HTML entities should be decoded');
  expect(hash(section(page.replace('9:00', '10:00'), 'Food Pantry Hours', 'Contact us').text) !== hash(s.text), 'a changed digit should change the hash');
  expect(hash(section(page.replace('Oct 3 bake sale', 'Nov 9 chili supper'), 'Food Pantry Hours', 'Contact us').text) === hash(s.text), 'news outside the section should not change the hash');

  const groups = [{ group: 'food', title: 'Food', issue_title: 'Food pages changed', _file: 'content/watch/food.yaml', entries: [
    { name: 'A', kind: 'page', url: 'https://a.example/', start: 'Food Pantry Hours', end: 'Contact us', quote: 'Thursday 1 to 3 pm', checked: '2026-10-31' },
    { name: 'B', kind: 'pdf', url: 'https://b.example/x.pdf', checked: '2026-10-31' },
    { name: 'C', kind: 'facebook', url: 'https://facebook.com/c', checked: '2026-10-31' },
    { name: 'D', kind: 'page', url: 'https://d.example/', checked: '2026-10-31' },
  ] }];
  expect(validateWatch(groups).length === 0, `sample should validate: ${validateWatch(groups).join('; ')}`);
  const res = (text, pdf = 'p1') => new Map([
    ['https://a.example/', { state: 'ok', kind: 'html', fingerprint: 'x', text }],
    ['https://b.example/x.pdf', { state: 'ok', kind: 'pdf', fingerprint: pdf }],
    ['https://d.example/', { state: 'unverified', error: 'bot check page' }],
  ]);
  const now = new Date('2026-11-01T12:00:00Z');
  const first = evaluateWatch(groups, res(page), {}, { now });
  expect(first.groups[0].alerts.length === 0, 'the first run should not alert');
  expect(first.groups[0].rows.find((r) => r.name === 'D').status === 'unread', 'a blocked page should be unread, not changed');
  expect(first.groups[0].rows.find((r) => r.name === 'C').status === 'by-hand', 'Facebook should be by hand');
  const same = evaluateWatch(groups, res(page), first.state, { now });
  expect(same.groups[0].alerts.length === 0, 'an unchanged page should not alert');
  const moved = evaluateWatch(groups, res(page.replace('1 to 3 pm', '2 to 4 pm'), 'p2'), first.state, { now });
  expect(moved.groups[0].alerts.length === 2, 'changed hours and a changed PDF should both alert');
  expect(moved.groups[0].alerts[0].reasons.length === 2, 'changed hours should say the part changed and the quote is gone');
  const again = evaluateWatch(groups, res(page.replace('1 to 3 pm', '2 to 4 pm'), 'p2'), moved.state, { now });
  expect(again.groups[0].alerts.length === 0, 'the same change should alert only once');
  const rebuilt = evaluateWatch(groups, res('All new site. Visit us.'), first.state, { now });
  expect(rebuilt.groups[0].alerts[0].reasons.some((r) => r.includes('no longer on the page')), 'a missing marker should alert');
  const down = evaluateWatch(groups, new Map(), first.state, { now });
  expect(down.state['https://a.example/']?.h === first.state['https://a.example/'].h, 'a failed fetch should keep the last good state');
  expect(alertMd(moved.groups[0], { today: '2026-11-01' }).includes('Never copy hours'), 'the issue should say never to copy hours without reading');
  expect(!/—/.test(alertMd(moved.groups[0]) + watchMd(moved)), 'no em dashes in issue text');

  // The real watch files.
  const real = loadWatch();
  for (const e of validateWatch(real)) fails.push(e);
  if (fails.length) { console.error(`watch self-test failed:\n- ${fails.join('\n- ')}`); process.exit(1); }
  console.log(`watch self-test passed (${real.reduce((n, g) => n + g.entries.length, 0)} watched entries in ${real.length} files).`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  if (process.argv[2] === '--self-test') selfTest();
  else { console.error('Usage: node scripts/watch.mjs --self-test'); process.exit(2); }
}
