#!/usr/bin/env node
// Keeps one "Health" issue in step with a health report. Used by
// .github/workflows/health.yml after `npm run health`.
//  - Some check failing: open the issue (and pin it), or update its body.
//  - Nothing failing: comment and close it.
// Writes `issue` and `investigate` to $GITHUB_OUTPUT. `investigate` is true only
// when an agent-fixable failure is new since the last run, so Claude is not
// called again for the same problem.
//
// Usage: node scripts/health-issue.mjs health.json health.md
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, RUN_URL, and optionally
// SITE_RUN_URL and SITE_RUN_CONCLUSION (when started by a Site run).
// Plain fetch on purpose: the repo allows only a short list of actions.
import fs from 'node:fs';

const LABEL = 'health';
const API = 'https://api.github.com';

export function fixableFingerprint(report) {
  return report.checks.filter((c) => c.status === 'fail' && c.agent_fixable).map((c) => c.id).sort().join(',');
}

export function oldFingerprint(body) {
  return body?.match(/<!-- fingerprint: (.*?) -->/)?.[1] ?? '';
}

export function issueBody(report, md, { runUrl, repoUrl, siteRunUrl, siteRunConclusion }) {
  const siteNote = siteRunConclusion && siteRunConclusion !== 'success'
    ? `This run was started because the Site workflow on main ended in \`${siteRunConclusion}\`: ${siteRunUrl}\n` : '';
  return [
    'The Health workflow found failing checks. This issue updates itself on every run and closes when nothing is failing.',
    '',
    `Runbook: [docs/operations/README.md](${repoUrl}/blob/main/docs/operations/README.md). Latest run: ${runUrl}`,
    '',
    siteNote,
    md,
    `<!-- fingerprint: ${fixableFingerprint(report)} -->`,
  ].join('\n');
}

// Decide what to do, given the report and the open Health issue (or null).
export function plan(report, existing) {
  if (report.status !== 'fail') return { action: existing ? 'close' : 'none', investigate: false };
  const print = fixableFingerprint(report);
  return {
    action: existing ? 'update' : 'create',
    investigate: print !== '' && print !== oldFingerprint(existing?.body),
  };
}

async function main() {
  const [jsonFile, mdFile] = process.argv.slice(2);
  const report = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
  const md = fs.readFileSync(mdFile, 'utf8');
  const repo = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  const runUrl = process.env.RUN_URL || '';
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'mon-county-health' };

  async function gh(method, path, body) {
    const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
    return res.status === 204 ? null : res.json();
  }

  const output = (k, v) => {
    if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
    console.log(`${k}=${v}`);
  };

  // Make sure the label exists (422 means it already does).
  try { await gh('POST', `/repos/${repo}/labels`, { name: LABEL, color: 'b60205', description: 'Opened and closed by the Health workflow' }); }
  catch (e) { if (!/422/.test(e.message)) throw e; }

  const open = (await gh('GET', `/repos/${repo}/issues?state=open&labels=${LABEL}&per_page=100`)).filter((i) => !i.pull_request);
  const existing = open[0] ?? null;
  const p = plan(report, existing);

  if (p.action === 'close') {
    await gh('POST', `/repos/${repo}/issues/${existing.number}/comments`, {
      body: `Health is back to **${report.status.toUpperCase()}** as of ${report.checked_at}. Closing. [Run](${runUrl})\n\n${md}`,
    });
    await gh('PATCH', `/repos/${repo}/issues/${existing.number}`, { state: 'closed', state_reason: 'completed' });
  }

  let number = existing?.number ?? '';
  if (p.action === 'update' || p.action === 'create') {
    const body = issueBody(report, md, {
      runUrl,
      repoUrl: `https://github.com/${repo}`,
      siteRunUrl: process.env.SITE_RUN_URL,
      siteRunConclusion: process.env.SITE_RUN_CONCLUSION,
    });
    if (p.action === 'update') {
      await gh('PATCH', `/repos/${repo}/issues/${number}`, { body });
    } else {
      const created = await gh('POST', `/repos/${repo}/issues`, { title: 'Health: something is failing', body, labels: [LABEL, 'bug'] });
      number = created.number;
      // Pin it so people see it first. GraphQL only; carry on if not allowed.
      try {
        const res = await fetch(`${API}/graphql`, {
          method: 'POST', headers,
          body: JSON.stringify({ query: 'mutation($id: ID!) { pinIssue(input: { issueId: $id }) { issue { number } } }', variables: { id: created.node_id } }),
        });
        const out = await res.json();
        if (out.errors) console.warn(`::warning::Could not pin the Health issue: ${out.errors[0].message}`);
      } catch (e) { console.warn(`::warning::Could not pin the Health issue: ${e.message}`); }
    }
  }
  output('issue', number);
  output('investigate', p.investigate ? 'true' : 'false');
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
