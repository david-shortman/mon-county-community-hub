// Warming shelter status helpers (#219): the shared "checked" wording used by
// /tonight/ and /stay-tonight/, and the winter 7-day freshness warning.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkedWhen, tonightStaleness, inWinter, loadTonight } from '../src/lib/tonight.mjs';

const at = (day) => new Date(`${day}T17:00:00Z`); // noon in Morgantown
const rec = (checked, status = 'not-announced') => ({ status, checked, checkedDay: checked.slice(0, 10) });

test('checkedWhen reads like a person wrote it', () => {
  assert.equal(checkedWhen(rec('2026-11-14 22:40')), 'November 14, 2026 at 10:40 p.m.');
  assert.equal(checkedWhen(rec('2026-11-15 09:00')), 'November 15, 2026 at 9 a.m.');
  assert.equal(checkedWhen(rec('2026-12-01 12:00')), 'December 1, 2026 at noon');
});

test('winter is November through March', () => {
  for (const d of ['2026-11-01', '2026-12-15', '2027-01-10', '2027-03-31']) assert.ok(inWinter(d), d);
  for (const d of ['2027-04-01', '2026-08-24', '2026-10-31']) assert.ok(!inWinter(d), d);
});

test('warns in winter when the status is more than 7 days old', () => {
  assert.equal(tonightStaleness(rec('2026-11-08 10:00'), at('2026-11-15')), null, '7 days is fine');
  assert.match(tonightStaleness(rec('2026-11-07 10:00'), at('2026-11-15')), /8 days ago/);
  assert.match(tonightStaleness(rec('2026-12-28 10:00'), at('2027-01-10')), /13 days ago/, 'across the new year');
});

test('no warning outside winter or once the season is over', () => {
  assert.equal(tonightStaleness(rec('2026-08-01 10:00'), at('2026-10-15')), null);
  assert.equal(tonightStaleness(rec('2027-03-01 10:00', 'season-over'), at('2027-03-20')), null);
});

test('the real file parses and has a checked day', () => {
  assert.match(loadTonight().checkedDay, /^\d{4}-\d{2}-\d{2}$/);
});
