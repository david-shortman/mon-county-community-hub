// Opening hours as short lines (#1439): days with the same hours read together,
// and closed days come last as one line, never "Tuesdays Closed" per day.
import test from 'node:test';
import assert from 'node:assert/strict';
import { hoursLines, dayWords } from '../src/lib/listing.mjs';

test('days in a row read as a range, two days with and', () => {
  assert.equal(dayWords(['mon', 'tue', 'wed', 'thu']), 'Monday to Thursday');
  assert.equal(dayWords(['fri', 'sat']), 'Friday and Saturday');
  assert.equal(dayWords(['mon', 'wed', 'fri']), 'Monday, Wednesday and Friday');
  assert.equal(dayWords(['tue', 'thu', 'sat', 'sun']), 'Tuesday, Thursday, Saturday and Sunday');
});

test('a library week groups its hours and ends with the closed days', () => {
  assert.deepEqual(hoursLines([
    { days: ['mon', 'wed'], opens: '11:30', closes: '18:30' },
    { days: ['fri'], opens: '11:30', closes: '15:30' },
  ]), [
    'Monday and Wednesday: 11:30 a.m. to 6:30 p.m.',
    'Friday: 11:30 a.m. to 3:30 p.m.',
    'Closed Tuesday, Thursday, Saturday and Sunday',
  ]);
});

test('a day with two openings reads as one line', () => {
  assert.deepEqual(hoursLines([
    { days: ['mon', 'tue', 'wed', 'thu', 'fri'], opens: '09:00', closes: '12:00' },
    { days: ['tue', 'wed', 'thu'], opens: '18:00', closes: '20:00' },
  ]), [
    'Monday and Friday: 9 a.m. to noon',
    'Tuesday to Thursday: 9 a.m. to noon and 6 p.m. to 8 p.m.',
    'Closed Saturday and Sunday',
  ]);
});

test('open every day has no closed line, and always reads as 24 hours', () => {
  assert.deepEqual(hoursLines([{ days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], opens: '08:00', closes: '20:00' }]), ['Every day: 8 a.m. to 8 p.m.']);
  assert.deepEqual(hoursLines('always'), ['Open 24 hours, every day']);
  assert.deepEqual(hoursLines(undefined), []);
});
