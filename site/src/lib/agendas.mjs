// Plain-language agenda guides (#529): one file per upcoming City Council,
// County Commission or Board of Education meeting with a posted agenda, in
// content/agendas/<slug>.yaml. Rules: docs/decisions/2026-10-31-2132-agenda-guide-neutrality.md.
// How to make one: docs/process/agenda-guides.md.
//
// Each item keeps the agenda's own title, word for word, and adds one line
// that says what kind of item it is. Never whether it is good or bad, likely
// to pass, or who is for or against it. agendaProblems() checks the files,
// including a list of judging words that may not appear in a line.
import { loadDir } from './content.mjs';

// The bodies we write guides for. `comment` links to that body's card on
// Have your say, which holds the sourced comment rules.
export const BODIES = {
  'city-council': { name: 'Morgantown City Council', comment: '/have-your-say/#city-council' },
  'county-commission': { name: 'Monongalia County Commission', comment: '/have-your-say/#county-commission' },
  'school-board': { name: 'Monongalia County Board of Education', comment: '/have-your-say/#school-board' },
};

// What kind of item it is. The label shows next to the line, so the same
// kind of item reads the same way on every board's guide.
export const KINDS = {
  opening: 'Opening',
  minutes: 'Minutes',
  consent: 'Consent agenda',
  'public-comment': 'Public comment',
  'public-hearing': 'Public hearing',
  'first-reading': 'First reading',
  'later-reading': 'Second or third reading',
  vote: 'Vote',
  appointments: 'Board appointments',
  bids: 'Bids',
  personnel: 'Staff',
  proclamation: 'Proclamation',
  presentation: 'Presentation or update',
  correspondence: 'Correspondence',
  report: 'Reports',
  discussion: 'Discussion, no vote listed',
  'executive-session': 'Executive session',
  other: 'Other',
  closing: 'Closing',
};

// Words that judge, predict or take a side. A line may not use them (rule 9).
// Whole words only, any case.
export const JUDGING_WORDS = [
  'controversial', 'contentious', 'important', 'crucial', 'critical', 'major', 'big', 'huge',
  'should', 'finally', 'good', 'bad', 'great', 'poor', 'wasteful', 'costly',
  'expensive', 'cheap', 'excessive', 'overdue', 'long-awaited', 'welcome',
  'unfortunately', 'fortunately', 'hopefully', 'likely', 'unlikely', 'will pass', 'will fail',
  'supporters', 'opponents', 'critics', 'slams', 'blasts', 'victory', 'defeat', 'scheme',
  'giveaway', 'handout', 'boondoggle', 'common sense', 'commonsense', 'radical', 'extreme', 'sneak',
];
const judging = new RegExp(`\\b(${JUDGING_WORDS.map((w) => w.replace(/[-\s]/g, '[-\\s]')).join('|')})\\b`, 'i');

const FIELDS = ['slug', 'body', 'meeting', 'date', 'time', 'place', 'watch', 'agenda_url', 'packet_url', 'note', 'items', 'read', 'sources'];
const ITEM_FIELDS = ['number', 'title', 'kind', 'line', 'parts'];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '') && !Number.isNaN(Date.parse(`${d}T12:00:00Z`));
const isUrl = (u) => { try { return new URL(u).protocol === 'https:'; } catch { return false; } };
const text = (v) => typeof v === 'string' && v.trim().length > 0;

export function loadAgendas() {
  return loadDir('agendas').sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.body).localeCompare(String(b.body)));
}

// Problems with one guide's words: em dashes and judging words.
export function wordProblems(s) {
  const out = [];
  if (/—/.test(s)) out.push('has an em dash');
  const m = String(s).match(judging);
  if (m) out.push(`uses the judging word "${m[1]}" (see the neutrality rules)`);
  return out;
}

// Every problem in the guide files, as "agendas/<file>: message" strings.
export function agendaProblems(guides = loadDir('agendas', { withHidden: true })) {
  const out = [];
  const seen = new Set();
  for (const g of guides) {
    const where = g._file;
    const say = (m) => out.push(`${where}: ${m}`);
    for (const k of Object.keys(g)) if (k !== '_file' && !FIELDS.includes(k)) say(`unknown field ${k}`);
    for (const k of ['slug', 'body', 'meeting', 'date', 'time', 'place', 'watch', 'agenda_url', 'items', 'read', 'sources']) if (g[k] == null) say(`missing ${k}`);
    if (g.slug && `agendas/${g.slug}.yaml` !== where) say('slug must match the file name');
    if (seen.has(g.slug)) say(`duplicate slug ${g.slug}`);
    seen.add(g.slug);
    if (g.body && !BODIES[g.body]) say(`body must be one of ${Object.keys(BODIES).join(', ')}`);
    if (g.date != null && !isDate(String(g.date))) say('date must be YYYY-MM-DD');
    if (g.read != null && !isDate(String(g.read))) say('read must be YYYY-MM-DD, the day we read the agenda');
    if (g.time != null && !/^\d{2}:\d{2}$/.test(String(g.time))) say('time must be quoted 24-hour HH:MM, like "19:00"');
    for (const k of ['agenda_url', 'packet_url']) if (g[k] != null && !isUrl(g[k])) say(`${k} must be an https link`);
    for (const k of ['meeting', 'place', 'watch', 'note']) {
      if (g[k] != null && !text(g[k])) say(`${k} must be text`);
      else if (g[k] != null) for (const p of wordProblems(g[k])) say(`${k} ${p}`);
    }
    if (!Array.isArray(g.sources) || !g.sources.length) say('sources must list at least the agenda');
    else {
      for (const s of g.sources) if (!isUrl(s?.url) || !isDate(String(s?.checked ?? ''))) say('each source needs an https url and a checked date');
      if (g.agenda_url && !g.sources.some((s) => s.url === g.agenda_url)) say('sources must include the agenda_url');
    }
    if (!Array.isArray(g.items) || !g.items.length) { say('items must list every agenda item'); continue; }
    g.items.forEach((it, i) => {
      const at = `item ${it?.number ?? i + 1}`;
      for (const k of Object.keys(it ?? {})) if (!ITEM_FIELDS.includes(k)) say(`${at}: unknown field ${k}`);
      if (!text(it?.title)) say(`${at}: title must be the agenda's own words`);
      if (!KINDS[it?.kind]) say(`${at}: kind must be one of ${Object.keys(KINDS).join(', ')}`);
      if (!text(it?.line)) say(`${at}: needs a one-line plain description`);
      else {
        for (const p of wordProblems(it.line)) say(`${at}: line ${p}`);
        if (it.line.split(/[.!?](\s|$)/).filter((x) => x && x.trim()).length > 3) say(`${at}: keep the line to three short sentences or fewer`);
      }
      if (it?.parts != null && (!Array.isArray(it.parts) || it.parts.some((p) => !text(p)))) say(`${at}: parts must be a list of the agenda's sub-item titles`);
    });
  }
  return out;
}

// Guides for meetings on or after `today`, soonest first.
export const upcomingGuides = (guides, today) => guides.filter((g) => String(g.date) >= today);

// "19:00" -> "7 p.m.", "10:30" -> "10:30 a.m."
export function clock(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number);
  if (h === 12 && !m) return 'noon';
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}

// Which posted agendas in the meetings list belong to a body we write guides
// for. The meetings list names bodies the way each source does.
export const MEETING_BODIES = { 'City Council': 'city-council', 'Monongalia County Commission': 'county-commission' };
