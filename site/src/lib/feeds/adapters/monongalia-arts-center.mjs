// Monongalia Arts Center (MAC) events, from the public Google Calendar the
// center embeds on its site (#761). Human page: https://www.monartscenter.com/
//
// Turned off on 2026-11-01 (#529): Google Calendar's robots.txt asks robots
// to stay out of everything but its home page, and the center's own site
// gave us no other feed (it dropped our connection). The site keeps the
// saved events until their dates pass, and a person reads the calendar on
// the weekly centers checklist. Policy: docs/operations/automated-reads.md.
//
// The feed has classes, workshops, concerts and markets, mostly at the center
// on High Street. Many classes cost money, and the feed does not say how
// much, so cards send people to the center's site for cost. Repeating events
// show only the date the feed gives; we never expand repeat rules.
import { parseIcs, readIcsDate } from '../ical.mjs';
import { plain, slugify, addDays, hhmm, firstSentences, realTime, adds } from '../util.mjs';

const SITE = 'https://www.monartscenter.com';
const KIDS = /\bkids?\b|children|teen|tots|camp|youth/i;
const MARKET = /market|bazaar|craft fair/i;

export default {
  id: 'monongalia-arts-center',
  name: 'Monongalia Arts Center calendar',
  org_name: 'Monongalia Arts Center',
  page_url: `${SITE}/`,
  feed_url: 'https://calendar.google.com/calendar/ical/56d22ade1ef4e02b8eddb9fe26435b043cfa785f0123a23adc4abf5c85ec826a%40group.calendar.google.com/public/basic.ics',
  format: 'text',
  off: { since: '2026-11-01', reason: "calendar.google.com/robots.txt asks robots not to read calendar feeds; a person reads it on a weekly checklist" },

  parse(text) {
    const out = [];
    for (const ev of parseIcs(text)) {
      const title = plain(ev.SUMMARY?.value);
      const start = readIcsDate(ev.DTSTART);
      if (!title || !start) continue;
      if (/postponed|cancel+ed/i.test(title)) continue;
      const end = readIcsDate(ev.DTEND);
      let ends = end?.ymd ?? start.ymd;
      if (end?.allDay && ends > start.ymd) ends = addDays(ends, -1);
      if (ends < start.ymd) ends = start.ymd;
      const oneDay = ends === start.ymd;
      const t = !start.allDay ? hhmm(start.hour, start.minute) : '';
      const times = oneDay && realTime(t) ? { start_time: t } : {};
      const about = firstSentences(ev.DESCRIPTION?.value);
      const where = plain(ev.LOCATION?.value);
      const repeats = ev.RRULE ? ' This event repeats; check the center\'s site for other dates.' : '';
      out.push({
        title,
        slug: `mac-${slugify(title)}-${start.ymd}`,
        starts: start.ymd,
        ends,
        ...times,
        org_name: 'Monongalia Arts Center',
        who_it_is_for: adds(about, title) ? about : 'Listed on the Monongalia Arts Center calendar.',
        what_to_do: `${where ? `At ${where}. ` : ''}Some events cost money. See the center's site for details and cost.${repeats}`,
        url: `${SITE}/`,
        topics: MARKET.test(title) ? ['market'] : KIDS.test(title) ? ['family'] : ['community'],
      });
    }
    return out;
  },
};
