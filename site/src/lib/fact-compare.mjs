// Compare a listing's facts with its source pages (#1074). The daily Source
// check already looks for each phone number (#494). This adds three facts a
// program can find on a page without guessing:
//   quote    a source's quote (#1094), looked for on that source only
//   address  the street number and first street word of the listing's address
//   money    each dollar amount in the listing's cost
// A miss means "re-read this", never "this is wrong": pages word things
// differently. Nothing here edits a listing.

// Lowercase words and numbers only, padded with spaces, so punctuation, curly
// quotes and line breaks on the page do not matter. Dollar signs and decimal
// points inside numbers are kept; thousands commas are dropped.
export function normText(s) {
  const t = String(s ?? '').toLowerCase()
    .replace(/&#?\w+;/g, ' ')
    .replace(/(\d),(\d{3})\b/g, '$1$2')
    .replace(/[^a-z0-9$.]+/g, ' ')
    .replace(/\.(?!\d)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\$0\.(\d\d)\b/g, '$.$1')
    .replace(/\$(\d+)\.00\b/g, '$$$1')
    .trim();
  return ` ${t} `;
}

const DIRECTION = /^(n|s|e|w|north|south|east|west)$/;

// "200 M-Tec Dr, Morgantown, WV" gives " 200 m "; "PO Box 5" gives null.
export function addressNeedle(place) {
  const first = String(place ?? '').split(',')[0];
  const words = normText(first).trim().split(' ');
  if (!/^\d+[a-z]?$/.test(words[0] ?? '')) return null;
  const rest = words.slice(1).filter((w) => !DIRECTION.test(w));
  return rest[0] ? ` ${words[0]} ${rest[0]} ` : null;
}

// "$10 one way, $1,200 a year" gives [" $10 ", " $1200 "]. Cents are kept,
// written the way normText writes a page ($0.75 as $.75, $1.00 as $1).
export function moneyNeedles(cost) {
  const found = [...String(cost ?? '').matchAll(/\$\s?(\d[\d,]*(?:\.\d{2})?)/g)].map((m) => normText('$' + m[1]));
  return [...new Set(found)];
}

export function quoteNeedle(q) {
  const n = normText(q).trim();
  return n && n.split(' ').length >= 3 ? ` ${n} ` : null;
}

// The checks for one record: [{ kind, value, needle, urls }]. urls are the
// record's sources and its own links; a quote is looked for only on its own
// source.
export function factChecksFor(data, urls, isUrl) {
  const out = [];
  for (const s of data?.sources ?? []) {
    const needle = quoteNeedle(s?.quote);
    if (needle && isUrl(s.url)) out.push({ kind: 'quote', value: s.quote, needle, urls: [s.url] });
  }
  if (!urls.length) return out;
  for (const place of [data?.contact?.place, data?.place, data?.address]) {
    const needle = addressNeedle(place);
    if (needle) out.push({ kind: 'address', value: String(place), needle, urls });
  }
  for (const needle of moneyNeedles(data?.cost)) out.push({ kind: 'money', value: needle.trim(), needle, urls });
  return out;
}

// The page's text in the two forms needles are looked for in: as written, and
// with direction words dropped, so "799 E. Brockway Ave" matches "799 East
// Brockway Avenue" and "799 Brockway".
export function pageForms(text) {
  const norm = normText(text);
  return [norm, norm.replace(/ (?:n|s|e|w|north|south|east|west)(?= )/g, '')];
}
export const pageHas = (forms, needle) => forms.some((f) => f.includes(needle));
