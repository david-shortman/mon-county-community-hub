// Public meetings from the City of Morgantown AgendaCenter (#12) and the
// Monongalia County Commission's agenda page (#13).
//
// At build time we read the AgendaCenter page. If it is down, we use the last
// good copy in ./snapshots/. Like the calendar feeds, the build never fails
// because of a source. `npm run update-meetings` in site/ refreshes the saved
// copy and prints what is new or changed since the last one, so new meetings
// and newly posted minutes can be spotted between runs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAgendaCenter } from './agendacenter.mjs';
import { parseRevizeAgendas } from './revize.mjs';
import { fetchWithRetry } from '../ingest.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_DIR = fs.existsSync(path.join(here, 'snapshots'))
  ? path.join(here, 'snapshots')
  : path.resolve(process.cwd(), 'src/lib/meetings/snapshots');

export const SOURCES = [
  {
    id: 'morgantown-agendacenter',
    publisher: 'City of Morgantown',
    prefix: 'morgantown',
    page_url: 'https://www.morgantownwv.gov/AgendaCenter',
    parse: (html) => parseAgendaCenter(html, 'https://www.morgantownwv.gov'),
  },
  {
    id: 'monongalia-county-commission',
    publisher: 'Monongalia County Commission',
    prefix: 'mon-county',
    page_url: 'https://www.monongaliacounty.gov/commission/meeting_schedule/index.php',
    parse: (html) => parseRevizeAgendas(html, { body: 'Monongalia County Commission' }),
  },
];
// Keep meetings from this many days back, plus everything ahead.
export const KEEP_DAYS = 120;

const todayYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
const daysAgo = (today, n) => { const d = new Date(`${today}T12:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); };

function snapshotFile(src) { return path.join(SNAPSHOT_DIR, `${src.id}.json`); }
function readSnapshot(src) {
  try { return JSON.parse(fs.readFileSync(snapshotFile(src), 'utf8')); } catch { return null; }
}

// The first date we saw a meeting's agenda or minutes file at this URL.
function firstSeenFile(old, kind, url, checked) {
  if (!old || old[`${kind}_url`] !== url) return checked;
  return old[`${kind}_first_seen`] ?? old.first_seen ?? checked;
}

// Meetings with a new meeting, agenda or minutes first seen on or after
// `since` (YYYY-MM-DD), each with `what_is_new`: a list of 'meeting',
// 'agenda' and 'minutes'. For "new this week" lists (#951, #949).
export function newSince(meetings, since) {
  return meetings.flatMap((m) => {
    const what = [];
    if (m.first_seen >= since) what.push('meeting');
    if (m.agenda_first_seen && m.agenda_first_seen >= since && !what.includes('meeting')) what.push('agenda');
    if (m.minutes_first_seen && m.minutes_first_seen >= since) what.push('minutes');
    return what.length ? [{ ...m, what_is_new: what }] : [];
  });
}

// Turn parsed rows into records, carrying first_seen and last_changed over
// from the previous snapshot so changes can be seen between runs.
export function toRecords(src, rows, { checked, previous = [] }) {
  const before = new Map(previous.map((r) => [r.slug, r]));
  const records = rows.map((r) => {
    const slug = `${src.prefix}-${r.body_slug}-${r.date}-${r.id}`;
    const old = before.get(slug);
    const changed = !old || old.title !== r.title || old.agenda_url !== r.agenda_url || old.minutes_url !== r.minutes_url;
    return {
      slug,
      body: r.body,
      date: r.date,
      title: r.title,
      agenda_url: r.agenda_url,
      minutes_url: r.minutes_url,
      publisher: src.publisher,
      sources: [{ url: src.page_url, checked, method: 'watched-page' }],
      first_seen: old?.first_seen ?? checked,
      last_changed: changed ? checked : (old.last_changed ?? old.first_seen ?? checked),
      // When we first saw this agenda file and these minutes (#951), so a page
      // can show "new on an agenda this week". Older snapshots have no such
      // field; for those we use the meeting's first_seen, so nothing old is
      // shown as new.
      ...(r.agenda_url && { agenda_first_seen: firstSeenFile(old, 'agenda', r.agenda_url, checked) }),
      ...(r.minutes_url && { minutes_first_seen: firstSeenFile(old, 'minutes', r.minutes_url, checked) }),
    };
  });
  const seen = new Set();
  return records.filter((r) => !seen.has(r.slug) && seen.add(r.slug))
    .sort((a, b) => a.date.localeCompare(b.date) || a.body.localeCompare(b.body) || a.slug.localeCompare(b.slug));
}

const fetchPage = (url) => fetchWithRetry(url, { timeoutMs: 30_000 });

// { meetings, status } for one source. Never throws.
export async function loadSource(src, { live = true, save = false, today = todayYmd(), log = console } = {}) {
  const snap = readSnapshot(src);
  const keep = (r) => r.date >= daysAgo(today, KEEP_DAYS);
  if (live) {
    try {
      const rows = src.parse(await fetchPage(src.page_url));
      if (!rows.length) throw new Error('no meetings found on the page; its layout may have changed');
      const meetings = toRecords(src, rows, { checked: today, previous: snap?.meetings ?? [] }).filter(keep);
      if (save) {
        fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
        fs.writeFileSync(snapshotFile(src), JSON.stringify({ id: src.id, page_url: src.page_url, fetched: new Date().toISOString(), meetings }, null, 2) + '\n');
      }
      return { meetings, status: 'live', previous: snap?.meetings ?? [] };
    } catch (err) {
      log.warn(`meetings: ${src.id}: could not read ${src.page_url} (${err.message}). Using the saved copy if there is one.`);
    }
  }
  if (!snap) return { meetings: [], status: 'skipped', previous: [] };
  return { meetings: snap.meetings.filter(keep), status: 'snapshot', previous: snap.meetings };
}

let cached;
export function loadMeetings() {
  cached ??= (async () => {
    const all = [];
    for (const src of SOURCES) {
      const { meetings, status } = await loadSource(src);
      console.log(`meetings: ${src.id}: ${meetings.length} meetings (${status})`);
      all.push(...meetings);
    }
    return all;
  })();
  return cached;
}
