// The shared search code (#1286): the page runs inlineSource(), the search
// test runs the module. Both must give the same answer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { words, plain, fixedText, later, find, inlineSource } from '../src/lib/search-plan.mjs';

// A tiny fake Pagefind: each page has some words.
const PAGES = [
  { id: 'a', url: '/drugs-and-alcohol/', meta: { title: 'Drugs and alcohol' }, words: ['treatment', 'narcan'] },
  { id: 'b', url: '/groups/recovery-place/', meta: { title: 'Recovery Place' }, words: ['treatment', 'recovery', 'place'] },
  { id: 'c', url: '/help/food/', meta: { title: 'Food help' }, words: ['food', 'pantry', 'snap'] },
  { id: 'd', url: '/print/food/', meta: { title: 'Food help to print' }, words: ['food', 'pantry'] },
];
const pf = {
  search: async (q) => ({
    results: PAGES.filter((p) => q.split(' ').every((w) => p.words.includes(w)))
      .map((p, i) => ({ id: p.id, score: 1 - i / 10, data: async () => ({ url: p.url, meta: p.meta }) })),
  }),
};

test('words, spelling and filler', () => {
  assert.deepEqual(words('Where can I get Narcain?'), ['where', 'can', 'i', 'get', 'narcan']);
  assert.equal(fixedText('medicade'), 'medicaid');
  assert.equal(fixedText('food'), '');
  assert.equal(plain('detox near me in Morgantown'), 'treatment');
  assert.equal(plain("I can't afford groceries"), 'afford food');
  // Names on Object's prototype are not spelling fixes.
  assert.deepEqual(words('constructor toString'), ['constructor', 'tostring']);
});

test('group and print pages go after guides', () => {
  assert.equal(later({ url: '/print/food/' }, 'food'), 1);
  assert.equal(later({ url: '/groups/recovery-place/', meta: { title: 'Recovery Place' } }, 'treatment'), 1);
  assert.equal(later({ url: '/groups/recovery-place/', meta: { title: 'Recovery Place' } }, 'recovery place'), 0);
});

test('find ranks and flags partial matches', async () => {
  const r = await find(pf, 'rehab');
  assert.deepEqual(r.items.map((d) => d.url), ['/drugs-and-alcohol/', '/groups/recovery-place/']);
  const f = await find(pf, 'food pantry');
  assert.deepEqual(f.items.map((d) => d.url), ['/help/food/', '/print/food/']);
  const some = await find(pf, 'narcan pantry');
  assert.equal(some.some, true);
});

test('the page copy gives the same answers as the module', async () => {
  const SearchPlan = new Function(`${inlineSource()}; return SearchPlan;`)();
  for (const q of ['rehab', 'food pantry', 'narcan pantry', 'medicade card', 'recovery place', '']) {
    assert.deepEqual(await SearchPlan.find(pf, q), await find(pf, q), q);
    assert.equal(SearchPlan.plain(q), plain(q));
  }
});
