// The blind second check (#1098, docs/playbook/second-check.md; decided on
// #97). Two halves:
//   claimsFor(record)   the claim list a checker gets: one line per field,
//                       with no source links, no URLs and no notes, so the
//                       checker finds the owner's page on its own
//   parseTable(text)    reads the "Second check" table a checker posts on the
//                       PR, and verdict() says whether it lets the PR merge
import { ymd } from './content.mjs';

// The fields the PR template's table names, and where each lives in a record.
export const FIELDS = [
  { field: 'Hours', from: (r) => r.hours ?? (r.opening_hours ? 'see opening_hours' : null) },
  { field: 'Phone', from: (r) => r.contact?.phone ?? r.phone ?? null },
  { field: 'Cost', from: (r) => r.cost ?? null },
  { field: "Who it's for", from: (r) => r.who_it_is_for ?? r.who_can_use ?? null },
  { field: 'Address', from: (r) => r.contact?.place ?? r.place ?? r.address ?? null },
  { field: 'Dates and deadlines', from: (r) => (r.starts ? [ymd(r.starts), r.ends && ymd(r.ends) !== ymd(r.starts) ? `to ${ymd(r.ends)}` : '', r.start_time ? `at ${r.start_time}` : ''].filter(Boolean).join(' ') : null) },
];

const noLinks = (v) => String(v).replace(/https?:\/\/\S+/g, '[link removed]').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();

// One claim per field the record states. Never the sources.
export function claimsFor(r) {
  const name = r.title || r.name || r.slug;
  const org = r.org_name || r.org || null;
  const claims = [];
  for (const f of FIELDS) {
    const v = f.from(r);
    if (v != null && v !== '') claims.push({ field: f.field, claim: noLinks(v) });
  }
  return { name, org, file: r._file, claims };
}

export function packetMd(items) {
  const L = ['# Second check: claims to verify', '',
    'You are the second checker. You get only these claims, not the draft\'s sources or notes.',
    'For each claim, find the owner\'s own page (the group\'s site, or the office that runs the program), read it, and mark the claim confirmed, changed or not found.',
    'Do not open the record\'s file, the PR or its diff: they show the draft\'s sources.',
    'Use the owner\'s page when there is one. For a one-time event with no owner page, a named local news story may count (docs/playbook/source-order.md). Never a directory or a search snippet. Copies of one page count once.',
    'Post the table below as a PR comment that starts with "## Second check".', ''];
  for (const it of items) {
    L.push(`## ${it.name}${it.org ? ` (${it.org})` : ''}`, '');
    L.push('| Field | Claim | Result (confirmed, changed, not found) | Owner\'s source URL | Checked |', '|---|---|---|---|---|');
    for (const c of it.claims) L.push(`| ${c.field} | ${c.claim.replace(/\|/g, '/')} | | | |`);
    L.push('');
  }
  return L.join('\n');
}

const RESULTS = ['confirmed', 'changed', 'not found'];

// Rows from every "Second check" table in the text (a PR body or comment).
export function parseTable(text) {
  const rows = [];
  const parts = String(text ?? '').split(/^##+\s*Second check\b.*$/im).slice(1);
  for (const part of parts) {
    // The text right under "## Second check", plus every later "## " section
    // (a record heading, as packetMd() writes them) whose table has a
    // "| Field | Claim |" header. Other tables, like a review rubric, are skipped.
    const [first, ...sections] = part.split(/^##\s/m);
    const body = [first, ...sections.filter((s) => /^\s*\|\s*Field\s*\|\s*Claim\s*\|/im.test(s))].join('\n');
    for (const line of body.split('\n')) {
      if (!/^\s*\|/.test(line) || /^\s*\|\s*-/.test(line) || /\|\s*Field\s*\|/i.test(line)) continue;
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (cells.length < 5) continue;
      const [field, claim, result, url, checked] = cells;
      rows.push({ field, claim, result: result.toLowerCase(), url, checked });
    }
  }
  return rows;
}

// { ok, problems }: ok only when there is at least one filled row, every
// filled row is confirmed with an owner's URL and a date, and, when the claim
// packet is given (expected: claimsFor() items), every claim in it has a
// confirmed row with the same field and claim. Rows with no claim (the
// template's empty rows) are skipped.
const key = (field, claim) => `${String(field).trim().toLowerCase()}|${String(claim).replace(/\|/g, '/').replace(/\s+/g, ' ').trim().toLowerCase()}`;
export function verdict(rows, expected = null) {
  const filled = rows.filter((r) => r.claim);
  const problems = [];
  if (!filled.length) problems.push('no filled Second check table');
  for (const r of filled) {
    const where = `${r.field}: "${r.claim.slice(0, 50)}"`;
    if (!RESULTS.includes(r.result)) problems.push(`${where} has no result (confirmed, changed or not found)`);
    else if (r.result !== 'confirmed') problems.push(`${where} is ${r.result}; this blocks the merge until a third look or the owner's page settles it`);
    if (r.result === 'confirmed' && !/^https?:\/\//.test(r.url)) problems.push(`${where} needs the owner's source URL`);
    if (r.result === 'confirmed' && !/^\d{4}-\d{2}-\d{2}$/.test(r.checked)) problems.push(`${where} needs the checked date (YYYY-MM-DD)`);
  }
  if (expected) {
    const have = new Set(filled.map((r) => key(r.field, r.claim)));
    for (const it of expected) for (const c of it.claims) {
      if (!have.has(key(c.field, c.claim))) problems.push(`${it.name}: ${c.field} "${c.claim.slice(0, 50)}" has no row in the Second check table`);
    }
  }
  return { ok: !problems.length, problems };
}
