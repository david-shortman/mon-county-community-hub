import test from 'node:test';
import assert from 'node:assert/strict';
import { keepPhones } from '../src/lib/keep-phones.mjs';

const page = (body) => `<html><head><title>304-555-0100</title><style>.nowrap { white-space: nowrap; }</style></head><body>${body}</body></html>`;

test('wraps numbers in sentences', () => {
  const out = keepPhones(page('<p>Call 1-877-322-8228 or (304) 598-5181, or text 898-211.</p>'));
  assert.match(out, /Call <span class="nowrap">1-877-322-8228<\/span> or <span class="nowrap">\(304\) 598-5181<\/span>, or text <span class="nowrap">898-211<\/span>\./);
});

test('leaves tags, scripts, titles, tel links and wrapped numbers alone', () => {
  const html = page('<a href="tel:3045550100" data-n="304-555-0100">304-555-0100</a><script>var n="304-555-0100"</script><span class="nowrap">304-555-0100</span>');
  assert.equal(keepPhones(html), html);
});

test('does not touch other number shapes', () => {
  const html = page('<p>Form SCA-M225, 2026-2027, ZIP 26505-1234, ID 12-304-555-0100x</p>');
  assert.equal(keepPhones(html), html);
});

test('pages without the nowrap class are unchanged', () => {
  const html = '<p>Call 304-555-0100</p>';
  assert.equal(keepPhones(html), html);
});
