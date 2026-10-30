#!/usr/bin/env node
// Health check for Mon County Community Hub.
//
// Checks the live site (pages, calendar feed, links, basic accessibility,
// content freshness, live feed sources) and, when GITHUB_TOKEN is set, the
// pipeline (Actions runs, PRs, stuck issues, the up-next queue, the daily run).
//
// Usage (from site/):
//   node scripts/health.mjs [--site URL] [--repo owner/name]
//       [--json FILE] [--md FILE] [--skip-links] [--skip-github] [--no-fail]
//
// Writes a JSON report and a short markdown summary (to the files given, or
// the markdown to stdout). Exits 1 if any check fails, unless --no-fail.
// Uses only Node built-ins and the `yaml` package the site already has.
// Thresholds and who reacts to what are in docs/operations/README.md.
import fs from 'node:fs';
import path from 'node:path';
import { loadCalendar, todayYmd, upcoming, CONTENT_DIR } from '../src/lib/content.mjs';

// ---------- settings ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const SITE = opt('site', process.env.HEALTH_SITE_URL || 'https://everythingmorgantown.org/').replace(/\/?$/, '/');
const REPO = opt('repo', process.env.GITHUB_REPOSITORY || 'david-shortman/mon-county-community-hub');
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const REPO_ROOT = path.resolve(CONTENT_DIR, '..');
const UA = 'MonCountyCommunityHub-health/1.0 (+https://github.com/david-shortman/mon-county-community-hub)';

// Thresholds. Keep in sync with docs/operations/README.md.
export const T = {
  pageTimeoutMs: 20_000,
  linkTimeoutMs: 15_000,
  linkConcurrency: 6,
  maxPages: 60,
  calendarMinUpcoming: 3, // fewer upcoming entries than this is a warning
  calendarRunwayDays: 14, // warn if nothing starts after today + this many days
  deployMaxAgeHours: 30, // the site rebuilds daily; older than this means deploys are stuck
  recheckMonths: 6, // source checked dates older than this are past due
  recheckSoonDays: 30, // ...and within this many days of that are due soon
  feedSnapshotMaxDays: 14,
  prOpenWarnDays: 3,
  inProgressStaleDays: 3,
  buildLogMaxAgeDays: 1, // daily loop should add an entry at least this often
};

const now = new Date();
const today = todayYmd(now);
const checks = [];

// status: ok | warn | fail | skip. owner: who reacts. fixable: an agent can fix it.
function record(id, area, status, summary, { details = [], owner = 'Claude Code', fixable = false } = {}) {
  checks.push({ id, area, status, summary, details, owner, agent_fixable: fixable && status !== 'ok' && status !== 'skip' });
}

async function get(url, { method = 'GET', timeout = T.pageTimeoutMs, headers = {} } = {}) {
  const res = await fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
    headers: { 'User-Agent': UA, ...headers },
  });
  const body = method === 'HEAD' ? '' : await res.text();
  return { status: res.status, ok: res.ok, url: res.url, body, headers: res.headers };
}

const daysBetween = (a, b) => (new Date(`${b}T12:00:00Z`) - new Date(`${a}T12:00:00Z`)) / 86_400_000;
const addDays = (d, n) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const hoursSince = (iso) => (now - new Date(iso)) / 3_600_000;

// ---------- product: pages ----------
const pages = new Map(); // url -> { status, body }
const outbound = new Map(); // url -> Set of where it was found

