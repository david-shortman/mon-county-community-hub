// The public data API, v1 (#72, ADR 0003). The build writes static JSON next
// to the site under /api/v1/, from the same files the pages use, so the API
// can never disagree with the site.
//
// TYPES below is the v1 shape: every record type and every field it may
// carry. Records are trimmed to these fields, the OpenAPI file is made from
// them, and scripts/check-api.mjs compares them with the saved copy in
// api-contract-v1.json. Within v1 we only ADD fields. Removing or renaming
// one is a breaking change and needs /api/v2/ (see docs/architecture/adr/0003).
import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR, loadCalendarWithFeeds, loadDir, todayYmd, ymd } from './content.mjs';

export const API_VERSION = 'v1';
export const SITE_URL = 'https://everythingmorgantown.org';
export const API_BASE = `${SITE_URL}/api/v1/`;
export const REPO_URL = 'https://github.com/david-shortman/mon-county-community-hub';

const str = (description, extra = {}) => ({ type: 'string', description, ...extra });
const date = (description) => ({ type: 'string', format: 'date', description });
const list = (description) => ({ type: 'array', items: { type: 'string' }, description });

// Where a fact came from (ADR 0002). Every record has at least one.
const SOURCES = {
  type: 'array',
  description: 'Public pages that back up this record. Check them before you act.',
  items: {
    type: 'object',
    required: ['url', 'checked'],
    properties: {
      url: str('A public page a person can open to check the facts', { format: 'uri' }),
      checked: date('Date (YYYY-MM-DD, Morgantown time) the facts were last checked against this page'),
      name: str('Who published the page, when it is not clear from the address'),
    },
  },
};

// The needs register's shape comes straight from its JSON Schema (#74).
const NEED = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'schemas/need.schema.json'), 'utf8'));

