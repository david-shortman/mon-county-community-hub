import { test } from 'node:test';
import assert from 'node:assert/strict';
import { factKinds, factWindow, factLate, windowProblems, loadWindows } from '../src/lib/fact-windows.mjs';

const windows = {
  kinds: [
    { kind: 'hours', fields: ['hours', 'opening_hours'], days: 90 },
    { kind: 'cost-and-eligibility', fields: ['cost', 'who_it_is_for'], days: 180 },
    { kind: 'address', fields: ['contact.place'], days: 365 },
  ],
  upcoming_event: { within_days: 14, checked_within_days: 30 },
};
const src = (checked) => [{ url: 'https://example.org', checked }];

test('factKinds reads plain and dotted fields, skipping empty ones', () => {
  assert.deepEqual(factKinds({ hours: 'Mon 9 a.m.', contact: { place: '1 Main St, Morgantown, WV' }, cost: '' }, windows).map((k) => k.kind), ['hours', 'address']);
});

test('factWindow takes the shortest window, capped by the tier', () => {
  assert.deepEqual(factWindow({ _file: 'orgs/x.yaml', topics: ['community'], hours: 'x' }, windows), { days: 90, because: 'hours' });
  assert.deepEqual(factWindow({ _file: 'orgs/x.yaml', topics: ['community'], cost: 'Free' }, windows), { days: 180, because: 'cost-and-eligibility' });
  assert.deepEqual(factWindow({ _file: 'orgs/x.yaml', topics: ['health'], cost: 'Free' }, windows), { days: 90, because: 'its risk tier' });
});

test('factLate flags hours past 90 days and a soon event read over 30 days ago', () => {
  assert.equal(factLate({ _file: 'orgs/x.yaml', topics: ['community'], hours: 'x', sources: src('2026-08-01') }, windows, '2026-11-14').days, 90);
  assert.equal(factLate({ _file: 'orgs/x.yaml', topics: ['community'], hours: 'x', sources: src('2026-10-01') }, windows, '2026-11-14'), null);
  const ev = { _file: 'calendar/e.yaml', starts: '2026-11-20', sources: src('2026-10-01') };
  assert.match(factLate(ev, windows, '2026-11-14').because, /within 14 days/);
  assert.equal(factLate({ ...ev, sources: src('2026-11-01') }, windows, '2026-11-14'), null);
});

test('the real windows file has no problems', () => {
  assert.deepEqual(windowProblems(loadWindows()), []);
  assert.equal(windowProblems({ kinds: [{ kind: 'x', fields: ['hours'], days: 0 }] }).length, 1);
});