function linksIn(html, base) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const href = (m[2] ?? m[3] ?? '').trim();
    if (!href || href.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(href)) continue;
    try { out.push(new URL(href, base).href.replace(/#.*$/, '')); } catch { /* skip bad href */ }
  }
  return out;
}

async function crawl() {
  const seeds = ['', 'calendar/', 'about/'].map((p) => new URL(p, SITE).href);
  const queue = [...seeds];
  const seen = new Set(queue);
  while (queue.length && pages.size < T.maxPages) {
    const url = queue.shift();
    let r;
    try { r = await get(url); } catch (err) { pages.set(url, { status: 0, error: err.cause?.code || err.message }); continue; }
    pages.set(url, { status: r.status, body: r.body, type: r.headers.get('content-type') || '' });
    if (!r.ok || !/html/.test(r.headers.get('content-type') || '')) continue;
    for (const link of linksIn(r.body, url)) {
      if (link.startsWith(SITE)) {
        if (!seen.has(link) && !/\.(ics|svg|png|jpe?g|webp|xml|txt|json)$/i.test(link)) { seen.add(link); queue.push(link); }
      } else if (/^https?:/.test(link)) {
        if (!outbound.has(link)) outbound.set(link, new Set());
        outbound.get(link).add(url.replace(SITE, '/'));
      }
    }
  }
}

async function checkPages() {
  await crawl();
  const home = pages.get(SITE);
  if (!home || home.status !== 200) {
    record('site-up', 'product', 'fail', `Home page is down (status ${home?.status ?? 'none'}${home?.error ? `, ${home.error}` : ''}).`, { owner: 'Claude Code, then David if it is a hosting or settings problem', fixable: true });
  } else {
    record('site-up', 'product', 'ok', 'Home page returns 200.');
  }
  const bad = [...pages].filter(([, p]) => p.status !== 200);
  record('pages-200', 'product', bad.length ? 'fail' : 'ok',
    bad.length ? `${bad.length} of ${pages.size} site pages do not return 200.` : `All ${pages.size} site pages return 200.`,
    { details: bad.map(([u, p]) => `${u.replace(SITE, '/')}: ${p.status || p.error}`), fixable: true });

  // A missing page should give a real 404 (GitHub Pages serves 404.html with status 404).
  try {
    const r = await get(new URL('health-check-missing-page/', SITE).href);
    record('not-found', 'product', r.status === 404 ? 'ok' : 'warn',
      r.status === 404 ? 'Missing pages return 404.' : `Missing pages return ${r.status} instead of 404.`, { fixable: true });
  } catch (err) {
    record('not-found', 'product', 'warn', `Could not test a missing page: ${err.message}`);
  }
}

// ---------- product: deploy freshness ----------
// The calendar page prints "Updated <Month D, YYYY>" at build time. The site
// rebuilds every morning, so an old date means deploys have stopped.
function checkDeployFresh() {
  const cal = pages.get(new URL('calendar/', SITE).href);
  const m = cal?.body?.match(/Updated ([A-Z][a-z]+ \d{1,2}, \d{4})/);
  if (!m) return record('deploy-fresh', 'product', 'warn', 'Could not find the "Updated" date on the calendar page.', { fixable: true });
  const built = new Date(`${m[1]} 12:00 UTC`);
  const builtYmd = Number.isNaN(built.getTime()) ? null : built.toISOString().slice(0, 10);
  if (!builtYmd) return record('deploy-fresh', 'product', 'warn', `Could not read the date "${m[1]}".`);
  const age = daysBetween(builtYmd, today);
  const status = age <= 1 ? 'ok' : 'fail';
  record('deploy-fresh', 'product', status,
    status === 'ok' ? `Live site was built ${builtYmd}.` : `Live site was last built ${builtYmd}, ${age} days ago. Daily rebuilds are not reaching the site.`,
    { owner: 'Claude Code (check the Site workflow), David if Actions or Pages settings', fixable: true });
}

// ---------- product: calendar.ics ----------
export function parseIcs(text) {
  const problems = [];
  if (!/\r\n/.test(text)) problems.push('lines do not end in CRLF');
  const raw = text.split(/\r?\n/);
  const long = raw.filter((l) => Buffer.byteLength(l, 'utf8') > 75).length;
  if (long) problems.push(`${long} lines are longer than 75 octets`);
  const lines = [];
  for (const l of raw) {
    if (/^[ \t]/.test(l) && lines.length) lines[lines.length - 1] += l.slice(1);
    else if (l) lines.push(l);
  }
  if (lines[0] !== 'BEGIN:VCALENDAR') problems.push('does not start with BEGIN:VCALENDAR');
  if (lines[lines.length - 1] !== 'END:VCALENDAR') problems.push('does not end with END:VCALENDAR');
  if (!lines.includes('VERSION:2.0')) problems.push('missing VERSION:2.0');
  if (!lines.some((l) => l.startsWith('PRODID:'))) problems.push('missing PRODID');
  const events = [];
  let cur = null;
  for (const l of lines) {
    if (l === 'BEGIN:VEVENT') { if (cur) problems.push('nested VEVENT'); cur = {}; continue; }
    if (l === 'END:VEVENT') { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const i = l.indexOf(':');
    if (i < 0) { problems.push(`bad line: ${l.slice(0, 40)}`); continue; }
    const name = l.slice(0, i).split(';')[0].toUpperCase();
    cur[name] = l.slice(i + 1);
  }
  if (cur) problems.push('VEVENT not closed');
  const uids = new Set();
  for (const e of events) {
    for (const f of ['UID', 'DTSTAMP', 'DTSTART', 'SUMMARY']) if (!e[f]) problems.push(`event "${e.SUMMARY ?? e.UID ?? '?'}" missing ${f}`);
    if (e.UID && uids.has(e.UID)) problems.push(`duplicate UID ${e.UID}`);
    // Text values must escape ; and , with a backslash (RFC 5545 3.3.11).
    for (const f of ['SUMMARY', 'DESCRIPTION', 'LOCATION']) {
      if (e[f] && /(^|[^\\])(\\\\)*[;,]/.test(e[f])) problems.push(`event "${e.UID ?? '?'}" has an unescaped ; or , in ${f}`);
    }
    uids.add(e.UID);
    const d = (v) => (v ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : null);
    e.start = d(e.DTSTART);
    e.end = e.DTEND ? d(e.DTEND) : e.start; // DTEND is exclusive for all-day events
  }
  return { events, problems };
}

async function checkIcs() {
  const url = new URL('calendar.ics', SITE).href;
  let r;
  try { r = await get(url); } catch (err) {
    return record('ics-parses', 'product', 'fail', `calendar.ics could not be fetched: ${err.message}`, { fixable: true });
  }
  pages.set(url, { status: r.status, type: r.headers.get('content-type') });
  if (r.status !== 200) return record('ics-parses', 'product', 'fail', `calendar.ics returns ${r.status}.`, { fixable: true });
  const { events, problems } = parseIcs(r.body);
  const type = r.headers.get('content-type') || '';
  if (!/text\/calendar/.test(type)) problems.push(`served as "${type}", not text/calendar (some phones will not subscribe)`);
  record('ics-parses', 'product', problems.length ? 'fail' : 'ok',
    problems.length ? `calendar.ics has ${problems.length} problems.` : `calendar.ics parses with ${events.length} events.`,
    { details: problems.slice(0, 20), fixable: true });

  const live = events.filter((e) => e.end > today);
  const runway = addDays(today, T.calendarRunwayDays);
  const later = live.filter((e) => e.start > runway);
  let status = 'ok';
  let summary = `${live.length} upcoming events in the feed, ${later.length} start after ${runway}.`;
  if (!live.length) { status = 'fail'; summary = 'calendar.ics has no upcoming events. Residents who subscribed see nothing.'; }
  else if (live.length < T.calendarMinUpcoming || !later.length) { status = 'warn'; summary += ' The calendar is close to running dry.'; }
  record('ics-entries', 'product', status, summary, { owner: 'Duet (add dates, #17), Claude Code (feeds, #31)', fixable: true });
}

// ---------- product: content in the repo ----------
function checkContent() {
  let entries;
  try { entries = loadCalendar(); } catch (err) {
    return record('content-loads', 'product', 'fail', `content/calendar could not be read: ${err.message}`, { fixable: true });
  }
  const due = new Date(`${today}T12:00:00Z`); due.setUTCMonth(due.getUTCMonth() - T.recheckMonths);
  const dueYmd = due.toISOString().slice(0, 10);
  const soonYmd = addDays(dueYmd, T.recheckSoonDays);
  const past = [];
  const soon = [];
  for (const e of entries) {
    if (e.ends < today) continue; // finished entries do not show, so skip them
    const oldest = (e.sources || []).map((s) => s.checked).filter(Boolean).sort()[0];
    if (!oldest || oldest < dueYmd) past.push(`${e._file}: last checked ${oldest ?? 'never'}`);
    else if (oldest < soonYmd) soon.push(`${e._file}: last checked ${oldest}`);
  }
  record('content-recheck', 'product', past.length ? 'warn' : 'ok',
    past.length ? `${past.length} entries are past their re-check date.` : `No entries past their re-check date (${soon.length} due within ${T.recheckSoonDays} days).`,
    { details: [...past, ...soon.map((s) => `due soon: ${s}`)], owner: 'Duet', fixable: true });

  const ended = entries.filter((e) => e.ends < addDays(today, -30));
  if (ended.length) {
    record('content-ended', 'product', 'warn', `${ended.length} calendar files ended over 30 days ago. Roll them forward or remove them.`,
      { details: ended.map((e) => `${e._file}: ended ${e.ends}`), owner: 'Duet', fixable: true });
  }

  const soonList = upcoming(entries, today, 62);
  record('content-upcoming', 'product', soonList.length ? 'ok' : 'warn',
    `${soonList.length} hand-checked entries are in the next 62 days on main.`, { owner: 'Duet' });
}

// ---------- product: live feed sources (from #31) ----------
async function checkFeeds() {
  const dir = path.join(REPO_ROOT, 'site/src/lib/feeds/snapshots');
  if (!fs.existsSync(dir)) return record('feeds', 'product', 'skip', 'No live feed adapters on this branch yet (#31).');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
  const details = [];
  let worst = 'ok';
  const bump = (s) => { if (s === 'fail' || (s === 'warn' && worst === 'ok')) worst = s; };
  for (const f of files) {
    let snap;
    try { snap = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { details.push(`${f}: snapshot is not valid JSON`); bump('fail'); continue; }
    const age = snap.fetched ? Math.floor(hoursSince(snap.fetched) / 24) : null;
    if (age === null || age > T.feedSnapshotMaxDays) { details.push(`${snap.id ?? f}: saved copy is ${age ?? '?'} days old`); bump('warn'); }
    if (!snap.feed_url) continue;
    try {
      const r = await get(snap.feed_url, { timeout: T.linkTimeoutMs });
      if (!r.ok) { details.push(`${snap.id}: feed returns ${r.status}`); bump('warn'); }
      else if (r.body.length < 50) { details.push(`${snap.id}: feed is empty`); bump('warn'); }
    } catch (err) { details.push(`${snap.id}: feed unreachable (${err.cause?.code || err.message})`); bump('warn'); }
  }
  record('feeds', 'product', worst, worst === 'ok' ? `All ${files.length} live feeds respond.` : `Problems with ${details.length} live feed items. The site falls back to saved copies.`,
    { details, owner: 'Claude Code (Builder, #31)', fixable: true });
}

// ---------- product: outbound links ----------
function collectContentLinks() {
  for (const e of loadCalendar()) {
    if (e.ends < today) continue;
    for (const u of [e.url, ...(e.sources || []).map((s) => s.url)]) {
      if (!u || !/^https?:/.test(u)) continue;
      if (!outbound.has(u)) outbound.set(u, new Set());
      outbound.get(u).add(e._file);
    }
  }
}

async function checkLink(url) {
  // Some sites reject HEAD or bots. Try HEAD, then GET.
  try {
    let r = await get(url, { method: 'HEAD', timeout: T.linkTimeoutMs });
    if (r.status >= 400) r = await get(url, { timeout: T.linkTimeoutMs });
    return { status: r.status };
  } catch (err) {
    return { status: 0, error: err.cause?.code || err.name || err.message };
  }
}

async function checkLinks() {
  if (flag('skip-links')) return record('links', 'product', 'skip', 'Outbound link check skipped (--skip-links).');
  collectContentLinks();
  // GitHub "new issue" links need a login, so they always look broken to a robot.
  const needsLogin = (u) => /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/new/.test(u);
  const urls = [...outbound.keys()].filter((u) => !u.startsWith(SITE) && !needsLogin(u));
  const results = new Map();
  let i = 0;
  await Promise.all(Array.from({ length: T.linkConcurrency }, async () => {
    while (i < urls.length) { const u = urls[i++]; results.set(u, await checkLink(u)); }
  }));
  const broken = [];
  const unsure = [];
  for (const [u, r] of results) {
    const where = [...outbound.get(u)].slice(0, 3).join(', ');
    // 404 and 410 mean the page is gone. 401, 403, 429, 5xx, and network errors
    // are often bot blocking or a blip, so they are only a warning.
    if (r.status === 404 || r.status === 410) broken.push(`${u} (${r.status}) on ${where}`);
    else if (r.status === 0 || r.status >= 400) unsure.push(`${u} (${r.status || r.error}) on ${where}`);
  }
  const status = broken.length ? 'fail' : unsure.length ? 'warn' : 'ok';
  record('links', 'product', status,
    status === 'ok' ? `All ${urls.length} outbound links work.` : `${broken.length} broken and ${unsure.length} unverified of ${urls.length} outbound links.`,
    { details: [...broken.map((b) => `broken: ${b}`), ...unsure.map((u) => `unverified: ${u}`)], owner: 'Claude Code (fix the link), Duet (find the new page)', fixable: broken.length > 0 });
}

// ---------- product: basic accessibility (static, no browser) ----------
// A quick guard against regressions. The full review uses Playwright and axe
// (docs/rubrics/accessibility.md, docs/reviews/tools/site-review.js).
export function a11yProblems(html) {
  const p = [];
  if (!/<html[^>]*\blang=/i.test(html)) p.push('no lang on <html>');
  if (!/<title>[^<]+<\/title>/i.test(html)) p.push('no page title');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) p.push('no viewport meta');
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) p.push(`${h1} h1 headings (want 1)`);
  if (!/<main\b/i.test(html)) p.push('no <main> landmark');
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) if (!/\balt=/i.test(m[0])) p.push('image without alt');
  for (const m of html.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = m[1].replace(/<[^>]+>/g, '').trim();
    if (!text && !/aria-label=/i.test(m[0])) p.push('link with no text');
  }
  let last = 0;
  for (const m of html.matchAll(/<h([1-6])\b/gi)) {
    const lvl = Number(m[1]);
    if (last && lvl > last + 1) { p.push(`heading jumps from h${last} to h${lvl}`); break; }
    last = lvl;
  }
  if (/\u2014/.test(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ''))) p.push('contains an em dash');
  return p;
}

