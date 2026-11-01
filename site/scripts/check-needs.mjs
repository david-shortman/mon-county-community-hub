// Checks the needs register, content/needs/<slug>.yaml (#74). Exits 1 on any error.
//
// The shape is content/schemas/need.schema.json. On top of the shape, this
// enforces the charter's rules for the register: every piece of evidence has a
// source, counts are aggregate, and nothing names or quotes a private person.
//
// Before checking content/needs/, it checks the fake fixtures in
// scripts/fixtures/needs/ so the checker itself is tested on every run: the
// good fixture must pass and the bad one must fail.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, loadDir, loadDoors, todayYmd, ymd } from '../src/lib/content.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const PAGES_DIR = path.join(here, '../src/pages');

// True when a site path like /help/food/ or /money/?pick=rent has a page file.
export function pageExists(p, pagesDir = PAGES_DIR) {
  const route = String(p ?? '').replace(/[?#].*$/, '');
  if (!route.startsWith('/') || route.includes('..')) return false;
  const bare = route.replace(/\/$/, '');
  const candidates = [path.join(pagesDir, bare, 'index.astro'), `${path.join(pagesDir, bare)}.astro`];
  return candidates.some((f) => fs.existsSync(f));
}
const schema = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'schemas/need.schema.json'), 'utf8'));
const P = schema.properties;

const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
const isUrl = (u) => { try { return ['https:', 'http:'].includes(new URL(u).protocol); } catch { return false; } };
const isSlug = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s ?? '');
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE = /\b\d{3}[-. )]\s?\d{3}[-.]\d{4}\b/;
// A quoted passage of 6 or more words reads like a quote from a person.
const LONG_QUOTE = /["“][^"”]*(\s+\S+){5,}[^"”]*["”]/;

const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const stale = sixMonthsAgo.toISOString().slice(0, 10);

function loadFrom(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).sort()
    .map((f) => ({ need: YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) ?? {}, file: f }));
}

const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);

