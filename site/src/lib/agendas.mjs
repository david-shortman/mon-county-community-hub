// Plain-language agenda guides (#529): one file per upcoming meeting of a
// body in BODIES below with a posted agenda, in
// content/agendas/<slug>.yaml. Rules: docs/decisions/2026-10-31-2132-agenda-guide-neutrality.md.
// How to make one: docs/process/agenda-guides.md.
//
// Each item keeps the agenda's own title, word for word, and adds one line
// that says what kind of item it is. Never whether it is good or bad, likely
// to pass, or who is for or against it. agendaProblems() checks the files,
// including a list of judging words that may not appear in a line.
import { loadDir } from './content.mjs';

// The bodies we write guides for. `comment` links to that body's card on
// Have your say, which holds the sourced comment rules; bodies with no card
// there link `home`, the official page where the body posts its agendas.
// `group` sorts the list on /meetings/agendas/ (#529).
export const BODIES = {
  'city-council': { name: 'Morgantown City Council', group: 'city', comment: '/have-your-say/#city-council', home: 'https://www.morgantownwv.gov/AgendaCenter/City-Council-3' },
  'county-commission': { name: 'Monongalia County Commission', group: 'county', comment: '/have-your-say/#county-commission', home: 'https://www.monongaliacounty.gov/commission/meeting_schedule/index.php' },
  'school-board': { name: 'Monongalia County Board of Education', group: 'county', comment: '/have-your-say/#school-board', home: 'https://go.boarddocs.com/wv/mono/Board.nsf/Public' },
  'planning-commission': { name: 'Morgantown Planning Commission', group: 'city', comment: '/have-your-say/#planning-commission', home: 'https://www.morgantownwv.gov/AgendaCenter' },
  'board-of-zoning-appeals': { name: 'Morgantown Board of Zoning Appeals', group: 'city', home: 'https://www.morgantownwv.gov/AgendaCenter' },
  boparc: { name: 'BOPARC (Morgantown parks and recreation board)', group: 'city', comment: '/have-your-say/#boparc', home: 'https://www.morgantownwv.gov/AgendaCenter' },
  mub: { name: 'Morgantown Utility Board', group: 'city', home: 'https://www.morgantownwv.gov/AgendaCenter' },
  'land-reuse': { name: 'Morgantown Land Reuse and Preservation Agency', group: 'city', home: 'https://www.morgantownwv.gov/AgendaCenter' },
  mpo: { name: 'Morgantown Monongalia MPO Policy Board', group: 'region', home: 'https://www.plantogether.org/agendas' },
  'mountain-line': { name: 'Mountain Line Transit Authority Board', group: 'region', home: 'https://www.busride.org/copy-of-board-meetings' },
  'board-of-health': { name: 'Monongalia County Board of Health', group: 'county', home: 'https://www.monchd.org/about' },
  westover: { name: 'Westover City Council', group: 'towns', home: 'https://www.westoverwv.org/government' },
  'star-city': { name: 'Star City Town Council', group: 'towns', home: 'https://www.starcitywv.com/minutes/' },
  granville: { name: 'Granville Town Council', group: 'towns', home: 'https://townofgranvillewv.gov/meeting-minutes-agendas' },
  blacksville: { name: 'Blacksville Town Council', group: 'towns' },
};
export const GROUPS = { city: 'City of Morgantown', county: 'Monongalia County', region: 'Regional boards', towns: 'Towns' };

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
  request: 'Request to decide',
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
  // Added for "what was decided" notes (#529): words that tell how a vote
  // went or felt, or that sum up debate.
  'narrowly', 'overwhelmingly', 'sweeping', 'landmark', 'rubber stamp', 'rubber-stamped', 'backroom',
  'secretly', 'quietly', 'pushed through', 'rammed', 'caved', 'shocking', 'surprising', 'surprisingly',
  'alarming', 'troubling', 'heated', 'hotly', 'debate', 'debated', 'argued', 'praised', 'criticized',
  'outrage', 'win', 'wins', 'won', 'lost', 'loses',
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

