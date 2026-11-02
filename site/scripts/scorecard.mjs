// Weekly scorecard (#1052). Gathers the numbers the project's checks already
// make into one table per lane (information, presentation, infrastructure,
// outcomes), with last week's value beside each, and writes
// docs/scorecard/YYYY-Www.md plus a .json copy the next run compares against.
// Design: https://claude.ai/artifact/QeSvygH6YKeXpVNyLcnAyv. Run weekly by
// .github/workflows/scorecard.yml. Free: no accounts, no keys, no data about people.
//
// Usage (from site/, after `npm run build`):
//   node scripts/scorecard.mjs [--lighthouse lighthouse.json] [--out ../docs/scorecard] [--week 2026-W45] [--no-github]
// GitHub reads (open PRs, the Source check and Health issues) use
// GITHUB_TOKEN when set, or the `gh` command. A number that cannot be read
// shows as "not read", never as zero.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { scanTypedFacts, phoneDigits } from './check-typed-facts.mjs';
import { LCP_GOAL_MS } from './lighthouse.mjs';

const REPO = process.env.GITHUB_REPOSITORY || 'david-shortman/mon-county-community-hub';
const SITE = 'https://everythingmorgantown.org';
const ROOT = path.resolve('..');
const DAY = 86_400_000;
// A high-stakes change should be live within this many days (#1056).
const LAG_DAYS = 2;

const opt = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);
const now = new Date(opt('now', new Date().toISOString()));
const today = now.toISOString().slice(0, 10);
const daysSince = (d) => Math.floor((now - new Date(d)) / DAY);
const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round = (n, d = 1) => (n == null ? null : Number(n.toFixed(d)));
const readJson = (f) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return null; } };
const sh = (cmd, args, o = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 << 20, ...o });

// ISO 8601 week, like 2026-W45.
export function isoWeek(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const year = d.getUTCFullYear();
  const week = Math.ceil(((d - Date.UTC(year, 0, 1)) / DAY + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

// GitHub REST, read only.
async function api(route) {
  if (flag('no-github')) throw new Error('GitHub reads turned off');
  if (process.env.GITHUB_ACTIONS && process.env.GITHUB_TOKEN) {
    const r = await fetch(`https://api.github.com/${route}`, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'mon-county-scorecard' },
    });
    if (!r.ok) throw new Error(`GitHub ${r.status} on ${route.split('?')[0]}`);
    return r.json();
  }
  // A hand run: the `gh` command has the credentials.
  return JSON.parse(sh('gh', ['api', route]));
}

// Each measure: lane, key, what, ours (number or null), shown (text),
// today (today's sources, text, optional), better ('up' or 'down' or null),
// noise (a move this size or smaller is not counted), note.
const rows = [];
const add = (r) => rows.push({ today: '', better: null, noise: 0, note: '', ...r });
const notRead = (lane, key, what, why) => add({ lane, key, what, ours: null, shown: 'not read', note: why });

// ---------- Information ----------

// Lag on known changes (#1056), part a: open PRs that change high-stakes
// files, by the same rules the High stakes check uses.
async function lagPrs() {
  const prs = await api(`repos/${REPO}/pulls?state=open&per_page=100`);
  const hits = [];
  let unread = 0;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'scorecard-'));
  for (const pr of prs) {
    const dir = path.join(tmp, String(pr.number));
    try {
      sh('git', ['fetch', '-q', 'origin', `pull/${pr.number}/head`], { cwd: ROOT });
      sh('git', ['worktree', 'add', '-q', '--detach', dir, 'FETCH_HEAD'], { cwd: ROOT });
      fs.symlinkSync(path.resolve('node_modules'), path.join(dir, 'site', 'node_modules'));
      const out = sh('node', ['scripts/high-stakes.mjs', 'origin/main'], { cwd: path.join(dir, 'site') }).trim();
      if (out) hits.push({ number: pr.number, title: pr.title, days: daysSince(pr.created_at), files: out.split('\n').length });
    } catch { unread += 1; } finally {
      try { sh('git', ['worktree', 'remove', '--force', dir], { cwd: ROOT }); } catch { /* already gone */ }
    }
  }
  return { open: prs.length, unread, hits: hits.sort((a, b) => b.days - a.days) };
}

