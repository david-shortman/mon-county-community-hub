// A day on the buses: route hours as data, plus the drawing and the
// "what is running at this time" logic. Pure functions, no DOM, so the same
// code draws the still pictures at build time and runs in the browser.
// Hours come from Mountain Line's route pages (busride.org), as copied in
// content/pdf-pages/mountain-line-routes.yaml (checked 2026-11-01).
// "first" and "last" are when the route STARTS its first and last trip.

// Day letters: m t w r(Thu) f s u(Sun). A day picker shows four kinds of day.
export const DAYS = [
  { id: 'mtw', key: 'm', label: 'Mon to Wed', long: 'Monday to Wednesday' },
  { id: 'rf', key: 'r', label: 'Thu or Fri', long: 'a Thursday or Friday' },
  { id: 's', key: 's', label: 'Saturday', long: 'Saturday' },
  { id: 'u', key: 'u', label: 'Sunday', long: 'Sunday' },
];

export const GROUPS = { city: 'Around town', eve: 'Evenings', wvu: 'WVU campus' };

// Minutes after midnight. The day runs from 5 a.m. to 4 a.m. the next morning.
export const T0 = 300, T1 = 1680;
export function mins(hm) { const [h, m] = hm.split(':').map(Number); return h * 60 + m; }

// One route's spans on one kind of day: [{a, b}] in minutes, b may pass 1440.
export function spans(r, dayKey) {
  const out = [];
  for (const [days, f, l] of r.runs) {
    if (!days.includes(dayKey)) continue;
    const a = mins(f); let b = mins(l); if (b < a) b += 1440;
    out.push({ a, b });
  }
  // A late run that started the evening before (Fri night into Sat morning) is
  // left out on purpose: the chart's day starts at 5 a.m., after the last one ends.
  return out;
}
// The i-th span on any day, used to park a bar that has no run on the chosen day.
export function anySpan(r, i) {
  for (const k of 'mrsu') { const sp = spans(r, k); if (sp[i]) return sp[i]; }
  return null;
}
export function earlyTimes(r, dayKey) {
  return r.early && r.early.days.includes(dayKey) ? r.early.at.map(mins) : [];
}

// What a route is doing at minute t: 'run' (trips still starting), 'early'
// (an early trip is out), 'last' (its last trip is still on the road),
// 'before' (not started yet), 'done' (finished for the day), 'off' (no service that day).
export function stateAt(r, dayKey, t) {
  const sp = spans(r, dayKey), ea = earlyTimes(r, dayKey);
  if (!sp.length && !ea.length) return 'off';
  for (const s of sp) if (t >= s.a && t <= s.b) return 'run';
  for (const e of ea) if (t >= e && t < e + (r.trip || 60)) return 'early';
  for (const s of sp) if (r.trip && t > s.b && t <= s.b + r.trip) return 'last';
  const firstStart = Math.min(...sp.map((s) => s.a), ...ea);
  if (t < firstStart) return 'before';
  const lastEnd = Math.max(...sp.map((s) => s.b));
  if (t > lastEnd) return 'done';
  return 'gap';   // between two runs, like West Run between 7:50 p.m. and 9 p.m.
}

// Which part of a route's bar the time line is on: the span whose trips are
// still starting, the last trip's tail, or an early trip. -1 means none.
export function partsAt(r, dayKey, t) {
  const sp = spans(r, dayKey);
  let span = -1, tail = -1;
  sp.forEach((s, i) => {
    if (t >= s.a && t <= s.b) span = i;
    else if (r.trip && t > s.b && t <= s.b + r.trip) tail = i;
  });
  const early = earlyTimes(r, dayKey).some((e) => t >= e && t < e + (r.trip || 60));
  return { span, tail, early };
}

export function tally(routes, dayKey, t) {
  const by = { run: [], early: [], last: [], before: [], done: [], gap: [], off: [] };
  for (const r of routes) by[stateAt(r, dayKey, t)].push(r);
  return by;
}