// "What was decided" (#529): one file per past meeting with posted minutes,
// in content/minutes/<body>-<date>.yaml. It lists each motion the official
// minutes record, with the result and the vote count as the minutes write
// them, and links the minutes. Never a summary of debate, comments or
// reasons. Rules: docs/process/agenda-guides.md, "What was decided".
export const MINUTES_STATUS = {
  Approved: 'The board approved these minutes.',
  Draft: 'These minutes are a draft. The board has not approved them yet, so they can change.',
  'Not marked': 'The minutes file does not say whether the board has approved it.',
};
const DECIDED_FIELDS = ['slug', 'body', 'meeting', 'date', 'minutes_url', 'minutes_status', 'read', 'actions', 'note', 'sources'];
const ACTION_FIELDS = ['item', 'motion', 'result', 'vote'];

export function loadDecided() {
  return loadDir('minutes').sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(a.body).localeCompare(String(b.body)));
}

// Every problem in the minutes files, as "minutes/<file>: message" strings.
export function decidedProblems(records = loadDir('minutes', { withHidden: true })) {
  const out = [];
  const seen = new Set();
  for (const r of records) {
    const say = (m) => out.push(`${r._file}: ${m}`);
    for (const k of Object.keys(r)) if (k !== '_file' && !DECIDED_FIELDS.includes(k)) say(`unknown field ${k}`);
    for (const k of ['slug', 'body', 'meeting', 'date', 'minutes_url', 'minutes_status', 'read', 'actions', 'sources']) if (r[k] == null) say(`missing ${k}`);
    if (r.slug && `minutes/${r.slug}.yaml` !== r._file) say('slug must match the file name');
    if (r.slug && r.body && r.date != null && !String(r.slug).startsWith(`${r.body}-${r.date}`)) say('slug must start with <body>-<date>');
    if (seen.has(r.slug)) say(`duplicate slug ${r.slug}`);
    seen.add(r.slug);
    if (r.body && !BODIES[r.body]) say(`body must be one of ${Object.keys(BODIES).join(', ')}`);
    if (r.date != null && !isDate(String(r.date))) say('date must be YYYY-MM-DD');
    if (r.read != null && !isDate(String(r.read))) say('read must be YYYY-MM-DD, the day we read the minutes');
    if (r.read != null && r.date != null && String(r.read) < String(r.date)) say('read cannot be before the meeting date');
    if (r.minutes_url != null && !isUrl(r.minutes_url)) say('minutes_url must be an https link');
    if (r.minutes_status != null && !MINUTES_STATUS[r.minutes_status]) say(`minutes_status must be one of ${Object.keys(MINUTES_STATUS).join(', ')}`);
    for (const k of ['meeting', 'note']) {
      if (r[k] != null && !text(r[k])) say(`${k} must be text`);
      else if (r[k] != null) for (const p of wordProblems(r[k])) say(`${k} ${p}`);
    }
    if (!Array.isArray(r.sources) || !r.sources.length) say('sources must list at least the minutes');
    else {
      for (const s of r.sources) if (!isUrl(s?.url) || !isDate(String(s?.checked ?? ''))) say('each source needs an https url and a checked date');
      if (r.minutes_url && !r.sources.some((s) => s.url === r.minutes_url)) say('sources must include the minutes_url');
    }
    if (!Array.isArray(r.actions) || !r.actions.length) { say('actions must list every motion the minutes record'); continue; }
    r.actions.forEach((a, i) => {
      const at = `action ${i + 1}`;
      for (const k of Object.keys(a ?? {})) if (!ACTION_FIELDS.includes(k)) say(`${at}: unknown field ${k}`);
      if (!text(a?.motion)) say(`${at}: motion must be the minutes' own words`);
      for (const k of ['item', 'result', 'vote']) if (a?.[k] != null && !text(String(a[k]))) say(`${at}: ${k} must be text`);
    });
  }
  return out;
}

// Records for meetings in the `days` days up to `today`, newest first.
export function recentDecided(records, today, days = 30) {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  const from = d.toISOString().slice(0, 10);
  return records.filter((r) => String(r.date) >= from && String(r.date) <= today);
}

// Guides for meetings in the `days` days before `today`, newest first, for
// a body's page. Their agenda links stay useful next to the minutes.
export function pastGuides(guides, today, days = 30) {
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  const from = d.toISOString().slice(0, 10);
  return guides.filter((g) => String(g.date) >= from && String(g.date) < today).reverse();
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
export const MEETING_BODIES = {
  'City Council': 'city-council',
  'Monongalia County Commission': 'county-commission',
  'Planning Commission': 'planning-commission',
  'Board of Zoning Appeals': 'board-of-zoning-appeals',
  BOPARC: 'boparc',
  'Morgantown Utility Board': 'mub',
  'Land Reuse and Preservation Agency': 'land-reuse',
};
