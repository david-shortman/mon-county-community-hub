// Helpers for saving government PDFs to the Internet Archive (#2079).
// The script that uses them is site/scripts/save-pdf-copies.mjs. These parts
// do no network work, so the tests can run them offline.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

// The folders whose records cite government PDFs.
export const CITING_DIRS = ['minutes', 'agendas', 'pdf-pages'];

// An address we treat as a PDF: it ends in .pdf, or it is a CivicPlus
// AgendaCenter or DocumentCenter file (those send a PDF with no .pdf name).
export function looksLikePdfUrl(url) {
  let u;
  try { u = new URL(url); } catch { return false; }
  if (!/^https?:$/.test(u.protocol)) return false;
  if (/\.pdf$/i.test(decodeURIComponent(u.pathname))) return true;
  return /\/(AgendaCenter\/ViewFile|DocumentCenter\/View)\//i.test(u.pathname);
}

// Every string in a parsed YAML value that is a web address.
function urlsIn(value, out = []) {
  if (typeof value === 'string') { if (/^https?:\/\//i.test(value.trim())) out.push(value.trim()); }
  else if (Array.isArray(value)) value.forEach((v) => urlsIn(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => urlsIn(v, out));
  return out;
}

// Map of PDF address to the record files that cite it, for content/<dir>/.
export function citedPdfs(contentDir, dirs = CITING_DIRS) {
  const cited = new Map();
  for (const d of dirs) {
    const dir = path.join(contentDir, d);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((n) => /\.ya?ml$/.test(n)).sort()) {
      const data = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      for (const url of new Set(urlsIn(data))) {
        if (!looksLikePdfUrl(url)) continue;
        if (!cited.has(url)) cited.set(url, []);
        cited.get(url).push(`content/${d}/${f}`);
      }
    }
  }
  return cited;
}

// Does this look like a PDF file? Checks the first bytes, not the name.
export const isPdfBytes = (buf) => buf.length >= 5 && buf.subarray(0, 5).toString('latin1') === '%PDF-';

export const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

// The Wayback Machine's CDX "digest" is the SHA-1 of the file in base 32.
export function sha1Base32(buf) {
  const bytes = crypto.createHash('sha1').update(buf).digest();
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, value = 0, out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) { out += abc[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += abc[(value << (5 - bits)) & 31];
  return out;
}

export const cdxUrl = (url) => `https://web.archive.org/cdx/search/cdx?${new URLSearchParams({ url, output: 'json', fl: 'timestamp,digest,statuscode,mimetype,length', filter: 'statuscode:200' })}`;
export const saveUrl = (url) => `https://web.archive.org/save/${url}`;
export const captureUrl = (ts, url) => `https://web.archive.org/web/${ts}/${url}`;
export const rawCaptureUrl = (ts, url) => `https://web.archive.org/web/${ts}id_/${url}`;
export const versionsUrl = (url) => `https://web.archive.org/web/*/${url}`;

// Rows from a CDX JSON answer, as objects. The first row is the header.
export function parseCdx(json) {
  if (!Array.isArray(json) || json.length < 2) return [];
  const [head, ...rows] = json;
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

// The newest capture whose file matches this digest, or null.
export function newestMatching(rows, digest) {
  const hits = rows.filter((r) => r.digest === digest).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return hits[0] ?? null;
}

// The capture time from a Save Page Now answer's Location header.
export function timestampFromLocation(loc) {
  const m = String(loc ?? '').match(/\/web\/(\d{14})\//);
  return m ? m[1] : null;
}

// 20261121220510 -> 2026-11-21
export const tsDate = (ts) => `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`;

// The file name an address gives, decoded.
export function fileNameOf(url) {
  const last = new URL(url).pathname.split('/').filter(Boolean).pop() ?? '';
  try { return decodeURIComponent(last.replace(/\+/g, ' ')); } catch { return last; }
}

// A server's Last-Modified header as a date, or null.
export function lastModifiedDate(header) {
  if (!header) return null;
  const d = new Date(header);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