export const TYPES = {
  orgs: {
    description: 'Organizations: nonprofits, government offices, schools, community groups and others.',
    id: 'slug',
    required: ['name', 'slug', 'kind', 'summary', 'topics', 'area', 'sources'],
    properties: {
      name: str('Name of the organization'),
      slug: str('Stable id, used in the record URL'),
      kind: str('What kind of group it is', { enum: ['nonprofit', 'government', 'community-group', 'business', 'school', 'faith'] }),
      website: str('Its own website', { format: 'uri' }),
      phone: str('Public main phone number, as the source gives it'),
      summary: str('One or two plain sentences on what it does'),
      topics: list('Topic tags (see content/doors.yaml)'),
      area: str('Where it works', { enum: ['morgantown', 'monongalia-county', 'statewide', 'national'] }),
      sources: SOURCES,
    },
  },
  resources: {
    description: 'Things a person can use or do: programs, services, offices and lines.',
    id: 'slug',
    required: ['title', 'slug', 'org', 'topics', 'who_it_is_for', 'what_to_do', 'contact', 'sources'],
    properties: {
      title: str('Short name of the program or service'),
      slug: str('Stable id, used in the record URL'),
      org: str('Slug of the organization that runs it (see orgs)'),
      topics: list('Topic tags (see content/doors.yaml)'),
      who_it_is_for: str('Who it is for, in the source\'s terms. It does not decide who qualifies.'),
      hours: str('Hours in words, as the source gives them'),
      what_to_do: str('How to use it'),
      contact: {
        type: 'object',
        description: 'Public contact details for the program. Never a private person.',
        properties: {
          phone: str('Public phone number'),
          text: str('Public text line'),
          url: str('Web page to act on', { format: 'uri' }),
          url_label: str('Short label for the web link, like "Apply online"'),
          place: str('Street address the source publishes'),
          email: str('Public email address'),
        },
      },
      cost: str('What it costs, as the source says'),
      sources: SOURCES,
    },
  },
  calendar: {
    description: 'Deadlines and dates that have not ended yet: hand-checked entries plus entries pulled from public calendar feeds each day.',
    id: 'slug',
    required: ['title', 'slug', 'starts', 'ends', 'org_name', 'who_it_is_for', 'what_to_do', 'url', 'sources'],
    properties: {
      title: str('What is happening'),
      slug: str('Stable id, used in the record URL'),
      starts: date('First day (YYYY-MM-DD)'),
      ends: date('Last day (YYYY-MM-DD); same as starts for a single day'),
      start_time: str('Start time, 24-hour HH:MM Eastern, only when the source states it'),
      end_time: str('End time, 24-hour HH:MM Eastern'),
      org_name: str('Who runs it, or whose calendar listed it'),
      who_it_is_for: str('Who it is for'),
      what_to_do: str('What to do'),
      url: str('Where a person should go to act', { format: 'uri' }),
      topics: list('Topic tags (see content/doors.yaml)'),
      place: str('Street address the source publishes'),
      phone: str('Public office or program phone number'),
      phone_label: str('Who answers the phone'),
      sources: SOURCES,
      feed: {
        type: 'object',
        description: 'Only on entries pulled from a live calendar feed: which feed and when it was read.',
        properties: {
          id: str('Feed id'),
          name: str('Feed name'),
          url: str('Feed address', { format: 'uri' }),
          page_url: str('The human page for the same calendar', { format: 'uri' }),
          fetched: str('When the feed was read (UTC)', { format: 'date-time' }),
        },
      },
    },
  },
  needs: {
    description: 'The needs register: ranked problems people in Mon County face, each with public, aggregate evidence and its sources. Describes problems; takes no policy side.',
    id: 'slug',
    required: NEED.required,
    properties: NEED.properties,
  },
  corrections: {
    description: 'Every fix we made to a fact, link or out-of-date detail.',
    id: 'id',
    required: ['id', 'date', 'item', 'kind', 'what'],
    properties: {
      id: str('Stable id, from the file name'),
      date: date('Morgantown date the fix went live'),
      item: str('What was fixed'),
      page: str('Site path where the item shows'),
      kind: str('Kind of fix', { enum: ['fact', 'link', 'outdated', 'wording'] }),
      found_by: str('How the problem was found', { enum: ['our-check', 'works-there', 'helper', 'used-it', 'other'] }),
      what: str('What was wrong and what it says now'),
      link: str('The public change that made the fix', { format: 'uri' }),
    },
  },
};

// Dates in YAML parse as Date objects; the API always writes YYYY-MM-DD.
function plainValue(v) {
  if (v instanceof Date) return ymd(v);
  if (Array.isArray(v)) return v.map(plainValue);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, plainValue(x)]));
  return v;
}

// Keep only the fields the v1 shape names, in its order. Nothing internal
// (like `_file`) leaks out.
function trim(value, schema) {
  if (value == null) return undefined;
  if (schema.type === 'object' && schema.properties) {
    const out = {};
    for (const [k, s] of Object.entries(schema.properties)) {
      const v = trim(value[k], s);
      if (v !== undefined) out[k] = v;
    }
    return out;
  }
  if (schema.type === 'array' && schema.items?.type === 'object') return value.map((x) => trim(x, schema.items));
  if (schema.type === 'string' && typeof value !== 'string') return String(value);
  return value;
}

export function shape(type, record) {
  return trim(plainValue(record), { type: 'object', properties: TYPES[type].properties });
}

// All records of one type, shaped, sorted by id.
export async function records(type) {
  let raw;
  if (type === 'calendar') {
    const today = todayYmd();
    raw = (await loadCalendarWithFeeds()).filter((e) => e.ends >= today);
  } else if (type === 'corrections') {
    raw = loadDir('corrections').map((c) => ({ ...c, id: path.basename(c._file).replace(/\.ya?ml$/, '') }));
  } else {
    raw = loadDir(type);
  }
  const id = TYPES[type].id;
  return raw.map((r) => shape(type, r)).sort((a, b) => (a[id] < b[id] ? -1 : a[id] > b[id] ? 1 : 0));
}

