// Friends of Deckers Creek events, from the group's public iCal feed (#952).
// The events page is https://deckerscreek.org/events/. It posts a few events
// a year, mostly creek and trail cleanups. Research: docs/research/volunteer-ask-sources.md.
// The feed was empty on 2026-10-31, so the saved copy has no entries yet.
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, prettyTime, addDays } from '../util.mjs';

const SITE = 'https://deckerscreek.org';

export default {
  id: 'deckers-creek',
  name: 'Friends of Deckers Creek events',
  org_name: 'Friends of Deckers Creek',
  page_url: `${SITE}/events/`,
  feed_url: `${SITE}/events.ics`,
  format: 'text',

  parse(text) {
    const out = [];
    for (const ev of parseIcs(text)) {
      const title = plain(ev.SUMMARY?.value);
      const start = readIcsDate(ev.DTSTART);
      if (!title || !start) continue;
      const end = readIcsDate(ev.DTEND);
      let ends = end?.ymd ?? start.ymd;
      if (end?.allDay && ends > start.ymd) ends = addDays(ends, -1);
      if (ends < start.ymd) ends = start.ymd;
      const where = plain(ev.LOCATION?.value);
      const timed = !start.allDay && (start.hour || start.minute);
      const lead = [timed && `Starts at ${prettyTime(start.hour, start.minute)}`, where && `at ${where}`].filter(Boolean).join(' ');
      const link = ev.URL?.value?.trim();
      out.push({
        title,
        slug: `deckers-${slugify(title)}-${start.ymd}`,
        starts: start.ymd,
        ends,
        org_name: 'Friends of Deckers Creek',
        who_it_is_for: 'Listed on the Friends of Deckers Creek events calendar.',
        what_to_do: `${lead ? `${lead}. ` : ''}See the event page for details.`,
        url: link && link.startsWith(SITE) ? link : `${SITE}/events/`,
        topics: ['community'],
      });
    }
    return out;
  },
};
