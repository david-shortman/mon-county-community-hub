// Duplicate records and broken org links (#1170). Many sessions add records at
// once, so the same group can land twice under two slugs. These checks catch
// that in npm run check-content. A duplicate is a warning, since two records
// can share a number on purpose (a city office and its program). A link to an
// org that has no file is an error.

const site = (u) => {
  try { const x = new URL(u); return (x.hostname.replace(/^www\./, '') + x.pathname.replace(/\/+$/, '')).toLowerCase(); } catch { return null; }
};
const digits = (p) => (p == null ? null : String(p).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '') || null);
const words = (t) => (t == null ? null : String(t).trim().toLowerCase().replace(/\s+/g, ' ') || null);

// Records checked and found to be different groups that share a website or
// number on purpose. Each pair with why. Keep sorted.
export const NOT_DUPLICATES = [
  // Two USDA agencies; both link to the shared Service Center locator.
  ['orgs/usda-farm-service-agency.yaml', 'orgs/usda-natural-resources-conservation-service.yaml'],
];
const onPurpose = (files) => NOT_DUPLICATES.some((pair) => files.length === pair.length && pair.every((f) => files.includes(f)));

// Each group of 2 or more records that share a key.
function groups(records, key) {
  const seen = new Map();
  for (const r of records) {
    const k = key(r);
    if (!k) continue;
    if (!seen.has(k)) seen.set(k, []);
    seen.get(k).push(r._file);
  }
  return [...seen].filter(([, files]) => files.length > 1 && !onPurpose(files));
}

// Warnings for likely duplicates among orgs, places and resources.
// Places share phones and addresses on purpose (groups that meet in one
// building), so only their names are compared. Resources often share an
// office's phone and page, so only the same title from the same org counts.
export function duplicateWarnings({ orgs = [], places = [], resources = [] }) {
  const out = [];
  const say = (what, list) => { for (const [k, files] of list) out.push(`${files.join(' and ')}: same ${what} (${k}); merge them into one record if they are the same group (#1170)`); };
  say('org name', groups(orgs, (o) => words(o.name)));
  say('org website', groups(orgs, (o) => site(o.website)));
  say('org phone', groups(orgs, (o) => digits(o.phone)));
  say('place name', groups(places, (p) => words(p.name)));
  say('resource title and org', groups(resources, (r) => (words(r.title) ? `${words(r.title)}, ${r.org ?? 'no org'}` : null)));
  return out;
}

// Every `org:` value anywhere in a parsed record, with where it sits.
export function orgLinks(value, at = '') {
  if (Array.isArray(value)) return value.flatMap((v, i) => orgLinks(v, `${at}[${i}]`));
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([k, v]) => (k === 'org' && typeof v === 'string' ? [{ at: at ? `${at}.org` : 'org', slug: v }] : orgLinks(v, at ? `${at}.${k}` : k)));
}

// Errors for org links with no file in content/orgs/.
export function missingOrgErrors(records, orgSlugs) {
  return records.flatMap((r) => orgLinks(r).filter((l) => !orgSlugs.has(l.slug)).map((l) => `${r._file}: ${l.at} ${l.slug} has no file in content/orgs/`));
}

// Errors for moved pages (src/lib/moved.mjs) whose old address is a live
// group page again, or whose new address is not one.
export function movedErrors(moved, orgSlugs) {
  const out = [];
  for (const [from, to] of Object.entries(moved)) {
    const old = from.match(/^\/groups\/([a-z0-9-]+)\/$/)?.[1];
    const now = to.match(/^\/groups\/([a-z0-9-]+)\/$/)?.[1];
    if (old && orgSlugs.has(old)) out.push(`src/lib/moved.mjs: ${from} is a live group page again; take it out of MOVED`);
    if (now && !orgSlugs.has(now)) out.push(`src/lib/moved.mjs: ${from} sends people to ${to}, which has no org file`);
    if (!/^\/.*\/$/.test(from) || !/^\/.*\/$/.test(to)) out.push(`src/lib/moved.mjs: ${from} and ${to} must start and end with /`);
  }
  return out;
}