// One plain line on what a route is doing at minute t, for the "Right now" box.
export function nowStatus(r, dayKey, t) {
  const sp = spans(r, dayKey), ea = earlyTimes(r, dayKey), st = stateAt(r, dayKey, t);
  const next = sp.map((s) => s.a).concat(ea).filter((a) => a > t).sort((a, b) => a - b)[0];
  let s;
  if (st === 'off') s = 'no service today';
  else if (st === 'run') s = `running, last run starts at ${fmt(sp.find((x) => t >= x.a && t <= x.b).b)}`;
  else if (st === 'early') s = `early trip out, regular runs start at ${fmt(Math.min(...sp.map((x) => x.a)))}`;
  else if (st === 'last') s = next ? `between runs, next runs start at ${fmt(next)}` : 'on its last trip of the day';
  else if (st === 'before' || st === 'gap') s = next != null ? `${st === 'gap' ? 'between runs, next runs start' : 'starts'} at ${fmt(next)}` : 'done for today';
  else s = 'done for today';
  if (st !== 'off' && (r.wvu || (r.wvuNote && /[su]/.test(dayKey)))) s += ' (WVU sessions only)';
  return { state: st, text: s };
}
// The earliest trip start on a kind of day, or null.
export function firstStart(routes, dayKey) {
  const all = routes.flatMap((r) => spans(r, dayKey).map((s) => s.a).concat(earlyTimes(r, dayKey)));
  return all.length ? Math.min(...all) : null;
}

export function fmt(t) {
  t = ((t % 1440) + 1440) % 1440;
  if (t === 0) return 'midnight';
  if (t === 720) return 'noon';
  const h = Math.floor(t / 60), m = t % 60, h12 = ((h + 11) % 12) + 1;
  return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}

// ---------- The drawing ----------
export const G = { W: 340, LX: 2, PX: 76, PW: 258, TOP: 30, ROW: 10, GROUP: 12, BAR: 6 };
// Keeps the time label inside the drawing near either edge.
export function pillShift(x) { return Math.min(Math.max(x, 30), G.W - 30) - x; }
export function xOf(t) { return G.PX + ((t - T0) / (T1 - T0)) * G.PW; }

