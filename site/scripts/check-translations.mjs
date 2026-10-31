// Checks translation files and language folders (#1083). Part of
// `npm run check-content`. Exits 1 on any error.
//
// - Each file in content/translations/ follows the schema in
//   docs/process/translations.md: a reviewer role, a reviewed date, the
//   hash of the English it was made from, no translated facts.
// - A translation whose English changed is listed as stale. High-stakes ones
//   are hidden on the site until a reviewer checks them again.
// - No page can sit in site/src/pages/<lang>/ until that language is turned
//   on in site/src/lib/i18n.mjs (PUBLISHED).
//
// `node scripts/check-translations.mjs --hash <translation file>` prints the
// current english_hash for a file, for the reviewer to copy in.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { REPO_ROOT, LOCALES, DEFAULT_LOCALE, OTHER_LOCALES, PUBLISHED, englishRoute, pageExists } from '../src/lib/i18n.mjs';
import { listTranslationFiles, readTranslation, translationProblems } from '../src/lib/translations.mjs';

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

if (process.argv[2] === '--hash') {
  const file = path.relative(REPO_ROOT, path.resolve(process.argv[3] ?? '')).split(path.sep).join('/');
  const t = readTranslation(file);
  if (!t.currentHash) { console.error(`${file}: no English source found, so there is nothing to hash`); process.exit(1); }
  console.log(t.currentHash);
  process.exit(0);
}

// Language folders under site/src/pages and whether they may have pages.
export function localeFolderProblems({ root = REPO_ROOT, published = PUBLISHED } = {}) {
  const errors = [];
  for (const lang of published) {
    if (!LOCALES[lang] || lang === DEFAULT_LOCALE) errors.push(`site/src/lib/i18n.mjs: PUBLISHED has ${lang}, which is not in LOCALES`);
  }
  for (const lang of OTHER_LOCALES) {
    const dir = path.join(root, 'site/src/pages', lang);
    if (!fs.existsSync(dir)) continue;
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
    const pages = walk(dir).filter((f) => f.endsWith('.astro'));
    for (const f of pages) {
      const rel = path.relative(root, f).split(path.sep).join('/');
      if (!published.includes(lang)) errors.push(`${rel}: ${LOCALES[lang].name} pages are off (add '${lang}' to PUBLISHED in site/src/lib/i18n.mjs, which is David's call, #1067)`);
      const route = englishRoute(rel.replace(/^site\/src\/pages/, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '/'));
      if (!pageExists(DEFAULT_LOCALE, route, { root })) errors.push(`${rel}: has no English page at ${route}; every translated page matches an English one`);
    }
  }
  return errors;
}

export function checkTranslations({ root = REPO_ROOT, published = PUBLISHED, now = today } = {}) {
  const errors = localeFolderProblems({ root, published });
  const warnings = [];
  let stale = 0;
  const files = listTranslationFiles(root);
  for (const file of files) {
    const t = readTranslation(file, { root });
    const p = translationProblems(t, { today: now });
    errors.push(...p.errors);
    warnings.push(...p.warnings);
    stale += p.warnings.filter((w) => w.includes(': stale:')).length;
  }
  return { errors, warnings, files: files.length, stale };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { errors, warnings, files, stale } = checkTranslations();
  for (const w of warnings) console.warn(`warning: ${w}`);
  if (errors.length) {
    console.error(`check-translations: ${errors.length} error(s)\n- ${errors.join('\n- ')}`);
    process.exit(1);
  }
  const on = PUBLISHED.length ? PUBLISHED.map((l) => LOCALES[l].name).join(', ') : 'none (English only)';
  console.log(`check-translations: ${files} translation file(s), ${stale} stale. Languages on: ${on}.`);
}
