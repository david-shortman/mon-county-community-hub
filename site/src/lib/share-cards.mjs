// Share cards (link preview images): one 1200 by 630 picture for each guide,
// so a link pasted in a text, a group or a post shows that guide's own name
// and summary, its door (Get care, Living here and so on) with the door's
// icon, and the logo. Drawn at build time from the page's own tags
// (src/lib/pages.mjs), so a new page gets its card with no extra step.
// Free: satori lays the card out and resvg turns it into a PNG, both inside
// the build, with no outside service. Rules: docs/design/identity.md,
// "Share cards".
import fs from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const CARD_W = 1200;
export const CARD_H = 630;
const TEXT_W = CARD_W - 160;

// Pages about domestic or sexual violence keep the plain site picture, the
// same rule Share this follows (a share can leave a trace), whether the
// address or the label says so. Crisis pages (the ones with the crisis strip)
// keep it too: Base.astro skips them, and so does the card builder.
const QUIET = /domestic|sexual|abuse/i;

// A crisis page is one whose source opens <Base crisis ...>. Quoted values
// and {expressions} are dropped first, so a description that says "crisis"
// does not count.
export function isCrisisSource(source) {
  const tag = source.match(/<Base\b(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^>])*>/)?.[0] ?? '';
  return /\scrisis(?=[\s=>/])/.test(tag.replace(/"[^"]*"|'[^']*'|\{[^}]*\}/g, '""'));
}

// The one card for every page that has no card of its own.
export const PLAIN_CARD = '/share.png';

// Which pages get their own card: every tagged page with a label, except the
// quiet ones above.
// Embeds (/embed/) live inside other sites' pages and keep the plain picture.
export function hasCard(tags, route) {
  return Boolean(tags?.label) && !route.startsWith('/embed/') && !QUIET.test(route) && !QUIET.test(tags.label);
}

// The door or lane named on the card. A door's own page skips it, since its
// title is already the door's name.
export function cardDoor(tags, route, doors) {
  const door = doors.bySlug[tags?.door];
  return door && door.page !== route ? door : undefined;
}

// '/help/food/' -> '/share/help/food.png'
export function cardPath(route) {
  return `/share${route.replace(/\/$/, '')}.png`;
}

// What the card says, for og:image:alt and the picture itself.
export function cardAlt({ label, doorName }) {
  return `${label}${doorName ? `, in ${doorName}` : ''}, on Everything Morgantown. The logo: two hills joined by a bridge over the river.`;
}

// Icons for each door and lane, the same line drawings as Icon.astro.
const ICONS = {
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',
  health: 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10zM12 9.5v5M9.5 12h5',
  pin: 'M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5M16 10.5a2.5 2.5 0 1 0 0-5M17 14c2 .3 3.3 2 3.6 4.5',
  hall: 'M3 20h18M5 20v-8M9.5 20v-8M14.5 20v-8M19 20v-8M3.5 10 12 4l8.5 6z',
  bed: 'M3 18V7M3 14h18v4M21 14v-2.5a3 3 0 0 0-3-3h-7v5.5M7 11.5a1.5 1.5 0 1 0 0-.01',
  calendar: 'M4 6.5h16V20H4zM4 10.5h16M8 4v4M16 4v4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v6M12 7.5v.5',
};
const LANE_ICONS = { 'help-now': 'bed', dates: 'calendar', about: 'info' };
export const doorIcon = (door) => (door ? ICONS[door.icon] ?? ICONS[LANE_ICONS[door.slug]] : undefined);

// Press inks only (docs/design/identity.md, docs/design/looks/press.md):
// a hemlock ground, paper for the name and title, pale hemlock for the
// summary, sandstone for the door and the address, and one rust quilt corner.
// Every text color is 7:1 or more on the hemlock (paper 8.9, pale hemlock
// 8.4, sandstone 7.8). Rust is a mark, never text.
const C = { ground: '#24493d', paper: '#f6f1e6', pale: '#e7ece4', sand: '#ece2cd', rust: '#d98c6c' };

