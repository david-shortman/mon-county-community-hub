// Contrast of the site's color tokens (WCAG 2.2), shared by
// scripts/check-contrast.mjs (which fails the build) and the access page
// (/access/, which prints today's lowest numbers). Reads the tokens from
// site/src/layouts/Base.astro, in light and dark mode.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Next to this file when run by node; from site/ when bundled into the build.
const here = fileURLToPath(new URL('../layouts/Base.astro', import.meta.url));
const css = readFileSync(existsSync(here) ? here : path.join(process.cwd(), 'src/layouts/Base.astro'), 'utf8');
const block = (re) => {
  const m = css.match(re);
  if (!m) throw new Error(`Could not find token block ${re}`);
  return Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((t) => [t[1], t[2]]));
};
export const light = block(/:root \{([^}]*)\}/);
export const dark = { ...light, ...block(/prefers-color-scheme: dark\) \{\s*:root \{([^}]*)\}/) };

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, kind]
export const PAIRS = [
  ['fg', 'bg', 'text'], ['fg', 'card', 'text'], ['fg', 'accent-bg', 'text'],
  ['muted', 'bg', 'text'], ['muted', 'card', 'text'], ['muted', 'accent-bg', 'text'],
  ['accent', 'bg', 'text'], ['accent', 'card', 'text'], ['accent', 'accent-bg', 'text'],
  ['card', 'accent', 'text'],
  // Press inks (#396): sandstone boxes, and step numbers on Cheat water.
  ['fg', 'sand', 'text'], ['muted', 'sand', 'text'], ['accent', 'sand', 'text'],
  ['card', 'water', 'text'],
  ['rust', 'bg', 'non-text'], ['rust', 'card', 'non-text'],
  ['brick', 'bg', 'non-text'], ['brick', 'accent-bg', 'non-text'],
  ['ridge', 'bg', 'decorative'], ['line', 'bg', 'decorative'], ['line', 'card', 'decorative'],
];
export const NEED = { text: 7, 'non-text': 3, decorative: 0 };

// Every pair with its ratio in light and dark.
export const contrastPairs = () => PAIRS.map(([f, b, kind]) => ({ f, b, kind, light: ratio(light[f], light[b]), dark: ratio(dark[f], dark[b]) }));

// The lowest text ratio in each theme, for the access page.
export function lowestText() {
  const text = contrastPairs().filter((p) => p.kind === 'text');
  return { light: Math.min(...text.map((p) => p.light)), dark: Math.min(...text.map((p) => p.dark)) };
}