function checkA11y() {
  const details = [];
  for (const [url, pg] of pages) {
    if (pg.status !== 200 || !/html/.test(pg.type || '') || !pg.body) continue;
    for (const prob of a11yProblems(pg.body)) details.push(`${url.replace(SITE, '/')}: ${prob}`);
  }
  record('a11y-basic', 'product', details.length ? 'warn' : 'ok',
    details.length ? `${details.length} basic accessibility problems.` : 'No basic accessibility problems (lang, title, one h1, alt text, link text, heading order).',
    { details, owner: 'Claude Code (Design reviewer to confirm)', fixable: true });
}

// ---------- pipeline (GitHub REST API) ----------
async function gh(p) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${p}`, {
    signal: AbortSignal.timeout(T.pageTimeoutMs),
    headers: { 'User-Agent': UA, Accept: 'application/vnd.github+json', ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) },
  });
  if (!res.ok) throw new Error(`GitHub API ${p} returned ${res.status}`);
  return res.json();
}

async function checkRuns() {
  const { workflow_runs: runs } = await gh('/actions/runs?branch=main&per_page=100');
  const byWorkflow = new Map();
  for (const r of runs) if (!byWorkflow.has(r.name)) byWorkflow.set(r.name, r);
  const badConclusions = ['failure', 'startup_failure', 'timed_out', 'action_required'];
  const failing = [...byWorkflow.values()].filter((r) => badConclusions.includes(r.conclusion));
  const dayAgo = runs.filter((r) => hoursSince(r.created_at) <= 24);
  const failedDay = dayAgo.filter((r) => badConclusions.includes(r.conclusion));
  const startup = failing.some((r) => r.conclusion === 'startup_failure');
  record('actions-main', 'pipeline', failing.length ? 'fail' : 'ok',
    failing.length
      ? `Latest run is failing for: ${failing.map((r) => `${r.name} (${r.conclusion})`).join(', ')}. ${failedDay.length} of ${dayAgo.length} runs on main failed in the last 24 hours.`
      : `Latest run on main passed for every workflow (${dayAgo.length} runs in the last 24 hours).`,
    {
      details: failing.map((r) => `${r.name}: ${r.html_url}`),
      // A startup failure happens before any step runs, so it is a settings problem, not code.
      owner: startup ? 'David (repo or account Actions settings)' : 'Claude Code',
      fixable: !startup,
    });

  // Last good deploy: ask the Site workflow directly, since a flood of failed
  // runs can push the last success off the first page of all runs.
  const { workflow_runs: goodRuns } = await gh('/actions/workflows/site.yml/runs?branch=main&status=success&per_page=1');
  const good = goodRuns[0];
  const age = good ? hoursSince(good.updated_at) : Infinity;
  record('deploy-age', 'pipeline', age <= T.deployMaxAgeHours ? 'ok' : 'fail',
    good ? `Last successful Site deploy was ${age.toFixed(1)} hours ago.` : 'No successful Site deploy on main found.',
    { details: good ? [good.html_url] : [], owner: startup ? 'David' : 'Claude Code', fixable: !startup });
  if (!good) return;

  // Merged work that never went live: commits on main newer than the last good deploy.
  const commits = await gh('/commits?sha=main&per_page=30');
  const since = new Date(good.created_at);
  const notLive = commits.filter((c) => new Date(c.commit.committer.date) > since && hoursSince(c.commit.committer.date) > 0.5);
  record('main-deployed', 'pipeline', notLive.length ? 'fail' : 'ok',
    notLive.length ? `${notLive.length} commits merged to main more than 30 minutes ago are not live yet.` : 'Everything merged to main is live.',
    { details: notLive.map((c) => `${c.sha.slice(0, 7)} ${c.commit.message.split('\n')[0]}`), owner: startup ? 'David' : 'Claude Code', fixable: !startup });
}

async function checkPrs() {
  const prs = await gh('/pulls?state=open&per_page=100');
  const old = [];
  const conflicted = [];
  for (const pr of prs) {
    const days = hoursSince(pr.created_at) / 24;
    const waits = pr.labels.some((l) => l.name === 'for:david');
    if (days > T.prOpenWarnDays) old.push(`#${pr.number} ${pr.title} (${Math.floor(days)} days${waits ? ', waits for David' : ''})`);
    const full = await gh(`/pulls/${pr.number}`);
    if (full.mergeable === false || full.mergeable_state === 'dirty') conflicted.push({ pr, waits });
  }
  record('prs-old', 'pipeline', old.length ? 'warn' : 'ok',
    old.length ? `${old.length} PRs open longer than ${T.prOpenWarnDays} days.` : `${prs.length} open PRs, none older than ${T.prOpenWarnDays} days.`,
    { details: old, owner: 'PR author, or David for for:david PRs' });

  // Which files do conflicted PRs share? Repeated conflicts on one file mean it needs a new layout.
  const fileCount = new Map();
  for (const { pr } of conflicted) {
    const files = await gh(`/pulls/${pr.number}/files?per_page=100`);
    for (const f of files) fileCount.set(f.filename, (fileCount.get(f.filename) || 0) + 1);
  }
  const shared = [...fileCount].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
  record('prs-conflicts', 'pipeline', conflicted.length ? 'warn' : 'ok',
    conflicted.length ? `${conflicted.length} PRs have merge conflicts.` : 'No open PRs have merge conflicts.',
    {
      details: [
        ...conflicted.map(({ pr, waits }) => `#${pr.number} ${pr.title}${waits ? ' (for:david)' : ''}`),
        ...shared.map(([f, n]) => `shared conflict file: ${f} in ${n} PRs`),
      ],
      owner: 'PR author (rebase, keep every build-log entry)',
      fixable: conflicted.some(({ waits }) => !waits),
    });
}

