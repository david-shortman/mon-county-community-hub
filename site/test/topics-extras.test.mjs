// "Keep exploring" pieces on /topics/ (#1040).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { shuffleForDay, pickStories, pickSurprise, recentPages, dayNumber } from '../src/lib/topics-extras.mjs';

test('a day always gives the same order, and the next day a different one', () => {
  const list = Array.from({ length: 20 }, (_, i) => i);
  assert.deepEqual(shuffleForDay(list, '2026-11-02'), shuffleForDay(list, '2026-11-02'));
  assert.notDeepEqual(shuffleForDay(list, '2026-11-02'), shuffleForDay(list, '2026-11-03'));
  assert.deepEqual([...shuffleForDay(list, '2026-11-02')].sort((a, b) => a - b), list);
});

test('stories need a source and come from different areas', () => {
  const places = [
    { slug: 'a', area: 'north', story: 'A.', sources: [{ url: 'https://x' }] },
    { slug: 'b', area: 'north', story: 'B.', sources: [{ url: 'https://x' }] },
    { slug: 'c', area: 'south', story: 'C.', sources: [{ url: 'https://x' }] },
    { slug: 'd', area: 'west', story: 'D.', sources: [] },
    { slug: 'e', area: 'east', sources: [{ url: 'https://x' }] },
  ];
  const picked = pickStories(places, '2026-11-02');
  assert.equal(picked.length, 2);
  assert.equal(new Set(picked.map((p) => p.area)).size, 2);
  assert.ok(picked.every((p) => p.story && p.sources.length));
});

test('one page to show, changing by day', () => {
  const pages = ['/a/', '/b/', '/c/'];
  assert.equal(pickSurprise(pages, '2026-11-02'), pages[dayNumber('2026-11-02') % 3]);
  assert.notEqual(pickSurprise(pages, '2026-11-02'), pickSurprise(pages, '2026-11-03'));
  assert.equal(pickSurprise([], '2026-11-02'), null);
});

test('pages named in the last week of the build log, newest first', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'log-'));
  fs.writeFileSync(path.join(dir, '2026-10-20-0100-old.md'), 'Changed `/old/`.');
  fs.writeFileSync(path.join(dir, '2026-10-30-0100-a.md'), 'Added `/a/` and `/b/` and `/not-a-page/`.');
  fs.writeFileSync(path.join(dir, '2026-11-01-0100-b.md'), 'Fixed `/b/`.');
  const r = recentPages(dir, new Set(['/a/', '/b/', '/old/']), '2026-11-02');
  assert.equal(r.count, 2);
  assert.deepEqual(r.pages, [{ route: '/b/', date: '2026-11-01' }, { route: '/a/', date: '2026-10-30' }]);
});
