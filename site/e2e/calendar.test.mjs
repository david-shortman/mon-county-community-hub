// The calendar page, its "Add to my calendar" files and the calendar feed.
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setup, PHONE, SMOKE } from './lib.mjs';

// Undo line folding (RFC 5545 3.1), then split into events.
function parseIcs(text) {
  const lines = text.replace(/\r\n[ \t]/g, '').split('\r\n');
  const events = [];
  let ev = null;
  let depth = 0;
  for (const line of lines) {
    if (line.startsWith('BEGIN:')) depth++;
    if (line.startsWith('END:')) depth--;
    if (line === 'BEGIN:VEVENT') ev = {};
    else if (line === 'END:VEVENT') { events.push(ev); ev = null; }
    else if (ev) { const k = line.split(/[;:]/)[0]; ev[k] = line.slice(line.indexOf(':') + 1); }
  }
  return { lines, events, balanced: depth === 0 };
}

function checkIcs(name, text, problems) {
  if (!text.startsWith('BEGIN:VCALENDAR\r\n')) problems.push(`${name}: does not start with BEGIN:VCALENDAR and a CRLF`);
  const { events, balanced, lines } = parseIcs(text);
  if (!balanced) problems.push(`${name}: BEGIN and END do not match`);
  if (lines.at(-1) !== '' || lines.at(-2) !== 'END:VCALENDAR') problems.push(`${name}: should end with END:VCALENDAR and a CRLF`);
  if (!events.length) problems.push(`${name}: no events`);
  for (const e of events) {
    for (const k of ['UID', 'DTSTART', 'SUMMARY', 'DTSTAMP']) if (!e[k]) problems.push(`${name}: an event has no ${k}`);
  }
  return events;
}

describe('calendar', () => {
  let s;
  before(async () => { s = await setup(); });
  after(async () => { await s?.close(); });

  test('the calendar page lists events, and each one can be added to a phone calendar', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    await page.goto(s.origin + '/calendar/');
    const cards = page.locator('article.event');
    const n = await cards.count();
    assert.ok(n > 5, `only ${n} events on /calendar/`);
    assert.ok(await cards.first().isVisible());
    const icsLinks = [...new Set(await page.locator('a[href^="/calendar/"][href$=".ics"]').evaluateAll((as) => as.map((a) => a.getAttribute('href'))))];
    assert.ok(icsLinks.length > 5, 'events should have "add to calendar" files');
    const problems = [];
    for (const href of SMOKE ? icsLinks.slice(0, 3) : icsLinks) {
      const r = await page.request.get(s.origin + href);
      if (r.status() !== 200) { problems.push(`${href}: HTTP ${r.status()}`); continue; }
      const evs = checkIcs(href, await r.text(), problems);
      const slug = href.split('/').pop().replace(/\.ics$/, '');
      if (!evs.some((e) => e.UID === `${slug}@mon-county-community-hub`)) problems.push(`${href}: no event with UID ${slug}@...`);
    }
    assert.deepEqual(problems, []);
    await ctx.close();
  });

  test('the calendar feed is valid and has every event on the page', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    const r = await page.request.get(s.origin + '/calendar.ics');
    assert.equal(r.status(), 200);
    const problems = [];
    const events = checkIcs('/calendar.ics', await r.text(), problems);
    assert.deepEqual(problems, []);
    const uids = new Set(events.map((e) => e.UID));
    assert.equal(uids.size, events.length, 'every event UID in the feed should be different');
    await page.goto(s.origin + '/calendar/');
    const ids = await page.locator('article.event[id]').evaluateAll((as) => as.map((a) => a.id));
    const missing = ids.filter((id) => !uids.has(`${id}@mon-county-community-hub`));
    assert.deepEqual(missing, [], 'events on /calendar/ that are not in the feed');
    // The subscribe links point to this feed.
    const subs = await page.locator('a[href*="calendar.ics"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    assert.ok(subs.some((h) => h.startsWith('webcal://')), 'a webcal:// subscribe link');
    await ctx.close();
  });

  test('the month view loads', async () => {
    const ctx = await s.browser.newContext(PHONE);
    const page = await ctx.newPage();
    const r = await page.goto(s.origin + '/calendar/month/');
    assert.equal(r.status(), 200);
    assert.ok((await page.locator('h1').textContent()).trim());
    await ctx.close();
  });
});
