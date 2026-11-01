// Persona path check (#1042), on a small made-up site.
import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPersonas, route, sixMonthsBefore } from '../scripts/check-personas.mjs';

const pages = {
  '/money/': ['/utility-bills/', '/help/food/'],
  '/utility-bills/': ['/after-you-apply/lieap/'],
  '/after-you-apply/lieap/': [],
  '/help/food/': [],
  '/far/': [],
};
const graph = { exists: (r) => r in pages, links: (r) => new Set(pages[r] ?? []) };
const today = '2026-11-01';

test('routes', () => {
  assert.equal(route('/money'), '/money/');
  assert.equal(route('https://everythingmorgantown.org/help/food/#today'), '/help/food/');
  assert.equal(route('/utility-bills/index.html'), '/utility-bills/');
  assert.equal(route('https://example.org/'), null);
  assert.equal(sixMonthsBefore('2026-11-01'), '2026-05-01');
});

test('one and two taps pass', () => {
  const r = checkPersonas([{ slug: 'behind-on-heat', landing: '/money/', next_steps: ['/utility-bills/', '/after-you-apply/lieap/'], last_reviewed: today }], graph, today);
  assert.deepEqual(r, { errors: [], warnings: [], checked: 1 });
});

test('broken paths fail with the persona name', () => {
  const r = checkPersonas([
    { slug: 'a', landing: '/gone/', next_steps: [], last_reviewed: today },
    { slug: 'b', landing: '/money/', next_steps: ['/far/', '/missing/'], last_reviewed: today },
    { slug: 'c', next_steps: ['/money/'], last_reviewed: today },
  ], graph, today);
  assert.equal(r.errors.length, 4);
  assert.match(r.errors[0], /^a: landing page \/gone\//);
  assert.match(r.errors[1], /^b: next step \/far\/ is not linked/);
  assert.match(r.errors[2], /^b: next step \/missing\/ is not on the built site/);
  assert.match(r.errors[3], /^c: no landing page/);
});

test('known gaps and old reviews only warn', () => {
  const r = checkPersonas([
    { slug: 'gap', gap: 1234, last_reviewed: today },
    { slug: 'old', landing: '/help/food/', next_steps: [], last_reviewed: '2026-04-30' },
  ], graph, today);
  assert.deepEqual(r.errors, []);
  assert.equal(r.checked, 1);
  assert.match(r.warnings.join('\n'), /gap: skipped.*#1234/);
  assert.match(r.warnings.join('\n'), /old: last reviewed 2026-04-30, more than six months ago/);
});
