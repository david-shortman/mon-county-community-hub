// The service worker (#150, offline hard moments in wave 8 #529): pages open
// with no signal once saved, and a saved copy always says so, with the date
// it was saved and "call before you go". docs/operations/offline.md explains
// it in plain words.
//
// - Pages: try the network first. If there is no answer in 4 seconds (spotty
//   signal) or no network, show the saved copy with a "Saved copy" note.
// - Install saves Help now only (about 18 KB). Once a page has loaded, the
//   page asks the worker to save the hard-moment pages (HARD below: Help now,
//   Tonight, food help, utility bills, after a storm, mental health, drugs and
//   alcohol, protective orders). From the second page on, the home page, the
//   door pages and Dates are saved too. Each list is fetched again at most
//   once a week, and checked at most once an hour. With Data Saver on, only
//   Help now. On a 2G connection, the larger lists wait for a faster one.
//   Saving the same pages for everyone means the saved list does not show
//   which of them a person looked at.
// - Old copies expire: a page that changes daily (Tonight, food today, Dates)
//   after 3 days, the other hard-moment pages after 30 days, anything else
//   after 90 days. An expired copy is deleted, not shown. Help now is never
//   deleted, because it is the last thing to show with no signal, but a copy
//   more than 30 days old says so.
// - Styles, fonts and images: saved copies first; their file names change
//   when they change.
// - Nothing else: no tracking, no push messages, nothing sent anywhere.
//
// The file only changes when the saved lists or this code change, so a
// daily rebuild does not make phones download it all again.
import { loadDoors } from '../lib/content.mjs';

// Every page source, to check at build time that the saved lists name real pages.
const SOURCES = Object.keys(import.meta.glob('./**/*.{astro,md}'));
const exists = (p) => {
  const bare = p.replace(/^\/|\/$/g, '');
  return !bare || [`./${bare}.astro`, `./${bare}/index.astro`, `./${bare}.md`, `./${bare}/index.md`].some((k) => SOURCES.includes(k));
};

// The pages people need most in a hard moment, saved after one visit.
const HARD = [
  '/tonight/', '/help/food/', '/help/food/today/', '/help/food/today/other/', '/help/food/today/student/',
  '/utility-bills/', '/after-a-storm/', '/mental-health/', '/drugs-and-alcohol/', '/protective-orders/',
];
// Pages whose facts change day to day: their saved copies expire soonest.
const DAILY = ['/tonight/', '/help/food/today/', '/help/food/today/other/', '/help/food/today/student/'];