async function checkIssues() {
  const issues = (await gh('/issues?state=open&per_page=100')).filter((i) => !i.pull_request);
  const has = (i, n) => i.labels.some((l) => l.name === n);
  const stuck = issues.filter((i) => has(i, 'in-progress') && hoursSince(i.updated_at) / 24 > T.inProgressStaleDays);
  record('issues-stuck', 'pipeline', stuck.length ? 'warn' : 'ok',
    stuck.length ? `${stuck.length} issues marked in-progress with no activity for ${T.inProgressStaleDays}+ days.` : 'No in-progress issues have gone quiet.',
    { details: stuck.map((i) => `#${i.number} ${i.title} (last update ${i.updated_at.slice(0, 10)})`), owner: 'Whoever claimed it; anyone may ask on the issue' });

  const queue = issues.filter((i) => has(i, 'up-next') && !has(i, 'in-progress'));
  const forCode = issues.filter((i) => has(i, 'for:code') && !has(i, 'in-progress'));
  record('up-next-queue', 'pipeline', queue.length ? 'ok' : 'warn',
    queue.length ? `${queue.length} issues waiting in the up-next queue.` : `The up-next queue is empty (${forCode.length} unclaimed for:code issues could be queued).`,
    { owner: 'Duet or the daily run (pick and label the next issue)' });

  const davidOpen = issues.filter((i) => has(i, 'for:david'));
  record('for-david', 'pipeline', 'ok', `${davidOpen.length} open issues wait for David.`, { details: davidOpen.map((i) => `#${i.number} ${i.title}`), owner: 'David' });
}

