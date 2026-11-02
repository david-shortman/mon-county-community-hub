#!/usr/bin/env node
// Agenda guides check (#529). Once a day, reads the City AgendaCenter and the
// County Commission's agenda page (the same readers as the meetings list),
// and opens one issue for each meeting of a body in MEETING_BODIES (City
// Council, County Commission and the city boards we write guides for) in
// the next 14 days that has a posted agenda but no guide in content/agendas/.
// One issue per meeting, ever: an issue already opened for it (open or
// closed) is found by a hidden marker and not opened again. Nothing here
// writes content or calls an AI service; a person or session writes the guide
// by following docs/process/agenda-guides.md.
//
// Usage (from site/):
//   node scripts/agenda-issues.mjs --dry-run   (prints what it would open)
//   node scripts/agenda-issues.mjs run         (opens issues; needs GITHUB_TOKEN, GITHUB_REPOSITORY)
// Env: RUN_URL (optional), for a link back to the run.
// Plain fetch on purpose: the repo allows only a short list of actions.
import { SOURCES, loadSource } from '../src/lib/meetings/index.mjs';
import { loadAgendas, BODIES, MEETING_BODIES } from '../src/lib/agendas.mjs';
import { prettyDate, todayYmd } from '../src/lib/content.mjs';

const LABEL = 'agenda-guide';
const API = 'https://api.github.com';
const DAYS = 14;
const marker = (key) => `<!-- agenda-guide:${key} -->`;

const addDays = (ymd, n) => { const d = new Date(`${ymd}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

// The meetings that need a guide: { key, body, date, files: [{ title, url }] }.
// `existing` is the text of issues already opened (bodies), to skip repeats.
export function plan({ meetings, guides, today, existing = [] }) {
  const until = addDays(today, DAYS);
  const covered = new Set(guides.map((g) => `${g.body}-${g.date}`));
  const byKey = new Map();
  // A meeting with any file marked cancelled gets no issue.
  const cancelled = new Set(meetings.filter((m) => MEETING_BODIES[m.body] && /cancel/i.test(m.title ?? '')).map((m) => `${MEETING_BODIES[m.body]}-${m.date}`));
  for (const m of meetings) {
    const body = MEETING_BODIES[m.body];
    if (!body || !m.agenda_url || m.date < today || m.date > until) continue;
    const key = `${body}-${m.date}`;
    if (covered.has(key) || cancelled.has(key) || existing.some((t) => String(t).includes(marker(key)))) continue;
    if (!byKey.has(key)) byKey.set(key, { key, body, date: m.date, files: [] });
    byKey.get(key).files.push({ title: m.title, url: m.agenda_url });
  }
  return [...byKey.values()].sort((a, b) => a.date.localeCompare(b.date) || a.key.localeCompare(b.key));
}

export function issueFor(p, { runUrl, repo = 'david-shortman/mon-county-community-hub' } = {}) {
  const name = BODIES[p.body].name;
  const body = [
    `${name} posted an agenda for its meeting on ${prettyDate(p.date)}, and there is no plain-language guide for it yet.`,
    '',
    '**Posted files**',
    ...p.files.map((f) => `- [${f.title}](${f.url})`),
    '',
    '**What to do**',
    `1. Follow the checklist in [docs/process/agenda-guides.md](https://github.com/${repo}/blob/main/docs/process/agenda-guides.md) and the neutrality rules it links.`,
    `2. Add \`content/agendas/${p.key}.yaml\` with every agenda item, its exact title, a kind and one neutral line.`,
    '3. Open a PR that closes this issue. If the meeting is cancelled or the agenda is withdrawn, close this issue instead.',
    '',
    'If the agenda is amended later, re-read it the day before the meeting and update the guide.',
    '',
    `Opened by the daily Agenda guides check${runUrl ? ` ([run](${runUrl}))` : ''}. It opens one issue per meeting and never writes content.`,
    '',
    marker(p.key),
  ].join('\n');
  return { title: `Agenda guide: ${name}, ${prettyDate(p.date)}`, body };
}

async function readMeetings() {
  const all = [];
  for (const src of SOURCES) {
    const { meetings, status } = await loadSource(src, { save: false });
    if (status !== 'live') console.warn(`${src.id}: could not read the live page (${status}); using the saved copy.`);
    all.push(...meetings);
  }
  return all;
}

async function main() {
  const mode = process.argv[2] ?? '--dry-run';
  const today = todayYmd();
  const meetings = await readMeetings();
  const guides = loadAgendas();
  if (mode !== 'run') {
    const todo = plan({ meetings, guides, today });
    console.log(`${todo.length} meeting(s) need a guide (dry run; existing issues not checked).`);
    for (const p of todo) console.log(`- ${issueFor(p).title}\n${p.files.map((f) => `    ${f.title}: ${f.url}`).join('\n')}`);
    return;
  }
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are needed for run');
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'everything-morgantown-agenda-check' };
  async function gh(method, p, body) {
    const res = await fetch(`${API}${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw new Error(`${method} ${p}: ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  }
  try { await gh('POST', `/repos/${repo}/labels`, { name: LABEL, color: '1d76db', description: 'A posted meeting agenda that needs a plain-language guide (#529)' }); } catch { /* already there */ }
  const existing = (await gh('GET', `/repos/${repo}/issues?state=all&labels=${LABEL}&sort=created&direction=desc&per_page=100`)).map((i) => i.body ?? '');
  const todo = plan({ meetings, guides, today, existing });
  console.log(`${todo.length} new meeting(s) need a guide.`);
  for (const p of todo) {
    const created = await gh('POST', `/repos/${repo}/issues`, { ...issueFor(p, { runUrl: process.env.RUN_URL, repo }), labels: [LABEL, 'for:code', 'type:content'] });
    console.log(`Opened #${created.number}: ${created.title}`);
    // Space out writes, so a busy week never trips GitHub's limits.
    await new Promise((r) => setTimeout(r, 3000));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => { console.error(err.message); process.exit(1); });
}
