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

test('feeds list posts newest first with absolute links and full text', async () => {
  const { rssXml, jsonFeed, absolutize } = await import('../src/lib/blog-feeds.mjs');
  const origin = 'https://everythingmorgantown.org';
  const [p] = await loadPosts({ dir: fixtures, today: '2026-11-05' });
  const older = { ...p, slug: '2026-10-01-older', title: 'Older & wiser', date: '2026-10-01', lastmod: '2026-10-01' };
  const posts = [p, older];
  const rss = rssXml(posts, origin);
  assert.match(rss, /^<\?xml version="1.0"/);
  assert.ok(rss.indexOf('2026-11-03-sample-post') < rss.indexOf('2026-10-01-older'));
  assert.match(rss, /<link>https:\/\/everythingmorgantown\.org\/blog\/2026-11-03-sample-post\/<\/link>/);
  assert.match(rss, /Older &amp; wiser/);
  assert.match(rss, /href="https:\/\/everythingmorgantown\.org\/how-it-works\/"/);
  assert.doesNotMatch(rss, /href="\/(?!\/)/);
  const feed = jsonFeed(posts, origin);
  assert.equal(feed.version, 'https://jsonfeed.org/version/1.1');
  assert.equal(feed.feed_url, `${origin}/blog/feed.json`);
  assert.deepEqual(feed.items.map((i) => i.id), [`${origin}/blog/2026-11-03-sample-post/`, `${origin}/blog/2026-10-01-older/`]);
  assert.equal(feed.items[0].date_modified, '2026-11-04T12:00:00.000Z');
  assert.ok(feed.items.every((i) => i.url.startsWith(`${origin}/`) && i.content_html && i.summary));
  assert.equal(absolutize('<a href="//x.org/">a</a> <img src="/i.png">', origin), `<a href="//x.org/">a</a> <img src="${origin}/i.png">`);
  assert.doesNotMatch(rssXml([], origin), /<item>/);
});
