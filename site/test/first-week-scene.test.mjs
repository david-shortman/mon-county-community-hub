// The first week drawing (#1442): every step draws, trips stay drawn once
// they appear, and the drawing never holds a fare or a time.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scene, PARTS, STEPS } from '../src/lib/first-week-scene.mjs';

test('each step makes one hidden drawing with its step number', () => {
  for (let s = 1; s <= STEPS; s++) {
    const svg = scene(s);
    assert.match(svg, new RegExp(`data-s="${s}"`));
    assert.match(svg, /aria-hidden="true"/);
  }
  assert.throws(() => scene(0), RangeError);
  assert.throws(() => scene(6), RangeError);
});

test('every part a step turns on exists in the drawing', () => {
  const svg = scene(1);
  for (const parts of Object.values(PARTS)) for (const p of parts) assert.ok(svg.includes(`e-${p}"`), p);
});

test('a trip stays drawn on every later step', () => {
  for (const trip of ['trip-doc', 'trip-air']) {
    const first = Object.keys(PARTS).map(Number).find((s) => PARTS[s].includes(trip));
    for (let s = first; s <= STEPS; s++) assert.ok(PARTS[s].includes(trip), `${trip} at step ${s}`);
  }
  assert.ok(PARTS[STEPS].includes('trip-doc') && PARTS[STEPS].includes('trip-air'), 'whole week on the last step');
});

test('no fare, time or phone number lives only in the drawing', () => {
  const text = scene(1).replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /\$|\d{1,2}:\d\d|a\.m\.|p\.m\.|\d{3}-\d{4}/);
});
