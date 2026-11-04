// The full street map for the bus trip planner (#1721). Loaded only when
// someone taps "Expand map" (decision docs/decisions/2026-11-04-1500-street-map-on-tap.md),
// so the bus page itself stays small.
// - Engine: MapLibre GL JS (open source, no account, no key).
// - Base map: Census TIGER/Line 2024 streets, water, parks and county line,
//   made by site/scripts/make-street-map.py into site/public/bus-map/.
// - On top: our places (content/bus-map/places.yaml) and the trip as numbered
//   markers. No bus lines on streets yet: real route shapes wait on Mountain
//   Line's route file (#26, #1447), and we never guess a bus's path.
// - "Show my location" uses the phone's own location and never sends it anywhere.
import * as maplibregl from 'maplibre-gl';
// MapLibre's own styles, as a file fetched only when the map opens. (A plain
// CSS import here would be inlined into every page of the site.)
import cssUrl from 'maplibre-gl/dist/maplibre-gl.css?url';
function addCss() {
  if (document.querySelector('link[data-maplibre]')) return Promise.resolve();
  return new Promise((res) => { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = cssUrl; l.dataset.maplibre = ''; l.onload = l.onerror = res; document.head.append(l); });
}
// MapLibre 6 draws in a separate worker file; the bundler gives us its address.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
maplibregl.setWorkerUrl(workerUrl);

const BBOX = [[-80.06, 39.585], [-79.875, 39.69]]; // Morgantown and nearby

function tokens(el) {
  const cs = getComputedStyle(el);
  const v = (n, f) => cs.getPropertyValue(n).trim() || f;
  return { bg: v('--bg', '#f6f1e6'), card: v('--card', '#fffdf8'), fg: v('--fg', '#1f1d19'), muted: v('--muted', '#4a453b'), line: v('--line', '#d6cab3'), accent: v('--accent', '#24493d'), accentBg: v('--accent-bg', '#e7ece4'), sand: v('--sand', '#ece2cd'), water: v('--water', '#1c4a50'), rust: v('--rust', '#9a4b2c') };
}

