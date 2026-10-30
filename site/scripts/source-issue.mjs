#!/usr/bin/env node
// Keeps one open "Source check" issue in step with the source check (#16).
// Used by .github/workflows/sources.yml.
//
// The issue is a standing board: its title says whether anything needs a
// re-check, and it carries the `for:duet` label only while something does.
// Its body also stores each page's fingerprint from the last run (in a hidden
// comment), so the workflow can spot changed pages without writing to the repo.
//
// Usage:
//   node scripts/source-issue.mjs get-state STATE.json
//   node scripts/source-issue.mjs update REPORT.json REPORT.md
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, RUN_URL.
// Plain fetch on purpose: the repo allows only a short list of actions.
import fs from 'node:fs';

const LABEL = 'source-check';
const TODO_LABEL = 'for:duet';
const API = 'https://api.github.com';
const MAX_BODY = 60_000; // GitHub's limit is 65,536 characters

export function readState(body) {
  const m = body?.match(/<!-- source-state: (.*?) -->/s);
  if (!m) return {};
  try { return JSON.parse(m[1]); } catch { return {}; }
}

export function needsLook(report) {
  return report.broken.length + report.moved.length + report.phones_missing.length;
}

export function title(report) {
  const n = needsLook(report);
  return n ? `Source check: ${n} to re-check` : 'Source check: all clear';
}

export function issueBody(report, md, runUrl) {
  const head = [
    'The Source check workflow updates this issue every day. It never closes. It has the `for:duet` label only while something needs a re-check.',
    '',
    'What to do: for **Broken**, **Moved** and **Phone** items, open the source, find the current page or number, update the entry and its `checked` date, and fix the link. **Changed** pages are a hint to re-check facts, not a problem. Rules and how it works: `content/source-rules.yaml` and `site/scripts/check-sources.mjs`.',
    '',
    `Latest run: ${runUrl}`,
    '',
  ].join('\n');
  const state = `\n<!-- source-state: ${JSON.stringify(report.state)} -->`;
  let text = md;
  const room = MAX_BODY - head.length - state.length - 200;
  if (text.length > room) text = `${text.slice(0, room)}\n\n(Cut short. The full list is in the run summary.)`;
  return head + text + state;
}

async function main() {
  const [cmd, a, b] = process.argv.slice(2);
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'mon-county-source-check' };
  async function gh(method, p, body) {
    const res = await fetch(`${API}${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw new Error(`${method} ${p}: ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  }
  const findIssue = async () => (await gh('GET', `/repos/${repo}/issues?state=all&labels=${LABEL}&sort=created&direction=desc&per_page=10`))
    .filter((i) => !i.pull_request)[0] ?? null;

  if (cmd === 'get-state') {
    const issue = await findIssue();
    fs.writeFileSync(a, JSON.stringify(readState(issue?.body)));
    console.log(issue ? `State read from #${issue.number}.` : 'No Source check issue yet; starting fresh.');
    return;
  }
  if (cmd !== 'update') throw new Error('Usage: source-issue.mjs get-state FILE | update REPORT.json REPORT.md');

  const report = JSON.parse(fs.readFileSync(a, 'utf8'));
  const md = fs.readFileSync(b, 'utf8');
  try { await gh('POST', `/repos/${repo}/labels`, { name: LABEL, color: '0e8a16', description: 'The daily Source check board (#16)' }); }
  catch (e) { if (!/422/.test(e.message)) throw e; }

  const body = issueBody(report, md, process.env.RUN_URL || '');
  const issue = await findIssue();
  const labels = needsLook(report) ? [LABEL, TODO_LABEL] : [LABEL];
  if (!issue) {
    const created = await gh('POST', `/repos/${repo}/issues`, { title: title(report), body, labels });
    console.log(`Opened #${created.number}.`);
  } else {
    await gh('PATCH', `/repos/${repo}/issues/${issue.number}`, { title: title(report), body, labels, state: 'open' });
    console.log(`Updated #${issue.number}.`);
  }
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
