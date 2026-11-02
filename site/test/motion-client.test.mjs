// Tests for the scroll story kit (#1441): src/lib/motion-client.mjs and
// src/lib/motion-markup.mjs, with a pretend window, storage and observer.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createMotion, motion, watchSteps, nearestCard, bindMotionSwitch } from '../src/lib/motion-client.mjs';
import { motionSwitchHtml } from '../src/lib/motion-markup.mjs';

function classes() {
  const set = new Set();
  return {
    set,
    toggle(c, on) { if (on === undefined) on = !set.has(c); if (on) set.add(c); else set.delete(c); return on; },
    remove(c) { set.delete(c); },
    contains(c) { return set.has(c); },
  };
}
function el(found = {}) {
  const attrs = {};
  const listeners = {};
  return {
    classList: classes(), hidden: true, textContent: '',
    setAttribute(k, v) { attrs[k] = String(v); }, removeAttribute(k) { delete attrs[k]; },
    hasAttribute(k) { return k in attrs; }, toggleAttribute(k, on) { if (on) attrs[k] = ''; else delete attrs[k]; }, getAttribute(k) { return attrs[k] ?? null; },
    addEventListener(t, f) { listeners[t] = f; }, click() { listeners.click?.(); },
    querySelectorAll(sel) { return found[sel] || []; },
  };
}
function fakeWin({ stored = null, reduce = false, io = true } = {}) {
  const store = new Map(stored == null ? [] : [['em-motion-off', stored]]);
  const mqListeners = [];
  const winListeners = {};
  const observers = [];
  const win = {
    document: { documentElement: el() },
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, v) },
    addEventListener: (t, f) => { winListeners[t] = f; },
    store, observers,
    setDevice(v) { reduce = v; mqListeners.forEach((f) => f()); },
    otherTab(v) { store.set('em-motion-off', v); winListeners.storage({ key: 'em-motion-off', newValue: v }); },
  };
  // matches has to follow setDevice, so read it live.
  win.matchMedia = () => {
    const mq = { addEventListener: (_t, f) => mqListeners.push(f) };
    Object.defineProperty(mq, 'matches', { get: () => reduce });
    return mq;
  };
  if (io) {
    win.IntersectionObserver = class {
      constructor(cb, opts) { this.cb = cb; this.opts = opts; this.watched = []; this.off = false; observers.push(this); }
      observe(t) { this.watched.push(t); }
      disconnect() { this.off = true; }
      show(t) { this.cb([{ isIntersecting: true, target: t }]); }
    };
  }
  return win;
}

test('motion is allowed unless the device or the reader turns it off', () => {
  assert.equal(createMotion(fakeWin()).allowed(), true);
  assert.equal(createMotion(fakeWin({ stored: '1' })).allowed(), false);
  assert.equal(createMotion(fakeWin({ stored: '0' })).allowed(), true);
  assert.equal(createMotion(fakeWin({ reduce: true })).allowed(), false);
});

test('turning motion off is saved, marks the page, and every listener hears it', () => {
  const win = fakeWin();
  const m = createMotion(win);
  const heard = [[], []];
  m.onChange((on) => heard[0].push(on));
  m.onChange((on) => heard[1].push(on));
  m.setUserOff(true);
  assert.equal(win.store.get('em-motion-off'), '1');
  assert.equal(win.document.documentElement.hasAttribute('data-motion-off'), true);
  assert.deepEqual(heard, [[true, false], [true, false]]);
  m.setUserOff(false);
  assert.equal(win.store.get('em-motion-off'), '0');
  assert.equal(win.document.documentElement.hasAttribute('data-motion-off'), false);
});

test('follows the device setting', () => {
  const win = fakeWin();
  const m = createMotion(win);
  win.setDevice(true);
  assert.equal(m.allowed(), false);
  win.setDevice(false);
  assert.equal(m.allowed(), true);
});

test('one setting per page, shared by every explainer on it', () => {
  const win = fakeWin();
  assert.equal(motion(win), motion(win));
});

test('works when storage throws (private mode)', () => {
  const win = fakeWin();
  win.localStorage = { getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); } };
  const m = createMotion(win);
  assert.equal(m.allowed(), true);
  m.setUserOff(true);
  assert.equal(m.allowed(), false);
});

test('the switch: hidden when the device reduces motion, labeled by the setting', () => {
  const btn = el(), note = el();
  const root = el({ '[data-motion-switch]': [btn], '[data-motion-note]': [note] });
  const win = fakeWin();
  const m = createMotion(win);
  bindMotionSwitch(root, m);
  assert.equal(btn.hidden, false);
  assert.equal(btn.textContent, 'Turn off motion');
  assert.equal(note.hidden, true);
  btn.click();
  assert.equal(btn.textContent, 'Turn on motion');
  assert.equal(m.allowed(), false);
  win.setDevice(true);
  assert.equal(btn.hidden, true);
  assert.equal(note.hidden, false);
});

test('step watcher follows the step in view and stops when motion is off', () => {
  const win = fakeWin();
  const m = createMotion(win);
  const steps = [el(), el(), el()];
  const sec = el();
  const seen = [];
  const live = [];
  watchSteps(sec, steps, (i) => seen.push(i), { win, motion: m, onLive: (on) => live.push(on) });
  assert.equal(sec.classList.contains('is-live'), true);
  assert.deepEqual(seen, [0]);
  const io = win.observers[0];
  assert.equal(io.watched.length, 3);
  io.show(steps[2]);
  io.show(steps[2]);
  assert.deepEqual(seen, [0, 2]);
  assert.equal(steps[2].classList.contains('on'), true);
  assert.equal(steps[0].classList.contains('on'), false);
  m.setUserOff(true);
  assert.equal(io.off, true);
  assert.equal(sec.classList.contains('is-live'), false);
  assert.equal(steps.some((s) => s.classList.contains('on')), false);
  assert.deepEqual(live, [true, false]);
  m.setUserOff(false);
  assert.deepEqual(seen, [0, 2, 0]);
});

test('step watcher does nothing when motion starts off or there is no observer', () => {
  const win = fakeWin({ reduce: true });
  const sec = el();
  const seen = [];
  watchSteps(sec, [el(), el()], (i) => seen.push(i), { win, motion: createMotion(win) });
  assert.deepEqual(seen, []);
  assert.equal(sec.classList.contains('is-live'), false);
  const old = fakeWin({ io: false });
  assert.equal(watchSteps(el(), [el()], () => {}, { win: old, motion: createMotion(old) }), null);
});

test('nearest card to a scroll position', () => {
  assert.equal(nearestCard([0, 300, 600], 0), 0);
  assert.equal(nearestCard([0, 300, 600], 140), 0);
  assert.equal(nearestCard([0, 300, 600], 160), 1);
  assert.equal(nearestCard([0, 300, 600], 900), 2);
});

test('switch markup is hidden until script runs, and escapes the link', () => {
  const html = motionSwitchHtml({ skip: '#a"b' });
  assert.match(html, /<a href="#a&quot;b">Skip to the summary<\/a>/);
  assert.match(html, /<button class="motion-toggle" type="button" data-motion-switch hidden>Turn off motion<\/button>/);
  assert.match(html, /data-motion-note hidden>/);
  assert.doesNotMatch(motionSwitchHtml(), /<a /);
});