// The daily run (6:41 AM Eastern) should add a build-log entry each day.
function checkDailyRun() {
  // One file per entry: docs/build-log/YYYY-MM-DD-HHMM-<short-name>.md
  const dir = path.join(REPO_ROOT, 'docs/build-log');
  if (!fs.existsSync(dir)) return record('daily-run', 'pipeline', 'warn', 'docs/build-log/ not found.');
  const dates = fs.readdirSync(dir).map((f) => f.match(/^(\d{4}-\d{2}-\d{2})-.*\.md$/)?.[1]).filter(Boolean).sort();
  const latest = dates[dates.length - 1];
  const age = latest ? daysBetween(latest, today) : Infinity;
  // Before 9 AM Eastern, yesterday's entry still counts.
  const hourET = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hourCycle: 'h23', timeZone: 'America/New_York' }).format(now));
  const allowed = T.buildLogMaxAgeDays + (hourET < 9 ? 1 : 0);
  record('daily-run', 'pipeline', age <= allowed ? 'ok' : 'warn',
    latest ? `Newest build-log entry is from ${latest}.` : 'No dated build-log entries.',
    { details: age > allowed ? ['The daily scheduled run may not be running, or it shipped without a log entry.'] : [], owner: 'David (the scheduled run lives outside the repo)' });
}

