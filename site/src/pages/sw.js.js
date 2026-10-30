// The service worker (#150): pages open with no signal once saved, and a
// saved copy always says so, with the date it was saved.
//
// - Pages: try the network first. If there is no answer in 4 seconds (spotty
//   signal) or no network, show the saved copy with a "Saved copy" note.
// - The first visit saves Help now only (about 9 KB), so a first visit stays
//   inside the weight budget. From the second page on, the home page, the
//   door pages, Dates and Food today are saved too (about 85 KB, once, then
//   fetched again at most once a week). With Data Saver on, only Help now.
//   Saving the same pages for everyone means the saved list does not show
//   which of them a person looked at.
// - Styles, fonts and images: saved copies first; their file names change
//   when they change.
// - Nothing else: no tracking, no push messages, nothing sent anywhere.
//
// The file only changes when the list of saved pages changes, so a daily
// rebuild does not make phones download it all again.
import { loadDoors } from '../lib/content.mjs';

export function GET() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const doors = loadDoors();
  const helpNow = `${base}${doors.bySlug['help-now'].page}`;
  const saveFirst = [...new Set([
    helpNow,
    `${base}/`,
    `${base}/help/food/today/`,
    ...doors.doors.filter((d) => d.page).map((d) => `${base}${d.page}`),
    `${base}${doors.bySlug.dates.page}`,
  ])];
  const body = `// Built from site/src/pages/sw.js.js. See that file for what this does.
const PAGES = 'pages-v1';
const FILES = 'files-v1';
const HELP_NOW = ${JSON.stringify(helpNow)};
const SAVE_FIRST = ${JSON.stringify(saveFirst)};
const WAIT_MS = 4000;
const REFRESH_DAYS = 7;
const MAX_PAGES = 60;
const MAX_FILES = 80;

// Store a copy with the time it was saved.
async function save(cacheName, key, res, max) {
  const headers = new Headers(res.headers);
  headers.set('x-saved-at', new Date().toISOString());
  const copy = new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers });
  const cache = await caches.open(cacheName);
  await cache.put(key, copy);
  const keys = await cache.keys();
  for (const old of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(old);
}

const savedAt = (res) => Date.parse(res.headers.get('x-saved-at') || '') || 0;

// Save the first pages, and fetch again any saved more than a week ago.
// At install: Help now only. After that, at most once an hour after a page
// loads: the whole list.
let lastTopUp = 0;
async function topUp(all) {
  if (all && Date.now() - lastTopUp < 36e5) return;
  if (all) lastTopUp = Date.now();
  const lean = self.navigator.connection && self.navigator.connection.saveData;
  const cache = await caches.open(PAGES);
  await Promise.all((all && !lean ? SAVE_FIRST : [HELP_NOW]).map(async (url) => {
    const have = await cache.match(url);
    if (have && Date.now() - savedAt(have) < REFRESH_DAYS * 864e5) return;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) await save(PAGES, url, res, MAX_PAGES);
    } catch (e) { /* offline: try again later */ }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(topUp(false).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (![PAGES, FILES].includes(name)) await caches.delete(name);
    await self.clients.claim();
  })());
});

// "12:42 a.m. on October 30, 2026", Eastern time.
const when = (ms) => {
  const f = (o) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...o }).format(new Date(ms));
  return f({ hour: 'numeric', minute: '2-digit' }).replace('AM', 'a.m.').replace('PM', 'p.m.') + ' on ' + f({ month: 'long', day: 'numeric', year: 'numeric' });
};

// Put a plain note at the top of a saved page. Inline styles use the page's
// own color tokens, so it matches light and dark.
async function withNote(res, missing) {
  const html = await res.text();
  const date = when(savedAt(res) || Date.now());
  const text = missing
    ? 'You are offline, and that page is not saved on this phone yet. Here is the Help now page, saved at ' + date + '. Phone numbers and hours may have changed since then.'
    : 'Saved copy from ' + date + '. You are offline, so dates, hours and phone numbers may have changed since then.';
  const note = '<div class="saved-copy" role="note" style="background:var(--accent-bg);color:var(--fg);border-bottom:2px solid var(--accent);padding:.75rem 1rem;font-weight:600"><p style="margin:0 auto;max-width:44rem">' + text + '</p></div>';
  // Just before the main content, so the skip link and crisis strip stay first.
  const out = /<main[\\s>]/.test(html) ? html.replace(/<main[\\s>]/, (m) => note + m) : html.replace(/<body[^>]*>/, (m) => m + note);
  const headers = new Headers(res.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
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
  const saved = await cache.match(key, { ignoreSearch: true });
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
    if (res) return res;
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
    event.waitUntil(res.then(() => topUp(true)).catch(() => {}));
    return;
  }
  if (/^\\/(_astro|fonts)\\/|\\.(svg|png|woff2)$/.test(url.pathname.slice(${JSON.stringify(base)}.length))) event.respondWith(file(req));
});
`;
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
}
