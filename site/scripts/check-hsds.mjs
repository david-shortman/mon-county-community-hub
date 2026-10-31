// Checks the Open Referral HSDS export (#73). Runs after `npm run build`.
//
// 1. Validates every organization and service in dist/api/v1/hsds/ against
//    Open Referral's published HSDS 3.1.1 schema. The schema files are
//    fetched from Open Referral at a pinned version, not copied here: they are
//    under CC BY-SA, and our repo keeps ShareAlike material out. If they cannot
//    be fetched (no network), this part is skipped with a warning; the daily
//    CI run has network.
// 2. Ids are stable: UUID v5 gives the same id for the same slug on every
//    build, checked against a saved value.
// 3. The CSV tables match datapackage.json and the JSON export.
import fs from 'node:fs';
import path from 'node:path';
import { HSDS_VERSION, NAMESPACE, idFor, uuidv5 } from '../src/lib/hsds.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const dist = path.join(here, '../dist/api/v1/hsds');
const SCHEMA_BASE = `https://raw.githubusercontent.com/openreferral/specification/${HSDS_VERSION}/schema/compiled/`;
const errors = [];
const warnings = [];
const read = (f) => JSON.parse(fs.readFileSync(path.join(dist, f), 'utf8'));

// --- 2. Stable ids. If these change, every app that stored our ids breaks.
if (uuidv5('www.example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8') !== '2ed6657d-e927-568b-95e1-2665a8aea6a2') errors.push('uuidv5() does not match the RFC 4122 test value');
if (NAMESPACE !== uuidv5('https://everythingmorgantown.org/', '6ba7b811-9dad-11d1-80b4-00c04fd430c8')) errors.push('the HSDS id namespace changed; ids must never change');
if (idFor('organization', 'west-virginia-211') !== idFor('organization', 'west-virginia-211')) errors.push('ids are not stable between calls');

// --- 1. A small JSON Schema validator for the keywords HSDS uses:
// type, properties, required, enum, format and items.
const FORMAT = {
  uuid: (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v),
  uri: (v) => { try { return Boolean(new URL(v).protocol); } catch { return false; } },
  email: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
  date: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v),
  'date-time': (v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(v),
};
const typeOf = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
function validate(value, schema, at, out) {
  if (!schema || typeof schema !== 'object') return;
  const types = [].concat(schema.type ?? []);
  if (types.length) {
    const t = typeOf(value);
    const ok = types.some((x) => x === t || (x === 'integer' && Number.isInteger(value)) || (x === 'number' && t === 'number'));
    if (!ok) { out.push(`${at}: should be ${types.join(' or ')}, got ${t}`); return; }
  }
  if (schema.enum && !schema.enum.includes(value)) out.push(`${at}: "${value}" is not one of ${schema.enum.join(', ')}`);
  if (schema.format && typeof value === 'string' && FORMAT[schema.format] && !FORMAT[schema.format](value)) out.push(`${at}: "${value}" is not a valid ${schema.format}`);
  if (typeOf(value) === 'object') {
    for (const r of schema.required ?? []) if (value[r] == null) out.push(`${at}: missing required ${r}`);
    for (const [k, v] of Object.entries(value)) {
      if (schema.properties && !(k in schema.properties)) out.push(`${at}: ${k} is not an HSDS field`);
      else validate(v, schema.properties?.[k], `${at}.${k}`, out);
    }
  }
  if (Array.isArray(value) && schema.items) value.forEach((v, i) => validate(v, schema.items, `${at}[${i}]`, out));
}

async function fetchSchema(name) {
  const res = await fetch(`${SCHEMA_BASE}${name}.json`, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

if (!fs.existsSync(dist)) errors.push('dist/api/v1/hsds is missing. Run `npm run build` first.');
else {
  const organizations = read('organizations.json');
  const services = read('services.json');
  try {
    const [orgSchema, serviceSchema] = await Promise.all([fetchSchema('organization'), fetchSchema('service')]);
    const out = [];
    organizations.forEach((o) => validate(o, orgSchema, `organizations/${o.id}`, out));
    services.forEach((s) => validate(s, serviceSchema, `services/${s.id}`, out));
    errors.push(...out.map((e) => `HSDS ${HSDS_VERSION}: ${e}`));
  } catch (err) {
    warnings.push(`could not fetch the HSDS ${HSDS_VERSION} schema (${err.message}); skipped schema validation`);
  }

  // Ids are unique, every per-record file matches its list entry, and every
  // service points at a real organization.
  const orgIds = new Set();
  for (const o of organizations) {
    if (orgIds.has(o.id)) errors.push(`organization id ${o.id} is used twice`);
    orgIds.add(o.id);
    if (JSON.stringify(read(`organizations/${o.id}.json`)) !== JSON.stringify(o)) errors.push(`organizations/${o.id}.json differs from organizations.json`);
  }
  const serviceIds = new Set();
  for (const s of services) {
    if (serviceIds.has(s.id)) errors.push(`service id ${s.id} is used twice`);
    serviceIds.add(s.id);
    if (!orgIds.has(s.organization_id)) errors.push(`service ${s.name} has no organization in the export`);
    if (s.status !== 'active') errors.push(`service ${s.name} status should be active`);
    if (JSON.stringify(read(`services/${s.id}.json`)) !== JSON.stringify(s)) errors.push(`services/${s.id}.json differs from services.json`);
  }

  // --- 3. CSV tables match datapackage.json, and row counts match the JSON.
  const pkg = read('datapackage.json');
  if (pkg.licenses?.[0]?.name !== 'CC-BY-4.0') errors.push('datapackage.json must name CC-BY-4.0');
  const counts = {
    organizations: organizations.length,
    services: services.length,
    phones: organizations.reduce((n, o) => n + (o.phones?.length ?? 0), 0) + services.reduce((n, s) => n + (s.phones?.length ?? 0), 0),
    schedules: services.reduce((n, s) => n + (s.schedules?.length ?? 0), 0),
  };
  for (const r of pkg.resources) {
    const text = fs.readFileSync(path.join(dist, r.path), 'utf8');
    const header = text.split('\r\n')[0];
    if (header !== r.schema.fields.map((f) => f.name).join(',')) errors.push(`${r.path}: header does not match datapackage.json`);
    // Count rows: a record ends at a CRLF that is not inside quotes.
    let rows = 0, quoted = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '"') quoted = !quoted;
      else if (!quoted && text[i] === '\r' && text[i + 1] === '\n') rows++;
    }
    if (rows - 1 !== counts[r.name]) errors.push(`${r.path}: ${rows - 1} rows, expected ${counts[r.name]}`);
  }
  if (JSON.stringify([organizations, services]).includes('—')) errors.push('the export contains an em dash');
}

for (const w of warnings) console.warn(`warning: ${w}`);
if (errors.length) {
  console.error(`HSDS export check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`HSDS export check: valid against HSDS ${HSDS_VERSION}${warnings.length ? ' (schema not fetched)' : ''}, stable ids, tables match.`);
