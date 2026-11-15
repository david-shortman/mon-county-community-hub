// Proof of a re-read (#1094, docs/playbook/reread-proof.md). For each content
// record this change touches, every source whose checked date moved later (or
// that is new) needs proof that the page was read again: a quote copied from
// the page, a phone call on that date, or a feed or watched page. Changes not
// committed yet count too, so run it before you commit. Warns, and
// fails only with --strict (not used in CI yet; that is David's call).
//
// The base to compare with:
//   --base REF, or REREAD_BASE, if given
//   else the merge base with origin/main, when this branch is not main
//   else HEAD^1 (in CI a PR's checkout is a merge commit whose first parent
//   is main, and on main it is the commit before the squash merge)
// With no git history to compare (a shallow clone with one commit), it says
// so and passes.
// Usage (from site/): node scripts/check-reread.mjs [--base REF] [--strict]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { missingProof } from '../src/lib/reread.mjs';

const DIRS = ['orgs', 'resources', 'calendar', 'secondhand', 'boards', 'places', 'facts'];
const args = process.argv.slice(2);
const strict = args.includes('--strict');
const at = args.indexOf('--base');
const repo = path.resolve('..');
const git = (...a) => execFileSync('git', a, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
const tryGit = (...a) => { try { return git(...a); } catch { return null; } };

function pickBase() {
  if (at >= 0 && args[at + 1]) return args[at + 1];
  if (process.env.REREAD_BASE) return process.env.REREAD_BASE;
  const branch = tryGit('rev-parse', '--abbrev-ref', 'HEAD');
  if (branch && branch !== 'main' && branch !== 'HEAD' && tryGit('rev-parse', '--verify', 'origin/main')) {
    const mb = tryGit('merge-base', 'origin/main', 'HEAD');
    if (mb) return mb;
  }
  return tryGit('rev-parse', '--verify', 'HEAD^1') ? 'HEAD^1' : null;
}

const base = pickBase();
if (!base) {
  console.log('Re-read check: no earlier commit to compare with, skipped.');
  process.exit(0);
}
// Compared with the working tree, so it also covers changes not committed yet.
const paths = DIRS.map((d) => `content/${d}`);
const changed = [...new Set([
  ...(tryGit('diff', '--name-only', '--diff-filter=AM', base, '--', ...paths) ?? '').split('\n'),
  ...(tryGit('ls-files', '--others', '--exclude-standard', '--', ...paths) ?? '').split('\n'),
])].filter((f) => /\.ya?ml$/.test(f));

const parse = (text) => { try { return YAML.parse(text) ?? {}; } catch { return null; } };
const problems = [];
for (const file of changed) {
  let text;
  try { text = fs.readFileSync(path.join(repo, file), 'utf8'); } catch { continue; }
  const after = parse(text);
  if (!after) continue;
  const before = parse(tryGit('show', `${base}:${file}`) ?? '') ?? {};
  const rel = file.replace(/^content\//, '');
  const miss = missingProof(before, { ...after, _file: rel });
  for (const m of miss) problems.push(`content/${rel}: ${m.url} checked ${m.was ? `${m.was} -> ${m.now}` : `${m.now} (new source)`} with no proof of a re-read. Add a quote copied from the page (sources[].quote), or phone_confirmed for a call (docs/playbook/reread-proof.md)`);
}
for (const p of problems) console.warn(`warning: ${p}`);
console.log(`Re-read check: compared ${changed.length} changed content files with ${base.slice(0, 12)}: ${problems.length} source dates moved without proof.`);
process.exit(strict && problems.length ? 1 : 0);
