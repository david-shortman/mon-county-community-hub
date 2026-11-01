// Translation files (plan: docs/plans/2026-10-31-languages.md, section 4).
//
// A translation lives in its own sidecar file next to nothing else:
// content/translations/<lang>/<kind>/<path>.yaml. The English record or page
// stays the one source of facts. Phone numbers, addresses, hours, prices and
// links are never translated; a translated page reads them from the English
// record at build time, so they are always current.
//
// Each file keeps `english_hash`, a short hash of the English text it was
// made from. When the English changes, the hash no longer matches and the
// translation is stale:
//   - high stakes (the same rules as the High stakes check): hidden, and the
//     English shows instead, until a reviewer checks it again
//   - everything else: shown with a "this part changed" note for up to 30
//     days after the English changed, then hidden
//
// How to add one: docs/process/translations.md. The check:
// site/scripts/check-translations.mjs (part of npm run check-content).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import YAML from 'yaml';
import { REPO_ROOT, LOCALES, DEFAULT_LOCALE, PUBLISHED, METHODS, ALLOW_MACHINE_DRAFTS, RECORD_KINDS, TRANSLATION_KINDS, parseTranslationPath, englishFilesFor } from './i18n.mjs';
import { translationHit } from '../../scripts/high-stakes-rules.mjs';

export const TRANSLATIONS_DIR = 'content/translations';
export const STALE_GRACE_DAYS = 30;

// Record fields that hold facts. They are never translated.
export const FACT_FIELDS = [
  'slug', 'org', 'kind', 'area', 'topics', 'interests', 'contact', 'phone', 'text', 'email', 'url', 'website',
  'place', 'address', 'hours', 'opening_hours', 'cost', 'starts', 'ends', 'start_time', 'end_time',
  'sources', 'hidden', 'lat', 'lon', 'geo', 'private_trace',
];
const KNOWN_FIELDS = ['of', 'lang', 'fields', 'strings', 'english_hash', 'method', 'translated', 'reviewed', 'reviewer', 'second_review', 'notes'];
// A reviewer is a role ID like es-reviewer-1, never a person's name (who that
// is stays in private Notion unless David decides otherwise, #1067).
const ROLE_ID = /^[a-z0-9]+(-[a-z0-9]+)+$/;
const HASH = /^[0-9a-f]{12}$/;

