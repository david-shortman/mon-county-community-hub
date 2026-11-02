// Share cards (src/lib/share-cards.mjs): one PNG for each guide, at
// /share/<page>.png, drawn at build time from the page's own tags.
import { loadPages, routeOf } from '../../lib/pages.mjs';
import { loadDoors } from '../../lib/content.mjs';
import { cardDoor, cardPath, drawCard, hasCard, isCrisisSource } from '../../lib/share-cards.mjs';

export async function getStaticPaths() {
  // Crisis pages keep the plain picture, so no card file is made for them.
  const sources = import.meta.glob('../**/*.astro', { query: '?raw', import: 'default', eager: true });
  const crisis = new Set(Object.entries(sources).filter(([, src]) => isCrisisSource(src)).map(([file]) => routeOf(file.replace(/^\.\.\//, '../pages/'))));
  const doors = loadDoors();
  const site = (import.meta.env.SITE ?? 'https://everythingmorgantown.org').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return [...(await loadPages()).values()]
    .filter((p) => hasCard(p, p.route) && !crisis.has(p.route))
    .map((p) => ({
      params: { card: cardPath(p.route).replace(/^\/share\//, '') },
      props: { label: p.label, summary: p.summary, door: cardDoor(p, p.route, doors), link: `${site}${p.route.replace(/\/$/, '')}` },
    }));
}

export async function GET({ props }) {
  return new Response(await drawCard(props), { headers: { 'Content-Type': 'image/png' } });
}
