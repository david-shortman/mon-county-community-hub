// Proof of a re-read (#1094, docs/playbook/reread-proof.md). When a source's
// checked date moves, something has to show the page was read again:
//   quote    words copied from the page (sources[].quote), which the daily
//            Source check then looks for on the page (#1074)
//   call     the record's phone_confirmed is the new checked date (#164)
//   program  a feed or watched page, whose own run log is the proof
// Kept out of resident pages: the quote is only in the YAML and the API.
import { ymd } from './content.mjs';

export const QUOTE_MIN_WORDS = 3;
export const QUOTE_MAX_WORDS = 40;

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean);

// Problems with a sources[].quote value, or [] when it is fine or absent.
export function quoteProblems(q) {
  if (q == null) return [];
  if (typeof q !== 'string' || !q.trim()) return ['quote must be text copied from the page'];
  const out = [];
  const n = words(q).length;
  if (n < QUOTE_MIN_WORDS) out.push(`quote needs at least ${QUOTE_MIN_WORDS} words, so it proves the page was read`);
  if (n > QUOTE_MAX_WORDS) out.push(`quote is ${n} words; keep it to ${QUOTE_MAX_WORDS} or fewer, just the part that backs the fact`);
  if (/\n/.test(q)) out.push('quote must be one line');
  return out;
}

// How a source's re-read is shown, or null when nothing shows it.
export function rereadProof(source, record = {}) {
  if (source?.method === 'feed' || source?.method === 'watched-page') return 'program';
  if (typeof source?.quote === 'string' && !quoteProblems(source.quote).length) return 'quote';
  if (record.quote && String(record._file ?? '').startsWith('facts/')) return 'quote';
  if (record.phone_confirmed && ymd(record.phone_confirmed) === ymd(source?.checked)) return 'call';
  return null;
}

// Sources whose checked date moved later between two versions of a record,
// plus sources that are new. Matched by url.
export function bumpedSources(before, after) {
  const old = new Map((before?.sources ?? []).map((s) => [s?.url, ymd(s?.checked)]));
  const out = [];
  for (const s of after?.sources ?? []) {
    const now = ymd(s?.checked);
    if (!now) continue;
    const was = old.get(s?.url);
    if (was == null) out.push({ source: s, was: null, now });
    else if (now > was) out.push({ source: s, was, now });
  }
  return out;
}

// Every bumped source in a changed record that has no proof.
export function missingProof(before, after) {
  return bumpedSources(before, after)
    .filter((b) => !rereadProof(b.source, after))
    .map((b) => ({ url: b.source.url, was: b.was, now: b.now }));
}