const ymd = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v == null ? null : String(v).slice(0, 10));
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d ?? '');
const addDays = (date, n) => new Date(Date.parse(`${date}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
export const shortHash = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 12);

// The words a reader sees in an .astro file, roughly: no frontmatter, no
// style or script blocks, no tags, no {expressions}. Spaces are collapsed,
// so a change to markup or code alone does not make a translation stale.
export function pageText(source) {
  return source
    .replace(/^---[\s\S]*?\n---/, ' ')
    .replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// The hash of the English a translation is made from. For a record, only
// the fields the translation covers count, so editing a phone number (which
// is never translated) does not make it stale. For a page or part, the
// page's visible text counts.
export function englishHash(kind, englishText, keys = []) {
  if (RECORD_KINDS.includes(kind)) {
    const data = YAML.parse(englishText) ?? {};
    const picked = [...keys].sort().map((k) => [k, data[k] ?? null]);
    return shortHash(JSON.stringify(picked));
  }
  return shortHash(pageText(englishText));
}

// Every translation file, relative to the repo root.
export function listTranslationFiles(root = REPO_ROOT) {
  const top = path.join(root, TRANSLATIONS_DIR);
  if (!fs.existsSync(top)) return [];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.ya?ml$/.test(d.name) ? [path.relative(root, p).split(path.sep).join('/')] : [];
  });
  return walk(top).sort();
}

const readOr = (root) => (file) => {
  try { return fs.readFileSync(path.join(root, file), 'utf8'); } catch { return ''; }
};

// Reads one translation file with what the checks need: its parsed data, its
// place (lang, kind, of), its English source and whether it is high stakes.
export function readTranslation(file, { root = REPO_ROOT, read = readOr(root) } = {}) {
  const text = read(file);
  let data = null;
  let parseError = null;
  try { data = YAML.parse(text); } catch (e) { parseError = e.message; }
  const place = parseTranslationPath(file);
  const source = place ? englishFilesFor(place.of).find((f) => read(f)) ?? null : null;
  const english = source ? read(source) : '';
  const values = data && typeof data === 'object' ? (RECORD_KINDS.includes(place?.kind) ? data.fields : data.strings) : null;
  const keys = values && typeof values === 'object' ? Object.keys(values) : [];
  let currentHash = null;
  try { currentHash = english ? englishHash(place.kind, english, keys) : null; } catch { /* bad English YAML is check-content's job */ }
  return {
    file, data: data ?? {}, parseError, place, source, english, values, currentHash,
    highStakes: Boolean(place && translationHit(file, text, read)),
  };
}

// Numbers in a text that must match the English exactly: phone numbers,
// prices, and any number with three or more digits. A translation can
// never add or change one ("same claim as the English, no more").
export function numbersIn(text) {
  return (String(text).match(/\$\s?\d[\d,.]*|\d[\d.,:-]*\d/g) ?? [])
    .map((n) => n.replace(/[.,:-]+$/, ''))
    .filter((n) => n.startsWith('$') || (n.match(/\d/g) ?? []).length >= 3);
}

const flat = (v) => (Array.isArray(v) ? v.map(flat).join('\n') : v && typeof v === 'object' ? Object.values(v).map(flat).join('\n') : String(v ?? ''));
const isText = (v) => typeof v === 'string' || (Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === 'string'));

// A draft: written, but no fluent reader has checked it yet (reviewed: false).
export const isDraft = (d) => d?.reviewed === false;

// Errors and warnings for one translation (from readTranslation).
export function translationProblems(t, { today, allowMachine = ALLOW_MACHINE_DRAFTS } = {}) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(`${t.file}: ${m}`);
  const warn = (m) => warnings.push(`${t.file}: ${m}`);
  if (!t.place) { err('must be at content/translations/<lang>/<kind>/<name>.yaml'); return { errors, warnings }; }
  if (t.parseError) { err(`is not valid YAML (${t.parseError})`); return { errors, warnings }; }
  const d = t.data;
  const { lang, kind, of } = t.place;
  if (!LOCALES[lang] || lang === DEFAULT_LOCALE) err(`${lang} is not a language in site/src/lib/i18n.mjs LOCALES`);
  if (!TRANSLATION_KINDS.includes(kind)) err(`kind ${kind} must be one of ${TRANSLATION_KINDS.join(', ')}`);
  if (d.lang !== lang) err(`lang must be ${lang} (the folder it is in)`);
  if (d.of !== of) err(`of must be ${of} (it matches the file's path)`);
  if (!t.source) err(`its English source ${englishFilesFor(of)[0] ?? of} does not exist`);
  const field = RECORD_KINDS.includes(kind) ? 'fields' : 'strings';
  const other = field === 'fields' ? 'strings' : 'fields';
  if (d[other] != null) err(`a ${kind} translation uses ${field}, not ${other}`);
  if (!t.values || typeof t.values !== 'object' || Array.isArray(t.values) || !Object.keys(t.values).length) {
    err(`${field} needs at least one translated text`);
  } else {
    let englishData = {};
    if (field === 'fields' && t.english) { try { englishData = YAML.parse(t.english) ?? {}; } catch { /* reported by check-content */ } }
    for (const [k, v] of Object.entries(t.values)) {
      if (!isText(v)) err(`${field}.${k} must be text or a list of text`);
      if (field === 'fields') {
        if (FACT_FIELDS.includes(k)) err(`fields.${k} is a fact (numbers, places, hours, prices, links); facts come from the English record and are never translated`);
        else if (englishData[k] == null) err(`fields.${k} is not in the English record`);
      }
      const english = field === 'fields' ? flat(englishData[k]) : t.english;
      for (const n of numbersIn(flat(v))) if (!english.includes(n)) err(`${field}.${k} has ${n}, which is not in the English; a translation cannot add or change a number`);
    }
  }
  if (!HASH.test(d.english_hash ?? '')) err('english_hash must be the 12-character hash of the English (npm run check-content prints it)');
  if (!METHODS.includes(d.method)) err(`method must be one of ${METHODS.join(', ')}`);
  else if (d.method === 'machine-plus-review' && !allowMachine) err('machine-plus-review is off until David decides (#1067, decision 3)');
  const translated = ymd(d.translated);
  if (!isDate(translated)) err('translated must be a date (YYYY-MM-DD)');
  // A draft (reviewed: false) waits for a fluent reviewer. It is checked like
  // any translation (no facts, no new numbers, a real hash), but it never
  // shows on the site and never builds a page (#1101).
  if (isDraft(d)) {
    if (d.reviewer != null && !ROLE_ID.test(d.reviewer)) err('reviewer must be a role ID like es-reviewer-1, never a name');
    if (d.second_review != null) err('a draft has no second_review yet; add it after the first reviewer marks it reviewed');
    warn(`draft: not reviewed yet, so it is hidden and the English shows. A fluent reader checks it, then sets reviewed to the date and reviewer to their role ID${t.highStakes ? ', and a second reader adds second_review (high stakes)' : ''}.`);
    for (const k of Object.keys(d)) if (!KNOWN_FIELDS.includes(k)) warn(`unknown field ${k}`);
    return { errors, warnings };
  }
  const reviewed = ymd(d.reviewed);
  if (!isDate(reviewed)) err('reviewed must be a date (YYYY-MM-DD), or false for a draft that stays hidden; nothing goes on the site before a fluent person checks it');
  if (today && isDate(reviewed) && reviewed > today) err(`reviewed ${reviewed} is in the future`);
  if (isDate(translated) && isDate(reviewed) && reviewed < translated) err('reviewed is before translated');
  if (!ROLE_ID.test(d.reviewer ?? '')) err('reviewer must be a role ID like es-reviewer-1, never a name');
  const second = d.second_review;
  if (second != null) {
    if (typeof second !== 'object' || !ROLE_ID.test(second.reviewer ?? '') || !isDate(ymd(second.reviewed))) err('second_review needs reviewer (a role ID) and reviewed (a date)');
    else if (second.reviewer === d.reviewer) err('second_review must be a different reviewer');
  } else if (t.highStakes) {
    err('is high stakes (the same rules as the High stakes check), so it needs second_review from a second fluent reader');
  }
  for (const k of Object.keys(d)) if (!KNOWN_FIELDS.includes(k)) warn(`unknown field ${k}`);
  if (t.currentHash && HASH.test(d.english_hash ?? '') && d.english_hash !== t.currentHash) {
    warn(`stale: the English changed since this was reviewed (english_hash ${d.english_hash}, now ${t.currentHash}). ${t.highStakes ? 'High stakes, so it is hidden and the English shows until a reviewer checks it again.' : `It shows with a "this part changed" note for up to ${STALE_GRACE_DAYS} days after the English changed, then the English shows.`}`);
  }
  return { errors, warnings };
}

// The first date the English source changed after a translation was
// reviewed, from git. null when there is no change, or when git cannot say
// (a shallow clone), so the caller can be careful.
export function firstChangeAfter(file, since, { root = REPO_ROOT } = {}) {
  try {
    const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (git('rev-parse', '--is-shallow-repository') === 'true') return undefined;
    const dates = git('log', `--since=${since}T23:59:59`, '--format=%cs', '--reverse', '--', file).split('\n').filter(Boolean);
    return dates[0] ?? null;
  } catch { return undefined; }
}

// What the site does with a translation:
//   'current'     show it
//   'stale-shown' show it with a "this part changed" note
//   'hidden'      show the English instead
// `staleSince` is when the English changed (undefined if unknown).
export function translationState({ storedHash, currentHash, highStakes, staleSince, today }) {
  if (!currentHash || storedHash === currentHash) return 'current';
  if (highStakes) return 'hidden';
  if (!staleSince || !today) return 'hidden';
  return today <= addDays(staleSince, STALE_GRACE_DAYS) ? 'stale-shown' : 'hidden';
}

// The translation a page should use, or null to show the English. Only for
// published languages, only for files with no errors, never when hidden.
// Returns { values, stale, reviewed, reviewer, method, file }.
export function loadTranslation(lang, of, { root = REPO_ROOT, today, published = PUBLISHED } = {}) {
  if (!published.includes(lang)) return null;
  const file = [`${TRANSLATIONS_DIR}/${lang}/${of}.yaml`, `${TRANSLATIONS_DIR}/${lang}/${of}.yml`].find((f) => fs.existsSync(path.join(root, f)));
  if (!file) return null;
  const t = readTranslation(file, { root });
  if (isDraft(t.data) || translationProblems(t, { today }).errors.length) return null;
  const stale = t.currentHash !== t.data.english_hash;
  const staleSince = stale ? firstChangeAfter(t.source, ymd(t.data.reviewed), { root }) : null;
  const state = translationState({ storedHash: t.data.english_hash, currentHash: t.currentHash, highStakes: t.highStakes, staleSince, today });
  if (state === 'hidden') return null;
  return { values: t.values, stale: state === 'stale-shown', reviewed: ymd(t.data.reviewed), reviewer: t.data.reviewer, method: t.data.method, file };
}

// One translated field of a record, or the English when there is no usable
// translation. Facts are never looked up here.
export function translatedField(record, lang, key, opts = {}) {
  if (lang === DEFAULT_LOCALE || FACT_FIELDS.includes(key)) return record[key];
  const kind = record._file?.split('/')[0];
  const slug = record._file?.split('/')[1]?.replace(/\.ya?ml$/, '');
  const t = kind && slug ? loadTranslation(lang, `${kind}/${slug}`, opts) : null;
  return t?.values?.[key] ?? record[key];
}
