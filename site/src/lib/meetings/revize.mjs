// Reads the Monongalia County Commission's "Meeting Schedule and Agendas"
// page (#13). It is a table with one row per meeting day: the date as
// MM/DD/YY, then links named "Meeting Agenda", "Work Session Agenda" and,
// for a few meetings, "Minutes".
import { plain } from '../feeds/util.mjs';

export function parseRevizeAgendas(html, { body }) {
  const out = [];
  for (const row of html.split(/<tr>/i).slice(1)) {
    const d = row.match(/<td[^>]*>\s*(\d{2})\/(\d{2})\/(\d{2})\s*</);
    if (!d) continue;
    const date = `20${d[3]}-${d[1]}-${d[2]}`;
    if (Number.isNaN(Date.parse(`${date}T12:00:00Z`))) continue;
    const links = [...row.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(([, href, label]) => ({ href: encodeURI(decodeURI(href.trim())), label: plain(label) }))
      .filter((l) => /^https:\/\/www\.monongaliacounty\.gov\//.test(l.href));
    const minutes = links.find((l) => /minutes/i.test(l.label))?.href ?? null;
    for (const l of links.filter((x) => /agenda/i.test(x.label))) {
      const work = /work session/i.test(l.label);
      out.push({
        id: work ? 'work-session' : 'meeting',
        body,
        body_slug: 'county-commission',
        date,
        title: work ? 'Work Session Agenda' : 'Meeting Agenda',
        agenda_url: l.href,
        minutes_url: work ? null : minutes,
      });
    }
  }
  return out;
}
