import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPosts, postProblems } from '../src/lib/blog.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'blog');
const good = { title: 'T', date: '2026-11-03', type: 'milestone', summary: 'S.', pages: ['/about/'] };

test('the fixture post loads with rendered HTML and its correction', async () => {
  const [p] = await loadPosts({ dir: fixtures, today: '2026-11-05' });
  assert.equal(p.slug, '2026-11-03-sample-post');
  assert.equal(p.typeLabel, 'How it works');
  assert.match(p.html, /<strong>sample<\/strong>/);
  assert.equal(p.lastmod, '2026-11-04');
  assert.equal(p.stale, false);
});

test('a post older than 90 days is marked stale', async () => {
  const [p] = await loadPosts({ dir: fixtures, today: '2027-02-02' });
  assert.equal(p.stale, true);
});

test('no folder means no posts', async () => {
  assert.deepEqual(await loadPosts({ dir: path.join(fixtures, 'missing') }), []);
});

test('postProblems catches bad files and fields', () => {
  assert.deepEqual(postProblems('2026-11-03-ok.md', good), []);
  assert.match(postProblems('bad-name.md', good)[0], /YYYY-MM-DD/);
  assert.match(postProblems('2026-11-04-ok.md', good).join(), /does not match/);
  assert.match(postProblems('2026-11-03-ok.md', { ...good, type: 'news' }).join(), /type must be/);
  assert.match(postProblems('2026-11-03-ok.md', { ...good, pages: ['about'] }).join(), /site path/);
  assert.match(postProblems('2026-11-03-ok.md', { ...good, corrections: [{ date: 'x' }] }).join(), /correction/);
});
