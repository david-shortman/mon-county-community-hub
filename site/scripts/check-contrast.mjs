// Checks WCAG 2.2 contrast for every text and background pair in the site's
// color tokens (site/src/layouts/Base.astro), in light and dark mode. The
// pairs and the math are in src/lib/contrast.mjs, shared with /access/.
// Text pairs need 7:1 (WCAG AAA 1.4.6, our rule since 2026-10-29). Non-text pairs
// (borders, the brick accent) need 3:1.
// Decorative pairs (the ridge line, card lines) are printed but not required.
// Run: npm run check-contrast. Results go in docs/design/identity.md.
import { contrastPairs, NEED as need } from '../src/lib/contrast.mjs';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

let failed = 0;
console.log('| Pair | Kind | Light | Dark |\n|---|---|---|---|');
for (const { f, b, kind, light, dark } of contrastPairs()) {
  const cells = [light, dark].map((r) => {
    const ok = r >= need[kind];
    if (!ok) failed++;
    return `${r.toFixed(2)}:1${need[kind] ? (ok ? ' pass' : ' FAIL') : ''}`;
  });
  console.log(`| \`--${f}\` on \`--${b}\` | ${kind} | ${cells[0]} | ${cells[1]} |`);
}
// Rust (and brick, its old name) is for marks only, never text: it is about 6:1,
// under the 7:1 text rule. Catch any style that sets text `color` to it.
const srcDir = new URL('../src/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const markText = /(^|[\s;{])color:\s*var\(--(brick|rust)\)/;
for (const file of walk(srcDir).filter((p) => /\.(astro|css|mjs)$/.test(p))) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (markText.test(line)) { failed++; console.error(`${file.replace(srcDir, 'src/')}:${i + 1}: text color uses --brick or --rust (marks only, never text). Use --fg or --accent.`); }
  });
}
if (failed) {
  console.error(`\n${failed} problem(s): pairs below our minimum (7:1 text, WCAG AAA; 3:1 non-text), or rust used as text.`);
  process.exit(1);
}
console.log('\nAll required pairs pass: text at 7:1 or more (WCAG AAA), non-text at 3:1 or more.');
