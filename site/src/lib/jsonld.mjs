// schema.org JSON-LD for the listings on a page (#37), so search engines and
// AI tools read the right group, phone, link and date.
//
// Built from the same records as the cards: each card is an
// <article class="card resource|place|event" id="<slug>">, and this turns the
// cards on a page into one JSON-LD graph. Hidden records (#519) are not
// loaded, so they never get markup.
// - resources: Service, or GovernmentService when a government office runs it,
//   with the organization as provider.
// - calendar: Event only for in-person entries with a `place`. Deadlines and
//   application windows get no Event markup (Google's Event rules).
// - the home page also gets WebSite (the site's name in search results), and
//   every page with a breadcrumb gets a BreadcrumbList that matches it (#1044).
import { loadCalendarWithFeeds, loadDir } from './content.mjs';
import { crumbsFromHtml, breadcrumbNode, websiteNode } from './site-meta.mjs';

const ORG_TYPES = { government: 'GovernmentOrganization', nonprofit: 'NGO', school: 'EducationalOrganization' };
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== '' && !(Array.isArray(v) && !v.length)));

function orgNode(o) {
  return clean({ '@type': ORG_TYPES[o.kind] ?? 'Organization', name: o.name, url: o.website, telephone: o.phone ? String(o.phone) : undefined });
}

function serviceNode(r, org) {
  const c = r.contact ?? {};
  return clean({
    '@type': org?.kind === 'government' ? 'GovernmentService' : 'Service',
    name: r.title,
    description: [r.who_it_is_for, r.what_to_do, r.options?.join('; '), ...(r.notes ?? [])].filter(Boolean).join(' '),
    url: c.url,
    provider: org ? orgNode(org) : undefined,
    availableChannel: clean({
      '@type': 'ServiceChannel',
      serviceUrl: c.url,
      servicePhone: c.phone ? { '@type': 'ContactPoint', telephone: String(c.phone) } : undefined,
      serviceLocation: c.place ? { '@type': 'Place', address: c.place } : undefined,
    }),
  });
}

// "2026-12-12" + "10:00" -> "2026-12-12T10:00:00-05:00", with the Eastern offset for that day.
function eastern(date, time) {
  if (!time) return date;
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'longOffset' }).formatToParts(new Date(`${date}T${time}:00Z`));
  const offset = parts.find((p) => p.type === 'timeZoneName')?.value.replace('GMT', '') || '-05:00';
  return `${date}T${time}:00${offset}`;
}

function eventNode(e) {
  if (!e.place) return null; // deadlines and windows are not events
  return clean({
    '@type': 'Event',
    name: e.title,
    description: e.who_it_is_for,
    startDate: eastern(e.starts, e.start_time),
    endDate: e.end_time ? eastern(e.starts, e.end_time) : e.ends !== e.starts ? e.ends : undefined,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: e.place.split(',')[0], address: e.place },
    organizer: { '@type': 'Organization', name: e.org_name },
    url: e.url,
  });
}

let indexes;
async function load() {
  indexes ??= (async () => {
    const orgs = new Map(loadDir('orgs').map((o) => [o.slug, o]));
    const resources = new Map(loadDir('resources').map((r) => [r.slug, r]));
    const events = new Map((await loadCalendarWithFeeds()).map((e) => [e.slug, e]));
    return { orgs, resources, events };
  })();
  return indexes;
}

const CARD = /<article class="card (resource|place|event)" id="([a-z0-9-]+)"/g;

// The JSON-LD graph for one built page, or null when it has nothing to mark up.
// `home` is true for the home page.
export async function jsonLdForHtml(html, { home = false } = {}) {
  const { orgs, resources, events } = await load();
  const nodes = [];
  const seen = new Set();
  for (const [, kind, slug] of html.matchAll(CARD)) {
    if (seen.has(`${kind}:${slug}`)) continue;
    seen.add(`${kind}:${slug}`);
    if (kind === 'event') {
      const e = events.get(slug);
      const n = e && eventNode(e);
      if (n) nodes.push(n);
    } else {
      const r = resources.get(slug);
      if (r) nodes.push(serviceNode(r, orgs.get(r.org)));
    }
  }
  if (home) nodes.unshift(websiteNode());
  const crumbs = breadcrumbNode(crumbsFromHtml(html));
  if (crumbs) nodes.push(crumbs);
  return nodes.length ? { '@context': 'https://schema.org', '@graph': nodes } : null;
}

// A <script> tag that is safe to put in HTML: "<" can never close it early.
export const jsonLdScript = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
