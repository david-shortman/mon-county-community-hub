#!/usr/bin/env node
// The group request clock (#521). Run by the Health workflow every 4 hours.
// For each open issue labeled `group-request`:
//   - adds "Due: <received + REQUEST_DAYS>" to the top of the body,
//   - on PRIORITY_DAY adds `priority`, on DAVID_DAY adds `for:david`,
//   - on REQUEST_DAYS plans a PR that hides the item (`reason: overdue`, #519).
// The days come from site/src/lib/group-requests.mjs (one number, #502).
// It never contacts anyone: it only edits labels, comments and issue bodies
// in this repo. Runbook: docs/operations/group-requests.md.
//
// Usage (from site/):
//   node scripts/group-requests.mjs --plan hides.json [--dry-run] [--today YYYY-MM-DD]
//   node scripts/group-requests.mjs --hide <content file> <issue>   (edits the file only)
//   node scripts/group-requests.mjs --report <issue> ok <pr url>
//   node scripts/group-requests.mjs --report <issue> fail <what went wrong>
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY. Plain fetch, like health-issue.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { todayYmd, CONTENT_DIR } from '../src/lib/content.mjs';
import {
  REQUEST_DAYS, PRIORITY_DAY, DAVID_DAY, LABEL, PRIORITY_LABEL, DAVID_LABEL, OVERDUE_LABEL,
  parseRequest, clockSteps, withHiddenBlock,
} from '../src/lib/group-requests.mjs';

const API = 'https://api.github.com';
const FAIL_MARK = '<!-- clock:hide-failed -->';
const NOFILE_MARK = '<!-- clock:overdue-no-file -->';
const FOOTER = '\n\n---\n_Posted by the group request clock (#521) in the Health workflow._';
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

async function gh(method, path, body) {
  const repo = process.env.GITHUB_REPOSITORY || 'david-shortman/mon-county-community-hub';
  const token = process.env.GITHUB_TOKEN;
  const res = await fetch(`${API}/repos/${repo}${path}`, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), Accept: 'application/vnd.github+json', 'User-Agent': 'mon-county-request-clock' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

async function listAll(path) {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const batch = await gh('GET', `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

const comment = (n, text) => gh('POST', `/issues/${n}/comments`, { body: text + FOOTER });
const addLabel = (n, label) => gh('POST', `/issues/${n}/labels`, { labels: [label] });
async function hasComment(n, mark) {
  return (await listAll(`/issues/${n}/comments`)).some((c) => c.body?.includes(mark));
}

async function plan(outFile, dryRun, today) {
  const issues = (await listAll(`/issues?state=open&labels=${encodeURIComponent(LABEL)}`)).filter((i) => !i.pull_request);
  const hides = [];
  for (const issue of issues) {
    const req = parseRequest(issue);
    if (!req.fromTeam) { console.log(`#${req.number}: not opened by the project team, so the clock leaves it alone`); continue; }
    const { age, steps } = clockSteps(req, today);
    console.log(`#${req.number}: received ${req.received}, day ${age}, due ${req.due}, ${req.kind ?? 'kind?'}, ${req.file ?? 'no file'}: ${steps.join(', ') || 'nothing to do'}`);
    if (dryRun) { if (steps.includes('hide')) hides.push({ number: req.number, file: req.file }); continue; }
    for (const step of steps) {
      if (step === 'due-line') {
        await gh('PATCH', `/issues/${req.number}`, { body: `Due: ${req.due} (received ${req.received}; we act within ${REQUEST_DAYS} days)\n\n${issue.body ?? ''}` });
      } else if (step === 'priority') {
        await addLabel(req.number, PRIORITY_LABEL);
        await comment(req.number, `Day ${age} of ${REQUEST_DAYS}, still open, so this moves to the top of the queue (\`${PRIORITY_LABEL}\`). Due ${req.due}.`);
      } else if (step === 'for:david') {
        await addLabel(req.number, DAVID_LABEL);
        await comment(req.number, `Day ${age} of ${REQUEST_DAYS}, still open. Adding \`for:david\`. If this is not done by ${req.due}, the item is hidden until it is (#519, #521).`);
      } else if (step === 'hide') {
        // Already hidden (a removal is hidden the day it comes in): nothing to do.
        const file = path.join(CONTENT_DIR, '..', req.file);
        if (!fs.existsSync(file)) await report(req.number, 'fail', `${req.file} does not exist`);
        else if (!/^hidden:/m.test(fs.readFileSync(file, 'utf8'))) hides.push({ number: req.number, file: req.file });
      } else if (step === 'overdue-no-file' && !(await hasComment(req.number, NOFILE_MARK))) {
        const why = req.kind === 'add' ? 'This is a request to add an item, so there is nothing to hide.' : 'The issue does not name a `content/...yaml` file, so the clock cannot hide the item by itself. A session should hide it now (content/README.md, "Hiding an item").';
        await comment(req.number, `${NOFILE_MARK}Day ${age}: past the ${REQUEST_DAYS}-day promise. ${why}`);
      }
    }
  }
  fs.writeFileSync(outFile, JSON.stringify(hides, null, 2));
  console.log(`${issues.length} open group requests; ${hides.length} to hide.`);
}

function hide(file, number, today) {
  const text = fs.readFileSync(file, 'utf8');
  const next = withHiddenBlock(text, { reason: 'overdue', since: today, note: `Group request #${number} was still open after ${REQUEST_DAYS} days.` });
  if (!next) { console.error(`${file} is already hidden`); process.exit(3); }
  fs.writeFileSync(file, next);
}

async function report(number, outcome, detail) {
  if (outcome === 'ok') {
    await addLabel(number, OVERDUE_LABEL);
    await comment(number, `Day ${REQUEST_DAYS}: this request was still open, so the item is hidden until it is fixed (\`reason: overdue\`, #519): ${detail}\n\nTo put it back, fix it, then remove its \`hidden\` block. A missed deadline means the item comes down, never that it stays up and wrong.`);
  } else if (!(await hasComment(number, FAIL_MARK))) {
    await addLabel(number, 'for:code');
    await comment(number, `${FAIL_MARK}Day ${REQUEST_DAYS}: the clock could not hide this item by itself (${detail}). A session should hide it now (content/README.md, "Hiding an item") and merge it the same day.`);
  }
}

const today = opt('--today') ?? todayYmd();
if (args.includes('--plan')) await plan(opt('--plan'), args.includes('--dry-run'), today);
else if (args.includes('--hide')) hide(opt('--hide'), args[args.indexOf('--hide') + 2], today);
else if (args.includes('--report')) { const i = args.indexOf('--report'); await report(args[i + 1], args[i + 2], args.slice(i + 3).join(' ')); }
else { console.error('Usage: see the top of this file.'); process.exit(1); }
// Days for reference in logs: priority on day PRIORITY_DAY, for:david on day DAVID_DAY.
if (args.includes('--plan')) console.log(`Clock: priority on day ${PRIORITY_DAY}, for:david on day ${DAVID_DAY}, hide on day ${REQUEST_DAYS}.`);
