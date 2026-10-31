// Reads a CivicPlus AgendaCenter page (#12). The city's RSS feeds give only
// the date an agenda was posted, so we read the AgendaCenter page itself,
// which lists each meeting under its board with the meeting date, the
// agenda link, and the minutes link once minutes are posted.
//
// Each agenda row looks like:
//   <h2 ... aria-controls="category-panel-3">City Council</h2>
//   ... <h3 id="h410272026-3920"> <strong aria-label="Agenda for October 27, 2026">...
//   <a href="/AgendaCenter/ViewFile/Agenda/_10272026-3920"> City Council Work Session Meeting Agenda </a>
//   <td class="minutes"><a href="/AgendaCenter/ViewFile/Minutes/_10272026-3920" ...>
import { plain, slugify } from '../feeds/util.mjs';

export function parseAgendaCenter(html, site) {
  const names = new Map();
  for (const m of html.matchAll(/<h2[^>]*aria-controls="category-panel-(\d+)"[^>]*>([\s\S]*?)<\/h2>/g)) names.set(m[1], plain(m[2]));
  const out = [];
  const panels = html.split(/<div id="category-panel-(\d+)"/);
  // split() puts each panel id before its markup: [before, id, markup, id, markup, ...]
  for (let i = 1; i < panels.length; i += 2) {
    const cat = panels[i];
    const body = names.get(cat);
    if (!body) continue;
    for (const row of panels[i + 1].split('class="catAgendaRow"').slice(1)) {
      const a = row.match(/href="(\/AgendaCenter\/ViewFile\/Agenda\/_(\d{2})(\d{2})(\d{4})-(\d+))"[^>]*>([\s\S]*?)<\/a>/);
      if (!a) continue;
      const [, agendaPath, mm, dd, yyyy, id, rawTitle] = a;
      const date = `${yyyy}-${mm}-${dd}`;
      if (Number.isNaN(Date.parse(`${date}T12:00:00Z`))) continue;
      const minutes = row.match(/href="(\/AgendaCenter\/ViewFile\/Minutes\/_\d{8}-\d+)"/)?.[1];
      const title = plain(rawTitle) || `${body} meeting`;
      out.push({
        id,
        body,
        body_slug: slugify(body),
        date,
        title,
        agenda_url: new URL(agendaPath, site).href,
        minutes_url: minutes ? new URL(minutes, site).href : null,
      });
    }
  }
  return out;
}
