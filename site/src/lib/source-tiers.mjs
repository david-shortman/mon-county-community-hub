// The source order (#1092, docs/playbook/source-order.md). content/source-tiers.yaml
// names the sites that are local news (tier 3) or directories and listing
// sites (tier 4). Any other site counts as the owner or another office
// (tiers 1 and 2): we only list the lower tiers, so a new official site needs
// no edit here.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR } from './content.mjs';

export const LOWER_TIERS = ['news', 'directory'];

export function loadSourceTiers(file = path.join(CONTENT_DIR, 'source-tiers.yaml')) {
  const raw = YAML.parse(fs.readFileSync(file, 'utf8')) || {};
  const out = [];
  for (const tier of LOWER_TIERS) for (const s of raw[tier] ?? []) out.push({ tier, host: String(s.host).toLowerCase().replace(/^www\./, ''), name: s.name, note: s.note, ownerOf: s.owner_of ?? [] });
  return out;
}

// 'news', 'directory', or null (the owner or another office).
// file: the record's path under content/, for owner_of.
export function tierOf(url, tiers, file) {
  let host;
  try { host = new URL(url).hostname.toLowerCase().replace(/^www\./, ''); } catch { return null; }
  const hit = tiers.find((t) => host === t.host || host.endsWith(`.${t.host}`));
  if (!hit || (file && hit.ownerOf.includes(file))) return null;
  return hit.tier;
}

// Problems with the list itself: unknown keys, a bad host, a host twice.
export function tierListProblems(file = path.join(CONTENT_DIR, 'source-tiers.yaml')) {
  const raw = YAML.parse(fs.readFileSync(file, 'utf8')) || {};
  const out = [];
  const seen = new Set();
  for (const k of Object.keys(raw)) if (!LOWER_TIERS.includes(k)) out.push(`source-tiers.yaml: unknown group ${k} (use ${LOWER_TIERS.join(' or ')})`);
  for (const tier of LOWER_TIERS) {
    for (const s of raw[tier] ?? []) {
      if (!s?.host || !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(s.host)) out.push(`source-tiers.yaml: ${tier}: host must be a bare site name like dominionpost.com`);
      else if (seen.has(s.host)) out.push(`source-tiers.yaml: ${s.host} is listed twice`);
      else seen.add(s.host);
      if (!s?.name) out.push(`source-tiers.yaml: ${s?.host ?? tier}: needs a name`);
      for (const k of Object.keys(s ?? {})) if (!['host', 'name', 'note', 'owner_of'].includes(k)) out.push(`source-tiers.yaml: ${s.host}: unknown field ${k}`);
      if (s?.owner_of != null && !Array.isArray(s.owner_of)) out.push(`source-tiers.yaml: ${s.host}: owner_of must be a list of files like secondhand/example.yaml`);
    }
  }
  return out;
}

// A record whose every source is news or a directory, with the tier of each.
// Records with no sources are left to the other checks.
export function lowerTierOnly(record, tiers) {
  const urls = (record?.sources ?? []).map((s) => s?.url).filter(Boolean);
  if (!urls.length) return null;
  const found = urls.map((u) => tierOf(u, tiers, record._file));
  return found.every(Boolean) ? [...new Set(found)] : null;
}
