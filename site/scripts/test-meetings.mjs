// Checks that meetings records keep first-seen dates for agendas and minutes
// across snapshots (#951). Run by npm run check-content.
import { toRecords, newSince } from '../src/lib/meetings/index.mjs';
const src = { prefix: 'x', publisher: 'P', page_url: 'https://example.org' };
const row = (o) => ({ body: 'Council', body_slug: 'council', date: '2026-11-03', id: '1', title: 'Agenda', agenda_url: 'https://example.org/a', ...o });
const fails = [];
const expect = (c, m) => { if (!c) fails.push(m); };
// An old snapshot record with no file dates: nothing should look new.
const old = toRecords(src, [row({})], { checked: '2026-10-01' }).map(({ agenda_first_seen, ...r }) => r);
const same = toRecords(src, [row({})], { checked: '2026-10-31', previous: old })[0];
expect(same.agenda_first_seen === '2026-10-01', 'an agenda already seen keeps the meeting first_seen when the old snapshot has no file date');
expect(newSince([same], '2026-10-25').length === 0, 'nothing old should be new');
// Minutes posted later.
const withMin = toRecords(src, [row({ minutes_url: 'https://example.org/m' })], { checked: '2026-11-10', previous: [same] })[0];
expect(withMin.minutes_first_seen === '2026-11-10', 'new minutes get the check date');
expect(withMin.agenda_first_seen === '2026-10-01', 'the agenda date carries over');
const n = newSince([withMin], '2026-11-05');
expect(n.length === 1 && n[0].what_is_new.join() === 'minutes', 'newSince reports only the new minutes');
// A replaced agenda file counts as new.
const newAgenda = toRecords(src, [row({ agenda_url: 'https://example.org/a2' })], { checked: '2026-11-12', previous: [withMin] })[0];
expect(newAgenda.agenda_first_seen === '2026-11-12', 'a new agenda link gets the check date');
// A brand-new meeting reports 'meeting' only.
const fresh = toRecords(src, [row({ id: '2' })], { checked: '2026-11-12' })[0];
expect(newSince([fresh], '2026-11-12')[0].what_is_new.join() === 'meeting', 'a new meeting is reported once, as a meeting');
if (fails.length) { console.error(`meetings test failed:\n- ${fails.join('\n- ')}`); process.exit(1); }
console.log('meetings first-seen test passed.');
