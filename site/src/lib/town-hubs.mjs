// Town pages (/towns/, #1120): one page for each town and each census place in
// Monongalia County. Almost everything on a town page comes from records we
// already have (resources, places, calendar, bus routes, the bodies on
// /who-decides/ and /meetings/), so each fact keeps its own source. The few
// facts that live only here (a town office, a council's meeting days) carry
// their own source and checked date.
//
// Which places get a page: the Census Bureau's list of places in the county.
// Towns and cities have their own government. Census-designated places (CDPs)
// are named communities with no town government, so the county serves them.
// Never decide that an address is in a place from its mailing address.
import { loadDir } from './content.mjs';
import { loadPlaces } from './places.mjs';
import { pdfPage } from './pdf-pages.mjs';
import { body } from './who-decides.mjs';
import { others, OTHER_CHECKED } from './meetings/others.mjs';

const CHECKED = '2026-10-31';
export const CENSUS_LIST = { url: 'https://www2.census.gov/geo/docs/reference/codes2020/place_by_cou/st54_wv_place_by_county2020.txt', checked: CHECKED, name: 'U.S. Census Bureau, places in Monongalia County (2020)' };
export const CDP_MEANING = { url: 'https://www.census.gov/programs-surveys/bas/information/cdp.html', checked: CHECKED, name: 'U.S. Census Bureau, what a census-designated place is' };

// Who to call, by kind of place. Each line is a resource slug plus an
// optional note. Same records as /who-serves-me/.
const SERVICES = {
  morgantown: [
    ['Police', 'morgantown-police-non-emergency', 'Then press 0.'],
    ['City streets', 'morgantown-streets'],
    ['Water and sewer', 'mub-start-service'],
    ['Trash', 'mon-swa-ask-about-trash', 'We could not confirm how to start city trash pickup yet. The Solid Waste Authority can tell you who serves your address.'],
  ],
  westover: [
    ['Police', 'westover-police-non-emergency'],
    ['Trash and recycling', 'westover-trash'],
    ['Water and sewer', 'mub-start-service'],
  ],
  'star-city': [
    ['Police', 'mecca-non-emergency', 'Star City has no dispatch center of its own and sends calls to this line.'],
    ['Trash', 'star-city-trash'],
    ['Water and sewer', 'mub-start-service'],
  ],
  granville: [
    ['Police', 'granville-police'],
    ['Trash', 'granville-trash'],
    ['Water and sewer', 'mub-start-service'],
  ],
  blacksville: [
    ['Water and police', 'blacksville-town-office', 'We could not confirm who provides water or police here. Ask the town office.'],
    ['Trash', 'mon-swa-ask-about-trash'],
  ],
  county: [
    ['Sheriff', 'mon-county-sheriff-office'],
    ['Police non-emergency, any hour', 'mecca-non-emergency'],
    ['Trash', 'mon-swa-ask-about-trash', 'We could not find a public list of who picks up trash outside town limits. The Solid Waste Authority can tell you who serves your address.'],
    ['Water', 'wv-psc-utility-questions', 'We could not confirm which water company serves each area outside the towns. Ask your landlord or the seller, or ask the state utility agency.'],
  ],
};

// A town's own office, from its own site.
const OFFICES = {
  westover: { text: 'Westover City Hall, 500 Dupont Road.', phone: '304-296-6860', url: 'https://www.westoverwv.org/government', checked: CHECKED },
  'star-city': { text: 'Star City town office, 370 Broadway Avenue. Open 8 a.m. to 4:30 p.m., Monday to Friday. The office closes for lunch from 11:30 a.m. to 12:30 p.m.', phone: '304-599-3550', url: 'https://www.starcitywv.com/', checked: CHECKED },
  granville: { text: 'Granville City Hall, 1245 Main Street. Open 8 a.m. to 4 p.m. daily.', phone: '304-599-5080', url: 'https://townofgranvillewv.gov/city-council/', checked: CHECKED },
};

// A town's own council, beyond the county-wide bodies every page shows.
const meetingRecords = (id) => {
  const o = others.find((x) => x.id === id);
  return o ? { link: o.link, url: o.url, note: o.note, checked: OTHER_CHECKED } : null;
};
const COUNCILS = {
  morgantown: () => {
    const b = body('city-council');
    return { name: b.name, about: `${b.chosen} ${b.does}`, meets: b.meets, records: b.records.map(([link, url]) => ({ link, url })), sources: b.sources, more: '/who-decides/#city-council' };
  },
  westover: () => ({
    name: 'Westover City Council',
    about: 'Six members: three elected by the whole city and one for each of the city\'s three wards.',
    meets: 'First and third Monday of every month, at City Hall, 500 Dupont Road. The public is welcome.',
    records: [meetingRecords('westover')].filter(Boolean),
    sources: [{ url: 'https://www.westoverwv.org/government', checked: CHECKED }],
  }),
  'star-city': () => ({
    name: 'Star City Town Council',
    meets: 'The town posts its next council meeting on its home page, with a link to watch it on Microsoft Teams.',
    records: [{ link: 'Town home page, with the next meeting', url: 'https://www.starcitywv.com/' }, meetingRecords('star-city')].filter(Boolean),
    sources: [{ url: 'https://www.starcitywv.com/', checked: CHECKED }, { url: 'https://www.starcitywv.com/minutes/', checked: OTHER_CHECKED }],
  }),
  granville: () => ({
    name: 'Granville Town Council',
    meets: 'We did not find a meeting schedule on the town\'s site. Call City Hall to ask.',
    records: [meetingRecords('granville')].filter(Boolean),
    sources: [{ url: 'https://townofgranvillewv.gov/meeting-minutes-agendas', checked: OTHER_CHECKED }],
  }),
  blacksville: () => ({
    name: 'Blacksville town government',
    meets: 'We did not find a town website or posted meetings. Call the town office to ask.',
    records: [],
    sources: [{ url: 'https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php', checked: '2026-10-30' }],
  }),
};

