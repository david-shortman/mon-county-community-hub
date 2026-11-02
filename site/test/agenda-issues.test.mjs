// Checks for the daily Agenda guides check (#529): which meetings get an
// issue, and that a meeting never gets a second one.
import test from 'node:test';
import assert from 'node:assert/strict';
import { plan, issueFor } from '../scripts/agenda-issues.mjs';

const m = (body, date, title = 'Agenda', url = `https://example.gov/${body}/${date}/${title}`) => ({ body, date, title, agenda_url: url });
const today = '2026-11-01';

test('one issue per meeting, with every posted file, only for covered bodies in the next 14 days', () => {
  const meetings = [
    m('City Council', '2026-11-10', 'Agenda'), m('City Council', '2026-11-10', 'Agenda Packet'),
    m('Monongalia County Commission', '2026-11-04'),
    m('Tree Board', '2026-11-05'), m('City Council', '2026-10-27'), m('City Council', '2026-11-24'),
  ];
  const out = plan({ meetings, guides: [], today });
  assert.deepEqual(out.map((p) => p.key), ['county-commission-2026-11-04', 'city-council-2026-11-10']);
  assert.equal(out[1].files.length, 2);
});

test('a meeting with a guide or an earlier issue is skipped', () => {
  const meetings = [m('City Council', '2026-11-10'), m('Monongalia County Commission', '2026-11-04')];
  const first = plan({ meetings, guides: [{ body: 'county-commission', date: '2026-11-04' }], today });
  assert.deepEqual(first.map((p) => p.key), ['city-council-2026-11-10']);
  const again = plan({ meetings, guides: [{ body: 'county-commission', date: '2026-11-04' }], today, existing: [issueFor(first[0]).body] });
  assert.equal(again.length, 0);
});

test('the issue names the body, the date and the file to add', () => {
  const [p] = plan({ meetings: [m('City Council', '2026-11-10')], guides: [], today });
  const i = issueFor(p);
  assert.equal(i.title, 'Agenda guide: Morgantown City Council, November 10, 2026');
  assert.match(i.body, /content\/agendas\/city-council-2026-11-10\.yaml/);
  assert.ok(!/—/.test(i.title + i.body));
});
