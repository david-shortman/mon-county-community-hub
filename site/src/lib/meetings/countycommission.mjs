// Reads the Monongalia County Commission's "Meeting Schedule and Agendas"
// page (#13). The county posts each agenda as a PDF whose file name carries
// the meeting date, in two folders:
//   .../document_center/Agenda/REGULAR MEETINGS/2026/AGENDA November 4, 2026.pdf
//   .../document_center/Agenda/WORK SESSIONS/2026/WORK SESSION AGENDA October 28, 2026.pdf
// A name may add "Special Meeting" or "Emergency Meeting". The page has no
// minutes archive (checked October 30, 2026), so minutes_url is always null.
import { plain } from '../feeds/util.mjs';

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export function parseCountyCommission(html, site) {
  const out = [];
  const seen = new Set();
  for (const m of html.matchAll(/href="([^"]*\/document_center\/Agenda\/(REGULAR MEETINGS|WORK SESSIONS)\/\d{4}\/([^"?]+)\.pdf)(?:\?[^"]*)?"/gi)) {
    const [, href, folder, rawName] = m;
    const name = plain(decodeURIComponent(rawName.replace(/\+/g, ' ')));
    const d = name.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})/i);
    if (!d) continue;
    const date = `${d[3]}-${String(MONTHS.indexOf(d[1].toLowerCase()) + 1).padStart(2, '0')}-${d[2].padStart(2, '0')}`;
    if (Number.isNaN(Date.parse(`${date}T12:00:00Z`))) continue;
    const work = /WORK SESSIONS/i.test(folder);
    const extra = /emergency/i.test(name) ? 'emergency' : /special/i.test(name) ? 'special' : '';
    const kind = work ? 'work-session' : extra || 'regular';
    const id = `${date.replace(/-/g, '')}-${kind}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const label = work ? `Work session agenda${extra ? ` (${extra} meeting)` : ''}` : `${extra ? `${extra[0].toUpperCase()}${extra.slice(1)} meeting` : 'Regular meeting'} agenda`;
    out.push({
      id,
      body: 'Monongalia County Commission',
      body_slug: 'county-commission',
      date,
      title: label,
      agenda_url: new URL(href, site).href,
      minutes_url: null,
    });
  }
  return out;
}
