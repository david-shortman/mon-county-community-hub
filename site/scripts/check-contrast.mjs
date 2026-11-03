// Checks WCAG 2.2 contrast for every text and background pair in the site's
// color tokens (site/src/layouts/Base.astro), in light and dark mode. The
// pairs and the math are in src/lib/contrast.mjs, shared with /access/.
// Text pairs need 7:1 (WCAG AAA 1.4.6, our rule since 2026-10-29). Non-text pairs
// (borders, the brick accent) need 3:1.
// Decorative pairs (the ridge line, card lines) are printed but not required.
// Run: npm run check-contrast. Results go in docs/design/identity.md.
import { contrastPairs, NEED as need } from '../src/lib/contrast.mjs';

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
if (failed) {
  console.error(`\n${failed} pair(s) below our minimum (7:1 text, WCAG AAA; 3:1 non-text).`);
  process.exit(1);
}
console.log('\nAll required pairs pass: text at 7:1 or more (WCAG AAA), non-text at 3:1 or more.');
