// Group requests (#521): a group asks us to fix, remove or add a listing, and
// we act within REQUEST_DAYS. The Health workflow runs the clock every 4 hours
// (scripts/group-requests.mjs), and the Corrections and For groups pages show
// how we are doing (#523). Runbook: docs/operations/group-requests.md.
//
// REQUEST_DAYS is the one number to change if David picks a different promise
// (#502). The two warning steps move with it.
export const REQUEST_DAYS = 7;

// The no-account way in (#522): a private Tally form in David's account.
// Answers go to David, never to GitHub. A team member files the issue, only on
// David's yes, with no sender details or message text.
export const FIX_FORM = 'https://tally.so/r/rD5adv';
export const PRIORITY_DAY = Math.max(1, REQUEST_DAYS - 4); // 3 when the promise is 7 days
export const DAVID_DAY = Math.max(1, REQUEST_DAYS - 2); // 5 when the promise is 7 days

export const LABEL = 'group-request';
export const PRIORITY_LABEL = 'priority';
export const DAVID_LABEL = 'for:david';
export const OVERDUE_LABEL = 'overdue-hidden';
export const KINDS = ['fix', 'removal', 'add'];

const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s ?? '');
const easternYmd = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(d));

export function addDays(ymd, n) {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export const daysBetween = (a, b) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

// A field from the issue form ("### Received date\n\n2026-10-30") or a plain
// "Received: 2026-10-30" line.
function field(body, name) {
  const form = body.match(new RegExp(`^###\\s*${name}[^\\n]*\\n+([^\\n#][^\\n]*)`, 'im'))?.[1];
  const line = body.match(new RegExp(`^\\s*${name}\\s*:\\s*(.+)$`, 'im'))?.[1];
  const v = (form ?? line ?? '').trim();
  return v && v !== '_No response_' ? v : null;
}

// What the clock needs from one group-request issue. Received falls back to
// the day the issue was opened (Morgantown date), so the clock never waits on
// a missing field.
// Only issues opened by the project team count (TEAM), so no one outside it
// can start a clock that takes a listing down. The received date can be
// earlier than the day the issue was opened, never later, so an edit cannot
// push a deadline back.
export const TEAM = ['OWNER', 'MEMBER', 'COLLABORATOR'];
export function parseRequest({ body = '', created_at, closed_at = null, number, labels = [], author_association = 'OWNER' }) {
  const text = body ?? '';
  const rawReceived = field(text, 'Received(?: date)?');
  const opened = easternYmd(created_at);
  const given = isYmd(rawReceived?.slice(0, 10)) ? rawReceived.slice(0, 10) : opened;
  const received = given < opened ? given : opened;
  const kind = (field(text, 'Kind') ?? '').toLowerCase().match(/fix|removal|remove|add/)?.[0]?.replace('remove', 'removal') ?? null;
  const file = text.match(/\bcontent\/(orgs|resources|calendar)\/[a-z0-9-]+\.ya?ml\b/)?.[0] ?? null;
  const names = labels.map((l) => (typeof l === 'string' ? l : l.name));
  return {
    number, received, kind, file, fromTeam: TEAM.includes(author_association),
    due: addDays(received, REQUEST_DAYS),
    closed: closed_at ? easternYmd(closed_at) : null,
    hasDueLine: /^\s*Due:\s*\d{4}-\d{2}-\d{2}/.test(text),
    lateReason: field(text, 'Late because'),
    labels: names,
    overdueHidden: names.includes(OVERDUE_LABEL),
  };
}

// The steps the clock should take today for one open request. Each step
// happens once: the labels it adds are the record that it ran.
export function clockSteps(req, today) {
  const age = daysBetween(req.received, today);
  const steps = [];
  if (!req.hasDueLine) steps.push('due-line');
  if (age >= PRIORITY_DAY && !req.labels.includes(PRIORITY_LABEL)) steps.push('priority');
  if (age >= DAVID_DAY && !req.labels.includes(DAVID_LABEL)) steps.push('for:david');
  if (age >= REQUEST_DAYS && !req.overdueHidden) steps.push(req.kind !== 'add' && req.file ? 'hide' : 'overdue-no-file');
  return { age, steps };
}

// Adds a hidden block (#519) to a record's YAML text. Returns null when the
// record is already hidden, so a hide never overwrites an earlier reason.
export function withHiddenBlock(yamlText, { reason, since, note }) {
  if (/^hidden:/m.test(yamlText)) return null;
  const safeNote = note ? `\n  note: ${JSON.stringify(note)}` : '';
  return `${yamlText.replace(/\s*$/, '\n')}hidden:\n  reason: ${reason}\n  since: ${since}${safeNote}\n`;
}

// Public numbers for #523, from closed and open group-request issues. Only the
// item and dates are used, never who asked. A request counts as on time when
// it was closed, or its item was hidden as overdue, within REQUEST_DAYS.
export function promiseStats(requests, today, { since = null } = {}) {
  const inRange = requests.filter((r) => !since || r.received >= since);
  const decided = inRange.filter((r) => r.closed || r.overdueHidden || daysBetween(r.received, today) > REQUEST_DAYS);
  const fixedOnTime = decided.filter((r) => r.closed && daysBetween(r.received, r.closed) <= REQUEST_DAYS && !r.overdueHidden);
  const hiddenOnTime = decided.filter((r) => r.overdueHidden);
  const late = decided.filter((r) => !fixedOnTime.includes(r) && !hiddenOnTime.includes(r));
  return { total: inRange.length, decided: decided.length, fixedOnTime: fixedOnTime.length, hiddenOnTime: hiddenOnTime.length, late };
}

// All group-request issues opened by the team, read once per build for the
// public numbers (#523). Uses GITHUB_TOKEN when the build has one. Never
// throws: on any problem it returns null and the pages say the numbers could
// not be loaded, so a GitHub hiccup never stops the site from building.
export const REQUESTS_URL = 'https://github.com/david-shortman/mon-county-community-hub/issues?q=label%3Agroup-request';
let loaded;
export function loadGroupRequests() {
  loaded ??= (async () => {
    try {
      const token = process.env.GITHUB_TOKEN;
      const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'everything-morgantown-build', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const out = [];
      for (let page = 1; page < 20; page++) {
        const res = await fetch(`https://api.github.com/repos/david-shortman/mon-county-community-hub/issues?state=all&labels=${LABEL}&per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`GitHub said ${res.status}`);
        const batch = await res.json();
        out.push(...batch.filter((i) => !i.pull_request && i.state_reason !== 'not_planned').map(parseRequest).filter((r) => r.fromTeam));
        if (batch.length < 100) break;
      }
      return out;
    } catch (err) {
      console.warn(`group requests: could not load (${err.message}); pages will say so`);
      return null;
    }
  })();
  return loaded;
}