export function GET() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const doors = loadDoors();
  const helpNowPath = doors.bySlug['help-now'].page;
  const datesPath = doors.bySlug.dates.page;
  const missing = [helpNowPath, datesPath, ...HARD].filter((p) => !exists(p));
  if (missing.length) throw new Error(`sw.js: these saved pages do not exist: ${missing.join(', ')}`);
  const helpNow = `${base}${helpNowPath}`;
  const hard = [...new Set([helpNow, ...HARD.map((p) => `${base}${p}`)])];
  const saveFirst = [...new Set([
    `${base}/`,
    ...doors.doors.filter((d) => d.page).map((d) => `${base}${d.page}`),
    `${base}${datesPath}`,
  ])].filter((u) => !hard.includes(u));
  const daily = [...DAILY.map((p) => `${base}${p}`), `${base}${datesPath}`];
  const body = `// Built from site/src/pages/sw.js.js. See that file for what this does.
const PAGES = 'pages-v1';
const FILES = 'files-v1';
const HELP_NOW = ${JSON.stringify(helpNow)};
const HARD = ${JSON.stringify(hard)};
const SAVE_FIRST = ${JSON.stringify(saveFirst)};
const DAILY = ${JSON.stringify(daily)};
const WAIT_MS = 4000;
const REFRESH_DAYS = 7;
const MAX_PAGES = 60;
const MAX_FILES = 80;
const DAY = 864e5;

// How many days a saved copy may be shown. Help now never expires.
const path = (url) => new URL(url, self.location.href).pathname;
function maxDays(url) {
  const p = path(url);
  if (p === HELP_NOW) return Infinity;
  if (DAILY.includes(p)) return 3;
  if (HARD.includes(p)) return 30;
  return 90;
}
const savedAt = (res) => Date.parse(res.headers.get('x-saved-at') || '') || 0;
const expired = (url, res) => Date.now() - savedAt(res) > maxDays(url) * DAY;
const kept = (url) => { const p = path(url); return HARD.includes(p) || SAVE_FIRST.includes(p); };

// Store a copy with the time it was saved. Over the limit, drop the oldest
// pages first, but never the saved lists.
async function save(cacheName, key, res, max) {
  const headers = new Headers(res.headers);
  headers.set('x-saved-at', new Date().toISOString());
  const copy = new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers });
  const cache = await caches.open(cacheName);
  await cache.put(key, copy);
  const keys = await cache.keys();
  const extra = keys.filter((k) => cacheName !== PAGES || !kept(k.url));
  for (const old of extra.slice(0, Math.max(0, keys.length - max))) await cache.delete(old);
}

// Delete saved pages that are too old to show.
async function sweep() {
  const cache = await caches.open(PAGES);
  for (const req of await cache.keys()) {
    const res = await cache.match(req);
    if (res && expired(req.url, res)) await cache.delete(req);
  }
}

// Save a list of pages, fetching again any saved more than a week ago.
async function fill(urls) {
  const cache = await caches.open(PAGES);
  await Promise.all(urls.map(async (url) => {
    const have = await cache.match(url);
    if (have && Date.now() - savedAt(have) < REFRESH_DAYS * DAY) return;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) await save(PAGES, url, res, MAX_PAGES);
    } catch (e) { /* offline: try again later */ }
  }));
}

// what: 'help' (install), 'hard' (once a page loads) or 'all' (from the
// second page on). The larger lists run at most once an hour.
const last = {};
async function topUp(what) {
  if (what !== 'help') {
    if (Date.now() - (last[what] || 0) < 36e5) return;
    last[what] = Date.now();
  }
  const c = self.navigator.connection;
  const lean = c && (c.saveData || /2g/.test(c.effectiveType || ''));
  await sweep();
  if (what === 'help' || lean) return fill([HELP_NOW]);
  return fill(what === 'all' ? [...HARD, ...SAVE_FIRST] : HARD);
}

self.addEventListener('install', (event) => {
  event.waitUntil(topUp('help').then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (![PAGES, FILES].includes(name)) await caches.delete(name);
    await self.clients.claim();
  })());
});

// A page has loaded (AppShell.astro): save the hard-moment pages.
self.addEventListener('message', (event) => {
  if (event.data === 'save') event.waitUntil(topUp('hard').catch(() => {}));
});

// "12:42 a.m. on October 30, 2026", Eastern time.
const when = (ms) => {
  const f = (o) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...o }).format(new Date(ms));
  return f({ hour: 'numeric', minute: '2-digit' }).replace('AM', 'a.m.').replace('PM', 'p.m.') + ' on ' + f({ month: 'long', day: 'numeric', year: 'numeric' });
};

// Put a plain note at the top of a saved page. Its look is the .saved-copy
// rule in Base.astro, so it matches the site's notes in light and dark (#354).
async function withNote(res, missing) {
  const html = await res.text();
  const at = savedAt(res) || Date.now();
  const date = when(at);
  const old = Date.now() - at > 30 * DAY ? ' That is more than a month ago.' : '';
  const text = missing
    ? 'That page could not open because the connection is slow or missing, and there is no recent copy of it on this phone. Here is the Help now page, saved at ' + date + '.' + old + ' Phone numbers and hours may have changed. Call before you go.'
    : 'Saved copy from ' + date + ', shown because the connection is slow or missing.' + old + ' Dates, hours and phone numbers may have changed. Call before you go.';
  const note = '<div class="saved-copy" role="note"><p>' + text + '</p></div>';
  // Just before the main content, so the skip link and crisis strip stay first.
  const out = /<main[\\s>]/.test(html) ? html.replace(/<main[\\s>]/, (m) => note + m) : html.replace(/<body[^>]*>/, (m) => m + note);
  const headers = new Headers(res.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.delete('content-length');
  return new Response(out, { status: 200, headers });
}

async function page(request) {
  const url = new URL(request.url);
  const key = url.origin + url.pathname.replace(/\\/?$/, '/').replace(/\\/index\\.html\\/$/, '/');
  const network = fetch(request).then(async (res) => {
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) await save(PAGES, key, res.clone(), MAX_PAGES);
    return res;
  });
  const cache = await caches.open(PAGES);
  let saved = await cache.match(key, { ignoreSearch: true });
  if (saved && expired(key, saved)) { await cache.delete(key); saved = undefined; }
  if (!saved) {
    try { return await network; } catch (e) {
      const help = await cache.match(HELP_NOW);
      return help ? withNote(help, true) : Response.error();
    }
  }
  // Have a saved copy: use the network if it answers in time.
  const slow = new Promise((resolve) => setTimeout(() => resolve(null), WAIT_MS));
  try {
    const res = await Promise.race([network, slow]);
    // A server error is worse than a saved copy; a missing page (404) is not.
    if (res && res.status < 500) return res;
  } catch (e) { /* no network */ }
  network.catch(() => {});
  return withNote(saved, false);
}

async function file(request) {
  const cache = await caches.open(FILES);
  const saved = await cache.match(request);
  if (saved) return saved;
  const res = await fetch(request);
  if (res.ok) await save(FILES, request, res.clone(), MAX_FILES);
  return res;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    const res = page(req);
    event.respondWith(res);
    event.waitUntil(res.then(() => topUp('all')).catch(() => {}));
    return;
  }
  if (/^\\/(_astro|fonts)\\/|\\.(svg|png|woff2)$/.test(url.pathname.slice(${JSON.stringify(base)}.length))) event.respondWith(file(req));
});
`;
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
}
