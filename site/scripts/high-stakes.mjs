// Lists the high-stakes files a pull request changes: what residents see about
// shelter, crisis help, food and benefits. A PR that changes any of them waits
// for David (docs/COORDINATION.md, "When a PR waits for David").
// Usage: node scripts/high-stakes.mjs <base-ref>   (run from site/)
// Prints one line per file with the reason. Exit code is always 0.
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';

// Pages and parts that show shelter, crisis help, food or benefits. Any page
// file also counts if it is in the Help now or Get through this month door, has
// one of TOPICS, or names a crisis line (see pageHit below).
const PAGES = [
  'site/src/pages/help/food/',
  'site/src/components/CrisisStrip.astro',
  'site/src/components/CrisisLine.astro',
];
const DOORS = ['help-now', 'this-month'];
// Entries with these topics feed those pages.
const TOPICS = ['housing', 'money', 'food'];
// Crisis lines, matched in an entry's text.
const CRISIS = /\b(988|211|911)\b|crisis/i;
const CONTENT = /^content\/(resources|orgs|calendar)\/[^/]+\.ya?ml$/;

const base = process.argv[2] || 'origin/main';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', cwd: '..', stdio: ['ignore', 'pipe', 'ignore'] });
const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);

// Read a file as it is on this branch, or as it was on the base if it was deleted.
const read = (file) => {
  for (const ref of ['HEAD', base]) {
    try { return git('show', `${ref}:${file}`); } catch { /* not on this ref */ }
  }
  return '';
};

for (const file of changed) {
  const page = PAGES.find((p) => (p.endsWith('/') ? file.startsWith(p) : file === p));
  if (page) { console.log(`${file}: a shelter, crisis, food or benefits page`); continue; }
  if (/^site\/src\/pages\/.+\.astro$/.test(file)) {
    const text = read(file);
    const door = text.match(/door:\s*["']([a-z-]+)["']/)?.[1];
    const topic = text.match(/topic:\s*["']([a-z-]+)["']/)?.[1];
    if (DOORS.includes(door)) console.log(`${file}: in the ${door} door`);
    else if (TOPICS.includes(topic)) console.log(`${file}: page topic ${topic}`);
    else if (CRISIS.test(text)) console.log(`${file}: names a crisis line`);
    continue;
  }
  if (!CONTENT.test(file)) continue;
  const text = read(file);
  let topics = [];
  try { topics = [].concat(YAML.parse(text)?.topics ?? []); } catch { /* bad YAML is check-content's job */ }
  const hit = topics.find((t) => TOPICS.includes(t));
  if (hit) console.log(`${file}: topic ${hit}`);
  else if (CRISIS.test(text)) console.log(`${file}: mentions a crisis line`);
}
