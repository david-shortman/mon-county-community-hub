// Contract check for the open data API (#72). Runs after `npm run build`.
// Exits 1 when the v1 shape lost a field, or when the built files under
// dist/api/v1/ do not match it.
//
// The rule (docs/architecture/adr/0003-static-api-and-mcp.md): within v1 we
// only ADD fields. Removing or renaming a field breaks apps that read it, so
// it needs a new /api/v2/ with v1 kept up for at least 6 months.
// To add a field: add it to TYPES in src/lib/api.mjs and to
// src/lib/api-contract-v1.json in the same PR.
import fs from 'node:fs';
import path from 'node:path';
import { TYPES, fieldPaths } from '../src/lib/api.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const contract = JSON.parse(fs.readFileSync(path.join(here, '../src/lib/api-contract-v1.json'), 'utf8'));
const dist = path.join(here, '../dist/api/v1');
const RULE = 'Within v1, fields are only added, never removed or renamed (docs/architecture/adr/0003-static-api-and-mcp.md). Put the field back, or plan an /api/v2/.';
const errors = [];

// 1. The shape in code still has every field the saved contract promises,
//    and every field in code is written down in the contract.
const now = fieldPaths();
for (const [type, fields] of Object.entries(contract.fields)) {
  if (!now[type]) { errors.push(`type "${type}" was removed. ${RULE}`); continue; }
  for (const f of fields) if (!now[type].includes(f)) errors.push(`${type}: field "${f}" was removed or renamed. ${RULE}`);
}
for (const [type, fields] of Object.entries(now)) {
  const saved = contract.fields[type] ?? [];
  for (const f of fields) if (!saved.includes(f)) errors.push(`${type}: new field "${f}" is not in src/lib/api-contract-v1.json yet. Add it there too.`);
}

// Field paths actually present in a JSON value.
function pathsOf(value, prefix = '', acc = new Set()) {
  if (Array.isArray(value)) { for (const v of value) if (v && typeof v === 'object') pathsOf(v, `${prefix}[]`, acc); return acc; }
  for (const [k, v] of Object.entries(value)) {
    const p = prefix ? `${prefix}.${k}` : k;
    acc.add(p.replace(/^\[\]\./, ''));
    if (v && typeof v === 'object') pathsOf(v, p, acc);
  }
  return acc;
}
const read = (f) => JSON.parse(fs.readFileSync(path.join(dist, f), 'utf8'));

// 2. The built files match the shape.
if (!fs.existsSync(dist)) errors.push('dist/api/v1 is missing. Run `npm run build` first.');
else {
  const index = read('index.json');
  for (const f of contract.index) if (!pathsOf(index).has(f)) errors.push(`index.json: field "${f}" is missing. ${RULE}`);
  if (!fs.existsSync(path.join(dist, 'openapi.yaml'))) errors.push('openapi.yaml is missing');
  for (const [type, t] of Object.entries(TYPES)) {
    const listed = index.types.find((x) => x.name === type);
    if (!listed) { errors.push(`index.json does not list type ${type}`); continue; }
    const all = read(`${type}.json`);
    if (all.length !== listed.count) errors.push(`${type}.json has ${all.length} records but index.json says ${listed.count}`);
    const allowed = new Set(now[type]);
    const ids = new Set();
    for (const r of all) {
      const id = r[t.id];
      if (!id || ids.has(id)) errors.push(`${type}.json: missing or repeated ${t.id} "${id}"`);
      ids.add(id);
      for (const f of t.required) if (r[f] == null) errors.push(`${type}/${id}: missing required field ${f}`);
      for (const p of pathsOf(r)) if (!allowed.has(p)) errors.push(`${type}/${id}: field "${p}" is not in the v1 shape`);
      const file = path.join(dist, type, `${id}.json`);
      if (!fs.existsSync(file)) errors.push(`${type}/${id}.json is missing`);
      else if (JSON.stringify(read(`${type}/${id}.json`)) !== JSON.stringify(r)) errors.push(`${type}/${id}.json differs from its entry in ${type}.json`);
    }
    if (JSON.stringify(all).includes('—')) errors.push(`${type}.json contains an em dash`);
  }
}

if (errors.length) {
  console.error(`API contract check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`API contract check: v1 shape intact, ${Object.keys(TYPES).length} types match the built files.`);
