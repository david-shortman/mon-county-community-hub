// The food day list (#60): content/food-days.yaml names real, food-tagged
// records, and each day's rows come from the records' own hours.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadFoodDaysFile, foodDaysProblems, resolveEntries, byDay, entryDays, timeOn, isOverdue } from '../src/lib/food-days.mjs';
import { RUNS } from '../scripts/checklists.mjs';

test('content/food-days.yaml has no problems', () => {
  assert.deepEqual(foodDaysProblems(loadFoodDaysFile()), []);
});

test('days come from opening_hours when the record has them', () => {
  const e = { kind: 'groceries', record: { opening_hours: [{ days: ['mon', 'thu'], opens: '09:00', closes: '16:00' }, { days: ['fri'], opens: '09:00', closes: '14:00' }] } };
  assert.deepEqual(entryDays(e), ['mon', 'thu', 'fri']);
  assert.equal(timeOn(e, 'fri'), '9 a.m. to 2 p.m.');
  const w = byDay([{ ...e, slug: 'x' }]);
  assert.equal(w.length, 7);
  assert.equal(w.find((d) => d.day === 'tue').rows.length, 0);
  assert.equal(w.find((d) => d.day === 'thu').rows[0].time, '9 a.m. to 4 p.m.');
});

test('an entry without hours uses its own days and words', () => {
  const e = { days: ['sun'], when: '6 p.m.', record: { regular: ['Sundays, 6 p.m.'] } };
  assert.deepEqual(entryDays(e), ['sun']);
  assert.equal(timeOn(e, 'sun'), '6 p.m.');
});

test('bad entries are caught', () => {
  const dirs = {
    resources: [{ slug: 'r1', topics: ['food'], opening_hours: [{ days: ['mon'], opens: '09:00', closes: '10:00' }], sources: [{ url: 'u', checked: '2026-11-01' }] }],
    places: [{ slug: 'p1', interests: ['social'], sources: [{ url: 'u', checked: '2026-11-01' }] }],
    orgs: [],
  };
  const errs = foodDaysProblems({ days: [
    { resource: 'r1', kind: 'groceries', days: ['mon'] },
    { place: 'p1', kind: 'meal', days: ['mon'], when: 'noon' },
    { resource: 'nope', kind: 'meal' },
    { resource: 'r1', kind: 'snack' },
  ] }, dirs);
  assert.ok(errs.some((x) => /leave days out/.test(x)), 'days with opening_hours');
  assert.ok(errs.some((x) => /not tagged food/.test(x)), 'not food');
  assert.ok(errs.some((x) => /no resource with slug nope/.test(x)), 'missing record');
  assert.ok(errs.some((x) => /kind must be/.test(x)), 'bad kind');
});

test('entries over 45 days old say call before you go', () => {
  assert.equal(isOverdue('2026-11-01', '2026-12-10'), false);
  assert.equal(isOverdue('2026-10-01', '2026-11-30'), true);
  assert.equal(isOverdue(undefined, '2026-11-30'), true);
});

test('the monthly checklist lists every entry', () => {
  const d = loadFoodDaysFile();
  const n = resolveEntries(d.days).length + resolveEntries(d.appointment).length;
  assert.equal(RUNS['food-days']('2026-12-07').length, n);
});
