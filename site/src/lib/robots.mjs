// One robots.txt rule for every automated read the site does (feeds,
// meetings, live numbers, weather, the source checker and the Health check).
// Policy and per-host results: docs/operations/automated-reads.md.
//
// - We read a site's robots.txt before reading any page on it, once per site
//   per run, and skip any path it asks robots to stay out of.
// - Rules for our name (moncountycommunityhub) win over rules for "*".
// - Paths match as written, and we also skip a path that only matches when
//   upper and lower case are ignored. Many local sites run on servers where
//   /iCalendar/ and /icalendar/ are the same page, so a rule for one is meant
//   for both. When unsure, we do not read.
// - No robots.txt (a 404 or 410 answer): every path is allowed, as RFC 9309
//   says. Any other answer that is not a robots.txt (a 403, 429 or other
//   refusal, a 5xx, a timeout, a dropped connection, or a web page such as a
//   bot check) means we read nothing on that site this run. RFC 9309 lets a
//   robot read everything after a 4xx, but a firewall's 403 is not a site
//   saying yes, so we are stricter (#529).
export const UA_TOKEN = 'moncountycommunityhub';

// The rules for our name, else for "*". Simple prefix matching with `*` and
// `$`, which covers what local sites use.
export function robotsRules(txt, token = UA_TOKEN) {
  const groups = [];
  let cur = null;
  let lastWasAgent = false;
  for (const raw of String(txt).split(/\r?\n/)) {
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
  const mine = groups.filter((g) => g.agents.some((a) => a !== '*' && token.includes(a)));
  const pick = mine.length ? mine : groups.filter((g) => g.agents.includes('*'));
  return pick.flatMap((g) => g.rules).filter((r) => r.path);
}

// Crawl-delay in seconds for our name, else for "*" (#166). 0 if none.
export function robotsDelay(txt, token = UA_TOKEN) {
  let agents = [];
  let lastWasAgent = false;
  let mine = null;
  let star = null;
  for (const raw of String(txt).split(/\r?\n/)) {
    const m = raw.replace(/#.*$/, '').trim().match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    if (key === 'user-agent') { agents = lastWasAgent ? [...agents, m[2].trim().toLowerCase()] : [m[2].trim().toLowerCase()]; lastWasAgent = true; continue; }
    lastWasAgent = false;
    if (key !== 'crawl-delay') continue;
    const n = Number(m[2]);
    if (!Number.isFinite(n)) continue;
    if (agents.some((a) => a !== '*' && token.includes(a))) mine = n;
    else if (agents.includes('*')) star = n;
  }
  return mine ?? star ?? 0;
}

// The longest matching rule wins; on a tie, Allow wins (RFC 9309).
function decide(rules, p, fold) {
  let best = null;
  for (const r of rules) {
    const rp = fold ? r.path.toLowerCase() : r.path;
    const anchored = rp.endsWith('$');
    const body = (anchored ? rp.slice(0, -1) : rp).replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    const re = new RegExp(`^${body}${anchored ? '$' : ''}`);
    if (re.test(fold ? p.toLowerCase() : p) && (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow))) best = r;
  }
  return best;
}

// The rule that stops us reading this path, or null if it is allowed.
export function robotsBlockingRule(rules, pathAndQuery) {
  for (const fold of [false, true]) {
    const best = decide(rules, pathAndQuery, fold);
    if (best && !best.allow) return best;
  }
  return null;
}

export const robotsAllows = (rules, pathAndQuery) => !robotsBlockingRule(rules, pathAndQuery);

const looksLikeHtml = (s) => /^\s*(<!doctype|<html|<head|<body)/i.test(s);

// Reads one site's robots.txt. Returns { rules, delay, state } where state is
// 'read', 'none' (no robots.txt, so all allowed) or 'unreadable' (read nothing).
// Never throws.
export async function readRobots(origin, { userAgent, fetchImpl = fetch, timeoutMs = 15_000, tries = 3, pauseMs = 1_000 } = {}) {
  let lastError = '';
  for (let i = 0; i < tries; i++) {
    // Some servers (the City's) answer 403 or 503 now and then, so wait a
    // moment and ask again before giving up on the site for this run.
    if (i > 0 && pauseMs) await new Promise((r) => setTimeout(r, pauseMs));
    try {
      const res = await fetchImpl(`${origin}/robots.txt`, { redirect: 'follow', signal: AbortSignal.timeout(timeoutMs), headers: userAgent ? { 'User-Agent': userAgent } : {} });
      // Only "not found" or "gone" means the site has no robots.txt. A 403,
      // 429 or other refusal is a firewall saying no, not "read anything":
      // the City's server sends 403 to some reads of a robots.txt that blocks
      // its calendar feed, and treating that as "none" let the feed be read.
      if (res.status === 404 || res.status === 410) return { rules: [], delay: 0, state: 'none', status: res.status };
      if (!res.ok) { lastError = `HTTP ${res.status}`; continue; }
      const txt = await res.text();
      // A web page instead of a robots.txt (a bot check, a firewall page or a
      // home page) means we did not get the rules, so read nothing this run.
      if (looksLikeHtml(txt)) { lastError = 'answered with a web page, not a robots.txt'; continue; }
      return { rules: robotsRules(txt), delay: robotsDelay(txt), state: 'read', status: res.status };
    } catch (err) {
      lastError = err.cause?.code || err.message;
    }
  }
  return { rules: [], delay: 0, state: 'unreadable', error: lastError };
}

const cache = new Map();
export const clearRobotsCache = () => cache.clear();

// { allowed, reason, delay } for one address. Each site's robots.txt is read
// once per run. Never throws.
export async function robotsCheck(url, opts = {}) {
  const u = new URL(url);
  if (!cache.has(u.origin)) cache.set(u.origin, readRobots(u.origin, opts));
  const robots = await cache.get(u.origin);
  const where = u.pathname + u.search;
  if (robots.state === 'unreadable') {
    return { allowed: false, delay: 0, reason: `${u.host}/robots.txt could not be read (${robots.error}), so nothing on that site was read` };
  }
  const rule = robotsBlockingRule(robots.rules, where);
  if (rule) return { allowed: false, delay: robots.delay, reason: `${u.host}/robots.txt asks robots not to read ${u.pathname} (Disallow: ${rule.path}), so it was not read` };
  return { allowed: true, delay: robots.delay, reason: null };
}

// Thrown by fetchWithRetry when robots.txt says no. Callers fall back to their
// saved copy, the same as when a site is down.
export class RobotsDisallowed extends Error {
  constructor(url, reason) {
    super(reason);
    this.name = 'RobotsDisallowed';
    this.url = url;
    this.robots = true;
  }
}
