// Share cards (src/lib/share-cards.mjs): which pages get one, where it lives,
// and that a card draws as a 1200 by 630 PNG.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CARD_H, CARD_W, cardAlt, cardDoor, cardPath, drawCard, hasCard, isCrisisSource } from '../src/lib/share-cards.mjs';

test('a card lives at /share/<page>.png', () => {
  assert.equal(cardPath('/grow/'), '/share/grow.png');
  assert.equal(cardPath('/help/food/today/'), '/share/help/food/today.png');
});

test('tagged pages get a card, but pages about domestic or sexual violence keep the plain one', () => {
  assert.ok(hasCard({ label: 'Grow food and flowers' }, '/grow/'));
  assert.ok(!hasCard(undefined, '/'));
  assert.ok(!hasCard({ label: 'Help now' }, '/embed/help-now/'));
  assert.ok(!hasCard({ label: 'Domestic violence help' }, '/domestic-violence/'));
  assert.ok(!hasCard({ label: 'After a sexual assault' }, '/sexual-assault/'));
  assert.ok(!hasCard({ label: 'Help after domestic violence' }, '/getting-safe/'));
});

test('crisis pages are found from their source, so they get no card file', () => {
  assert.ok(isCrisisSource('<Base crisis title="Leaving an unsafe home">'));
  assert.ok(isCrisisSource('<Base title="Mental health help" crisis>'));
  assert.ok(isCrisisSource('<Base\n  crisis\n  title="x">'));
  assert.ok(!isCrisisSource('<Base title="Grow food" help>'));
  assert.ok(!isCrisisSource('<Base title="Crisis lines near you">'));
  assert.ok(!isCrisisSource('<Base title="Veterans" description="24/7 lines for crisis and housing help">'));
  assert.ok(isCrisisSource('<Base crisis={true} title="x">'));
});

test("a door's own page does not name its door twice", () => {
  const care = { slug: 'care', name: 'Get care', page: '/care/' };
  const doors = { bySlug: { care } };
  assert.equal(cardDoor({ door: 'care' }, '/care/', doors), undefined);
  assert.equal(cardDoor({ door: 'care' }, '/flu-shots/', doors), care);
});

test('alt text names the page, its door and the logo', () => {
  assert.match(cardAlt({ label: 'Flu shots', doorName: 'Get care' }), /^Flu shots, in Get care, on Everything Morgantown\. The logo/);
});

test('a card draws as a 1200 by 630 PNG', async () => {
  const png = await drawCard({ label: 'Grow food and flowers', summary: 'Soil tests, plots and seeds', door: { slug: 'living-here', name: 'Living here', icon: 'pin' }, link: 'everythingmorgantown.org/grow' });
  assert.deepEqual([...png.subarray(1, 4)].map((c) => String.fromCharCode(c)).join(''), 'PNG');
  assert.equal(png.readUInt32BE(16), CARD_W);
  assert.equal(png.readUInt32BE(20), CARD_H);
});
