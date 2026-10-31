#!/usr/bin/env node
// Recurring checklists (#752, #718, #793). Some upkeep cannot be watched by a
// robot: a news column with a new address each week, a Google calendar that
// asks robots to stay out, a quarterly re-read of every thrift shop. For those,
// each file in content/checklists/ is one standing issue for a person, with a
// fresh checklist each week. Monthly, quarterly and seasonal items join the
// weekly list when they are due, so each lane has one issue, not five.
//
// Runs as a step in the daily Source check (.github/workflows/sources.yml).
// On the first run of a new week it rewrites the issue (or opens or reopens
// it) and adds a short comment so the person is notified. Other days it does
// nothing. It only writes issues. It never changes content or the site.
//
// Usage (from site/):
//   node scripts/checklists.mjs --self-test   (also validates the files)
//   node scripts/checklists.mjs --dry-run     (prints this week's issues)
//   node scripts/checklists.mjs run           (env: GITHUB_TOKEN, GITHUB_REPOSITORY, RUN_URL)
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, todayYmd, ymd, loadDir, loadSecondhand, oldestChecked, isStale, staleDaysFor } from '../src/lib/content.mjs';

export const CHECKLIST_DIR = path.join(CONTENT_DIR, 'checklists');
const FILE_FIELDS = ['id', 'title', 'issue_title', 'tracking', 'intro', 'items'];
const ITEM_FIELDS = ['text', 'url', 'when', 'months', 'from', 'run'];
const WHEN = ['week', 'month', 'quarter'];
const LABEL = 'checklist';
const TODO_LABEL = 'for:duet';

// ---------- dates (Morgantown) ----------
const day = (ymdStr) => new Date(`${ymdStr}T12:00:00Z`);
const addDays = (ymdStr, n) => { const d = day(ymdStr); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export function weekMonday(today) {
  return addDays(today, -((day(today).getUTCDay() + 6) % 7));
}
// ISO week key, such as 2026-W45.
export function weekKey(today) {
  const thu = addDays(weekMonday(today), 3);
  const jan1 = `${thu.slice(0, 4)}-01-01`;
  const n = Math.floor((day(thu) - day(jan1)) / 86_400_000 / 7) + 1;
  return `${thu.slice(0, 4)}-W${String(n).padStart(2, '0')}`;
}
// The week's Monday decides the month, so a week that starts Oct 30 belongs
// to October, and the first week of a month is the one whose Monday is 1 to 7.
export function isDue(item, today) {
  const mon = weekMonday(today);
  const month = Number(mon.slice(5, 7));
  const firstWeek = Number(mon.slice(8, 10)) <= 7;
  if (item.from && today < ymd(item.from)) return false;
  if (item.months && !item.months.includes(month)) return false;
  if (item.when === 'month') return firstWeek;
  if (item.when === 'quarter') return firstWeek && [1, 4, 7, 10].includes(month);
  return true;
}

// ---------- computed lists ----------
// Each returns lines for the checklist. They read only content/.
const ageDays = (from, today) => Math.round((day(today) - day(from)) / 86_400_000);
export const RUNS = {
  // Thrift shops and programs due for the quarterly re-read (#430). Same rule
  // as npm run secondhand-due: oldest check over 3 months old, or unclear.
  'secondhand-due': (today) => loadSecondhand({ all: true })
    .filter((s) => s.status !== 'closed')
    .map((s) => ({ s, c: oldestChecked(s.sources) }))
    .filter(({ s, c }) => (c && ageDays(c, today) > 91) || s.status === 'unclear')
    .sort((a, b) => String(a.c).localeCompare(String(b.c)))
    .map(({ s, c }) => `\`content/${s._file}\`: ${s.status}, last checked ${c}. Re-read ${s.sources.map((x) => x.url).join(', ')}`),
  // Sale and market dates that have passed (#718). The site already hides
  // them; each one is a reminder to look for the next date.
  'past-sale-dates': (today) => loadDir('calendar')
    .filter((e) => (e.topics || []).some((t) => t === 'secondhand' || t === 'market'))
    .filter((e) => { const end = ymd(e.ends) || ymd(e.starts); return end < today && ageDays(end, today) <= 120; })
    .map((e) => `${e.title} (ended ${ymd(e.ends) || ymd(e.starts)}): look for the next date at ${e.url || e.sources?.[0]?.url}`),
  // Make it better entries that will say "may be out of date" within 30 days
  // (90-day rule, #791), so they can be re-read first.
  'better-stale-soon': (today) => {
    const soon = addDays(today, 30);
    const recs = [
      ...loadDir('resources').filter((r) => (r.topics || []).includes('better')),
      ...loadDir('boards'),
    ];
    return recs
      .map((r) => ({ r, c: oldestChecked((r.sources || []).map((s) => ({ ...s, checked: ymd(s.checked) }))) }))
      .filter(({ r, c }) => c && isStale(c, soon, staleDaysFor(r)))
      .sort((a, b) => a.c.localeCompare(b.c))
      .map(({ r, c }) => `\`content/${r._file}\`: oldest check ${c}${isStale(c, today, staleDaysFor(r)) ? ' (already shows "may be out of date")' : ''}`);
  },
};

// ---------- loading and checking the files ----------
export function loadChecklists(dir = CHECKLIST_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)).sort().map((f) => {
    const data = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8')) || {};
    return { ...data, _file: `content/checklists/${f}`, items: data.items || [] };
  });
}

