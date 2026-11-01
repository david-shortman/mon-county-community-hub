// Group pages (/groups/<slug>/, docs/operations/group-pages.md): one page per
// organization in content/orgs, showing what the site says about it, the
// listings it runs, its upcoming dates, and how to ask for a fix. Built from
// the same records as every other page, so it never says more than they do.
// No one is contacted: it is a page a group can find on its own.
import { loadDir, upcoming, todayYmd } from './content.mjs';
import { printSheets } from './printouts.mjs';

// Calendar entries name their group in words (org_name), not by slug, so a
// date belongs to a group only when the name matches exactly.
const sameName = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

// [{ org, name, listings, dates, sheets }] for every org that is not hidden.
// `name` is the org's name, with its slug added when another record shares it.
export function groupPages(calendar = [], today = todayYmd()) {
  const resources = loadDir('resources').filter((r) => r.slug);
  const sheets = printSheets();
  const soon = upcoming(calendar, today, 62);
  return loadDir('orgs')
    .filter((o) => o.slug && o.name)
    .map((org) => {
      const listings = resources.filter((r) => r.org === org.slug).sort((a, b) => a.title.localeCompare(b.title));
      const slugs = new Set(listings.map((r) => r.slug));
      return {
        org,
        listings,
        dates: soon.filter((e) => sameName(e.org_name, org.name)),
        sheets: sheets.filter((s) => s.list.some((r) => slugs.has(r.slug))),
      };
    })
    .sort((a, b) => a.org.name.localeCompare(b.org.name) || a.org.slug.localeCompare(b.org.slug))
    // Two records can carry the same name (a duplicate waiting to be merged).
    // Their pages get the slug in the title, so each title stays unique.
    .map((g, i, all) => ({ ...g, name: all.filter((x) => x.org.name === g.org.name).length > 1 ? `${g.org.name} (${g.org.slug})` : g.org.name }));
}

export const KIND_LABELS = { nonprofit: 'Nonprofit', government: 'Government office', 'community-group': 'Community group', business: 'Business', school: 'School', faith: 'Faith group' };
export const AREA_LABELS = { morgantown: 'Morgantown', 'monongalia-county': 'Monongalia County', statewide: 'West Virginia', national: 'National' };
