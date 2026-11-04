// The bus trip planner in the browser (#1656, explore and expand #1708).
// Runs the From/To/Day form, and makes the map explorable:
// - Tap (or pick from "Look at") a place: its routes light up and a panel
//   lists them, with "Start here" and "Go here".
// - Tap a route line (or a route in a panel): that route lights up and the
//   panel gives its hours and its places in stop order.
// - "Expand map" opens the map full screen (a modal <dialog>) where it can be
//   zoomed with + and -, a pinch, a mouse wheel, or dragged to pan. Names,
//   dots and lines keep their size on screen while the map zooms.
// - With WebGL, "Expand map" opens a street map instead (bus-street-map.mjs,
//   MapLibre and Census streets, #1721). Its code and data load only then.
// The map stays aria-hidden: every fact in it is also in the panel or the
// answer as text, and every action has a button or a select.
import { plan, answerHtml, tripSvg, tripIds, mapLabels, stopPlace, DAY_OF_WEEK, placeInfoHtml, routeInfoHtml, routePlaceIds, W } from './bus-trips.mjs';

export function initPlanner(sec) {
  const data = JSON.parse(sec.querySelector('#tp-data')?.textContent ?? '{}');
  const $ = (q) => sec.querySelector(q);
  const form = $('.tp-form'), from = $('#tp-from'), to = $('#tp-to'), day = $('#tp-day');
  const out = $('.tp-answer'), svg = $('svg.tm'), info = $('.tp-info'), look = $('#tp-look');
  const box = $('.tp-mapbox'), dlg = $('.tp-dlg'), dlgMap = $('.tp-dlg-map'), dlgInfo = $('.tp-dlg-info');
  if (!form || !from || !to || !day || !out || !svg || !data.places) return;
  const m = { at: data.at, sp: stopPlace(data.places), places: data.places, H: data.H };
  const P = Object.fromEntries(data.places.map((p) => [p.id, p]));
  const R = Object.fromEntries(data.routes.map((r) => [r.id, r]));
  const H = data.H;
  let best = null, looking = null, z = 1, vb = [0, 0, W, H], base = [0, 0, W, H];
  let street = null, streetTried = false;
  const BASE = (import.meta.env?.BASE_URL ?? '/').replace(/\/$/, '');
  // The trip and the looked-at places, for the street map's markers.
  const streetUpdate = (fit = false) => {
    if (!street) return;
    const trip = best ? [...best.legs.map((l, i) => ({ p: m.sp.get(l.on), role: 'board', leg: i + 1 })), { p: to.value, role: 'end', leg: 0 }] : [];
    const lookIds = looking?.r ? routePlaceIds(R[looking.r], data.places) : [];
    street.update({ trip: trip.filter((t) => t.p), look: lookIds, lookPlace: looking?.p ?? '' }, { fit });
  };

  // ---------- Drawing ----------
  const relabel = () => {
    const ids = best ? tripIds(m, best, from.value, to.value) : [from.value, to.value];
    const extra = !looking ? [] : looking.p ? [looking.p] : routePlaceIds(R[looking.r], data.places);
    const lab = svg.querySelector('.tm-labels');
    if (lab) lab.innerHTML = mapLabels(m, [...new Set([...extra, ...ids])], { k: 1 / z });
  };
  const paintLook = () => {
    const rs = !looking ? new Set() : looking.r ? new Set([looking.r]) : new Set(data.routes.filter((r) => r.stops.some((s) => P[looking.p].stops.includes(s))).map((r) => r.id));
    svg.classList.toggle('is-looking', !!looking);
    svg.querySelectorAll('.tm-ln').forEach((l) => l.classList.toggle('is-look', rs.has(l.getAttribute('data-r'))));
    svg.querySelectorAll('.tm-p').forEach((g) => g.classList.toggle('is-look', !!looking?.p && g.dataset.p === looking.p));
    const html = !looking ? '' : (looking.p ? placeInfoHtml(P[looking.p], data.routes, day.value) : routeInfoHtml(R[looking.r], data.places, day.value)) + '<button type="button" class="tp-clear" data-clear>Back to my trip</button>';
    for (const el of [info, dlgInfo]) if (el) { el.innerHTML = html; el.hidden = !looking; }
    if (look) look.value = !looking ? '' : looking.p ? `p:${looking.p}` : `r:${looking.r}`;
    relabel();
    streetUpdate(!!looking);
  };
  const run = () => {
    const plans = plan(data.routes, data.places, from.value, to.value, day.value);
    out.innerHTML = answerHtml(plans, P[from.value], P[to.value], day.value);
    best = plans[0] ?? null;
    const trip = svg.querySelector('.tm-trip'), marks = svg.querySelector('.tm-marks');
    if (trip) trip.innerHTML = best ? tripSvg(m, best) : '';
    if (marks) marks.innerHTML = best ? tripSvg(m, best, 'marks') : '';
    const used = new Set(best ? best.legs.map((l) => l.r.id) : []);
    svg.querySelectorAll('.tm-ln').forEach((l) => l.classList.toggle('is-used', used.has(l.getAttribute('data-r'))));
    const change = new Set(best ? best.legs.slice(1).map((l) => m.sp.get(l.on)) : []);
    svg.querySelectorAll('.tm-p').forEach((g) => {
      const id = g.dataset.p ?? '';
      g.classList.toggle('is-end', id === from.value || id === to.value);
      g.classList.toggle('is-change', change.has(id));
    });
    paintLook();
  };
  const setLook = (v) => { looking = v; paintLook(); };

  // ---------- Taps and buttons ----------
  const onPanel = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.lookR) setLook({ r: b.dataset.lookR });
    else if (b.dataset.lookP) setLook({ p: b.dataset.lookP });
    else if (b.dataset.clear !== undefined) setLook(null);
    else if (b.dataset.set) {
      (b.dataset.set === 'from' ? from : to).value = b.dataset.p;
      looking = null; run();
      if (dlg?.open) closeBig();
      out.closest('.tp-card')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };
  info?.addEventListener('click', onPanel);
  dlgInfo?.addEventListener('click', onPanel);
  const tapAt = (target) => {
    const p = target.closest?.('[data-p]')?.getAttribute('data-p');
    const r = target.closest?.('.tm-hit-r')?.getAttribute('data-r');
    if (p && P[p]) setLook({ p }); else if (r && R[r]) setLook({ r });
    if ((p || r) && !dlg?.open) info?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  look?.addEventListener('change', () => {
    const [k, id] = look.value.split(':');
    setLook(!id ? null : k === 'p' ? { p: id } : { r: id });
  });

  // ---------- Zoom and pan (full screen only) ----------
  const setVb = (v) => {
    const minW = W / 8, maxW = base[2];
    let [x, y, w] = v; w = Math.min(Math.max(w, minW), maxW);
    const h = w * (base[3] / base[2]);
    x = Math.min(Math.max(x, base[0]), base[0] + base[2] - w);
    y = Math.min(Math.max(y, base[1]), base[1] + base[3] - h);
    vb = [x, y, w, h]; z = W / w;
    svg.setAttribute('viewBox', vb.map((n) => n.toFixed(2)).join(' '));
    svg.style.setProperty('--iz', String(1 / z));
  };
  let relabelTimer = 0;
  const zoomAt = (f, cx, cy) => {
    const [x, y, w, h] = vb, nw = w / f, nh = h / f;
    setVb([cx - (cx - x) * (nw / w), cy - (cy - y) * (nh / h), nw]);
    clearTimeout(relabelTimer); relabelTimer = setTimeout(relabel, 120);
  };
  const toMap = (clientX, clientY) => {
    const r = svg.getBoundingClientRect();
    return [vb[0] + ((clientX - r.left) / r.width) * vb[2], vb[1] + ((clientY - r.top) / r.height) * vb[3]];
  };
  const center = () => [vb[0] + vb[2] / 2, vb[1] + vb[3] / 2];
  const ptrs = new Map();
  let moved = 0, last = null, pinch = null;
  svg.addEventListener('pointerdown', (e) => {
    ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = 0;
    if (dlg?.open) svg.setPointerCapture?.(e.pointerId);
    last = [e.clientX, e.clientY];
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); }
  });
  svg.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (!dlg?.open) return;
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const [cx, cy] = toMap((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      zoomAt(d / pinch, cx, cy); pinch = d; moved += 10;
    } else if (ptrs.size === 1 && last) {
      const r = svg.getBoundingClientRect(), dx = e.clientX - last[0], dy = e.clientY - last[1];
      moved += Math.abs(dx) + Math.abs(dy);
      setVb([vb[0] - (dx / r.width) * vb[2], vb[1] - (dy / r.height) * vb[3], vb[2]]);
    }
    last = [e.clientX, e.clientY];
  });
  const up = (e) => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    if (!ptrs.size && moved < 8 && e.type === 'pointerup') tapAt(document.elementFromPoint(e.clientX, e.clientY) ?? e.target);
    if (!ptrs.size) last = null;
  };
  svg.addEventListener('pointerup', up);
  svg.addEventListener('pointercancel', up);
  svg.addEventListener('wheel', (e) => { if (!dlg?.open) return; e.preventDefault(); const [cx, cy] = toMap(e.clientX, e.clientY); zoomAt(e.deltaY < 0 ? 1.25 : 0.8, cx, cy); }, { passive: false });

  // ---------- Full screen ----------
  const big = $('.tp-expand');
  // Match the drawing's shape to the screen, so the whole map shows and
  // panning has room in the long direction. keep: hold the zoom and center
  // (when the panel opens or the phone turns).
  const fit = (keep = false) => {
    const r = dlgMap.getBoundingClientRect(), aspect = r.height / Math.max(r.width, 1);
    if (!r.width || !r.height) return;
    const w = Math.max(W, H / aspect), h = w * aspect;
    const [cx, cy] = center(), zw = vb[2];
    base = [(W - w) / 2, (H - h) / 2, w, h];
    if (keep) setVb([cx - zw / 2, cy - (zw * aspect) / 2, zw]); else setVb(base.slice(0, 3));
    relabel();
  };
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (!dlg?.open) return; if (dlg.classList.contains('is-street')) street?.resize(); else fit(true); }) : null;
  if (dlgMap) ro?.observe(dlgMap);
  const drawnMap = () => { dlg.classList.remove('is-street'); dlgMap.append(svg); svg.classList.add('is-big'); requestAnimationFrame(() => fit()); };
  const openBig = async () => {
    if (!dlg?.showModal) return;
    dlg.showModal(); document.documentElement.classList.add('tp-locked');
    if (street) { dlg.classList.add('is-street'); street.resize(); streetUpdate(true); return; }
    if (streetTried) { drawnMap(); return; }
    streetTried = true;
    try {
      const mod = await import('./bus-street-map.mjs');
      if (!mod.supported()) throw new Error('no WebGL');
      const el = document.createElement('div'); el.className = 'tp-street';
      dlgMap.append(el); dlg.classList.add('is-street');
      street = await mod.openStreetMap(el, { base: BASE, places: data.places, onTap: (id) => setLook({ p: id }) });
      streetUpdate(true);
    } catch (err) {
      console.warn('Street map could not open; showing the simple map.', err);
      dlgMap.querySelector('.tp-street')?.remove(); street = null; drawnMap();
    }
  };
  const closeBig = () => { if (dlg?.open) dlg.close(); };
  dlg?.addEventListener('close', () => {
    document.documentElement.classList.remove('tp-locked');
    if (svg.parentElement !== box) box.append(svg);
    svg.classList.remove('is-big');
    base = [0, 0, W, H]; setVb([0, 0, W]); z = 1; svg.style.setProperty('--iz', '1'); relabel();
    big?.focus();
  });
  if (big && dlg?.showModal) { big.hidden = false; big.addEventListener('click', openBig); }
  $('.tp-close')?.addEventListener('click', closeBig);
  $('.tp-zin')?.addEventListener('click', () => { if (street && dlg.classList.contains('is-street')) return street.zoomIn(); const [cx, cy] = center(); zoomAt(1.5, cx, cy); });
  $('.tp-zout')?.addEventListener('click', () => { if (street && dlg.classList.contains('is-street')) return street.zoomOut(); const [cx, cy] = center(); zoomAt(1 / 1.5, cx, cy); });
  $('.tp-zfit')?.addEventListener('click', () => { if (street && dlg.classList.contains('is-street')) return street.fit(); fit(); });

  // ---------- Start ----------
  form.hidden = false;
  $('.tp-tools')?.removeAttribute('hidden');
  $('[data-ex]')?.remove();
  day.value = DAY_OF_WEEK[new Date().getDay()];
  form.addEventListener('change', run);
  $('.tp-swap')?.addEventListener('click', () => { const a = from.value; from.value = to.value; to.value = a; run(); });
  run();
}
