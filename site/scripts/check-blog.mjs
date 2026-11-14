// Checks blog posts in content/blog/ (#1705). Exits 1 on any problem.
//
// Shape (date, title, type, summary, pages, corrections) comes from
// src/lib/blog.mjs. What a post may say comes from src/lib/blog-checks.mjs:
// no phone numbers, hours, dollar amounts or income limits (link the page),
// crisis lines only as links to a help page, "the owner" instead of a name,
// no em dashes, no "now" or "currently" without a date, no GitHub link as a
// way to report a problem, and every listed page is a real page.
//
// The fixtures are checked first, so the checker itself is tested on every
// run: the good sample post must pass and the bad one must fail on each rule.
// Reading grade, time words, contrast, weight and accessibility run on the
// built /blog/ pages like any other page.
import fs from 'node:fs';
import path from 'node:path';
import { blogDir, splitPost, postProblems } from '../src/lib/blog.mjs';
import { bodyProblems, pageFileExists } from '../src/lib/blog-checks.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const PAGES_DIR = path.join(here, '../src/pages');
const pageExists = (p) => pageFileExists(p, PAGES_DIR);

export function checkDir(dir) {
  if (!fs.existsSync(dir)) return { count: 0, errors: [] };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md').sort();
  const errors = [];
  for (const file of files) {
    const { data, body } = splitPost(fs.readFileSync(path.join(dir, file), 'utf8'));
    errors.push(...postProblems(file, data), ...bodyProblems(file, data, body, { pageExists }));
  }
  return { count: files.length, errors };
}

const good = checkDir(path.join(here, '../test/fixtures/blog'));
const bad = checkDir(path.join(here, 'fixtures/blog-bad'));
const selfTest = [];
if (good.errors.length) selfTest.push(`the good fixture should pass but got:\n  ${good.errors.join('\n  ')}`);
for (const expect of ['phone number', 'opening hours', 'dollar amount', 'income limit', 'names 211, 988 or 911', 'names the owner', 'em dash', '"currently" goes stale', 'report through GitHub', 'pages lists /no-such-page-here/', 'links to /also-missing/'])
  if (!bad.errors.some((e) => e.includes(expect))) selfTest.push(`the bad fixture should fail with "${expect}"`);
if (selfTest.length) {
  console.error(`check-blog self-test failed:\n- ${selfTest.join('\n- ')}`);
  process.exit(1);
}

const { count, errors } = checkDir(blogDir());
if (errors.length) {
  console.error(`Blog check failed (${errors.length}), see content/blog/README.md:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Checked ${count} blog post${count === 1 ? '' : 's'} (self-test passed): 0 errors.`);
