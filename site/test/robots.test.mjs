// The shared robots.txt check (src/lib/robots.mjs) and how the fetch helper
// and the feed loader use it. Policy: docs/operations/automated-reads.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import { robotsRules, robotsAllows, robotsDelay, readRobots, robotsCheck, clearRobotsCache } from '../src/lib/robots.mjs';
import { fetchWithRetry, RobotsDisallowed } from '../src/lib/ingest.mjs';
import { loadFeed, ADAPTERS } from '../src/lib/feeds/index.mjs';

const quiet = { warn() {}, log() {} };

// A fake fetch: robots.txt bodies by origin, page answers by full address.
function fakeFetch({ robots = {}, pages = {} }) {
  const calls = [];
  const fn = async (url) => {
    calls.push(url);
    const u = new URL(url);
    if (u.pathname === '/robots.txt') {
      const r = robots[u.origin];
      if (r === undefined) return new Response('not found', { status: 404 });
      if (r instanceof Error) throw r;
      if (typeof r === 'number') return new Response('', { status: r });
      return new Response(r, { status: 200, headers: { 'content-type': 'text/plain' } });
    }
    const p = pages[url];
    if (!p) return new Response('missing', { status: 404 });
    if (p.redirect) return new Response('', { status: 302, headers: { location: p.redirect } });
    return new Response(p.body ?? 'ok', { status: 200 });
  };
  fn.calls = calls;
  return fn;
}

const GOOGLE = 'User-agent: *\nAllow: /$\nDisallow: /\n';

test('Google Calendar robots.txt allows only the home page', () => {
  const rules = robotsRules(GOOGLE);
  assert.equal(robotsAllows(rules, '/'), true);
  assert.equal(robotsAllows(rules, '/calendar/ical/abc%40group.calendar.google.com/public/basic.ics'), false);
});

test('rules for our name win over rules for everyone', () => {
  const txt = 'User-agent: *\nDisallow: /\n\nUser-agent: MonCountyCommunityHub\nDisallow: /private/\n';
  const rules = robotsRules(txt);
  assert.equal(robotsAllows(rules, '/events.ics'), true);
  assert.equal(robotsAllows(rules, '/private/x'), false);
});

test('rules for other robots do not apply to us', () => {
  const txt = 'User-agent: ClaudeBot\nDisallow: /\n\nUser-agent: *\nDisallow: /issues\n';
  const rules = robotsRules(txt);
  assert.equal(robotsAllows(rules, '/api/v2/places?x=1'), true);
  assert.equal(robotsAllows(rules, '/issues/5'), false);
});

test('a rule that differs only in case still stops us (the City iCalendar rule)', () => {
  const rules = robotsRules('User-agent: *\nDisallow: /common/modules/icalendar/\n');
  assert.equal(robotsAllows(rules, '/common/modules/iCalendar/iCalendar.aspx?catID=14&feed=calendar'), false);
  assert.equal(robotsAllows(rules, '/AgendaCenter'), true);
});

test('longest rule wins, Allow wins a tie, and $ anchors the end', () => {
  const rules = robotsRules('User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\nDisallow: /*.json$\n');
  assert.equal(robotsAllows(rules, '/wp-admin/admin-ajax.php'), true);
  assert.equal(robotsAllows(rules, '/wp-admin/x'), false);
  assert.equal(robotsAllows(rules, '/a/b.json'), false);
  assert.equal(robotsAllows(rules, '/a/b.json?x=1'), true);
  assert.equal(robotsAllows(rules, '/wp-json/tribe/events/v1/events'), true);
});

test('crawl-delay is read', () => {
  assert.equal(robotsDelay('User-agent: *\nCrawl-delay: 10\nDisallow: /process_\n'), 10);
});

test('robots.txt answers: missing allows all, server error or no answer reads nothing, HTML has no rules', async () => {
  const o = 'https://a.example';
  assert.equal((await readRobots(o, { fetchImpl: fakeFetch({}) })).state, 'none');
  assert.equal((await readRobots(o, { fetchImpl: fakeFetch({ robots: { [o]: 503 } }), tries: 1 })).state, 'unreadable');
  assert.equal((await readRobots(o, { fetchImpl: fakeFetch({ robots: { [o]: new Error('reset') } }), tries: 1 })).state, 'unreadable');
  assert.equal((await readRobots(o, { fetchImpl: fakeFetch({ robots: { [o]: '<!DOCTYPE html><html>x</html>' } }) })).state, 'none');
  // A robots.txt sent as HTML text type but with real rules still counts (api.bls.gov).
  const r = await readRobots(o, { fetchImpl: fakeFetch({ robots: { [o]: 'User-agent: *\nDisallow: /\n' } }) });
  assert.equal(r.state, 'read');
  assert.equal(robotsAllows(r.rules, '/publicAPI/v1/x'), false);
});