// Part b: typed text on high-stakes pages that can fall out of step with the
// records. (1) Lines that say a date or fact is not out yet, the LIEAP case.
// (2) Phone numbers typed into a page that no content record has.
function typedText() {
  const pages = scanTypedFacts();
  const recordPhones = new Set();
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ya?ml|json)$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/\(?\b\d{3}\)?[-. ]?\d{3}[-. ]\d{4}\b/g)) recordPhones.add(phoneDigits(m[0]));
      }
    }
  })(path.join(ROOT, 'content'));
  const notYet = [];
  const phones = new Map();
  for (const p of pages) {
    for (const n of p.notYet) {
      let changed = null;
      try {
        const blame = sh('git', ['blame', '--porcelain', '-L', `${n.line},${n.line}`, '--', p.rel], { cwd: ROOT });
        changed = new Date(Number(blame.match(/^committer-time (\d+)/m)[1]) * 1000).toISOString().slice(0, 10);
      } catch { /* shallow clone: no date */ }
      notYet.push({ file: p.rel, line: n.line, text: n.text, changed });
    }
    for (const h of p.hits.filter((x) => x.kind === 'phone')) {
      const d = phoneDigits(h.text);
      if (d && !recordPhones.has(d)) phones.set(`${p.rel}|${d}`, { file: p.rel, line: h.line, phone: h.text });
    }
  }
  return { notYet, phones: [...phones.values()] };
}

function freshness() {
  const dates = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.ya?ml$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/^\s*(?:- )?checked:\s*['"]?(\d{4}-\d{2}-\d{2})/gm)) dates.push(m[1]);
      }
    }
  })(path.join(ROOT, 'content'));
  const within = (n) => Math.round((100 * dates.filter((d) => daysSince(d) <= n).length) / dates.length);
  return { count: dates.length, d30: within(30), d90: within(90), d180: within(180), oldest: dates.sort()[0] };
}