function style(base, c) {
  const F = ['Noto Sans Regular'], FM = ['Noto Sans Medium'];
  const src = (f) => ({ type: 'geojson', data: `${base}/bus-map/${f}.json`, attribution: f === 'county' ? 'Map data: U.S. Census Bureau TIGER/Line 2024' : undefined });
  const empty = { type: 'geojson', data: { type: 'FeatureCollection', features: [] } };
  return {
    version: 8,
    glyphs: `${base}/bus-map/fonts/{fontstack}/{range}.pbf`,
    sources: { county: src('county'), areas: src('areas'), water: src('water'), major: src('roads-major'), local: empty, places: empty, trip: empty },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': c.bg } },
      { id: 'county', type: 'fill', source: 'county', paint: { 'fill-color': c.card } },
      { id: 'county-line', type: 'line', source: 'county', paint: { 'line-color': c.muted, 'line-width': 1, 'line-dasharray': [3, 2], 'line-opacity': 0.5 } },
      { id: 'parks', type: 'fill', source: 'areas', filter: ['==', ['get', 'k'], 'park'], paint: { 'fill-color': c.accentBg } },
      { id: 'campus', type: 'fill', source: 'areas', filter: ['!=', ['get', 'k'], 'park'], paint: { 'fill-color': c.sand, 'fill-opacity': 0.7 } },
      { id: 'water', type: 'fill', source: 'water', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': c.water, 'fill-opacity': 0.35 } },
      { id: 'creeks', type: 'line', source: 'water', filter: ['==', ['geometry-type'], 'LineString'], minzoom: 12, paint: { 'line-color': c.water, 'line-opacity': 0.35, 'line-width': 1.2 } },
      { id: 'local', type: 'line', source: 'local', minzoom: 11, layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': c.line, 'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.4, 14, 2, 17, 7] } },
      { id: 'major', type: 'line', source: 'major', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': c.muted, 'line-opacity': ['match', ['get', 'k'], 'interstate', 0.7, 0.45], 'line-width': ['interpolate', ['linear'], ['zoom'], 9, ['match', ['get', 'k'], 'interstate', 1.6, 0.8], 14, ['match', ['get', 'k'], 'interstate', 5, 3.5], 17, 10] } },
      { id: 'local-names', type: 'symbol', source: 'local', minzoom: 15, layout: { 'symbol-placement': 'line', 'text-field': ['get', 'n'], 'text-font': F, 'text-size': 11, 'text-max-angle': 30 }, paint: { 'text-color': c.muted, 'text-halo-color': c.card, 'text-halo-width': 1.5 } },
      { id: 'major-names', type: 'symbol', source: 'major', minzoom: 12, layout: { 'symbol-placement': 'line', 'text-field': ['get', 'n'], 'text-font': FM, 'text-size': 11.5, 'text-max-angle': 30 }, paint: { 'text-color': c.fg, 'text-halo-color': c.card, 'text-halo-width': 1.8 } },
      { id: 'water-names', type: 'symbol', source: 'water', minzoom: 12, filter: ['all', ['==', ['geometry-type'], 'Polygon'], ['!=', ['get', 'n'], '']], layout: { 'text-field': ['get', 'n'], 'text-font': F, 'text-size': 11.5, 'text-letter-spacing': 0.05, 'symbol-spacing': 400 }, paint: { 'text-color': c.water, 'text-halo-color': c.card, 'text-halo-width': 1.2 } },
      { id: 'creek-names', type: 'symbol', source: 'water', minzoom: 14, filter: ['==', ['geometry-type'], 'LineString'], layout: { 'symbol-placement': 'line', 'text-field': ['get', 'n'], 'text-font': F, 'text-size': 10.5 }, paint: { 'text-color': c.water, 'text-halo-color': c.card, 'text-halo-width': 1.2 } },
      // Places: bigger dots for main stops; the looked-at and route places in accent.
      { id: 'places', type: 'circle', source: 'places', paint: {
        'circle-radius': ['case', ['get', 'look'], 9, ['==', ['get', 'kind'], 'hub'], 7, 5],
        'circle-color': ['case', ['get', 'look'], c.accent, ['==', ['get', 'kind'], 'hub'], c.fg, c.card],
        'circle-stroke-color': ['case', ['get', 'look'], c.card, c.fg], 'circle-stroke-width': ['case', ['get', 'look'], 2.5, 1.8] } },
      { id: 'place-names', type: 'symbol', source: 'places', layout: {
        'text-field': ['get', 'name'], 'text-font': FM, 'text-size': ['case', ['any', ['get', 'look'], ['==', ['get', 'kind'], 'hub']], 14, 12.5],
        'text-variable-anchor': ['left', 'right', 'top', 'bottom'], 'text-radial-offset': 0.9, 'text-justify': 'auto',
        'symbol-sort-key': ['case', ['get', 'look'], 0, ['==', ['get', 'kind'], 'hub'], 1, 2] },
        paint: { 'text-color': c.fg, 'text-halo-color': c.card, 'text-halo-width': 2 } },
      // The trip: where you start and end, where you change, numbered where you get on.
      { id: 'trip-ring', type: 'circle', source: 'trip', paint: { 'circle-radius': ['match', ['get', 'role'], 'board', 13, 'end', 10, 9], 'circle-color': ['match', ['get', 'leg'], 1, c.accent, 2, c.rust, 3, c.water, c.fg], 'circle-stroke-color': c.card, 'circle-stroke-width': 2.5 } },
      { id: 'trip-num', type: 'symbol', source: 'trip', filter: ['==', ['get', 'role'], 'board'], layout: { 'text-field': ['to-string', ['get', 'leg']], 'text-font': FM, 'text-size': 14, 'text-allow-overlap': true, 'text-ignore-placement': true }, paint: { 'text-color': c.card } },
    ],
  };
}