test('robotsCheck explains a skip', async () => {
  clearRobotsCache();
  const f = fakeFetch({ robots: { 'https://calendar.google.com': GOOGLE } });
  const c = await robotsCheck('https://calendar.google.com/calendar/ical/x/public/basic.ics', { fetchImpl: f });
  assert.equal(c.allowed, false);
  assert.match(c.reason, /robots\.txt asks robots not to read \/calendar\/ical\/x\/public\/basic\.ics \(Disallow: \/\)/);
});

test('fetchWithRetry never requests a disallowed page', async () => {
  clearRobotsCache();
  const url = 'https://calendar.google.com/calendar/ical/x/public/basic.ics';
  const f = fakeFetch({ robots: { 'https://calendar.google.com': GOOGLE }, pages: { [url]: { body: 'BEGIN:VCALENDAR' } } });
  await assert.rejects(fetchWithRetry(url, { fetchImpl: f }), RobotsDisallowed);
  assert.deepEqual(f.calls, ['https://calendar.google.com/robots.txt']);
});

test('fetchWithRetry reads an allowed page and checks each redirect', async () => {
  clearRobotsCache();
  const ok = 'https://b.example/events.ics';
  const moved = 'https://b.example/old.ics';
  const robots = { 'https://b.example': 'User-agent: *\nDisallow: /private/\n' };
  const f = fakeFetch({ robots, pages: { [ok]: { body: 'BEGIN:VCALENDAR' }, [moved]: { redirect: '/private/feed.ics' } } });
  assert.equal(await fetchWithRetry(ok, { fetchImpl: f }), 'BEGIN:VCALENDAR');
  await assert.rejects(fetchWithRetry(moved, { fetchImpl: f, tries: 1 }), RobotsDisallowed);
  assert.ok(!f.calls.includes('https://b.example/private/feed.ics'));
});

test('a feed robots.txt disallows falls back to its saved copy with a clear note', async (t) => {
  clearRobotsCache();
  const real = globalThis.fetch;
  globalThis.fetch = fakeFetch({ robots: { 'https://c.example': 'User-agent: *\nDisallow: /\n' } });
  t.after(() => { globalThis.fetch = real; clearRobotsCache(); });
  const adapter = { id: 'no-such-feed', name: 'Test', page_url: 'https://c.example/', feed_url: 'https://c.example/feed.ics', format: 'text', parse: () => [] };
  const r = await loadFeed(adapter, { today: '2026-11-01', log: quiet });
  assert.equal(r.status, 'skipped');
  assert.equal(r.robots, true);
  assert.match(r.error, /robots\.txt asks robots not to read \/feed\.ics/);
});

test('the Google Calendar adapters are off, never read, and drop past dates', async (t) => {
  const real = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('an off feed must not be fetched'); };
  t.after(() => { globalThis.fetch = real; });
  const off = ADAPTERS.filter((a) => /calendar\.google\.com/.test(a.feed_url ?? ''));
  assert.deepEqual(off.map((a) => a.id).sort(), ['monongalia-arts-center', 'morgantown-farmers-market']);
  for (const a of off) {
    assert.ok(a.off?.since && a.off?.reason, `${a.id} should be turned off`);
    const now = await loadFeed(a, { today: '2026-11-01', log: quiet });
    assert.equal(now.status, 'off');
    assert.ok(now.entries.every((e) => e.sources[0].checked && e.ends >= '2026-11-01'));
    // Long after every saved date, nothing is left.
    const later = await loadFeed(a, { today: '2028-01-01', log: quiet });
    assert.equal(later.entries.length, 0);
  }
});

test('no adapter reads a Google Calendar feed while on', () => {
  for (const a of ADAPTERS) {
    const url = a.feedUrl ? a.feedUrl('2026-11-01') : a.feed_url;
    if (/calendar\.google\.com/.test(url)) assert.ok(a.off, `${a.id} reads Google Calendar`);
  }
});

test('weather reads the forecast page JSON (allowed), not api.weather.gov', async () => {
  const { WEATHER_API, periodsFromForecastJson, pickForecast } = await import('../src/lib/weather.mjs');
  assert.match(WEATHER_API, /^https:\/\/forecast\.weather\.gov\/MapClick\.php\?.*FcstType=json$/);
  const json = {
    time: { startValidTime: ['2026-11-01T06:00:00-05:00', '2026-11-01T18:00:00-05:00'], tempLabel: ['High', 'Low'] },
    data: { temperature: ['70', '48'], weather: ['Mostly Cloudy', 'Chance Rain'] },
  };
  const periods = periodsFromForecastJson(json);
  assert.equal(periods[0].isDaytime, true);
  assert.equal(periods[1].endTime, '2026-11-02T11:00:00.000Z');
  assert.deepEqual(pickForecast(periods, new Date('2026-11-01T15:00:00Z')), { day: '2026-11-01', icon: 'wx-cloud', text: 'High 70°, mostly cloudy' });
  assert.equal(pickForecast(periods, new Date('2026-11-01T23:30:00Z')).text, 'Low 48°, chance rain');
});
