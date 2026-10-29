// Checks WCAG 2.2 contrast for every text and background pair in the site's
// color tokens (site/src/layouts/Base.astro), in light and dark mode.
// Text pairs need 7:1 (WCAG AAA 1.4.6, our rule since 2026-10-29). Non-text pairs
// (borders, the brick accent) need 3:1.
// Decorative pairs (the ridge line, card lines) are printed but not required.
// Run: npm run check-contrast. Results go in docs/design/identity.md.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
const block = (re) => {
  const m = css.match(re);
  if (!m) throw new Error(`Could not find token block ${re}`);
  return Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((t) => [t[1], t[2]]));
};
const light = block(/:root \{([^}]*)\}/);
const dark = { ...light, ...block(/prefers-color-scheme: dark\) \{\s*:root \{([^}]*)\}/) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, kind]
const pairs = [
  ['fg', 'bg', 'text'], ['fg', 'card', 'text'], ['fg', 'accent-bg', 'text'],
  ['muted', 'bg', 'text'], ['muted', 'card', 'text'], ['muted', 'accent-bg', 'text'],
  ['accent', 'bg', 'text'], ['accent', 'card', 'text'], ['accent', 'accent-bg', 'text'],
  ['card', 'accent', 'text'],
  ['brick', 'bg', 'non-text'], ['brick', 'accent-bg', 'non-text'],
  ['ridge', 'bg', 'decorative'], ['line', 'bg', 'decorative'], ['line', 'card', 'decorative'],
];
const need = { text: 7, 'non-text': 3, decorative: 0 };

let failed = 0;
console.log('| Pair | Kind | Light | Dark |\n|---|---|---|---|');
for (const [f, b, kind] of pairs) {
  const cells = [light, dark].map((t) => {
    const r = ratio(t[f], t[b]);
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