// Open the map in `el`. Returns { update, zoomIn, zoomOut, fit, destroy }.
export async function openStreetMap(el, { base = '', places, onTap }) {
  await addCss();
  const c = tokens(el);
  const map = new maplibregl.Map({
    container: el, style: style(base, c), bounds: BBOX, fitBoundsOptions: { padding: 24 },
    maxBounds: [[-80.6, 39.35], [-79.6, 39.9]], minZoom: 8.5, maxZoom: 18, attributionControl: { compact: true },
    dragRotate: false, pitchWithRotate: false, touchPitch: false, cooperativeGestures: false,
  });
  map.touchZoomRotate.disableRotation();
  el.tpMap = map; // lets screenshot checks read the drawn map
  map.on('error', (e) => console.warn('Street map:', e?.error?.message ?? e));
  map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showAccuracyCircle: true }), 'bottom-right');
  const P = new Map(places.map((p) => [p.id, p]));
  let state = { trip: [], look: [], lookPlace: '' };
  const placesData = () => ({ type: 'FeatureCollection', features: places.map((p) => ({ type: 'Feature', properties: { id: p.id, name: p.short ?? p.name, kind: p.kind, look: state.look.includes(p.id) || p.id === state.lookPlace }, geometry: { type: 'Point', coordinates: [p.point[1], p.point[0]] } })) });
  const tripData = () => ({ type: 'FeatureCollection', features: state.trip.filter((t) => P.has(t.p)).map((t) => ({ type: 'Feature', properties: t, geometry: { type: 'Point', coordinates: [P.get(t.p).point[1], P.get(t.p).point[0]] } })) });
  const ready = new Promise((res) => map.on('load', res));
  ready.then(() => {
    map.getSource('places').setData(placesData());
    map.getSource('trip').setData(tripData());
    // Local streets are the biggest file, so they come second.
    fetch(`${base}/bus-map/roads-local.json`).then((r) => r.json()).then((d) => map.getSource('local')?.setData(d)).catch(() => {});
    fitTo();
  });
  // A finger is wide: find the nearest place within about 18 px of a tap.
  map.on('click', (e) => {
    const pad = 18, { x, y } = e.point;
    const hits = map.queryRenderedFeatures([[x - pad, y - pad], [x + pad, y + pad]], { layers: ['places', 'place-names'] });
    if (!hits.length) return;
    const near = hits.map((h) => ({ id: h.properties.id, d: Math.hypot(...(() => { const p = map.project([P.get(h.properties.id).point[1], P.get(h.properties.id).point[0]]); return [p.x - x, p.y - y]; })()) })).sort((a, b) => a.d - b.d)[0];
    onTap?.(near.id);
  });
  map.on('mouseenter', 'places', () => { map.getCanvas().style.cursor = 'pointer'; });
  map.on('mouseleave', 'places', () => { map.getCanvas().style.cursor = ''; });
  function fitTo(ids) {
    const pts = (ids && ids.length ? ids : state.trip.map((t) => t.p)).filter((id) => P.has(id)).map((id) => [P.get(id).point[1], P.get(id).point[0]]);
    if (pts.length === 1) { map.easeTo({ center: pts[0], zoom: Math.max(map.getZoom(), 14), duration: 400 }); return; }
    if (!pts.length) { map.fitBounds(BBOX, { padding: 24, duration: 0 }); return; }
    const b = pts.reduce((bb, p) => bb.extend(p), new maplibregl.LngLatBounds(pts[0], pts[0]));
    map.fitBounds(b, { padding: { top: 60, bottom: 60, left: 50, right: 50 }, maxZoom: 15, duration: 400 });
  }
  return {
    // trip: [{ p, role: 'board'|'change'|'end', leg }], look: place ids to light up.
    update(next, { fit = false } = {}) {
      state = { ...state, ...next };
      ready.then(() => {
        map.getSource('places')?.setData(placesData());
        map.getSource('trip')?.setData(tripData());
        if (fit) fitTo(state.lookPlace ? [state.lookPlace] : state.look.length ? state.look : undefined);
      });
    },
    zoomIn: () => map.zoomIn(), zoomOut: () => map.zoomOut(), fit: () => fitTo(), resize: () => map.resize(),
    destroy: () => map.remove(),
  };
}

export function supported() {
  try { const cv = document.createElement('canvas'); return !!(cv.getContext('webgl2') || cv.getContext('webgl')); } catch { return false; }
}
