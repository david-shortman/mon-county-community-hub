// Follow one records request (#1931, part of #1440): every fact the drawing
// shows is in the step words, the marker moves to its stations, and the
// shared shell keeps its still list and kit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/components/RecordsJourney.astro', import.meta.url), 'utf8');
const shell = readFileSync(new URL('../src/components/StepJourney.astro', import.meta.url), 'utf8');

test('the marker moves from you to each station', () => {
  const st = Object.fromEntries([...src.match(/const ST = \{([^}]*)\}/)[1].matchAll(/(\w+): (\d+)/g)].map((m) => [m[1], Number(m[2])]));
  const want = { 2: st.office - st.you, 3: st.answer - st.you, 4: st.answer - st.you, 5: st.court - st.you };
  for (const [s, dx] of Object.entries(want)) {
    assert.match(src, new RegExp(`data-s="${s}"\\] \\.mark[^{]*\\{ transform: translateX\\(${dx}px\\)`), `step ${s}`);
  }
});

test('facts in the drawing are in the words too', () => {
  const body = src.split('const steps = [')[1].split('];')[0];
  for (const n of ['five days not including Saturdays, Sundays or legal holidays', 'send copies', 'time and place', 'say no in writing', 'search or retrieval fee', 'circuit court']) assert.ok(body.includes(n), n);
  assert.doesNotMatch(src + shell, /—/);
});

test('the shell keeps the still list, the switch and hidden drawings', () => {
  assert.match(shell, /<MotionSwitch skip=/);
  assert.match(shell, /watchSteps\(/);
  assert.match(shell, /<figure class="jr-stage" aria-hidden="true">/);
  assert.match(src, /aria-hidden="true" focusable="false"/);
  const n = (src.match(/when: '/g) || []).length;
  assert.ok(n >= 3 && n <= 7, `3 to 7 steps, got ${n}`);
});
