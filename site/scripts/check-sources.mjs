#!/usr/bin/env node
// Source check (#16, part of #122). Builds the source registry and checks it.
//
// The registry is every outside link we rely on, gathered on each run from
// content/ (orgs, resources, calendar, doors) and from the links on the built
// site (site/dist, if it exists). content/source-rules.yaml puts each source in
// one group: monitored (fetched here), manual (a person checks it) or
// reference (not a resident-facing fact). Nobody keeps the list by hand.
//
// For each monitored source it reports:
//   broken      404 or 410, a domain that no longer resolves, or a bad certificate
//   moved       a redirect to a different domain (a lapsed domain can be bought
//               by someone else, so this is never followed silently)
//   phone       a phone number in our entry that no longer appears on its sources
//   unverified  blocked, rate limited, server error, timeout or reset (often bot
//               blocking or a blip, not a problem for people)
//   changed     the page text changed since the last run (a hint for re-checking)
//   redirected  same site, new address (worth updating the link)
// Help now pages (#453) are checked first and listed first.
//
// Polite by design (#166): one request at a time per site, a pause between
// requests, robots.txt honored, no Facebook. No Claude calls, no extra packages.
//
// Usage (from site/):
//   node scripts/check-sources.mjs [--json FILE] [--md FILE]
//       [--state-in FILE] [--state-out FILE] [--help-now-only] [--limit N]
//       [--registry FILE]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';
import { CONTENT_DIR } from '../src/lib/content.mjs';

const UA = 'MonCountyCommunityHub-sourcecheck/1.0 (+https://github.com/david-shortman/mon-county-community-hub)';
const UA_TOKEN = 'moncountycommunityhub';
const SITE_DIR = path.resolve(CONTENT_DIR, '../site');
const DIST = path.join(SITE_DIR, 'dist');

export const T = {
  timeoutMs: 20_000,
  pauseMs: 1_500, // between requests to the same site
  hostConcurrency: 6, // different sites checked at the same time
  maxRedirects: 6,
  maxBytes: 4_000_000,
};

// Content folders that hold facts residents rely on. Findability results and
// corrections hold search results and reports, not our sources.
const SKIP_CONTENT = new Set(['findability', 'corrections']);

// ---------- rules ----------
export function loadRules(file = path.join(CONTENT_DIR, 'source-rules.yaml')) {
  const r = YAML.parse(fs.readFileSync(file, 'utf8')) || {};
  return { helpNowPages: r.help_now_pages || [], rules: r.rules || [], sameOwner: r.same_owner || [] };
}

export function hostOf(u) {
  try { return new URL(u).hostname.toLowerCase().replace(/^www\./, ''); } catch { return ''; }
}

// The part of a host that an owner registers: last two labels. Lenient on
// purpose: a move between wv.gov agencies or between subdomains is not a lapse.
export function baseDomain(host) {
  return host.split('.').slice(-2).join('.');
}

export function ruleFor(url, rules) {
  const host = hostOf(url);
  for (const r of rules) {
    if (r.prefix && url.startsWith(r.prefix)) return r;
    if (r.host && (host === r.host || host.endsWith(`.${r.host}`))) return r;
  }
  return null;
}

export function sameOwner(a, b, pairs = []) {
  const x = baseDomain(hostOf(a));
  const y = baseDomain(hostOf(b));
  if (x === y) return true;
  return pairs.some((p) => (p.includes(x) && p.includes(y)));
}

