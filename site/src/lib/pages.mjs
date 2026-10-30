// Every page says where it lives with a `page` export in its frontmatter:
//
//   export const page = {
//     door: 'this-month',     // a door or lane slug from content/doors.yaml
//     topic: 'money',         // a topic of that door (lanes need none)
//     label: 'Money help',    // short name for lists
//     summary: "Can't pay a bill, behind on rent, cash fast",  // one line for lists
//   };
//
// A step inside another page's flow (like the food questions) names its
// `parent` route instead. It takes its door and topic from the parent and is
// left out of lists, since people reach it through the parent.
//
// The build makes door lists, the Topics page and breadcrumbs from these
// tags, so adding a page never means editing the menu (#249). A bad tag
// stops the build with a message that says what to fix.
import { loadDoors } from './content.mjs';

// Pages that sit above the doors, so they carry no tags.
const UNTAGGED = new Set(['/', '/404/', '/search/', '/topics/']);

const modules = import.meta.glob('../pages/**/*.astro');

// '../pages/help/food/index.astro' -> '/help/food/'; '../pages/money.astro' -> '/money/'
export function routeOf(file) {
  const r = file.replace(/^\.\.\/pages/, '').replace(/\.astro$/, '').replace(/(^|\/)index$/, '');
  return r.endsWith('/') ? r : `${r}/`;
}

function problems(route, meta, routes, doors) {
  const out = [];
  if (!meta) return UNTAGGED.has(route) ? [] : ['needs `export const page = { door, topic, label, summary }` in its frontmatter'];
  if (UNTAGGED.has(route)) return ['sits above the doors, so it should not have a `page` export'];
  if (JSON.stringify(meta).includes('\u2014')) out.push('page tags contain an em dash');
  if (!meta.label) out.push('page.label is missing');
  if (meta.parent) {
    if (!routes.has(meta.parent)) out.push(`page.parent ${meta.parent} is not a tagged page`);
    if (meta.door || meta.topic) out.push('a page with a parent takes its door and topic from the parent');
    return out;
  }
  if (!meta.summary) out.push('page.summary is missing');
  const d = doors.bySlug[meta.door];
  if (!d) out.push(`page.door "${meta.door}" is not in content/doors.yaml`);
  else if (d.topics && !(meta.topic in d.topics)) {
    out.push(`page.topic "${meta.topic}" is not a topic of the ${d.name} door (see content/doors.yaml)`);
  } else if (!d.topics && meta.topic) out.push(`${d.name} is a lane, so page.topic is not needed`);
  return out;
}

let cached;
// All tagged pages: { route, door, topic, label, summary, parent, listed }.
export function loadPages() {
  cached ??= (async () => {
    const doors = loadDoors();
    const entries = await Promise.all(
      Object.entries(modules)
        .filter(([file]) => !/\[|\/_/.test(file))
        .map(async ([file, load]) => [routeOf(file), (await load()).page]),
    );
    const routes = new Set(entries.filter(([r, m]) => m && !UNTAGGED.has(r)).map(([r]) => r));
    const errors = entries.flatMap(([r, m]) => problems(r, m, routes, doors).map((p) => `${r}: ${p}`));
    // A door or lane that names its own page must point at a real one.
    const allRoutes = new Set(entries.map(([r]) => r));
    for (const d of [...doors.doors, ...doors.lanes]) {
      if (d.page && !allRoutes.has(d.page)) errors.push(`content/doors.yaml: ${d.slug} page ${d.page} is not a page on the site`);
    }
    if (errors.length) throw new Error(`Page tags need fixing (see site/src/lib/pages.mjs):\n- ${errors.join('\n- ')}`);
    const byRoute = new Map(entries.filter(([, m]) => m).map(([route, m]) => [route, { route, ...m }]));
    // Steps take their door and topic from the top of their parent chain.
    const root = (p, seen = new Set()) => (p.parent && !seen.has(p.route) ? root(byRoute.get(p.parent), seen.add(p.route)) : p);
    for (const p of byRoute.values()) {
      const top = root(p);
      Object.assign(p, { door: top.door, topic: top.topic, listed: !p.parent });
    }
    return byRoute;
  })();
  return cached;
}

const byLabel = (a, b) => a.label.localeCompare(b.label);

// A door's topics that have at least one live page, in doors.yaml order.
// A topic shows only when its page exists, so no one lands on an empty list.
export async function doorTopics(slug) {
  const door = loadDoors().bySlug[slug];
  const pages = [...(await loadPages()).values()].filter((p) => p.listed && p.door === slug);
  if (!door?.topics) return pages.length ? [{ topic: null, label: door?.name, pages: pages.sort(byLabel) }] : [];
  return Object.entries(door.topics)
    .map(([topic, label]) => ({ topic, label, pages: pages.filter((p) => p.topic === topic).sort(byLabel) }))
    .filter((t) => t.pages.length);
}

// Every listed page, A to Z.
export async function allListed() {
  return [...(await loadPages()).values()].filter((p) => p.listed).sort(byLabel);
}

// Where a door or lane lives: its own page once it has one, or its section
// of the Topics page until then.
export function doorHref(d) {
  return d.page ?? `/topics/#${d.slug}`;
}

// The trail above a page: Home, its door or lane, then any parent steps.
// The page itself is left off, since its heading already names it.
export async function breadcrumb(route) {
  const pages = await loadPages();
  const here = pages.get(route);
  if (!here) return [];
  const trail = [];
  for (let p = pages.get(here.parent); p; p = pages.get(p.parent)) trail.unshift({ label: p.label, href: p.route });
  const d = loadDoors().bySlug[here.door];
  if (d) trail.unshift({ label: d.name, href: doorHref(d) });
  return [{ label: 'Home', href: '/' }, ...trail].filter((c) => c.href !== route);
}

// The home page door buttons: each door with the example problems whose
// pages exist, so no example leads to an empty page. A door with none yet
// shows its hint and leads to its section of the Topics page.
export async function doorCards() {
  const pages = await loadPages();
  return loadDoors().doors.map((d) => ({
    ...d,
    href: doorHref(d),
    examples: (d.examples ?? []).filter((e) => pages.has(e.href.split('#')[0])),
  }));
}