async function checkPipeline() {
  if (flag('skip-github')) return record('github', 'pipeline', 'skip', 'Pipeline checks skipped (--skip-github).');
  if (!TOKEN) record('github-token', 'pipeline', 'skip', 'No GITHUB_TOKEN, so using unauthenticated API calls (low rate limit).');
  for (const [id, fn] of [['actions-main', checkRuns], ['prs', checkPrs], ['issues', checkIssues]]) {
    try { await fn(); } catch (err) { record(id, 'pipeline', 'skip', `Could not check: ${err.message}`); }
  }
  checkDailyRun();
}

// ---------- report ----------
const rank = { ok: 0, skip: 0, warn: 1, fail: 2 };
function overall() {
  return checks.reduce((w, c) => (rank[c.status] > rank[w] ? c.status : w), 'ok');
}

export function toMarkdown(report) {
  const icon = { ok: 'OK', warn: 'WARN', fail: 'FAIL', skip: 'SKIP' };
  const lines = [
    `# Health: ${report.status.toUpperCase()}`,
    '',
    `Checked ${report.checked_at} against ${report.site} and ${report.repo}.`,
    '',
    '| Status | Check | Area | Summary | Who reacts |',
    '|---|---|---|---|---|',
  ];
  const order = [...report.checks].sort((a, b) => rank[b.status] - rank[a.status]);
  for (const c of order) lines.push(`| ${icon[c.status]} | ${c.id} | ${c.area} | ${c.summary.replace(/\|/g, '/')} | ${c.status === 'ok' || c.status === 'skip' ? '' : c.owner} |`);
  const withDetails = order.filter((c) => c.details.length && c.status !== 'ok');
  if (withDetails.length) {
    lines.push('', '## Details');
    for (const c of withDetails) {
      lines.push('', `**${c.id}**`, '');
      for (const d of c.details.slice(0, 25)) lines.push(`- ${d}`);
      if (c.details.length > 25) lines.push(`- ...and ${c.details.length - 25} more`);
    }
  }
  return lines.join('\n') + '\n';
}

async function main() {
  await checkPages();
  checkDeployFresh();
  await checkIcs();
  checkContent();
  await checkFeeds();
  await checkLinks();
  checkA11y();
  await checkPipeline();

  const report = {
    status: overall(),
    checked_at: now.toISOString(),
    site: SITE,
    repo: REPO,
    counts: Object.fromEntries(['ok', 'warn', 'fail', 'skip'].map((s) => [s, checks.filter((c) => c.status === s).length])),
    agent_fixable: checks.some((c) => c.agent_fixable && c.status === 'fail'),
    checks,
  };
  const md = toMarkdown(report);
  const jsonOut = opt('json');
  const mdOut = opt('md');
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2) + '\n');
  if (mdOut) fs.writeFileSync(mdOut, md);
  if (!mdOut) process.stdout.write(md);
  if (!jsonOut && flag('print-json')) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(report.status === 'fail' && !flag('no-fail') ? 1 : 0);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) main().catch((err) => { console.error(err); process.exit(2); });