// ---------- registry ----------
const isUrl = (s) => typeof s === 'string' && /^https?:\/\/[^\s{}$`]+$/.test(s.trim());
const clean = (u) => u.trim().replace(/#.*$/, '').replace(/[.,;:]+$/, '');

function yamlFiles(dir, rel = '') {
  const out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const r = rel ? `${rel}/${f.name}` : f.name;
    if (f.isDirectory()) { if (!SKIP_CONTENT.has(f.name)) out.push(...yamlFiles(path.join(dir, f.name), r)); }
    else if (/\.ya?ml$/.test(f.name) && f.name !== 'source-rules.yaml') out.push(r);
  }
  return out;
}

function urlsIn(value, out = []) {
  if (isUrl(value)) out.push(clean(value));
  else if (Array.isArray(value)) value.forEach((v) => urlsIn(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => urlsIn(v, out));
  return out;
}

// Full phone numbers only (10 or 11 digits). Short codes like 211 and text
// codes like 898-211 cannot be checked against a page.
export function phoneKey(p) {
  const d = String(p ?? '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) return d.slice(1);
  return d.length === 10 ? d : null;
}

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) out.push(...htmlFiles(p));
    else if (f.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export function linksIn(html) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const href = (m[2] ?? m[3] ?? '').replace(/&amp;/g, '&').trim();
    if (isUrl(href)) out.push(clean(href));
  }
  return out;
}

function pagePath(file) {
  const rel = path.relative(DIST, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

export function buildRegistry({ rules = loadRules(), distDir = DIST } = {}) {
  const sources = new Map(); // url -> entry
  const add = (url, where) => {
    if (!sources.has(url)) sources.set(url, { url, host: hostOf(url), used_by: new Set() });
    sources.get(url).used_by.add(where);
  };
  const phoneChecks = []; // { file, name, phone, key, urls }

  for (const rel of yamlFiles(CONTENT_DIR)) {
    const data = YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, rel), 'utf8'));
    for (const u of urlsIn(data)) add(u, `content/${rel}`);
    if (!data || typeof data !== 'object' || Array.isArray(data)) continue;
    const urls = [...new Set([...(data.sources || []).map((s) => s?.url), data.contact?.url, data.url].filter(isUrl).map(clean))];
    for (const phone of [data.phone, data.contact?.phone]) {
      const key = phoneKey(phone);
      if (key && urls.length) phoneChecks.push({ file: `content/${rel}`, name: data.title || data.name || rel, phone: String(phone), key, urls });
    }
  }

  const distFound = fs.existsSync(distDir);
  for (const file of htmlFiles(distDir)) {
    const page = pagePath(file);
    for (const u of linksIn(fs.readFileSync(file, 'utf8'))) add(u, page);
  }

  const help = new Set(rules.helpNowPages);
  const list = [...sources.values()].map((s) => {
    const rule = ruleFor(s.url, rules.rules);
    const usedBy = [...s.used_by].sort();
    return {
      url: s.url,
      host: s.host,
      group: rule?.group || 'monitored',
      why: rule?.why || '',
      help_now: usedBy.some((w) => help.has(w)),
      used_by: usedBy,
    };
  });
  // Help now first, then by host so the report groups by site.
  list.sort((a, b) => (b.help_now - a.help_now) || a.host.localeCompare(b.host) || a.url.localeCompare(b.url));
  return { sources: list, phoneChecks, distFound };
}

// ---------- fetching ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function readCapped(res) {
  const reader = res.body?.getReader();
  if (!reader) return Buffer.alloc(0);
  const chunks = [];
  let n = 0;
  while (n < T.maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    n += value.length;
  }
  try { await reader.cancel(); } catch { /* already done */ }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

// Robots.txt: the rules for our name, else for "*". Simple prefix matching with
// `*` and `$`, which covers what local sites use.
export function robotsRules(txt) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      if (!lastWasAgent || !cur) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (key === 'allow' || key === 'disallow')) cur.rules.push({ allow: key === 'allow', path: val });
    }
  }
  const mine = groups.filter((g) => g.agents.some((a) => a !== '*' && UA_TOKEN.includes(a)));
  const pick = mine.length ? mine : groups.filter((g) => g.agents.includes('*'));
  return pick.flatMap((g) => g.rules).filter((r) => r.path);
}

export function robotsAllows(rules, pathAndQuery) {
  let best = null;
  for (const r of rules) {
    const re = new RegExp(`^${r.path.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}`);
    if (re.test(pathAndQuery) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow))) best = r;
  }
  return !best || best.allow;
}

function errCode(err) {
  return err?.cause?.code || err?.code || err?.name || err?.message || 'error';
}

const BROKEN_CODES = new Set(['ENOTFOUND', 'CERT_HAS_EXPIRED', 'ERR_TLS_CERT_ALTNAME_INVALID', 'DEPTH_ZERO_SELF_SIGNED_CERT', 'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'SELF_SIGNED_CERT_IN_CHAIN']);

// Follow redirects by hand so a move to another domain is seen, not followed.
async function fetchSource(url) {
  const chain = [];
  let cur = url;
  for (let hop = 0; hop <= T.maxRedirects; hop++) {
    let res;
    try {
      res = await fetch(cur, { redirect: 'manual', signal: AbortSignal.timeout(T.timeoutMs), headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf;q=0.9,*/*;q=0.5' } });
    } catch (err) {
      return { status: 0, error: errCode(err), final: cur, chain };
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      const next = new URL(res.headers.get('location'), cur).href;
      chain.push({ from: cur, to: next, status: res.status });
      try { await res.body?.cancel(); } catch { /* ignore */ }
      cur = next;
      continue;
    }
    const type = res.headers.get('content-type') || '';
    const body = res.ok ? await readCapped(res) : (await res.body?.cancel().catch(() => {}), Buffer.alloc(0));
    return { status: res.status, final: cur, chain, type, body };
  }
  return { status: 0, error: 'too many redirects', final: cur, chain };
}

// ---------- page content ----------
export function pageText(html) {
  return html
    .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// Fingerprint of the page's text pieces with digits removed and order ignored,
// so a clock, a counter, a "last updated" date or a shuffled list alone does
// not count as a change. Added or removed text does. Phone numbers are checked
// separately.
export function fingerprint(html) {
  const pieces = new Set(
    html
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, '<>')
      .split(/<[^>]*>/)
      .map((s) => s.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\d+/g, '#').replace(/\s+/g, ' ').trim())
      .filter(Boolean),
  );
  return crypto.createHash('sha256').update([...pieces].sort().join('\n')).digest('hex').slice(0, 16);
}

const KEYPAD = Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c) => [c, '22233344455566677778889999'['ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c)]]));

export function phonesOnPage(html) {
  const found = new Set();
  for (const m of html.matchAll(/href\s*=\s*["']tel:([^"']+)["']/gi)) { const k = phoneKey(m[1]); if (k) found.add(k); }
  // Scan the raw page too: some sites put numbers in attributes or page data
  // (VA pages do), which the plain text drops.
  const text = `${pageText(html)} ${html.replace(/<[^>]*>/g, (tag) => ` ${tag.replace(/[<>"'=]/g, ' ')} `)}`;
  for (const m of text.matchAll(/(?:\+?1[\s.-]*)?\(?\b(\d{3})\)?[\s.-]*(\d{3})[\s.-]*(\d{4})\b/g)) found.add(`${m[1]}${m[2]}${m[3]}`);
  // Lettered numbers like 1-800-QUIT-NOW.
  for (const m of text.matchAll(/\b(8\d\d)[\s.-]+([A-Z0-9]{3,4})[\s.-]?([A-Z0-9]{3,4})\b/gi)) {
    const rest = `${m[2]}${m[3]}`.toUpperCase();
    if (rest.length === 7 && /[A-Z]/.test(rest)) found.add(m[1] + rest.replace(/[A-Z]/g, (c) => KEYPAD[c]));
  }
  return found;
}

// ---------- check ----------
export function classify(src, r, sameOwnerPairs = []) {
  if (r.chain?.length && !sameOwner(src.url, r.final, sameOwnerPairs)) return 'moved';
  if (r.status === 404 || r.status === 410) return 'broken';
  if (r.status === 0 && BROKEN_CODES.has(r.error)) return 'broken';
  if (r.status >= 200 && r.status < 300) return r.chain?.length ? 'redirected' : 'ok';
  return 'unverified';
}

async function checkAll(registry, { helpNowOnly = false, limit = Infinity, sameOwnerPairs = [] } = {}) {
  let todo = registry.sources.filter((s) => s.group === 'monitored' && (!helpNowOnly || s.help_now));
  todo = todo.slice(0, limit);
  const byHost = new Map();
  for (const s of todo) {
    if (!byHost.has(s.host)) byHost.set(s.host, []);
    byHost.get(s.host).push(s);
  }
  // Hosts with Help now sources go first.
  const hosts = [...byHost.keys()].sort((a, b) => (byHost.get(b).some((s) => s.help_now) - byHost.get(a).some((s) => s.help_now)) || a.localeCompare(b));
  const results = new Map();
  let next = 0;
  await Promise.all(Array.from({ length: T.hostConcurrency }, async () => {
    while (next < hosts.length) {
      const host = hosts[next++];
      const list = byHost.get(host);
      let robots = [];
      try {
        const origin = new URL(list[0].url).origin;
        const rr = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(T.timeoutMs), headers: { 'User-Agent': UA } });
        if (rr.ok && /text\/plain/.test(rr.headers.get('content-type') || 'text/plain')) robots = robotsRules(await rr.text());
        await sleep(T.pauseMs);
      } catch { /* no robots.txt: allowed */ }
      for (const s of list) {
        const u = new URL(s.url);
        if (!robotsAllows(robots, u.pathname + u.search)) { results.set(s.url, { state: 'robots', status: null }); continue; }
        const r = await fetchSource(s.url);
        const state = classify(s, r, sameOwnerPairs);
        const out = { state, status: r.status, error: r.error, final: r.final !== s.url ? r.final : undefined };
        if (r.body?.length) {
          if (/pdf/i.test(r.type) || /\.pdf($|\?)/i.test(r.final)) {
            out.kind = 'pdf';
            out.fingerprint = crypto.createHash('sha256').update(r.body).digest('hex').slice(0, 16);
          } else if (/html|xml|text/i.test(r.type)) {
            const html = r.body.toString('utf8');
            out.kind = 'html';
            out.fingerprint = fingerprint(html);
            out.phones = [...phonesOnPage(html)];
          }
        }
        results.set(s.url, out);
        await sleep(T.pauseMs);
      }
    }
  }));
  return results;
}

// Phone numbers in our entries that appear on none of their fetched sources.
// Only judged when at least one source was read as a web page.
export function missingPhones(phoneChecks, results) {
  const out = [];
  for (const p of phoneChecks) {
    const read = p.urls.map((u) => results.get(u)).filter((r) => r?.kind === 'html');
    if (!read.length) continue;
    if (!read.some((r) => r.phones.includes(p.key))) out.push(p);
  }
  return out;
}

// ---------- report ----------
export function buildReport(registry, results, prevState, { now = new Date() } = {}) {
  const at = now.toISOString();
  const byUrl = new Map(registry.sources.map((s) => [s.url, s]));
  const rows = (state) => registry.sources.filter((s) => results.get(s.url)?.state === state);
  const changed = [];
  const state = {};
  for (const [url, r] of results) {
    const prev = prevState?.[url];
    if (r.fingerprint) {
      state[url] = { f: r.fingerprint, since: prev?.f === r.fingerprint ? prev.since : at.slice(0, 10) };
      if (prev?.f && prev.f !== r.fingerprint) changed.push(byUrl.get(url));
    } else if (prev) state[url] = prev; // keep the last good fingerprint
  }
  for (const [url, v] of Object.entries(prevState || {})) if (!state[url] && byUrl.has(url)) state[url] = v;
  const phones = missingPhones(registry.phoneChecks, results);
  const groups = { monitored: 0, manual: 0, reference: 0 };
  for (const s of registry.sources) groups[s.group]++;
  const counts = {};
  for (const r of results.values()) counts[r.state] = (counts[r.state] || 0) + 1;
  const broken = rows('broken');
  const moved = rows('moved');
  const problems = broken.length + moved.length + phones.length;
  return {
    checked_at: at,
    status: problems ? 'problems' : counts.unverified ? 'warn' : 'ok',
    dist_found: registry.distFound,
    groups,
    counts,
    checked: results.size,
    broken: broken.map((s) => ({ ...s, ...results.get(s.url) })),
    moved: moved.map((s) => ({ ...s, ...results.get(s.url) })),
    phones_missing: phones,
    unverified: rows('unverified').map((s) => ({ ...s, ...results.get(s.url) })),
    redirected: rows('redirected').map((s) => ({ ...s, ...results.get(s.url) })),
    robots: rows('robots'),
    changed,
    manual: registry.sources.filter((s) => s.group === 'manual'),
    state,
  };
}

const where = (s) => {
  const list = s.used_by.slice(0, 3).join(', ') + (s.used_by.length > 3 ? ` and ${s.used_by.length - 3} more` : '');
  return `${s.help_now ? '**Help now** · ' : ''}${list}`;
};
const why = (r) => (r.status ? String(r.status) : r.error || 'no answer');

export function reportMd(rep, { cap = 40 } = {}) {
  const L = [];
  const section = (title, items, line) => {
    if (!items.length) return;
    L.push(`### ${title} (${items.length})`, '');
    for (const it of items.slice(0, cap)) L.push(`- ${line(it)}`);
    if (items.length > cap) L.push(`- ...and ${items.length - cap} more (see the run's JSON report).`);
    L.push('');
  };
  L.push(`## Source check: ${rep.status === 'problems' ? 'needs a look' : rep.status === 'warn' ? 'OK, some could not be checked' : 'OK'}`, '');
  L.push(`Checked ${rep.checked_at.slice(0, 16).replace('T', ' ')} UTC. Registry: ${rep.groups.monitored} monitored, ${rep.groups.manual} checked by hand, ${rep.groups.reference} reference only. Fetched ${rep.checked} this run.`);
  if (!rep.dist_found) L.push('', 'Note: the built site was not found, so links that appear only on pages were not included.');
  L.push('');
  section('Broken', rep.broken, (r) => `${r.url} (${why(r)}) on ${where(r)}`);
  section('Moved to another domain', rep.moved, (r) => `${r.url} now goes to ${r.final}. Check who owns it now. On ${where(r)}`);
  section('Phone number not found on its source', rep.phones_missing, (p) => `${p.name}: ${p.phone} (${p.file}). Not on ${p.urls.join(', ')}`);
  section('Could not check (often bot blocking or a blip)', rep.unverified, (r) => `${r.url} (${why(r)}) on ${where(r)}`);
  section('Changed since the last run (worth a re-check)', rep.changed, (r) => `${r.url} on ${where(r)}`);
  section('Same site, new address (update the link)', rep.redirected, (r) => `${r.url} now ${r.final}`);
  section('Robots.txt asks us not to fetch (check by hand)', rep.robots, (r) => `${r.url} on ${where(r)}`);
  section('Checked by hand on the sweep, never fetched', rep.manual, (r) => `${r.url} (${r.why}) on ${where(r)}`);
  if (rep.status === 'ok' && !rep.changed.length) L.push('Nothing to do.');
  return L.join('\n');
}

// ---------- main ----------
async function main() {
  const args = process.argv.slice(2);
  const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const rules = loadRules();
  const registry = buildRegistry({ rules });
  if (opt('registry')) fs.writeFileSync(opt('registry'), JSON.stringify(registry.sources, null, 2));
  const prev = opt('state-in') && fs.existsSync(opt('state-in')) ? JSON.parse(fs.readFileSync(opt('state-in'), 'utf8')) : {};
  const results = await checkAll(registry, {
    helpNowOnly: args.includes('--help-now-only'),
    limit: opt('limit') ? Number(opt('limit')) : Infinity,
    sameOwnerPairs: rules.sameOwner,
  });
  const rep = buildReport(registry, results, prev);
  const md = reportMd(rep);
  if (opt('json')) fs.writeFileSync(opt('json'), JSON.stringify(rep, null, 2));
  if (opt('state-out')) fs.writeFileSync(opt('state-out'), JSON.stringify(rep.state));
  if (opt('md')) fs.writeFileSync(opt('md'), md);
  else console.log(md);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
