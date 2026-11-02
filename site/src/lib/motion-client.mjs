// The scroll story kit: the browser part every explainer shares (#1441).
// Rules: docs/design/motion.md. Plain script, no library.
//
// - motionAllowed(): false when the device asks for reduced motion or the
//   reader pressed "Turn off motion". One setting for the whole site: it is
//   kept on this phone only (localStorage "em-motion-off") and also sets
//   html[data-motion-off], so CSS can follow it.
// - watchSteps(sec, steps, onStep): marks which step is in the middle of the
//   screen and calls onStep(i). Wires the section's "Turn off motion" button.
//   Does nothing when motion is off, so the still page stays as it is.
// - swipeCards(root): Back and Next buttons and "Step 2 of 5" for a row of
//   scroll-snap cards. Never moves on its own.
//
// The functions take an optional window (win) so the tests can run in Node.

const KEY = 'em-motion-off';

// One motion setting for a window. Everything that listens hears every change,
// from any switch on the page or from the device setting. Other pages read
// the saved setting when they load.
export function createMotion(win) {
  const mq = win.matchMedia('(prefers-reduced-motion: reduce)');
  let userOff = false;
  try { userOff = win.localStorage.getItem(KEY) === '1'; } catch (e) {}
  const subs = [];
  const m = {
    device: () => mq.matches,
    userOff: () => userOff,
    allowed: () => !(userOff || mq.matches),
    setUserOff(v) {
      userOff = v;
      try { win.localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {}
      emit();
    },
    // Calls fn right away and after every change.
    onChange(fn) { subs.push(fn); fn(m.allowed()); },
  };
  function emit() {
    win.document.documentElement.toggleAttribute('data-motion-off', !m.allowed());
    subs.forEach((f) => f(m.allowed()));
  }
  mq.addEventListener?.('change', emit);
  emit();
  return m;
}

// The one setting for this page, shared by every explainer on it.
export const motion = (win = window) => win.__emMotion || (win.__emMotion = createMotion(win));
export const motionAllowed = (win) => motion(win).allowed();

// Wire every "Turn off motion" button and device note inside root
// (markup from motion-markup.mjs). Hidden with no script; the button stays
// hidden when the device already asks for reduced motion, and the note says so.
export function bindMotionSwitch(root, m = motion()) {
  const btns = root.querySelectorAll('[data-motion-switch]');
  btns.forEach((b) => b.addEventListener('click', () => m.setUserOff(!m.userOff())));
  m.onChange(() => {
    btns.forEach((b) => { b.hidden = m.device(); b.textContent = m.userOff() ? 'Turn on motion' : 'Turn off motion'; });
    root.querySelectorAll('[data-motion-note]').forEach((n) => { n.hidden = !m.device(); });
  });
}

// The step watcher. sec gets class "is-live" while the story follows the
// scroll, the step in view gets class "on", and onStep(i) runs once per new
// step. opts.onLive(on) runs when the story starts or stops following.
export function watchSteps(sec, steps, onStep, opts = {}) {
  const win = opts.win || window;
  if (!sec || !steps.length || !win.IntersectionObserver) return null;
  const m = opts.motion || motion(win);
  let io = null, current = -1;
  const go = (i) => {
    if (i < 0 || i === current) return;
    current = i;
    steps.forEach((s, n) => s.classList.toggle('on', n === i));
    onStep(i);
  };
  bindMotionSwitch(sec, m);
  m.onChange((on) => {
    sec.classList.toggle('is-live', on);
    opts.onLive?.(on);
    if (on && !io) {
      io = new win.IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) go(steps.indexOf(e.target)); }),
        { rootMargin: '-45% 0px -50% 0px' });
      steps.forEach((s) => io.observe(s));
      go(0);
    } else if (!on && io) {
      io.disconnect(); io = null; current = -1;
      steps.forEach((s) => s.classList.remove('on'));
    }
  });
  return go;
}

// The card nearest a scroll position: lefts are each card's left edge in the track.
export function nearestCard(lefts, x) {
  let best = 0;
  lefts.forEach((l, i) => { if (Math.abs(l - x) < Math.abs(lefts[best] - x)) best = i; });
  return best;
}

// Swipe cards. Markup: root holds [data-cards] (the scroll-snap row) and a
// [data-card-nav] with [data-back], [data-next] and [data-card-label].
// The nav is hidden with no script, since sideways scrolling still works.
// Buttons use aria-disabled at the ends, so focus is never lost.
export function swipeCards(root, opts = {}) {
  const track = root?.querySelector('[data-cards]');
  if (!track) return null;
  const cards = Array.from(track.children);
  const $ = (s) => root.querySelector(s);
  const back = $('[data-back]'), next = $('[data-next]'), label = $('[data-card-label]'), nav = $('[data-card-nav]');
  const m = opts.motion || motion(opts.win);
  let raf = 0;
  const lefts = () => {
    const t = track.getBoundingClientRect().left - track.scrollLeft;
    return cards.map((c) => c.getBoundingClientRect().left - t);
  };
  const index = () => nearestCard(lefts(), track.scrollLeft);
  const sync = () => {
    raf = 0;
    const i = index(), n = cards.length;
    if (label) label.textContent = 'Step ' + (i + 1) + ' of ' + n;
    back?.setAttribute('aria-disabled', String(i === 0));
    next?.setAttribute('aria-disabled', String(i === n - 1));
  };
  const go = (i) => {
    i = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: lefts()[i], behavior: m.allowed() ? 'smooth' : 'auto' });
  };
  back?.addEventListener('click', () => go(index() - 1));
  next?.addEventListener('click', () => go(index() + 1));
  track.addEventListener('scroll', () => { raf = raf || requestAnimationFrame(sync); }, { passive: true });
  if (nav) nav.hidden = false;
  sync();
  return go;
}
