// A page's lastReviewed is its oldest checked date (#122).
import test from 'node:test';
import assert from 'node:assert/strict';
import { newestChecked, oldestCheckedShown, webPageNode } from '../src/lib/site-meta.mjs';

const html = '<title>Trash and recycling</title><p>Checked October 30, 2026.</p><p>Checked on November 1, 2026.</p><p>Checked October 28, 2026.</p>';

test('oldest and newest checked dates', () => {
  assert.equal(oldestCheckedShown(html, '2026-11-01'), '2026-10-28');
  assert.equal(newestChecked(html, '2026-11-01'), '2026-11-01');
  assert.equal(oldestCheckedShown('<p>No dates here.</p>'), null);
  // A date after today is ignored.
  assert.equal(newestChecked('<p>Checked December 1, 2026.</p>', '2026-11-01'), null);
});

test('WebPage node', () => {
  const n = webPageNode(html, 'https://everythingmorgantown.org/recycling/');
  assert.equal(n['@type'], 'WebPage');
  assert.equal(n.name, 'Trash and recycling');
  assert.equal(n.lastReviewed, '2026-10-28');
  assert.equal(webPageNode('<title>x</title>', 'https://everythingmorgantown.org/'), null);
});

test('widget pages get no WebPage node', () => {
  assert.equal(webPageNode(html, 'https://everythingmorgantown.org/embed/dates/'), null);
});
