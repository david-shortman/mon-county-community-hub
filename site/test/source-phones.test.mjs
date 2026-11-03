// Phone numbers the Source check finds on a page (scripts/check-sources.mjs, #506).
import test from 'node:test';
import assert from 'node:assert/strict';
import { phonesOnPage } from '../scripts/check-sources.mjs';

test('reads plain, tel: and toll-free lettered numbers', () => {
  const found = phonesOnPage('<p>Call (304) 296-3680 or <a href="tel:18006884673">us</a>. Quit line 1-800-QUIT-NOW.</p>');
  assert.ok(found.has('3042963680'));
  assert.ok(found.has('8006884673'));
  assert.ok(found.has('8007848669'));
});

test('reads local lettered numbers like 304-291-RIDE', () => {
  const found = phonesOnPage('<p>Riders can call 304-291-RIDE as little as fifteen minutes before.</p>');
  assert.ok(found.has('3042917433'));
});

test('does not read ordinary words after a number as a phone number', () => {
  const found = phonesOnPage('<p>Open 304 days a year, 100 more Ride passes.</p>');
  assert.equal(found.size, 0);
});