export function layout(routes) {
  const rows = []; let y = G.TOP, lastG = null; const heads = [];
  for (const r of routes) {
    if (r.g !== lastG) { heads.push({ g: r.g, y: y + 9 }); y += G.GROUP; lastG = r.g; }
    rows.push({ r, y }); y += G.ROW;
  }
  return { rows, heads, H: y + 4 };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ticks = [[360, '6a'], [540, '9a'], [720, 'noon'], [900, '3p'], [1080, '6p'], [1260, '9p'], [1440, '12a'], [1620, '3a']];

// Draws the chart for one kind of day. With t, a time line and each route lit
// or faded by what it is doing at t. live: true draws bars as unit rects moved by
// CSS transforms, so the browser can slide them when the day changes.
export function svg(routes, { day = 'm', t = null, live = false, id = '', title = '' } = {}) {
  const { rows, heads, H } = layout(routes);
  const o = [];
  o.push(`<svg class="bd-chart${t != null || live ? ' bd-timed' : ''}"${id ? ` id="${id}"` : ''} viewBox="0 -2 ${G.W} ${H + 2}" ${title ? `role="img" aria-label="${esc(title)}"` : 'aria-hidden="true"'} focusable="false">`);
  // hour grid and labels
  for (const [tt, lab] of ticks) {
    const x = xOf(tt).toFixed(1);
    o.push(`<line class="bd-grid${tt === 1440 ? ' bd-mid' : ''}" x1="${x}" x2="${x}" y1="${G.TOP - 4}" y2="${H - 2}"/>`);
    o.push(`<text class="bd-tick" x="${x}" y="${G.TOP - 8}" text-anchor="middle">${lab}</text>`);
  }
  for (const h of heads) o.push(`<text class="bd-group" x="${G.LX}" y="${h.y}">${GROUPS[h.g]}${h.g === 'wvu' ? ' (fall and spring)' : ''}</text>`);
  for (const { r, y } of rows) {
    const st = t == null ? 'plain' : stateAt(r, day, t);
    const pa = t == null ? { span: -1, tail: -1, early: false } : partsAt(r, day, t);
    const sp = spans(r, day), ea = earlyTimes(r, day);
    o.push(`<g class="bd-row is-${st}" data-n="${r.n}">`);
    o.push(`<text class="bd-lab" x="${G.LX}" y="${y + 7}"><tspan class="bd-num">${r.n}</tspan> ${esc(r.short)}</text>`);
    o.push(`<rect class="bd-track" x="${G.PX}" y="${y + 3.5}" width="${G.PW}" height="1"/>`);
    const by = y + (G.ROW - G.BAR) / 2;
    const bar = (cls0, a, b, k) => {
      const i = Number(k.slice(1));
      const on = (k[0] === 't' ? pa.tail === i : pa.span === i);
      const near = k[0] === 't' && pa.span === i;
      const cls = cls0 + (on ? ' on' : near ? ' near' : '');
      if (live) {
        const w = Math.max(0, xOf(b) - xOf(a));
        return `<rect class="${cls}" data-k="${k}" x="0" y="${by}" width="1" height="${G.BAR}" style="transform:translateX(${xOf(a).toFixed(2)}px) scaleX(${w.toFixed(2)})"/>`;
      }
      return `<rect class="${cls}" x="${xOf(a).toFixed(2)}" y="${by}" width="${Math.max(0, xOf(b) - xOf(a)).toFixed(2)}" height="${G.BAR}"/>`;
    };
    // live mode always draws two span slots and one trip tail slot, so a day
    // change can slide them; empty slots get zero width.
    const slots = live ? [0, 1] : sp.map((_, i) => i);
    for (const i of slots) {
      const s = sp[i], any = s || anySpan(r, i), mid = any ? (any.a + any.b) / 2 : T0;
      const a = s ? s.a : mid, b = s ? s.b : mid;
      if (r.unsureFrom && s && !live) {
        const u = mins(r.unsureFrom);
        o.push(bar('bd-span', a, u, 's' + i));
        o.push(bar('bd-span bd-unsure', u, b, 'u' + i));
      } else {
        o.push(bar('bd-span', a, b, 's' + i));
        if (r.unsureFrom && live) { const u = mins(r.unsureFrom); o.push(bar('bd-span bd-unsure', s ? u : a, s ? b : a, 'u' + i)); }
      }
      if (r.trip && (s || live)) o.push(bar('bd-tail', s ? b : a, s ? b + r.trip : a, 't' + i));
    }
    if (r.early) {
      const at = r.early.at.map(mins);
      at.forEach((e, i) => {
        const on = ea.length > 0;
        o.push(`<circle class="bd-early${pa.early ? ' on' : ''}" data-k="e${i}" cx="${xOf(e).toFixed(2)}" cy="${y + G.ROW / 2}" r="${on ? 2.6 : 0}"/>`);
      });
    }
    o.push('</g>');
  }
  if (t != null || live) {
    const x = xOf(t ?? 540);
    o.push(`<g class="bd-now" style="transform:translateX(${x.toFixed(2)}px)">`);
    o.push(`<line x1="0" x2="0" y1="${G.TOP - 4}" y2="${H - 2}"/>`);
    o.push(`<g class="bd-pillg" style="transform:translateX(${pillShift(x).toFixed(2)}px)">`);
    o.push(`<rect class="bd-pill" x="-28" y="-1" width="56" height="15" rx="7.5"/>`);
    o.push(`<text class="bd-pilltx" x="0" y="10" text-anchor="middle">${t == null ? '' : fmt(t)}</text>`);
    o.push('</g></g>');
  }
  o.push('</svg>');
  return o.join('');
}

// ---------- From the site's route file ----------
// Each route item in content/pdf-pages/mountain-line-routes.yaml may carry
//   hours: { short, trip, runs: [{days, first, last}], early, unsure_from, unsure, wvu, wvu_note }
// Section ids map to chart groups.
const GROUP_OF = { city: 'city', evening: 'eve', campus: 'wvu' };
export function routesFromRecord(d) {
  const out = [];
  for (const s of d.sections ?? []) for (const it of s.items ?? []) {
    const h = it?.hours; if (!h) continue;
    out.push({
      g: GROUP_OF[s.id] ?? 'city', n: (it.name.match(/^Route (\d+)/) ?? [])[1] ?? '', short: h.short, name: it.name,
      trip: h.trip ?? null, wvu: !!h.wvu, wvuNote: h.wvu_note, unsure: h.unsure, unsureFrom: h.unsure_from,
      runs: (h.runs ?? []).map((r) => [String(r.days), String(r.first), String(r.last)]),
      early: h.early ? { days: String(h.early.days), at: h.early.at.map(String), note: h.early.note } : undefined,
    });
  }
  return out;
}
// The chart must never disagree with the words: every first and last run in
// `hours` has to appear, worded the same way, in that item's own lines.
export function hoursProblems(route, lines) {
  const text = (lines ?? []).join(' ');
  const out = [];
  for (const [days, f, l] of route.runs) {
    if (!/^[mtwrfsu]+$/.test(days)) out.push(`${route.name}: hours days "${days}" should use m t w r f s u`);
    const want = `first run ${fmt(mins(f))}, last run ${fmt(mins(l))}`;
    if (!text.includes(want)) out.push(`${route.name}: hours say "${want}" but the lines do not`);
  }
  if (route.trip != null && !text.includes(`One trip around the route: ${route.trip} minutes`)) out.push(`${route.name}: hours trip ${route.trip} is not in the lines`);
  for (const e of route.early?.at ?? []) if (!text.includes(fmt(mins(e)))) out.push(`${route.name}: early trip ${e} is not in the lines`);
  return out;
}