// The credit line, read from content/LICENSE.md so the API says exactly what
// the license says.
export function license() {
  const text = fs.readFileSync(path.join(CONTENT_DIR, 'LICENSE.md'), 'utf8');
  const m = text.match(/credit to "([^"]+)" and link to (\S+?)\.?\s/);
  return {
    name: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    credit: m?.[1] ?? 'Everything Morgantown',
    credit_url: m?.[2] ?? SITE_URL,
    code_license: 'MIT',
  };
}

export async function catalog() {
  const types = [];
  for (const [name, t] of Object.entries(TYPES)) {
    types.push({
      name,
      description: t.description,
      count: (await records(name)).length,
      list_url: `${API_BASE}${name}.json`,
      record_url_template: `${API_BASE}${name}/{${t.id}}.json`,
    });
  }
  return {
    name: 'Everything Morgantown open data',
    description: 'Plain-language listings for Morgantown and Monongalia County, WV. Every record lists its sources and the date each was checked. Details change, so check the source before you act.',
    api_version: API_VERSION,
    schema_version: '1.0.0',
    generated: new Date().toISOString(),
    base_url: API_BASE,
    site_url: SITE_URL,
    openapi_url: `${API_BASE}openapi.yaml`,
    docs_url: `${SITE_URL}/data/`,
    source_code: REPO_URL,
    license: license(),
    versioning: 'Within v1, fields are only added, never removed or renamed. A breaking change would get a new /api/v2/, and v1 would stay up for at least 6 months.',
    stale_after_days: 183,
    types,
    exports: [
      { name: 'hsds', description: 'Organizations and services in Open Referral HSDS 3.1 JSON, the format 211 and referral tools read', url: `${API_BASE}hsds/services.json` },
      { name: 'hsds-tabular', description: 'The same in CSV tables, with a Tabular Data Package description', url: `${API_BASE}hsds/datapackage.json` },
    ],
  };
}

// OpenAPI 3.1 description of the files, made from TYPES.
export function openapi() {
  const schemas = Object.fromEntries(
    Object.entries(TYPES).map(([name, t]) => [name, { type: 'object', description: t.description, required: t.required, properties: t.properties }]),
  );
  const paths = { '/index.json': { get: { summary: 'Catalog: types, counts, license and build time', responses: { 200: { description: 'The catalog' } } } } };
  for (const [name, t] of Object.entries(TYPES)) {
    paths[`/${name}.json`] = {
      get: {
        summary: `All ${name} records`,
        description: t.description,
        responses: { 200: { description: 'A list of records', content: { 'application/json': { schema: { type: 'array', items: { $ref: `#/components/schemas/${name}` } } } } } },
      },
    };
    paths[`/${name}/{${t.id}}.json`] = {
      get: {
        summary: `One ${name} record`,
        parameters: [{ name: t.id, in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'The record', content: { 'application/json': { schema: { $ref: `#/components/schemas/${name}` } } } },
          404: { description: 'No record with that id' },
        },
      },
    };
  }
  const lic = license();
  return {
    openapi: '3.1.0',
    info: {
      title: 'Everything Morgantown open data',
      version: '1.0.0',
      description: 'Static JSON files, rebuilt every morning. No key, no sign-up. Every record lists its sources and checked dates. Check the source before you act.',
      license: { name: lic.name, url: lic.url },
    },
    servers: [{ url: API_BASE.replace(/\/$/, '') }],
    paths,
    components: { schemas },
  };
}

// The v1 shape as a flat list of field paths, for the contract check.
export function fieldPaths() {
  const out = {};
  const walk = (schema, prefix, acc) => {
    for (const [k, s] of Object.entries(schema.properties ?? {})) {
      const p = prefix ? `${prefix}.${k}` : k;
      acc.push(p);
      if (s.type === 'object') walk(s, p, acc);
      if (s.type === 'array' && s.items?.type === 'object') walk(s.items, `${p}[]`, acc);
    }
    return acc;
  };
  for (const [name, t] of Object.entries(TYPES)) out[name] = walk(t, '', []);
  return out;
}
