// Saved copies of source files that may go offline (#1906). The list lives in
// content/sources/<group>/saved-copies.yaml: each entry names the live url,
// the checksum we read and a Wayback Machine capture. Source lines link the
// capture next to the live address, and readers fall back to it.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR } from './content.mjs';

let byUrl;
export function savedCopies() {
  if (byUrl) return byUrl;
  byUrl = new Map();
  const dir = path.join(CONTENT_DIR, 'sources');
  if (!fs.existsSync(dir)) return byUrl;
  for (const group of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, group, 'saved-copies.yaml');
    if (!fs.existsSync(file)) continue;
    for (const f of YAML.parse(fs.readFileSync(file, 'utf8')).files ?? []) byUrl.set(f.url, f);
  }
  return byUrl;
}

// The saved-copy entry for a live url, or null.
export function savedCopy(url) {
  return savedCopies().get(url) ?? null;
}