export function validateChecklists(lists) {
  const errors = [];
  const seen = new Set();
  for (const c of lists) {
    const at = c._file;
    for (const k of Object.keys(c)) if (k !== '_file' && !FILE_FIELDS.includes(k)) errors.push(`${at}: unknown field ${k}`);
    if (!/^[a-z0-9-]+$/.test(c.id || '')) errors.push(`${at}: id must be a short slug`);
    if (seen.has(c.id)) errors.push(`${at}: id ${c.id} is used twice`);
    seen.add(c.id);
    if (!c.title) errors.push(`${at}: needs a title`);
    if (!c.issue_title) errors.push(`${at}: needs an issue_title`);
    if (c.tracking !== undefined && !Number.isInteger(c.tracking)) errors.push(`${at}: tracking must be an issue number`);
    if (!c.items.length) errors.push(`${at}: needs items`);
    c.items.forEach((it, i) => {
      const w = `${at} item ${i + 1}`;
      for (const k of Object.keys(it || {})) if (!ITEM_FIELDS.includes(k)) errors.push(`${w}: unknown field ${k}`);
      if (!it?.text) errors.push(`${w}: needs text`);
      if (it?.url && !/^https?:\/\//.test(it.url)) errors.push(`${w}: url must start with http`);
      if (it?.when && !WHEN.includes(it.when)) errors.push(`${w}: when must be one of ${WHEN.join(', ')}`);
      if (it?.months && (!Array.isArray(it.months) || it.months.some((m) => !Number.isInteger(m) || m < 1 || m > 12))) errors.push(`${w}: months must be numbers 1 to 12`);
      if (it?.from && !/^\d{4}-\d{2}-\d{2}$/.test(ymd(it.from))) errors.push(`${w}: from must be a date`);
      if (it?.run && !RUNS[it.run]) errors.push(`${w}: run must be one of ${Object.keys(RUNS).join(', ')}`);
    });
    if (/[\u2014]/.test(JSON.stringify(c))) errors.push(`${at}: no em dashes`);
  }
  return errors;
}

// ---------- writing ----------
const prettyMon = (ymdStr) => day(ymdStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' });
export const marker = (id) => `<!-- checklist: ${id} -->`;
export const periodMarker = (key) => `<!-- checklist-period: ${key} -->`;
export const readPeriod = (body) => body?.match(/<!-- checklist-period: (\S+) -->/)?.[1] ?? null;

const HEADS = { week: 'Every week', month: 'This month (first week of the month)', quarter: 'This quarter', season: 'This season' };
const headFor = (it) => (it.when === 'quarter' ? 'quarter' : it.when === 'month' ? 'month' : it.months ? 'season' : 'week');

// The issue for one checklist this week, or null when nothing is due.
export function buildIssue(c, today, { runUrl = '', runs = RUNS } = {}) {
  const due = c.items.filter((it) => isDue(it, today));
  if (!due.length) return null;
  const key = weekKey(today);
  const L = [
    `This is the weekly checklist from \`${c._file}\`. The daily Source check refreshes it on the first run of each week (${key}, the week of ${prettyMon(weekMonday(today))}) and adds a comment. Tick items as you go. Close the issue when the week's list is done; next week's list reopens it.`,
    '',
    String(c.intro || '').trim(),
    '',
  ];
  if (c.tracking) L.push(`Background and rules: #${c.tracking}.`, '');
  for (const h of ['week', 'month', 'quarter', 'season']) {
    const items = due.filter((it) => headFor(it) === h);
    if (!items.length) continue;
    L.push(`### ${HEADS[h]}`, '');
    for (const it of items) {
      L.push(`- [ ] ${it.text}${it.url ? ` ${it.url}` : ''}`);
      if (it.run) {
        let lines;
        try { lines = runs[it.run](today); } catch (e) { lines = [`(Could not build this list: ${e.message})`]; }
        if (!lines.length) L.push('  - Nothing due right now.');
        for (const x of lines.slice(0, 40)) L.push(`  - [ ] ${x}`);
        if (lines.length > 40) L.push(`  - ...and ${lines.length - 40} more. Run the list locally to see them all.`);
      }
    }
    L.push('');
  }
  L.push('Rules for every item: change a fact only after reading its source, set `checked` only for sources you re-read, never guess a date, and anything that needs asking a person becomes a `for:david` issue. Shelter, food and money changes wait for David.');
  if (runUrl) L.push('', `Latest run: ${runUrl}`);
  L.push('', marker(c.id), periodMarker(key));
  return { title: `${c.issue_title} (week of ${prettyMon(weekMonday(today))})`, body: L.join('\n'), key, count: due.length };
}

// ---------- GitHub ----------
async function run({ dryRun = false } = {}) {
  const lists = loadChecklists();
  const errors = validateChecklists(lists);
  if (errors.length) throw new Error(errors.join('\n'));
  const today = todayYmd();
  const runUrl = process.env.RUN_URL || '';
  if (dryRun) {
    for (const c of lists) {
      const issue = buildIssue(c, today, { runUrl });
      console.log(issue ? `\n===== ${issue.title}\n${issue.body}` : `\n===== ${c.id}: nothing due this week`);
    }
    return;
  }
  const repo = process.env.GITHUB_REPOSITORY;
  const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'mon-county-checklists' };
  const gh = async (method, p, body) => {
    const res = await fetch(`https://api.github.com${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw new Error(`${method} ${p}: ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  };
  const pause = () => new Promise((r) => setTimeout(r, 2_000));
  try { await gh('POST', `/repos/${repo}/labels`, { name: LABEL, color: 'c5def5', description: 'A recurring checklist for a person (#752, #718, #793)' }); }
  catch (e) { if (!/422/.test(e.message)) throw e; }
  const existing = (await gh('GET', `/repos/${repo}/issues?state=all&labels=${LABEL}&sort=created&direction=desc&per_page=100`)).filter((i) => !i.pull_request);
  for (const c of lists) {
    const issue = buildIssue(c, today, { runUrl });
    if (!issue) { console.log(`${c.id}: nothing due this week.`); continue; }
    const mine = existing.find((i) => i.body?.includes(marker(c.id)));
    if (mine && readPeriod(mine.body) === issue.key) { console.log(`${c.id}: #${mine.number} is already this week's list.`); continue; }
    const note = `New checklist for the week of ${prettyMon(weekMonday(today))}: ${issue.count} ${issue.count === 1 ? 'item' : 'items'}. The issue body above is refreshed.`;
    if (mine) {
      await gh('PATCH', `/repos/${repo}/issues/${mine.number}`, { title: issue.title, body: issue.body, state: 'open', labels: [LABEL, TODO_LABEL] });
      await pause();
      await gh('POST', `/repos/${repo}/issues/${mine.number}/comments`, { body: note });
      console.log(`${c.id}: refreshed #${mine.number}.`);
    } else {
      const made = await gh('POST', `/repos/${repo}/issues`, { title: issue.title, body: issue.body, labels: [LABEL, TODO_LABEL] });
      console.log(`${c.id}: opened #${made.number}.`);
      if (c.tracking) {
        await pause();
        await gh('POST', `/repos/${repo}/issues/${c.tracking}/comments`, { body: `The weekly checklist for this job now lives in #${made.number}, refreshed each week by the daily Source check.` });
      }
    }
    await pause();
  }
}

// ---------- self-test ----------
function selfTest() {
  const fails = [];
  const expect = (cond, msg) => { if (!cond) fails.push(msg); };
  expect(weekKey('2026-11-02') === '2026-W45' && weekKey('2026-11-08') === '2026-W45', 'Monday to Sunday is one week');
  expect(weekKey('2026-10-31') === '2026-W44', 'Saturday Oct 31, 2026 is in week 44');
  expect(weekKey('2027-01-01') === '2026-W53', 'Jan 1, 2027 belongs to the last week of 2026');
  expect(weekMonday('2026-11-01') === '2026-10-26', 'a Sunday belongs to the week that started the Monday before');
  expect(isDue({ text: 'x' }, '2026-11-04'), 'weekly items are always due');
  expect(isDue({ when: 'month' }, '2026-11-04') && !isDue({ when: 'month' }, '2026-11-11'), 'monthly items come in the first week of the month only');
  expect(!isDue({ when: 'month' }, '2026-11-01'), 'a week that starts in October is not November\'s first week');
  expect(isDue({ when: 'quarter' }, '2027-01-06') && !isDue({ when: 'quarter' }, '2026-12-09'), 'quarterly items come in the first week of a quarter');
  expect(isDue({ months: [3, 4] }, '2027-03-10') && !isDue({ months: [3, 4] }, '2027-05-10'), 'seasonal items come only in their months');
  expect(!isDue({ from: '2027-01-01' }, '2026-12-30') && isDue({ from: '2027-01-01' }, '2027-01-06'), 'from holds an item back until its date');

  const sample = { id: 'demo', title: 'Demo', issue_title: 'Weekly demo checklist', tracking: 752, intro: 'Read these.', _file: 'content/checklists/demo.yaml', items: [
    { text: 'Read the column', url: 'https://example.org/' },
    { text: 'Monthly page', when: 'month' },
    { text: 'Shops due', when: 'quarter', run: 'demo-run' },
    { text: 'Budget agendas', months: [3, 4] },
  ] };
  const runs = { 'demo-run': () => ['shop A', 'shop B'] };
  const v = validateChecklists([{ ...sample, items: sample.items.map(({ run, ...x }) => x) }]);
  expect(v.length === 0, `sample should validate: ${v.join('; ')}`);
  expect(validateChecklists([{ ...sample, items: [{ text: 'x', when: 'daily' }] }]).length === 1, 'a bad when should fail');
  const wk = buildIssue(sample, '2026-11-11', { runs });
  expect(wk.count === 1 && wk.body.includes('- [ ] Read the column https://example.org/') && !wk.body.includes('Monthly page'), 'a plain week lists weekly items only');
  expect(wk.title === 'Weekly demo checklist (week of November 9)', `title: ${wk.title}`);
  expect(readPeriod(wk.body) === '2026-W46' && wk.body.includes(marker('demo')), 'the body carries the checklist and week markers');
  const q = buildIssue(sample, '2027-01-06', { runs });
  expect(q.body.includes('### This quarter') && q.body.includes('  - [ ] shop B') && q.body.includes('Monthly page'), 'the first week of a quarter adds monthly and quarterly items with their computed lists');
  const spring = buildIssue(sample, '2027-03-17', { runs });
  expect(spring.body.includes('### This season') && spring.body.includes('Budget agendas'), 'seasonal items show in their months');
  expect(buildIssue({ ...sample, items: [{ text: 'x', months: [4] }] }, '2026-11-11') === null, 'nothing due means no issue');
  expect(!/\u2014/.test(q.body), 'no em dashes in issue text');

  // The computed lists run against the real content without errors.
  for (const [name, fn] of Object.entries(RUNS)) {
    try { const out = fn(todayYmd()); expect(Array.isArray(out), `${name} should return a list`); } catch (e) { fails.push(`${name} failed: ${e.message}`); }
  }
  const real = loadChecklists();
  for (const e of validateChecklists(real)) fails.push(e);
  for (const c of real) for (const d of ['2026-11-04', '2027-01-06', '2027-03-10', '2027-04-07']) {
    const b = buildIssue(c, d);
    if (b && /\u2014/.test(b.body)) fails.push(`${c._file}: em dash in the ${d} issue`);
  }
  if (fails.length) { console.error(`checklists self-test failed:\n- ${fails.join('\n- ')}`); process.exit(1); }
  console.log(`checklists self-test passed (${real.length} checklists, ${real.reduce((n, c) => n + c.items.length, 0)} items).`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const cmd = process.argv[2];
  if (cmd === '--self-test') selfTest();
  else if (cmd === '--dry-run') run({ dryRun: true }).catch((e) => { console.error(e); process.exit(1); });
  else if (cmd === 'run') run().catch((e) => { console.error(e); process.exit(1); });
  else { console.error('Usage: node scripts/checklists.mjs --self-test | --dry-run | run'); process.exit(2); }
}
