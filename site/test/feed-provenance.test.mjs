// One provenance shape (ADR 0002, #70): every feed record's first source says
// method feed, when it was fetched, and which feed, so the calendar card can
// say "Pulled from ... on ..." from the source alone.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFeedEntries } from '../src/lib/feeds/index.mjs';

test('feed records carry method, fetched and feed id on sources[0]', async () => {
  const quiet = { log() {}, warn() {} };
  const entries = await loadFeedEntries({ today: new Date().toISOString().slice(0, 10), live: false, log: quiet });
  for (const e of entries) {
    const s = e.sources?.[0];
    assert.equal(s?.method, 'feed', `${e.slug}: sources[0].method`);
    assert.ok(s.fetched && !Number.isNaN(Date.parse(s.fetched)), `${e.slug}: sources[0].fetched`);
    assert.equal(s.feed, e.feed?.id, `${e.slug}: sources[0].feed`);
    assert.equal(s.url, e.feed?.page_url, `${e.slug}: sources[0].url is the feed's page`);
  }
});
