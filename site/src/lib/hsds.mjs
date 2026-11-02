// Open Referral HSDS 3.1 export of our orgs and resources (#73). The field
// mapping and its reasons are in docs/architecture/hsds-mapping.md (#36).
//
// Ids are UUID v5, made from our slugs, so a record keeps the same id on every
// build. We never send 211 taxonomy codes or terms (they are copyrighted).
import crypto from 'node:crypto';
import { loadDir, ymd } from './content.mjs';
import { API_BASE } from './api.mjs';

export const HSDS_VERSION = '3.1.1';

// RFC 4122 UUID v5 (SHA-1 of namespace + name).
export function uuidv5(name, namespace) {
  const ns = Buffer.from(namespace.replace(/-/g, ''), 'hex');
  const hash = crypto.createHash('sha1').update(Buffer.concat([ns, Buffer.from(name, 'utf8')])).digest();
  const b = Buffer.from(hash.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
// Our namespace: UUID v5 of the site address in the standard URL namespace.
// Never change it, or every id changes for everyone who stored them.
const URL_NAMESPACE = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
export const NAMESPACE = uuidv5('https://everythingmorgantown.org/', URL_NAMESPACE);
export const idFor = (kind, slug) => uuidv5(`${kind}:${slug}`, NAMESPACE);

// Newest checked date across a record's sources, as an HSDS date-time. Noon
// UTC is the same calendar day in Morgantown all year.
function lastModified(sources) {
  const newest = (sources ?? []).map((s) => ymd(s.checked)).filter(Boolean).sort().at(-1);
  return newest ? `${newest}T12:00:00Z` : undefined;
}

const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && !v.length)));
const join = (...parts) => parts.filter(Boolean).map((p) => String(p).trim()).join(' ');

function organization(o) {
  const id = idFor('organization', o.slug);
  return clean({
    id,
    name: o.name,
    description: o.summary,
    website: o.website,
    uri: `${API_BASE}orgs/${o.slug}.json`,
    phones: o.phone ? [clean({ id: idFor('organization-phone', o.slug), organization_id: id, number: String(o.phone), type: 'voice' })] : [],
  });
}

function service(r, orgsBySlug) {
  const id = idFor('service', r.slug);
  const c = r.contact ?? {};
  const phones = [];
  if (c.phone) phones.push(clean({ id: idFor('service-phone', r.slug), service_id: id, number: String(c.phone), type: 'voice' }));
  if (c.text) phones.push(clean({ id: idFor('service-text', r.slug), service_id: id, number: String(c.text), type: 'text' }));
  return clean({
    id,
    organization_id: orgsBySlug.has(r.org) ? idFor('organization', r.org) : undefined,
    name: r.title,
    description: join(r.who_it_is_for, r.what_to_do),
    url: c.url,
    email: c.email,
    status: 'active',
    eligibility_description: r.who_it_is_for,
    application_process: r.what_to_do,
    fees_description: r.cost,
    last_modified: lastModified(r.sources),
    phones,
    schedules: r.hours ? [{ id: idFor('service-schedule', r.slug), service_id: id, description: String(r.hours) }] : [],
  });
}

// { organizations, services }: organizations carry their services, and each
// service carries its organization, the way the HSDS API returns them.
export function hsds() {
  const orgs = loadDir('orgs');
  const bySlug = new Map(orgs.map((o) => [o.slug, o]));
  const flatOrgs = new Map(orgs.map((o) => [o.slug, organization(o)]));
  const resources = loadDir('resources');
  // HSDS needs every service to name its organization, so a service whose
  // org is hidden (#519) is left out of this export until the org is back.
  const flatServices = resources.filter((r) => flatOrgs.has(r.org)).map((r) => ({ slug: r.slug, org: r.org, s: service(r, bySlug) }));
  const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const services = flatServices.map(({ org, s }) => ({ ...s, organization: flatOrgs.get(org) })).sort(byId);
  const organizations = [...flatOrgs.entries()]
    .map(([slug, o]) => clean({ ...o, services: flatServices.filter((x) => x.org === slug).map((x) => x.s).sort(byId) }))
    .sort(byId);
  return { organizations, services };
}

// Tabular Data Package: one CSV per HSDS object we fill, plus datapackage.json.
const TABLES = {
  organizations: { fields: ['id', 'name', 'description', 'website', 'uri'], key: 'id' },
  services: {
    fields: ['id', 'organization_id', 'name', 'description', 'url', 'email', 'status', 'eligibility_description', 'application_process', 'fees_description', 'last_modified'],
    key: 'id',
    foreign: [{ fields: 'organization_id', reference: { resource: 'organizations', fields: 'id' } }],
  },
  phones: {
    fields: ['id', 'organization_id', 'service_id', 'number', 'type'],
    key: 'id',
    foreign: [
      { fields: 'organization_id', reference: { resource: 'organizations', fields: 'id' } },
      { fields: 'service_id', reference: { resource: 'services', fields: 'id' } },
    ],
  },
  schedules: {
    fields: ['id', 'service_id', 'description'],
    key: 'id',
    foreign: [{ fields: 'service_id', reference: { resource: 'services', fields: 'id' } }],
  },
};
const FORMATS = { id: 'uuid', organization_id: 'uuid', service_id: 'uuid', website: 'uri', uri: 'uri', url: 'uri', email: 'email' };

export function tableRows() {
  const { organizations, services } = hsds();
  return {
    organizations,
    services,
    phones: [...organizations.flatMap((o) => o.phones ?? []), ...services.flatMap((s) => s.phones ?? [])],
    schedules: services.flatMap((s) => s.schedules ?? []),
  };
}

const cell = (v) => {
  if (v == null) return '';
  const s = String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export function csv(table) {
  const { fields } = TABLES[table];
  const rows = tableRows()[table];
  return [fields.join(','), ...rows.map((r) => fields.map((f) => cell(r[f])).join(','))].join('\r\n') + '\r\n';
}
export const TABLE_NAMES = Object.keys(TABLES);

export function datapackage(license) {
  return {
    profile: 'tabular-data-package',
    name: 'everything-morgantown-hsds',
    title: 'Everything Morgantown listings in Open Referral HSDS',
    description: `Organizations and services in Morgantown and Monongalia County, WV, in the column names of Open Referral HSDS ${HSDS_VERSION}. Details change; check each listing's source before you act. Sources and checked dates for every record are in ${API_BASE}orgs.json and ${API_BASE}resources.json.`,
    homepage: 'https://everythingmorgantown.org/data/',
    version: '1.0.0',
    licenses: [{ name: 'CC-BY-4.0', path: license.url, title: `Creative Commons Attribution 4.0. Credit "${license.credit}" and link to ${license.credit_url}` }],
    sources: [{ title: license.credit, path: license.credit_url }],
    resources: Object.entries(TABLES).map(([name, t]) => ({
      name,
      path: `${name}.csv`,
      profile: 'tabular-data-resource',
      format: 'csv',
      mediatype: 'text/csv',
      encoding: 'utf-8',
      schema: {
        fields: t.fields.map((f) => clean({ name: f, type: 'string', format: FORMATS[f] ?? (f === 'last_modified' ? 'date-time' : undefined) })),
        primaryKey: t.key,
        ...(t.foreign ? { foreignKeys: t.foreign } : {}),
      },
    })),
  };
}
