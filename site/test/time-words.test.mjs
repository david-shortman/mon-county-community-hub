// Time-of-day words (#1378): scripts/check-time-words.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { findTimeWords } from '../scripts/check-time-words.mjs';

const flagged = (p, t) => findTimeWords(p, t).length > 0;

test('flags time words where the time is not the point', () => {
  assert.ok(flagged('/living-will/', 'You can download free West Virginia forms tonight.'));
  assert.ok(flagged('/x/', 'Tonight, read the guide.'));
  assert.ok(flagged('/x/', 'Call the office this morning.'));
  assert.ok(flagged('/parks/', 'Cost: As the page shows today: $10.'));
  assert.ok(flagged('/parks/', 'Public skating times on the arena page today: noon.'));
});

test('keeps them where the time is the point', () => {
  assert.ok(!flagged('/', 'Need help tonight? A place to stay.'));
  assert.ok(!flagged('/topics/', 'A bed tonight, a warm place, food tonight, or safe from someone.'));
  assert.ok(!flagged('/topics/', 'Tonight: is the warming shelter open?'));
  assert.ok(!flagged('/about/', 'Copies of the pages for a hard moment (Tonight, food help, utility bills).'));
  assert.ok(!flagged('/tonight/', 'The shelter opens this evening.'));
  assert.ok(!flagged('/stay-tonight/', 'Call before you go tonight.'));
  assert.ok(!flagged('/parks/', 'Times are as each page showed them when we checked.'));
});
