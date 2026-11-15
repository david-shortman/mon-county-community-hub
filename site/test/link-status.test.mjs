// Health links check (#1929): which answers count as broken.
import test from 'node:test';
import assert from 'node:assert/strict';
import { linkStatus } from '../src/lib/link-status.mjs';

const fda = 'https://www.fda.gov/drugs/emergency-preparedness-drugs/safe-drug-use-after-natural-disaster';

test('2xx and 3xx are fine', () => {
  assert.equal(linkStatus('https://example.org/a', 200).kind, 'ok');
  assert.equal(linkStatus('https://example.org/a', 301).kind, 'ok');
});

test('404 and 410 are broken on other hosts', () => {
  assert.equal(linkStatus('https://example.org/gone', 404).kind, 'broken');
  assert.equal(linkStatus('https://example.org/gone', 410).kind, 'broken');
  assert.equal(linkStatus('https://www.cdc.gov/gone', 404).kind, 'broken');
  // Only the exact host is listed, not look-alikes.
  assert.equal(linkStatus('https://www.fda.gov.example.org/x', 404).kind, 'broken');
  assert.equal(linkStatus('https://notfda.gov/x', 404).kind, 'broken');
});

test('a 404 from fda.gov is unverified, with a note to open it by hand', () => {
  const r = linkStatus(fda, 404);
  assert.equal(r.kind, 'unverified');
  assert.match(r.note, /fda\.gov/);
  assert.match(r.note, /open it by hand/);
  assert.equal(linkStatus(fda.replace('www.fda.gov', 'WWW.FDA.GOV'), 404).kind, 'unverified');
});

test('410 from fda.gov still means gone', () => {
  assert.equal(linkStatus(fda, 410).kind, 'broken');
});

test('blocks, rate limits, server errors and network errors are unverified', () => {
  for (const s of [0, 401, 403, 429, 500, 503]) {
    const r = linkStatus('https://example.org/a', s);
    assert.equal(r.kind, 'unverified', `status ${s}`);
    assert.equal(r.note, undefined);
  }
  assert.equal(linkStatus(fda, 403).note, undefined);
});
