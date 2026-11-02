// Share cards (src/lib/share-cards.mjs): one PNG for each guide, at
// /share/<page>.png, drawn at build time from the page's own tags.
import { loadPages } from '../../lib/pages.mjs';
import { loadDoors } from '../../lib/content.mjs';
import { cardDoor, cardPath, drawCard, hasCard } from '../../lib/share-cards.mjs';

export async function getStaticPaths() {
  const doors = loadDoors();
  const site = (import.meta.env.SITE ?? 'https://everythingmorgantown.org').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return [...(await loadPages()).values()]
    .filter((p) => hasCard(p, p.route))
    .map((p) => ({
      params: { card: cardPath(p.route).replace(/^\/share\//, '') },
      props: { label: p.label, summary: p.summary, door: cardDoor(p, p.route, doors), link: `${site}${p.route.replace(/\/$/, '')}` },
    }));
}

export async function GET({ props }) {
  return new Response(await drawCard(props), { headers: { 'Content-Type': 'image/png' } });
}
