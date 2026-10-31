// Fact records (#122): tier 2 of ADR 0007, for sentences a page needs that
// are not a listing. Each is a record in content/facts/<topic>/<slug>.yaml
// with the usual `sources` (url, checked), plus the source's exact words
// (`quote`) and an optional `recheck_days` (ADR 0007, "still open"): how
// often to re-read it, by how fast it changes. Without it, the 6-month rule
// applies. Pages render facts instead of typing them into templates.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CONTENT_DIR, ymd, todayYmd, oldestChecked, STALE_DAYS } from './content.mjs';

export const FACTS_DIR = path.join(CONTENT_DIR, 'facts');

export function factTopics() {
  return fs.existsSync(FACTS_DIR) ? fs.readdirSync(FACTS_DIR).filter((d) => fs.statSync(path.join(FACTS_DIR, d)).isDirectory()).sort() : [];
}

export function isDue(f, today = todayYmd()) {
  const due = new Date(`${f.checked}T12:00:00Z`);
  due.setUTCDate(due.getUTCDate() + Number(f.recheck_days ?? STALE_DAYS));
  return due.toISOString().slice(0, 10) < today;
}

export function loadFacts(topic) {
  const dir = path.join(FACTS_DIR, topic);
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const file of fs.readdirSync(dir).filter((x) => /\.ya?ml$/.test(x)).sort()) {
    const f = YAML.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (out[f.slug]) throw new Error(`content/facts/${topic}: two files use slug ${f.slug}`);
    const sources = (f.sources ?? []).map((s) => ({ ...s, checked: ymd(s.checked) }));
    out[f.slug] = { ...f, sources, checked: oldestChecked(sources), _file: `facts/${topic}/${file}` };
  }
  return out;
}

// A fact by slug. Throws when it is missing, so a page never ships a gap.
export function factsFor(topic) {
  const all = loadFacts(topic);
  return (slug) => {
    if (!all[slug]) throw new Error(`content/facts/${topic}: no fact with slug ${slug}`);
    return all[slug];
  };
}

// Fact text allows **bold** and [label](https://... or tel:...) links only.
// Everything else is escaped.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function factHtml(text) {
  return esc(text)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|tel:)[^)\s]+)\)/g, '<a href="$2">$1</a>');
}
