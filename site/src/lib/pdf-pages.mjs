// PDF pages (#393): the useful part of a hard-to-read PDF, as short lists a
// phone can show. Each is a record in content/pdf-pages/<slug>.yaml. The
// record names the PDF, the date printed on it, the official page that links
// it, and our checked dates. Labels, fees, days and times are copied from the
// source, never reworded. Pages show a record with the FromPdf component.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, ymd, todayYmd, oldestChecked, STALE_DAYS } from './content.mjs';

export const PDF_PAGES_DIR = path.join(CONTENT_DIR, 'pdf-pages');
export const PDF_PAGE_FIELDS = ['slug', 'title', 'publisher', 'pdf', 'pdf_date', 'found_on', 'intro', 'sections', 'sources', 'recheck_days'];
export const SECTION_FIELDS = ['heading', 'id', 'note', 'items'];
export const ITEM_FIELDS = ['name', 'lines', 'links'];

export function loadPdfPages() {
  if (!fs.existsSync(PDF_PAGES_DIR)) return [];
  return fs.readdirSync(PDF_PAGES_DIR).filter((x) => /\.ya?ml$/.test(x)).sort().map((file) => {
    const d = YAML.parse(fs.readFileSync(path.join(PDF_PAGES_DIR, file), 'utf8')) ?? {};
    const sources = (d.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) }));
    return { ...d, sources, checked: oldestChecked(sources), _file: `pdf-pages/${file}` };
  });
}

// A record by slug. Throws when it is missing, so a page never ships a gap.
export function pdfPage(slug) {
  const d = loadPdfPages().find((x) => x.slug === slug);
  if (!d) throw new Error(`content/pdf-pages: no record with slug ${slug}`);
  return d;
}

// Past recheck_days (or 6 months) since the oldest checked date.
export function pdfPageDue(d, today = todayYmd()) {
  if (!d.checked) return true;
  const due = new Date(`${d.checked}T12:00:00Z`);
  due.setUTCDate(due.getUTCDate() + Number(d.recheck_days ?? STALE_DAYS));
  return due.toISOString().slice(0, 10) < today;
}

// Problems with one record, as messages. Used by npm run check-content.
export function pdfPageProblems(d) {
  const out = [];
  const isUrl = (u) => /^https?:\/\/\S+$/.test(u ?? '');
  for (const k of ['slug', 'title', 'publisher', 'sections']) if (d[k] == null || d[k] === '') out.push(`missing ${k}`);
  for (const k of Object.keys(d)) if (!['_file', 'checked'].includes(k) && !PDF_PAGE_FIELDS.includes(k)) out.push(`unknown field ${k}`);
  if (d.slug && path.basename(d._file ?? '').replace(/\.ya?ml$/, '') !== d.slug) out.push(`file name should match slug ${d.slug}`);
  if (d.pdf != null && !isUrl(d.pdf)) out.push('pdf must be a web link');
  if (d.pdf != null && !d.pdf_date) out.push('pdf_date is needed with pdf: the date printed on the PDF, in its own words');
  if (d.found_on != null && !isUrl(d.found_on)) out.push('found_on must be a web link');
  if (!d.sources?.length) out.push('needs at least one source');
  for (const s of d.sources ?? []) {
    if (!isUrl(s.url)) out.push('source url is not a web link');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.checked ?? '')) out.push('source needs a checked date (YYYY-MM-DD)');
    else if (s.checked > todayYmd()) out.push(`source checked date ${s.checked} is in the future`);
  }
  if (d.recheck_days != null && (!Number.isInteger(d.recheck_days) || d.recheck_days < 1)) out.push('recheck_days must be a whole number of days, like 90');
  if (!Array.isArray(d.sections) || !d.sections.length) out.push('sections must be a list');
  for (const [i, s] of (Array.isArray(d.sections) ? d.sections : []).entries()) {
    const at = `section ${i + 1}${s?.heading ? ` (${s.heading})` : ''}`;
    if (!s?.heading) out.push(`${at}: needs a heading`);
    for (const k of Object.keys(s ?? {})) if (!SECTION_FIELDS.includes(k)) out.push(`${at}: unknown field ${k}`);
    if (!Array.isArray(s?.items) || !s.items.length) out.push(`${at}: needs items`);
    for (const [j, it] of (Array.isArray(s?.items) ? s.items : []).entries()) {
      if (typeof it === 'string') continue;
      const where = `${at}, item ${j + 1}`;
      if (!it?.name) out.push(`${where}: needs a name, or be a plain line of text`);
      for (const k of Object.keys(it ?? {})) if (!ITEM_FIELDS.includes(k)) out.push(`${where}: unknown field ${k}`);
      if (it?.lines != null && !Array.isArray(it.lines)) out.push(`${where}: lines must be a list`);
      for (const l of it?.links ?? []) {
        if (!l?.label || !isUrl(l?.url)) out.push(`${where}: each link needs a label and a web url`);
        if (/\.pdf(\?|$)/i.test(l?.url ?? '') && !l?.date) out.push(`${where}: a PDF link needs the date printed on that PDF (date)`);
      }
    }
  }
  if (JSON.stringify(d).includes('—')) out.push('contains an em dash');
  return out;
}
