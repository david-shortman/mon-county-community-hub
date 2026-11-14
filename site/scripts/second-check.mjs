// The blind second check (#1098, docs/playbook/second-check.md; decided on #97).
//
//   node scripts/second-check.mjs claims [--base REF] [FILE...]
//     Prints the claim packet for a checker: one row per field of each
//     top-tier record this change adds or changes (or the FILEs named, as
//     paths under content/), with no source links or notes. Give it to a
//     different session, and only it.
//
//   node scripts/second-check.mjs verdict --pr N
//   node scripts/second-check.mjs verdict --file BODY.md [--base REF]
//     Reads the PR's "Second check" tables (body and comments) and says
//     whether the PR may merge. Exit 0: confirmed, or no top-tier record
//     changed. Exit 1: missing, unfilled, or a row changed or not found.
//     Nothing calls this yet; wiring it into scripts/safe-merge.sh is David's
//     call.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { isTopTier } from '../src/lib/content.mjs';
import { claimsFor, packetMd, parseTable, verdict } from '../src/lib/second-check.mjs';

const REPO = 'david-shortman/mon-county-community-hub';
const DIRS = ['orgs', 'resources', 'calendar', 'secondhand', 'boards', 'places'];
const [cmd, ...args] = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const root = path.resolve('..');
const tryRun = (bin, a) => { try { return execFileSync(bin, a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };
const git = (...a) => tryRun('git', a);
const gh1 = (p) => { const out = tryRun('gh', ['api', p]); return out == null ? null : JSON.parse(out); };
// Every page of a list endpoint, 100 at a time.
function ghAll(p) {
  const all = [];
  for (let page = 1; page <= 30; page++) {
    const got = gh1(`${p}${p.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    if (got == null) return null;
    all.push(...got);
    if (got.length < 100) break;
  }
  return all;
}

function base() {
  if (opt('base')) return opt('base');
  if (git('rev-parse', '--verify', 'origin/main')) { const mb = git('merge-base', 'origin/main', 'HEAD'); if (mb) return mb; }
  return git('rev-parse', '--verify', 'HEAD^1') ? 'HEAD^1' : null;
}

const fromDisk = (rel) => fs.readFileSync(path.join(root, 'content', rel), 'utf8');

// Top-tier records among files (paths under content/). A file that cannot be
// read or parsed counts as top tier, so it is never skipped by mistake.
function topTier(files, read = fromDisk) {
  const out = [];
  for (const rel of files) {
    if (!DIRS.some((d) => rel.startsWith(`${d}/`)) || !/\.ya?ml$/.test(rel)) continue;
    let r;
    try { r = { ...YAML.parse(read(rel)), _file: rel }; } catch { out.push({ _file: rel, unreadable: true }); continue; }
    // Hidden records are off the site, so they need no check (#519).
    if (isTopTier(r) && r.hidden == null) out.push(r);
  }
  return out;
}

function changedFiles(b) {
  const paths = DIRS.map((d) => `content/${d}`);
  return [...new Set([
    ...(git('diff', '--name-only', '--diff-filter=AM', b, '--', ...paths) ?? '').split('\n'),
    ...(git('ls-files', '--others', '--exclude-standard', '--', ...paths) ?? '').split('\n'),
  ])].filter(Boolean).map((f) => f.replace(/^content\//, ''));
}

if (cmd === 'claims') {
  const named = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--base').map((f) => f.replace(/^(\.\.\/)?content\//, ''));
  const b = named.length ? null : base();
  const files = named.length ? named : b ? changedFiles(b) : [];
  const items = topTier(files).map(claimsFor).filter((it) => it.claims.length);
  if (!items.length) { console.log('No top-tier record with checkable fields in this change, so no second check is needed.'); process.exit(0); }
  console.log(packetMd(items));
} else if (cmd === 'verdict') {
  let text = '';
  let files = [];
  let read = fromDisk;
  if (opt('pr')) {
    const n = opt('pr');
    const pr = gh1(`repos/${REPO}/pulls/${n}`);
    const comments = ghAll(`repos/${REPO}/issues/${n}/comments`);
    const list = ghAll(`repos/${REPO}/pulls/${n}/files`);
    if (pr == null || comments == null || list == null) { console.error('Could not read the PR from GitHub.'); process.exit(2); }
    text = [pr.body ?? '', ...comments.map((c) => c.body ?? '')].join('\n\n');
    // Read each file as it is on the PR's head, not this checkout.
    read = (rel) => {
      const out = tryRun('gh', ['api', '-H', 'Accept: application/vnd.github.raw', `repos/${REPO}/contents/content/${rel}?ref=${pr.head.sha}`]);
      if (out == null) throw new Error('unreadable');
      return out;
    };
    files = list.filter((f) => f.status !== 'removed').map((f) => f.filename).filter((f) => f.startsWith('content/')).map((f) => f.slice('content/'.length));
  } else if (opt('file')) {
    text = fs.readFileSync(opt('file'), 'utf8');
    const b = base();
    files = b ? changedFiles(b) : [];
  } else { console.error('Usage: second-check.mjs verdict --pr N | --file BODY.md'); process.exit(2); }
  const top = topTier(files, read);
  if (top.some((r) => r.unreadable)) { console.log(`Second check: could not read ${top.filter((r) => r.unreadable).map((r) => r._file).join(', ')}, so cannot tell.`); process.exit(1); }
  if (!top.length) { console.log('Second check: not needed (no top-tier record changed).'); process.exit(0); }
  // Every claim in this PR's packet must have a confirmed row, so a partial
  // table, or one for another record, does not pass.
  const v = verdict(parseTable(text), top.filter((r) => !r.unreadable).map(claimsFor).filter((it) => it.claims.length));
  if (v.ok) { console.log(`Second check: confirmed for ${top.length} top-tier record(s).`); process.exit(0); }
  console.log(`Second check: not ready for ${top.map((r) => r._file).join(', ')}`);
  for (const p of v.problems) console.log(`- ${p}`);
  process.exit(1);
} else {
  console.error('Usage: second-check.mjs claims [--base REF] [FILE...] | verdict --pr N | verdict --file BODY.md');
  process.exit(2);
}
