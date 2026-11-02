// A day on the buses (/bus-routes/): the hours in the route file, read the way
// the chart and the "Right now" box read them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { pdfPage, pdfPageProblems } from '../src/lib/pdf-pages.mjs';
import { routesFromRecord, tally, nowStatus, firstStart, mins, fmt } from '../src/lib/bus-day.mjs';

const d = pdfPage('mountain-line-routes');
const routes = routesFromRecord(d);
const count = (day, hm) => { const b = tally(routes, day, mins(hm) + (mins(hm) < 300 ? 1440 : 0)); return b.run.length + b.early.length; };

test('every Mountain Line route has hours, and they match its own lines', () => {
  assert.equal(routes.length, 20);
  assert.deepEqual(pdfPageProblems(d), []);
});

// The step and summary text in bus-day-markup.mjs quote these numbers. If the
// hours change and one of these fails, update that text too.
test('the three weekday moments in the scroll story', () => {
  assert.equal(fmt(firstStart(routes, 'm')), '5:40 a.m.');
  assert.equal(count('m', '7:30'), 17);
  assert.equal(count('m', '9:00'), 18);
  assert.equal(count('m', '12:00'), 18);
  assert.equal(count('m', '20:30'), 3);
});

test('late nights and Sundays', () => {
  const r = (n) => routes.find((x) => x.n === n);
  assert.equal(nowStatus(r('1'), 'r', mins('1:30') + 1440).text, 'running, last run starts at 3:40 a.m. (WVU sessions only)');
  assert.equal(nowStatus(r('1'), 'm', mins('12:00')).text, 'no service today');
  assert.equal(nowStatus(r('30'), 'r', mins('20:30')).text, 'between runs, next runs start at 9 p.m. (WVU sessions only)');
  assert.equal(nowStatus(r('2'), 'm', mins('23:30')).text, 'on its last trip of the day');
  assert.equal(count('u', '16:00'), 6);
});
