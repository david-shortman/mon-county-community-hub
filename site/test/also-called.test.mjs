// content/also-called.yaml (#529): every key is a real page, entries are
// short plain words, and there are no em dashes.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const map = YAML.parse(fs.readFileSync(path.join(repo, 'content/also-called.yaml'), 'utf8')) ?? {};
const pageFile = (route) => {
  const r = route.replace(/^\/|\/$/g, '');
  return [`${r}.astro`, `${r}/index.astro`].map((f) => path.join(repo, 'site/src/pages', f)).find((f) => fs.existsSync(f));
};

test('also-called keys are real pages, in order', () => {
  const keys = Object.keys(map);
  for (const route of keys) assert.ok(/^\/.*\/$/.test(route) && pageFile(route), `${route} is not a page (check the path)`);
  assert.deepEqual(keys, [...keys].sort(), 'keep keys in alphabetical order');
});

test('also-called entries are short plain words', () => {
  for (const [route, words] of Object.entries(map)) {
    assert.ok(Array.isArray(words) && words.length >= 1 && words.length <= 6, `${route}: list 1 to 6 entries`);
    for (const w of words) {
      assert.equal(typeof w, 'string', `${route}: ${w} should be text`);
      assert.ok(w.split(/\s+/).length <= 5, `${route}: "${w}" is too long`);
      assert.ok(!w.includes('—'), `${route}: "${w}" has an em dash`);
    }
  }
});
