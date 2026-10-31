// Monongalia County Commission calendar, from the JSON data behind
// https://www.monongaliacounty.gov/calendar.php (a Revize calendar).
//
// Kept: park and recreation events, and election days.
// Left out: repeating events (like the weekly Commission meeting), because
// this reader does not expand repeat rules and we never guess dates. Also
// left out: the county office holiday list, which is not about residents
// doing something.
import { plain, slugify, firstSentences, realTime, adds } from '../util.mjs';

const SITE = 'https://www.monongaliacounty.gov';
const RECREATION = '3';
const EVENTS = '5';

// Event links sometimes point at the county's editing server, which the
// public cannot open. The same page lives on the public site.
function publicUrl(u) {
  if (!u) return `${SITE}/calendar.php`;
  return u.replace(/^https?:\/\/cms2\.revize\.com\/revize\/monongoliacountywv\//, `${SITE}/`);
}

export default {
  id: 'monongalia-county',
  name: 'Monongalia County calendar',
  org_name: 'Monongalia County',
  page_url: `${SITE}/calendar.php`,
  feed_url: `${SITE}/_assets_/plugins/revizeCalendar/calendar_data_handler.php?webspace=monongoliacountywv&relative_revize_url=//cms2.revize.com&protocol=https:`,
  format: 'json',

  parse(data) {
    const out = [];
    for (const ev of Array.isArray(data) ? data : []) {
      if (ev.rrule) continue;
      const cals = ev.calendar_displays ?? [];
      const title = plain(ev.title);
      const isElection = /election/i.test(title);
      const isRec = cals.includes(RECREATION);
      if (!title || !(isRec || (cals.includes(EVENTS) && isElection))) continue;
      const starts = String(ev.start ?? '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(starts)) continue;
      let ends = String(ev.end ?? '').slice(0, 10) || starts;
      if (ends < starts) ends = starts;
      const where = plain(ev.location);
      // The county's description is URL-encoded HTML. Most only repeat the
      // place, date and time on lines that start with a symbol; keep any
      // other words as a short summary (#230).
      let desc = '';
      try { desc = decodeURIComponent(String(ev.desc ?? '')); } catch { desc = String(ev.desc ?? ''); }
      const about = firstSentences(desc.split(/<br\s*\/?>|\n/i).map((l) => plain(l)).filter((l) => l && /^[A-Za-z0-9]/.test(l)).join(' '));
      // Times from the feed, for single-day events with a set time.
      const t0 = String(ev.start ?? '').slice(11, 16);
      const t1 = String(ev.end ?? '').slice(11, 16);
      const times = ends === starts && realTime(t0) ? { start_time: t0, ...(realTime(t1) && t1 > t0 ? { end_time: t1 } : {}) } : {};
      out.push({
        title,
        slug: `mon-county-${slugify(title)}-${starts}`,
        starts,
        ends,
        org_name: 'Monongalia County',
        who_it_is_for: adds(about, title) ? about : (isRec ? "Listed on the county's parks and recreation calendar." : 'Listed on the Monongalia County calendar.'),
        what_to_do: where ? `At ${where}.` : "The county's event page has the details.",
        ...times,
        url: publicUrl(ev.url),
        topics: isElection ? ['voting'] : ['community'],
      });
    }
    return out;
  },
};