// The places. `town` is the name used on records (TOWNS in towns.mjs).
// `communities` are the exact `community` values on content/places records
// that name this place. `stops` are words Mountain Line uses in stop names.
export const HUBS = [
  { slug: 'morgantown', name: 'Morgantown', kind: 'city', full: 'City of Morgantown', services: 'morgantown', org: 'city-of-morgantown', town: 'Morgantown',
    communities: ['Morgantown', 'Wiles Hill, Morgantown', 'Marilla Park, Morgantown', "Dorsey's Knob Park, Morgantown", 'Morgantown (Mountaineer Mall)'], stops: [] },
  { slug: 'westover', name: 'Westover', kind: 'city', full: 'City of Westover', services: 'westover', org: 'city-of-westover', town: 'Westover', communities: ['Westover'], stops: ['Westover'] },
  { slug: 'star-city', name: 'Star City', kind: 'town', full: 'Town of Star City', services: 'star-city', org: 'town-of-star-city', town: 'Star City', communities: ['Star City'], stops: ['Star City'] },
  { slug: 'granville', name: 'Granville', kind: 'town', full: 'Town of Granville', services: 'granville', org: 'town-of-granville', town: 'Granville', communities: ['Granville'], stops: ['Granville'] },
  { slug: 'blacksville', name: 'Blacksville', kind: 'town', full: 'Town of Blacksville', services: 'blacksville', org: 'town-of-blacksville', town: 'Blacksville', communities: ['Blacksville'], stops: ['Blacksville'] },
  { slug: 'booth', name: 'Booth', kind: 'cdp', services: 'county', communities: ['Booth'], stops: ['Booth'] },
  { slug: 'brookhaven', name: 'Brookhaven', kind: 'cdp', services: 'county', town: 'Brookhaven', communities: ['Brookhaven'], stops: ['Brookhaven'] },
  { slug: 'cassville', name: 'Cassville', kind: 'cdp', services: 'county', town: 'Cassville', communities: ['Cassville'], stops: ['Cassville'] },
  { slug: 'cheat-lake', name: 'Cheat Lake', kind: 'cdp', services: 'county', town: 'Cheat Lake', communities: ['Cheat Lake'], stops: ['Cheat Lake'] },
  { slug: 'osage', name: 'Osage', kind: 'cdp', services: 'county', town: 'Osage', communities: ['Osage'], stops: ['Osage'] },
  // Mountain Line spells the stop "Pintress".
  { slug: 'pentress', name: 'Pentress', kind: 'cdp', services: 'county', town: 'Pentress', communities: ['Pentress'], stops: ['Pentress', 'Pintress'] },
];
export const hub = (slug) => HUBS.find((h) => h.slug === slug);
export const KIND_WORDS = { city: 'A city in Monongalia County', town: 'A town in Monongalia County', cdp: 'A named area in Monongalia County, with no town government' };

const fmt = (d) => String(d).slice(0, 10);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Everything a town page shows. `calendar` is the merged calendar list.
export function hubData(h, { calendar = [], resources = loadDir('resources'), orgs = loadDir('orgs'), places = loadPlaces() } = {}) {
  const r = (slug) => resources.find((e) => e.slug === slug);
  const services = SERVICES[h.services].map(([what, slug, note]) => {
    const e = r(slug);
    if (!e) return null;
    return { what, title: e.title, phone: e.contact?.phone, url: e.contact?.url, note, sources: e.sources.map((s) => ({ ...s, checked: fmt(s.checked) })), slug };
  }).filter(Boolean);
  const org = h.org ? orgs.find((o) => o.slug === h.org) : null;
  const council = COUNCILS[h.slug]?.() ?? null;
  const county = ['county-commission', 'school-board'].map(body);
  const near = places.filter((p) => h.communities.includes(p.community) && p.kind !== 'group')
    .sort((a, b) => (a.kind === 'library' ? 0 : 1) - (b.kind === 'library' ? 0 : 1) || a.name.localeCompare(b.name));
  const dates = h.town ? calendar.filter((e) => e.town === h.town) : [];
  // Bus routes with a stop named for this place, in Mountain Line's words.
  const routes = [];
  if (h.stops.length) {
    const re = new RegExp(`\\b(${h.stops.map(escape).join('|')})\\b`);
    const d = pdfPage('mountain-line-routes');
    for (const s of d?.sections ?? []) {
      for (const it of s.items ?? []) {
        const stopLine = (it.lines ?? []).find((l) => l.startsWith('Stops along the way') && re.test(l));
        if (!stopLine) continue;
        const stops = stopLine.replace(/^[^:]*:\s*/, '').replace(/\.$/, '').split(/,\s*/).filter((x) => re.test(x));
        routes.push({ name: it.name, stops, url: it.links?.find((l) => l.label === 'Route page')?.url });
      }
    }
  }
  const busSources = pdfPage('mountain-line-routes')?.sources ?? [];
  return { services, office: OFFICES[h.slug] ?? null, org, council, county, near, dates, routes, busChecked: busSources[0] ? fmt(busSources[0].checked) : null };
}