// The site folder: two levels up both here (src/lib) and in the built copy
// of this file (dist/chunks), the same way content.mjs finds content/.
const siteDir = new URL('../../', import.meta.url);
const fontsDir = new URL('src/fonts/', siteDir);
let assets;
function load() {
  assets ??= {
    fonts: [
      { name: 'Atkinson', weight: 800, style: 'normal', data: fs.readFileSync(new URL('atkinson-hyperlegible-next-800.ttf', fontsDir)) },
      { name: 'Atkinson', weight: 500, style: 'normal', data: fs.readFileSync(new URL('atkinson-hyperlegible-next-500.ttf', fontsDir)) },
      { name: 'Fraunces', weight: 800, style: 'normal', data: fs.readFileSync(new URL('fraunces-name-800.ttf', fontsDir)) },
      // The site's heading serif, the same cut as public/fonts/newsreader-600.woff2 (OFL-Newsreader.txt).
      { name: 'Newsreader', weight: 600, style: 'normal', data: fs.readFileSync(new URL('newsreader-600.ttf', fontsDir)) },
    ],
    tile: `data:image/svg+xml;base64,${Buffer.from(
      fs.readFileSync(new URL('public/favicon.svg', siteDir), 'utf8').replace(/<!--[\s\S]*?-->\s*/, ''),
    ).toString('base64')}`,
  };
  return assets;
}

const h = (type, style, children, extra = {}) => ({ type, props: { style, children, ...extra } });
const icon = (d, size, color) => ({
  type: 'img',
  props: {
    width: size,
    height: size,
    src: `data:image/svg+xml;base64,${Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`,
    ).toString('base64')}`,
  },
});

// Long titles get smaller type, so up to three lines always fit.
const titleSize = (t) => (t.length <= 28 ? 80 : t.length <= 48 ? 68 : 58);

// The card as a PNG buffer. label and summary come from the page's tags;
// door is the door or lane record from content/doors.yaml; link is the short
// address shown at the bottom (everythingmorgantown.org/grow).
export async function drawCard({ label, summary, door, link }) {
  const { fonts, tile } = load();
  const d = doorIcon(door);
  const tree = h('div', {
    width: CARD_W, height: CARD_H, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    boxSizing: 'border-box', padding: '60px 80px 52px', background: C.ground, fontFamily: 'Atkinson', position: 'relative',
  }, [
    // One quilt corner: a half-square triangle, as on the site's cards.
    h('div', { position: 'absolute', top: 0, left: 0, width: 56, height: 56, backgroundImage: `linear-gradient(135deg, ${C.rust} 50%, transparent 50%)` }, []),
    // The logo: the icon tile and the name, as in the site header.
    // A rule under the name, like the site's masthead.
    h('div', { display: 'flex', alignItems: 'center', paddingBottom: 22, borderBottom: `5px solid ${C.paper}` }, [
      { type: 'img', props: { src: tile, width: 76, height: 76, style: { borderRadius: 4 } } },
      h('div', { marginLeft: 24, fontFamily: 'Fraunces', fontWeight: 800, fontSize: 42, color: C.paper }, 'Everything Morgantown'),
    ]),
    h('div', { display: 'flex', flexDirection: 'column', width: TEXT_W }, [
      door && h('div', { display: 'flex', alignItems: 'center', marginBottom: 18, color: C.sand, fontWeight: 800, fontSize: 32 }, [
        d && icon(d, 38, C.sand),
        h('div', { marginLeft: d ? 14 : 0 }, door.name),
      ].filter(Boolean)),
      h('div', { display: 'block', width: TEXT_W, lineClamp: 3, color: C.paper, fontFamily: 'Newsreader', fontWeight: 600, fontSize: titleSize(label), lineHeight: 1.08 }, label),
      summary && h('div', { display: 'block', width: TEXT_W, lineClamp: 2, marginTop: 22, color: C.pale, fontWeight: 500, fontSize: 32, lineHeight: 1.3 }, summary),
    ].filter(Boolean)),
    h('div', { display: 'flex', width: TEXT_W, color: C.sand, fontWeight: 800, fontSize: 28 }, link),
  ]);
  const svg = await satori(tree, { width: CARD_W, height: CARD_H, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: CARD_W } }).render().asPng();
}
