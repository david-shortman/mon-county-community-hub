// A day on the buses: the browser part. Works on the markup DayOnTheBuses
// draws: a held chart (.stage) that follows the scroll steps, and a
// "Pick a day and a time" tool. Needs bus-day.mjs (passed in as api).
export function initDay(sec, routes, api) {
  if (!sec) return;
  var root = document.documentElement;
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var btn = sec.querySelector('#motion-toggle');
  var note = sec.querySelector('#motion-note');
  var userOff = false;
  try { userOff = localStorage.getItem('em-motion-off') === '1'; } catch (e) {}
  var byN = {}; routes.forEach(function (r) { byN[r.n] = r; });
  var DAYLABEL = {}; api.DAYS.forEach(function (d) { DAYLABEL[d.key] = d; });
  function moving() { return !(userOff || mq.matches); }

  // ---- one chart: slide bars for a day, move the time line, light the rows ----
  function chart(svgEl) {
    var rows = Array.prototype.slice.call(svgEl.querySelectorAll('.bd-row'));
    var now = svgEl.querySelector('.bd-now');
    var pill = now && now.querySelector('.bd-pilltx'), pillG = now && now.querySelector('.bd-pillg');
    var c = { day: null, t: api.T0, raf: 0, listeners: [] };
    function place(el, a, b) {
      var x = api.xOf(a), w = Math.max(0, api.xOf(b) - x);
      el.style.transform = 'translateX(' + x.toFixed(2) + 'px) scaleX(' + w.toFixed(2) + ')';
    }
    c.setDay = function (day) {
      c.day = day;
      rows.forEach(function (g) {
        var r = byN[g.getAttribute('data-n')], sp = api.spans(r, day), ea = api.earlyTimes(r, day);
        [0, 1].forEach(function (i) {
          // A slot with no run this day shrinks to the middle of where it usually sits.
          var any = sp[i] || api.anySpan(r, i), mid = any ? (any.a + any.b) / 2 : api.T0;
          var s = sp[i], a = s ? s.a : mid, b = s ? s.b : mid;
          var span = g.querySelector('[data-k="s' + i + '"]'), un = g.querySelector('[data-k="u' + i + '"]'), tl = g.querySelector('[data-k="t' + i + '"]');
          if (span) place(span, a, b);
          if (un) { var u = api.mins(r.unsureFrom); place(un, s ? u : a, s ? b : a); }
          if (tl) place(tl, s ? b : a, s ? b + (r.trip || 0) : a);
        });
        Array.prototype.forEach.call(g.querySelectorAll('.bd-early'), function (e) { e.setAttribute('r', ea.length ? '2.6' : '0'); });
      });
      c.setTime(c.t);
    };
    c.setTime = function (t) {
      c.t = t;
      var x = api.xOf(t);
      if (now) now.style.transform = 'translateX(' + x.toFixed(2) + 'px)';
      if (pillG) pillG.style.transform = 'translateX(' + api.pillShift(x).toFixed(2) + 'px)';
      if (pill) pill.textContent = api.fmt(Math.round(t / 5) * 5);
      rows.forEach(function (g) {
        var r = byN[g.getAttribute('data-n')];
        var cls = 'bd-row is-' + api.stateAt(r, c.day, t);
        if (g.getAttribute('class') !== cls) g.setAttribute('class', cls);
        var pa = api.partsAt(r, c.day, t);
        Array.prototype.forEach.call(g.querySelectorAll('[data-k]'), function (el) {
          var k = el.getAttribute('data-k'), i = Number(k.slice(1)), want;
          if (k[0] === 'e') want = pa.early ? ' on' : '';
          else if (k[0] === 't') want = pa.tail === i ? ' on' : pa.span === i ? ' near' : '';
          else want = pa.span === i ? ' on' : '';
          var base = el.getAttribute('class').replace(/ (on|near)$/, '');
          if (el.getAttribute('class') !== base + want) el.setAttribute('class', base + want);
        });
      });
      c.listeners.forEach(function (f) { f(c.day, t); });
    };
    c.sweep = function (to, done) {
      cancelAnimationFrame(c.raf);
      var from = c.t, dist = Math.abs(to - from);
      if (!moving() || dist < 1) { c.setTime(to); if (done) done(); return; }
      var ms = Math.min(1600, Math.max(500, dist * 1.4)), t0 = null;
      function frame(ts) {
        if (t0 == null) t0 = ts;
        var p = Math.min(1, (ts - t0) / ms), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        c.setTime(from + (to - from) * e);
        if (p < 1) c.raf = requestAnimationFrame(frame); else { c.setTime(to); if (done) done(); }
      }
      c.raf = requestAnimationFrame(frame);
    };
    return c;
  }

  function counts(day, t) {
    var b = api.tally(routes, day, t);
    return { run: b.run.length + b.early.length, last: b.last.length, by: b };
  }
  function countLine(day, t) {
    var k = counts(day, t);
    var s = k.run === 1 ? '1 route running' : k.run + ' routes running';
    if (k.last) s += ', ' + k.last + ' on ' + (k.last === 1 ? 'its' : 'their') + ' last trip';
    return s;
  }

  // ---- the scroll story ----
  var stageSvg = sec.querySelector('.stage .bd-chart');
  var steps = Array.prototype.slice.call(sec.querySelectorAll('.days > li'));
  var cap = sec.querySelector('[data-now]');
  var story = stageSvg ? chart(stageSvg) : null;
  var io = null, current = -1, pending = 0;
  function go(i) {
    if (i < 0 || i === current || !story) return;
    current = i;
    steps.forEach(function (s, n) { s.classList.toggle('on', n === i); });
    var li = steps[i], day = li.getAttribute('data-day'), t = Number(li.getAttribute('data-t'));
    function caption() { cap.innerHTML = '<span>' + DAYLABEL[day].label + ', ' + api.fmt(t) + ':</span> ' + countLine(day, t); }
    clearTimeout(pending);
    if (story.day !== day) {
      var first = story.day == null;
      story.setDay(day);
      if (!first && t < story.t) story.setTime(api.T0);
      if (first) { story.setTime(t); caption(); return; }
      pending = setTimeout(function () { story.sweep(t, caption); }, moving() ? 650 : 0);
    } else story.sweep(t, caption);
  }
  if (story) story.listeners.push(function (day, t) {
    if (cap && current >= 0) cap.innerHTML = '<span>' + DAYLABEL[day].label + ', ' + api.fmt(Math.round(t / 5) * 5) + ':</span> ' + countLine(day, t);
  });
  function live(on) {
    sec.classList.toggle('is-live', on);
    if (on && !io && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) go(steps.indexOf(e.target)); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      steps.forEach(function (s) { io.observe(s); });
      go(0);
    } else if (!on && io) {
      io.disconnect(); io = null; current = -1;
      steps.forEach(function (s) { s.classList.remove('on'); });
    }
  }

  function nowInTown() {
    var p = {};
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    } catch (e) { return null; }
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var wd = week.indexOf(p.weekday), t = Number(p.hour) % 24 * 60 + Number(p.minute);
    var label = p.weekday + ' ' + api.fmt(t);
    if (t < api.T0) { wd = (wd + 6) % 7; t += 1440; }   // before 5 a.m. still counts as the night before
    if (t > api.T1) t = api.T1;
    var key = ['u', 'm', 'm', 'm', 'r', 'r', 's'][wd];
    return { day: key, t: t, label: label, next: ['u', 'm', 'm', 'm', 'r', 'r', 's'][(wd + 1) % 7] };
  }

  // ---- Right now: what is running in Morgantown at this minute ----
  var rnBox = sec.querySelector('#day-rightnow');
  function rightNow() {
    var n = nowInTown(); if (!rnBox || !n) return;
    var k = counts(n.day, n.t), on = k.run + k.last;
    var line = n.label + ': ';
    if (on) {
      line += k.run ? (k.run === 1 ? '1 of ' + routes.length + ' routes is' : k.run + ' of ' + routes.length + ' routes are') + ' running' : 'no routes are starting new trips';
      if (k.last) line += ', and ' + k.last + (k.last === 1 ? ' is' : ' are') + ' on the last trip of the day';
      line += '.';
    } else {
      var later = k.by.before.concat(k.by.gap).length;
      var at = later ? null : api.firstStart(routes, n.next);
      if (later) at = Math.min.apply(null, routes.map(function (r) { var s = api.nowStatus(r, n.day, n.t); return s.state === 'before' || s.state === 'gap' ? api.spans(r, n.day).map(function (x) { return x.a; }).concat(api.earlyTimes(r, n.day)).filter(function (a) { return a > n.t; })[0] : Infinity; }));
      line += 'no buses are running.' + (at != null && isFinite(at) ? ' The next bus leaves at ' + api.fmt(at) + (later ? (/\.$/.test(api.fmt(at)) ? '' : '.') : ' ' + (n.t >= 1440 ? 'this morning.' : 'tomorrow.')) : '');
    }
    sec.querySelector('#day-rn-line').textContent = line;
    sec.querySelector('#day-rn-list').innerHTML = routes.map(function (r) {
      return '<li><strong>' + r.n + ' ' + r.short.replace(/&/g, '&amp;') + ':</strong> ' + api.nowStatus(r, n.day, n.t).text + '</li>';
    }).join('');
    rnBox.hidden = false;
  }
  rightNow();
  setInterval(rightNow, 60000);

  // ---- the try-it tool ----
  var tool = sec.querySelector('#day-try');
  if (tool) {
    tool.hidden = false;
    var tc = chart(tool.querySelector('.bd-chart'));
    var dayBtns = Array.prototype.slice.call(tool.querySelectorAll('[data-pick]'));
    var range = tool.querySelector('#day-time');
    var out = tool.querySelector('#day-out');
    var lists = tool.querySelector('#day-lists');
    var nowBtn = tool.querySelector('#day-now');
    var nowNote = tool.querySelector('#day-now-note');
    function names(arr) { return arr.map(function (r) { return r.n + ' ' + r.short; }).join(', '); }
    function render(day, t) {
      var b = counts(day, t).by, tt = Math.round(t / 5) * 5;
      tt = Math.round(t);
      range.setAttribute('aria-valuetext', api.fmt(tt) + (tt >= 1440 ? ' (after midnight)' : ''));
      tool.querySelector('#day-time-label').textContent = api.fmt(tt);
      out.textContent = DAYLABEL[day].long.replace(/^a /, 'A ').replace(/^./, function (m) { return m.toUpperCase(); }) + ' at ' + api.fmt(tt) + ': ' + countLine(day, t) + '.';
      var parts = [];
      var run = b.run.concat(b.early);
      if (run.length) parts.push(['Running (trips still starting)', names(run)]);
      if (b.last.length) parts.push(['On the last trip of the day', names(b.last)]);
      if (b.before.length) parts.push(['Not started yet', names(b.before)]);
      if (b.gap.length) parts.push(['Between its day and night runs', names(b.gap)]);
      if (b.done.length) parts.push(['Done for the day', names(b.done)]);
      if (b.off.length) parts.push(['No service this day', names(b.off)]);
      lists.innerHTML = parts.map(function (p) { return '<li><strong>' + p[0] + ':</strong> ' + p[1] + '</li>'; }).join('');
    }
    tc.listeners.push(render);
    function pickDay(day) {
      dayBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-pick') === day)); });
      tc.setDay(day);
    }
    dayBtns.forEach(function (b) { b.addEventListener('click', function () { nowNote.hidden = true; pickDay(b.getAttribute('data-pick')); }); });
    range.addEventListener('input', function () { nowNote.hidden = true; cancelAnimationFrame(tc.raf); tc.setTime(Number(range.value)); });
    function toNow() {
      var n = nowInTown(); if (!n) return false;
      pickDay(n.day); range.value = String(Math.round(n.t / 5) * 5);
      tc.setTime(n.t);
      nowNote.hidden = false;
      nowNote.textContent = 'Set to now: ' + n.label + ' in Morgantown, by the posted hours. Holidays and WVU breaks can change this.';
      return true;
    }
    nowBtn.addEventListener('click', toNow);
    if (!toNow()) { pickDay('m'); range.value = '540'; tc.setTime(540); }
  }

  // ---- Turn off motion ----
  function update() {
    var off = userOff || mq.matches;
    if (off) root.setAttribute('data-motion-off', ''); else root.removeAttribute('data-motion-off');
    sec.classList.toggle('is-moving', !off);
    btn.hidden = mq.matches;
    btn.textContent = userOff ? 'Turn on motion' : 'Turn off motion';
    note.hidden = !mq.matches;
    live(!off);
  }
  btn.addEventListener('click', function () {
    userOff = !userOff;
    try { localStorage.setItem('em-motion-off', userOff ? '1' : '0'); } catch (e) {}
    update();
  });
  if (mq.addEventListener) mq.addEventListener('change', update); else if (mq.addListener) mq.addListener(update);
  update();
}