// Problems with every need in one folder: { errors, warnings }.
export function checkNeeds(entries, { label, orgSlugs, topics, questionIds, today = todayYmd() }) {
  const errors = [];
  const warnings = [];
  const ranks = new Map();
  const slugs = new Set();
  for (const { need: n, file } of entries) {
    const where = `${label}/${file}`;
    const err = (m) => errors.push(`${where}: ${m}`);
    const unknown = (obj, props, at) => {
      for (const k of Object.keys(obj ?? {})) if (!(k in props)) err(`unknown field ${at}${k} (see content/schemas/need.schema.json)`);
    };
    const checkDate = (d, at) => {
      const v = ymd(d);
      if (!isDate(v)) err(`${at} needs a checked date (YYYY-MM-DD)`);
      else if (v > today) err(`${at} checked date ${v} is in the future`);
      else if (v < stale) warnings.push(`${where}: ${at} last checked ${v}, re-verify`);
    };

    unknown(n, P, '');
    for (const f of schema.required) if (n[f] == null || n[f] === '') err(`missing ${f}`);
    if (n.slug != null) {
      if (!isSlug(n.slug)) err('slug must be lowercase letters, numbers and dashes');
      if (file.replace(/\.ya?ml$/, '') !== n.slug) err(`file name should match slug ${n.slug}`);
      if (slugs.has(n.slug)) err(`slug ${n.slug} is used twice`);
      slugs.add(n.slug);
    }
    if (typeof n.summary === 'string' && n.summary.length < P.summary.minLength) err('summary is too short; say what the problem is in a sentence or more');

    if (n.evidence != null && (!Array.isArray(n.evidence) || !n.evidence.length)) err('evidence must be a list with at least one item');
    (Array.isArray(n.evidence) ? n.evidence : []).forEach((e, i) => {
      const at = `evidence[${i}]`;
      unknown(e, P.evidence.items.properties, `${at}.`);
      if (!isUrl(e?.url)) err(`${at} needs a source url (every piece of evidence has a source)`);
      if (!e?.shows) err(`${at} needs "shows": what the source shows`);
      checkDate(e?.checked, at);
    });

    const a = n.affected;
    if (a) {
      unknown(a, P.affected.properties, 'affected.');
      if (a.count == null && !a.estimate) err('affected needs a count or an estimate');
      if (a.count != null && !(Number.isInteger(a.count) && a.count >= 0)) err('affected.count must be a whole number (an aggregate count, never a list of people)');
      if (!isUrl(a.url)) err('affected needs a source url');
      checkDate(a.checked, 'affected');
    }

    if (n.severity != null && !P.severity.enum.includes(n.severity)) err(`severity must be one of ${P.severity.enum.join(', ')}`);
    if (n.trend != null && !P.trend.enum.includes(n.trend)) err(`trend must be one of ${P.trend.enum.join(', ')}`);
    if (n.trend && !['unknown'].includes(n.trend) && !n.trend_why) warnings.push(`${where}: trend is "${n.trend}"; add trend_why naming the evidence that shows it`);

    (n.working_on ?? []).forEach((w, i) => {
      const at = `working_on[${i}]`;
      unknown(w, P.working_on.items.properties, `${at}.`);
      if (w?.org) { if (!orgSlugs.has(w.org)) err(`${at}.org "${w.org}" has no file in content/orgs/`); }
      else if (!(w?.name && isUrl(w?.url))) err(`${at} needs an org slug, or a group name with its public url (groups only, never a private person)`);
    });

    if (n.topics != null) {
      if (!Array.isArray(n.topics) || !n.topics.length) err('topics must be a list with at least one topic');
      else for (const t of n.topics) if (!topics.has(t)) err(`topic "${t}" is not in content/doors.yaml`);
    }
    if (n.rank != null) {
      if (!(Number.isInteger(n.rank) && n.rank >= 1)) err('rank must be a whole number, 1 or more');
      else if (ranks.has(n.rank)) err(`rank ${n.rank} is also used by ${ranks.get(n.rank)}`);
      else ranks.set(n.rank, file);
    }
    for (const q of n.questions ?? []) if (!questionIds.has(q)) err(`question ${q} is not in content/findability/questions.yaml`);
    for (const i of n.issues ?? []) if (!Number.isInteger(i)) err('issues must be issue numbers');

    // Where to get help on this site (#1248): every link goes to a real page.
    (Array.isArray(n.get_help) ? n.get_help : n.get_help == null ? [] : (err('get_help must be a list'), [])).forEach((g, i) => {
      const at = `get_help[${i}]`;
      unknown(g, P.get_help.items.properties, `${at}.`);
      if (!g?.label) err(`${at} needs a label: what the reader finds there`);
      if (typeof g?.path !== 'string' || !g.path.startsWith('/')) err(`${at}.path must be a path on this site, starting with /`);
      else if (!pageExists(g.path)) err(`${at}.path ${g.path} has no page in site/src/pages`);
    });
    const c = n.site_coverage;
    if (c != null) {
      unknown(c, P.site_coverage.properties, 'site_coverage.');
      if (!P.site_coverage.properties.level.enum.includes(c.level)) err(`site_coverage.level must be one of ${P.site_coverage.properties.level.enum.join(', ')}`);
      if (!c.why) err('site_coverage needs "why": what the site has and lacks');
      checkDate(c.checked, 'site_coverage');
    }

    // Privacy: a need is about a problem, not about people.
    const text = strings(n).join('\n');
    if (EMAIL.test(text)) err('contains an email address; needs never hold contact details');
    if (PHONE.test(text)) err('contains a phone number; needs never hold contact details');
    if (LONG_QUOTE.test(text)) err('contains a long quote; describe what the source shows instead of quoting people');
    if (text.includes('—')) err('contains an em dash');
  }
  return { errors, warnings };
}

const orgSlugs = new Set(loadDir('orgs').map((o) => o.slug));
const topics = new Set(Object.keys(loadDoors().topicDoor));
const questionIds = new Set((YAML.parse(fs.readFileSync(path.join(CONTENT_DIR, 'findability/questions.yaml'), 'utf8')).questions ?? []).map((q) => q.id));
const ctx = { orgSlugs, topics, questionIds };

// Self-test on the fixtures first.
const fixtures = loadFrom(path.join(here, 'fixtures/needs'));
const good = checkNeeds(fixtures.filter((f) => !f.file.includes('bad')), { ...ctx, label: 'fixtures/needs' });
const bad = checkNeeds(fixtures.filter((f) => f.file.includes('bad')), { ...ctx, label: 'fixtures/needs' });
const selfTest = [];
if (good.errors.length) selfTest.push(`the good fixture should pass but got:\n  ${good.errors.join('\n  ')}`);
for (const expect of ['unknown field contact_email', 'evidence[0] needs a source url', 'whole number', 'severity must be', 'long quote', 'in the future', 'never a private person', 'is not in content/doors.yaml', 'file name should match', 'has no page in site/src/pages', 'must be a path on this site', 'site_coverage.level must be', 'site_coverage needs "why"'])
  if (!bad.errors.some((e) => e.includes(expect))) selfTest.push(`the bad fixture should fail with "${expect}"`);
if (selfTest.length) {
  console.error(`check-needs self-test failed:\n- ${selfTest.join('\n- ')}`);
  process.exit(1);
}

const needs = loadFrom(path.join(CONTENT_DIR, 'needs'));
const { errors, warnings } = checkNeeds(needs, { ...ctx, label: 'needs' });
for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  console.error(`Needs check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Checked ${needs.length} needs (self-test passed): 0 errors, ${warnings.length} warnings.`);