function corrections() {
  const dir = path.join(ROOT, 'content', 'corrections');
  const items = fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).map((f) => YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) ?? {});
  const count = (key) => Object.entries(items.reduce((m, c) => ({ ...m, [c[key] ?? 'unknown']: (m[c[key] ?? 'unknown'] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${k}`).join(', ');
  const week = items.filter((c) => c.date && daysSince(String(c.date)) < 7).length;
  return { total: items.length, week, kinds: count('kind'), by: count('found_by') };
}

function gaps() {
  const dir = path.join(ROOT, 'content', 'gaps');
  return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f))
    .reduce((n, f) => n + ((YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) ?? {}).gaps?.length ?? 0), 0);
}

const py = (...args) => sh('python3', args, { cwd: ROOT });
const latest = (dir, re) => fs.readdirSync(dir).filter((f) => re.test(f)).sort().pop();

// ---------- Outcomes and presentation: the findability files ----------

function findability() {
  const dir = path.join(ROOT, 'content', 'findability');
  const file = latest(dir, /^\d{4}-\d{2}-\d{2}[a-z]?\.yaml$/);
  const out = py(path.join('content/findability/score.py'), path.join('content/findability', file));
  const score = Number(out.match(/Overall findability: (\d+)/)?.[1]);
  const [, pages, questions] = out.match(/Leading measure: (\d+) of (\d+)/) ?? [];
  const [, inSearch] = out.match(/showed up in search: (\d+) of/) ?? [];
  return { file, run: out.match(/^Run (\S+?):/)?.[1], score, pages: Number(pages), questions: Number(questions), inSearch: Number(inSearch) };
}

function benchmark() {
  const dir = path.join(ROOT, 'content', 'findability', 'benchmark');
  const file = latest(dir, /^\d{4}-\d{2}-\d{2}\.yaml$/);
  const run = YAML.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const out = py('content/findability/benchmark/score.py', path.join('content/findability/benchmark', file));
  const [, beats, needs, bar] = out.match(/beats every source on (\d+) of (\d+) needs; meets the bar on (\d+)/) ?? [];
  const ours = []; const others = [];
  for (const need of run.needs ?? []) {
    for (const s of need.sources ?? []) {
      if (s.covered === 'no' || s.covered === false || s.scored === false) continue;
      (s.kind === 'ours' ? ours : others).push(s);
    }
  }
  const pick = (list, f) => median(list.map(f));
  const side = (list) => ({
    kb: pick(list, (s) => s.auto?.kb),
    words: pick(list, (s) => s.auto?.words_before_answer),
    grade: pick(list, (s) => s.auto?.reading_grade),
    mustCall: list.filter((s) => s.must_call === true).length,
    firstPage: list.filter((s) => s.taps === 0 || s.auto?.answer_page === 1).length,
    n: list.length,
  });
  return { file, date: run.date, beats: Number(beats), needs: Number(needs), bar: Number(bar), ours: side(ours), others: side(others) };
}

function reach() {
  const out = py('content/findability/reach.py');
  const m = out.match(/All in-person listings: Morgantown (\d+), rest of the county (\d+) \((\d+)%\)/);
  return m ? { morgantown: Number(m[1]), rest: Number(m[2]), share: Number(m[3]) } : null;
}

function accessibility() {
  const text = fs.readFileSync(path.join(ROOT, 'docs', 'accessibility.md'), 'utf8');
  const head = text.match(/^## Results, (.+?) \((\d+) pages\)/m);
  const waiting = text.split(/^## Waiting\s*$/m)[1]?.split(/^## /m)[0] ?? '';
  return { date: head?.[1], pages: head?.[2], waiting: (waiting.match(/^\s*[-*] /gm) ?? []).length };
}

// ---------- Infrastructure ----------

async function health() {
  const issues = await api(`repos/${REPO}/issues?labels=health&state=all&per_page=50&sort=created&direction=desc`);
  const week = issues.filter((i) => !i.pull_request && daysSince(i.created_at) < 7);
  const open = issues.find((i) => !i.pull_request && i.state === 'open');
  return { week: week.length, open: open ? open.number : null };
}

async function sourceCheck() {
  const [issue] = await api(`repos/${REPO}/issues?labels=source-check&state=open&per_page=1`);
  if (!issue) return null;
  const n = (re) => Number(issue.body.match(re)?.[1] ?? 0);
  return {
    number: issue.number,
    broken: n(/^### Broken[^\n]*\((\d+)\)/m),
    moved: n(/^### Moved to another domain[^\n]*\((\d+)\)/m),
    phones: n(/^### Phone number not found[^\n]*\((\d+)\)/m),
    updated: issue.updated_at.slice(0, 10),
  };
}

async function feeds() {
  const r = await fetch(`${SITE}/api/v1/feed-health.json`, { headers: { 'User-Agent': 'mon-county-scorecard' } });
  if (!r.ok) throw new Error(`feed-health ${r.status}`);
  const j = await r.json();
  const by = (s) => j.feeds.filter((f) => f.status === s).length;
  return { total: j.feeds.length, live: by('live'), off: by('off'), other: j.feeds.length - by('live') - by('off') };
}

function pagesChanged() {
  const out = sh('git', ['log', `--since=${new Date(now - 7 * DAY).toISOString()}`, '--name-status', '--format=', '--', 'site/src/pages'], { cwd: ROOT });
  const added = new Set(); const changed = new Set();
  for (const line of out.split('\n')) {
    const [st, file] = line.split('\t');
    if (!file || !file.endsWith('.astro')) continue;
    (st === 'A' ? added : changed).add(file);
  }
  for (const f of added) changed.delete(f);
  return { added: added.size, changed: changed.size };
}

// ---------- Gather ----------

async function tryRun(lane, key, what, fn) {
  try { return await fn(); } catch (e) { notRead(lane, key, what, e.message.split('\n')[0].slice(0, 120)); return undefined; }
}

async function gather() {
  const I = 'Information', P = 'Presentation', S = 'Infrastructure', O = 'Outcomes';
  const details = {};

  const lag = await tryRun(I, 'lag_prs', 'Open PRs that change high-stakes pages', lagPrs);
  if (lag) {
    const late = lag.hits.filter((h) => h.days > LAG_DAYS);
    add({ lane: I, key: 'lag_prs', what: 'Open PRs that change high-stakes pages', ours: lag.hits.length, shown: `${lag.hits.length} (${late.length} older than ${LAG_DAYS} days)`, better: 'down', note: `of ${lag.open} open PRs${lag.unread ? `, ${lag.unread} could not be read` : ''}; goal: none older than ${LAG_DAYS} days` });
    add({ lane: I, key: 'lag_prs_late', what: `High-stakes PRs older than ${LAG_DAYS} days`, ours: late.length, shown: String(late.length), better: 'down' });
    details.lag = lag.hits;
  }
  const typed = typedText();
  add({ lane: I, key: 'not_yet_lines', what: 'High-stakes lines saying a date or fact is "not out yet"', ours: typed.notYet.length, shown: String(typed.notYet.length), better: 'down', note: 're-check each against its source and record' });
  add({ lane: I, key: 'typed_phones_unmatched', what: 'Phone numbers typed on high-stakes pages that no record has', ours: typed.phones.length, shown: String(typed.phones.length), better: 'down', note: 'a typed number gets no checked date' });
  details.typed = typed;

  const f = freshness();
  add({ lane: I, key: 'fresh_30', what: 'Checked dates within 30 days', ours: f.d30, shown: `${f.d30}% of ${f.count}`, better: 'up' });
  add({ lane: I, key: 'fresh_90', what: 'Checked dates within 90 days', ours: f.d90, shown: `${f.d90}%`, better: 'up' });
  add({ lane: I, key: 'fresh_oldest_days', what: 'Oldest checked date', ours: daysSince(f.oldest), shown: `${f.oldest} (${daysSince(f.oldest)} days)`, better: 'down' });

  const src = await tryRun(I, 'sources_broken', 'Source check: broken, moved, phone not found', sourceCheck);
  if (src) {
    add({ lane: I, key: 'sources_broken', what: 'Source check: broken links', ours: src.broken, shown: String(src.broken), better: 'down', note: `issue #${src.number}, updated ${src.updated}` });
    add({ lane: I, key: 'sources_moved', what: 'Source check: moved to another domain', ours: src.moved, shown: String(src.moved), better: 'down' });
    add({ lane: I, key: 'sources_phones', what: 'Source check: phone not found on its source', ours: src.phones, shown: String(src.phones), better: 'down' });
  }

  const c = corrections();
  add({ lane: I, key: 'corrections', what: 'Corrections logged', ours: c.total, shown: `${c.total} (${c.week} this week)`, note: `${c.kinds}; found by ${c.by}` });

  const fd = await tryRun(I, 'answer_pages', 'Findability questions with an answer page of ours', findability);
  if (fd) add({ lane: I, key: 'answer_pages', what: 'Findability questions with an answer page of ours', ours: fd.pages, shown: `${fd.pages} of ${fd.questions}`, better: 'up', note: `run ${fd.run}` });
  add({ lane: I, key: 'gaps', what: 'Open "Help wanted" gaps', ours: gaps(), shown: String(gaps()), note: 'shrinks as sources are found' });
  const r = await tryRun(I, 'reach', 'In-person listings outside Morgantown', reach);
  if (r) add({ lane: I, key: 'reach', what: 'In-person listings in the rest of the county', ours: r.share, shown: `${r.share}% (${r.rest} of ${r.rest + r.morgantown})`, better: 'up', note: 'about 72% of residents live outside the city' });

  // Presentation
  const b = await tryRun(P, 'bench', 'Source benchmark', benchmark);
  if (b) {
    add({ lane: P, key: 'first_screen', what: 'Urgent needs answered on the first page', today: `${b.others.firstPage} of ${b.others.n} other sources`, ours: b.ours.firstPage, shown: `${b.ours.firstPage} of ${b.ours.n}`, better: 'up', note: `source benchmark ${b.date}` });
    add({ lane: P, key: 'words_before', what: 'Words before the answer (middle value)', today: String(b.others.words ?? '?'), ours: b.ours.words, shown: String(b.ours.words ?? '?'), better: 'down' });
    add({ lane: P, key: 'must_call', what: 'Needs where you must call to learn the key fact', today: `${b.others.mustCall} of ${b.others.n}`, ours: b.ours.mustCall, shown: `${b.ours.mustCall} of ${b.ours.n}`, better: 'down' });
  }
  const rg = readJson('dist/reading-grades.json');
  if (rg) {
    const s = rg.summary;
    add({ lane: P, key: 'grade_opening', what: 'Reading grade of page openings (middle value)', ours: s.opening_median, shown: String(s.opening_median), better: 'down', noise: 0.3, note: `${s.opening_grade_8_or_under} of ${s.pages} at 8 or under` });
    add({ lane: P, key: 'grade_full', what: 'Reading grade of full text (middle value)', today: b?.others.grade != null ? String(round(b.others.grade)) : '', ours: s.full_median, shown: String(s.full_median), better: 'down', noise: 0.3 });
    add({ lane: P, key: 'grade_above_9', what: 'Page openings above grade 9', ours: s.opening_above_9, shown: String(s.opening_above_9), better: 'down' });
    add({ lane: P, key: 'help_now_above_8', what: 'Help now openings above grade 8', ours: s.help_now_above_8.length, shown: String(s.help_now_above_8.length), better: 'down' });
  } else notRead(P, 'grade_opening', 'Reading grade', 'run npm run build first');
  add({ lane: P, key: 'contrast', what: 'Color contrast', ours: null, shown: fs.existsSync('dist') ? 'all pairs pass' : 'not read', note: 'the build fails if a pair drops below 7:1' });
  const a = accessibility();
  add({ lane: P, key: 'a11y_waiting', what: 'Accessibility fixes waiting', ours: a.waiting, shown: String(a.waiting), better: 'down', note: `docs/accessibility.md, results of ${a.date} (${a.pages} pages)` });

  // Infrastructure
  const w = readJson('dist/page-weight.json');
  if (w) {
    add({ lane: S, key: 'pages', what: 'Pages built', ours: w.summary.pages, shown: String(w.summary.pages) });
    add({ lane: S, key: 'weight_median', what: 'Page weight (middle value, KB)', today: b?.others.kb != null ? String(Math.round(b.others.kb)) : '', ours: w.summary.median_kb, shown: String(w.summary.median_kb), better: 'down', noise: 1 });
    add({ lane: S, key: 'weight_urgent_max', what: 'Heaviest urgent page (KB)', ours: w.summary.urgent_heaviest_kb, shown: String(w.summary.urgent_heaviest_kb), better: 'down', noise: 1, note: `budget ${w.budget_kb.urgent} KB` });
    add({ lane: S, key: 'weight_over', what: 'Pages over the weight budget', ours: w.summary.over_budget, shown: String(w.summary.over_budget), better: 'down' });
  } else notRead(S, 'weight_median', 'Page weight', 'run npm run build first');
  const lhFile = opt('lighthouse');
  const lh = lhFile ? readJson(lhFile) : null;
  const lhRan = lh?.pages.filter((p) => p.lcp_ms != null) ?? [];
  if (lhRan.length) {
    const slowest = lhRan.reduce((x, y) => (y.lcp_ms > x.lcp_ms ? y : x));
    add({ lane: S, key: 'lcp_max', what: 'Slow 4G phone: main content shows (slowest of 5 pages, seconds)', ours: round(slowest.lcp_ms / 1000), shown: `${round(slowest.lcp_ms / 1000)} (${slowest.name})`, better: 'down', noise: 0.3, note: `goal under ${LCP_GOAL_MS / 1000}; Lighthouse ${lh.lighthouse}` });
    add({ lane: S, key: 'lcp_ok', what: 'Key pages under the 2.5 second goal', ours: lhRan.filter((p) => p.lcp_ms <= LCP_GOAL_MS).length, shown: `${lhRan.filter((p) => p.lcp_ms <= LCP_GOAL_MS).length} of ${lh.pages.length}`, better: 'up' });
    add({ lane: S, key: 'tbt_max', what: 'Slow 4G phone: most blocking time (ms)', ours: Math.max(...lhRan.map((p) => p.tbt_ms ?? 0)), shown: String(Math.max(...lhRan.map((p) => p.tbt_ms ?? 0))), better: 'down', noise: 50 });
    add({ lane: S, key: 'cls_max', what: 'Slow 4G phone: most layout shift', ours: Math.max(...lhRan.map((p) => p.cls ?? 0)), shown: String(Math.max(...lhRan.map((p) => p.cls ?? 0))), better: 'down', noise: 0.02 });
    details.lighthouse = lh;
  } else notRead(S, 'lcp_max', 'Slow 4G phone load speed', lhFile ? 'Lighthouse did not run' : 'no --lighthouse file');
  const h = await tryRun(S, 'health_fails', 'Health check failures this week', health);
  if (h) add({ lane: S, key: 'health_fails', what: 'Health check failures this week', ours: h.week, shown: String(h.week), better: 'down', note: h.open ? `failing now: #${h.open}` : 'nothing failing now' });
  const fe = await tryRun(S, 'feeds_live', 'Live calendar feeds', feeds);
  if (fe) add({ lane: S, key: 'feeds_live', what: 'Calendar feeds loading live', ours: fe.live, shown: `${fe.live} of ${fe.total}`, better: 'up', note: `${fe.off} off on purpose, ${fe.other} on a saved copy` });
  const pc = pagesChanged();
  add({ lane: S, key: 'pages_added', what: 'Page files added this week', ours: pc.added, shown: String(pc.added), note: `${pc.changed} more changed` });

  // Outcomes
  if (fd) {
    add({ lane: O, key: 'findability', what: 'Findability score (0 to 100)', ours: fd.score, shown: String(fd.score), better: 'up', noise: 2, note: `run ${fd.run}; moves of 2 or less are noise` });
    add({ lane: O, key: 'in_search', what: 'Our answer pages showing up in search', ours: fd.inSearch, shown: `${fd.inSearch} of ${fd.pages}`, better: 'up' });
  }
  if (b) add({ lane: O, key: 'beats_sources', what: 'Urgent needs where our page beats every source', ours: b.beats, shown: `${b.beats} of ${b.needs}`, better: 'up', note: `meets the bar on ${b.bar}` });
  add({ lane: O, key: 'visits', what: 'Visits and recognition', ours: null, shown: 'not measured', note: 'visit counts wait on a choice by David' });
  return details;
}

// ---------- Compare and write ----------

export function compare(row, prev) {
  if (row.ours == null || prev == null) return '';
  const delta = row.ours - prev;
  if (Math.abs(delta) <= row.noise) return delta === 0 ? 'same' : 'about the same';
  if (!row.better) return delta > 0 ? 'up' : 'down';
  return (delta > 0) === (row.better === 'up') ? '**better**' : '**worse**';
}

function render(week, prevWeek, prev, details) {
  const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const lines = [
    `# Weekly scorecard, ${week}`,
    '',
    `Made ${today} by \`site/scripts/scorecard.mjs\` (#1052) from the checks the project already runs. "Today's sources" are the guide, city page and official pages in the latest source benchmark, where a number can be compared. ${prevWeek ? `"Last week" is [${prevWeek}](${prevWeek}.md).` : 'There is no earlier week to compare with yet.'} A move counts only when it is bigger than the noise for that measure (findability: 2 points). How it works: [README](README.md).`,
    '',
  ];
  for (const lane of ['Information', 'Presentation', 'Infrastructure', 'Outcomes']) {
    lines.push(`## ${lane}`, '', "| Measure | Today's sources | Our site this week | Last week | Move | Notes |", '|---|---|---|---|---|---|');
    for (const r of rows.filter((x) => x.lane === lane)) {
      const p = prev?.[r.key];
      lines.push(`| ${cell(r.what)} | ${cell(r.today)} | ${cell(r.shown)} | ${cell(p?.shown ?? '')} | ${compare(r, p?.ours)} | ${cell(r.note)} |`);
    }
    lines.push('');
  }
  lines.push('## Details', '');
  lines.push(`### High-stakes PRs waiting (goal: live within ${LAG_DAYS} days)`, '');
  if (!details.lag) lines.push('Not read this run.');
  else if (!details.lag.length) lines.push('None open.');
  else for (const h of details.lag) lines.push(`- #${h.number}, open ${h.days} day${h.days === 1 ? '' : 's'}${h.days > LAG_DAYS ? ' (late)' : ''}: ${cell(h.title)}`);
  lines.push('', '### "Not out yet" lines on high-stakes pages', '', 'Typed into the page, so no check warns when the source posts the date. Re-check each one.', '');
  if (!details.typed.notYet.length) lines.push('None.');
  for (const n of details.typed.notYet) lines.push(`- \`${n.file}:${n.line}\`${n.changed ? ` (last changed ${n.changed})` : ''}: "${cell(n.text)}"`);
  lines.push('', '### Phone numbers typed on high-stakes pages that no record has', '', 'Not wrong by itself, but nothing re-checks a typed number. Move it into a record or confirm it.', '');
  if (!details.typed.phones.length) lines.push('None.');
  for (const t of details.typed.phones) lines.push(`- \`${t.file}:${t.line}\`: ${t.phone}`);
  if (details.lighthouse) {
    lines.push('', '### Slow 4G phone test, by page', '', `Lighthouse ${details.lighthouse.lighthouse}, mobile, simulated slow 4G (150 ms round trip, about 1.6 Mbps, CPU 4 times slower), one run per page on ${SITE}.`, '', '| Page | Main content shows (s) | Blocking (ms) | Layout shift |', '|---|---|---|---|');
    for (const p of details.lighthouse.pages) lines.push(`| ${p.name} (\`${p.route}\`) | ${p.lcp_ms == null ? `not measured${p.error ? `: ${cell(p.error)}` : ''}` : round(p.lcp_ms / 1000)} | ${p.tbt_ms ?? ''} | ${p.cls ?? ''} |`);
  }
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const out = path.resolve(opt('out', path.join(ROOT, 'docs', 'scorecard')));
  const week = opt('week', isoWeek(now));
  const details = await gather();
  fs.mkdirSync(out, { recursive: true });
  const prevWeek = fs.readdirSync(out).filter((f) => /^\d{4}-W\d{2}\.json$/.test(f) && f.slice(0, 8) < week).sort().pop()?.slice(0, 8);
  const prev = prevWeek ? readJson(path.join(out, `${prevWeek}.json`))?.measures : null;
  const md = render(week, prevWeek, prev, details);
  fs.writeFileSync(path.join(out, `${week}.md`), md);
  const measures = Object.fromEntries(rows.map((r) => [r.key, { lane: r.lane, what: r.what, ours: r.ours, shown: r.shown }]));
  fs.writeFileSync(path.join(out, `${week}.json`), JSON.stringify({ week, made: today, measures }, null, 1) + '\n');
  console.log(md);
  console.log(`Wrote ${path.relative(ROOT, path.join(out, week))}.md and .json`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
