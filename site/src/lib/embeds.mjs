// Embeds: small pages that local groups, libraries and offices can put on
// their own sites in an iframe. Each one is a plain static page built every
// morning with the rest of the site: no scripts, no cookies, no outside fonts,
// no tracking. Every item shows its source and the date we checked it, and
// links back to the site. Runbook: docs/operations/embeds.md.
import { loadDoors, upcoming, todayYmd } from './content.mjs';
import { TOWNS } from './towns.mjs';
import { slugify } from './feeds/util.mjs';

// How far ahead the dates widget looks, and how many dates it shows at most.
export const EMBED_DAYS = 31;
export const EMBED_MAX = 10;

// Every topic in content/doors.yaml, as { slug, label }. A widget exists for
// each topic even when it has no dates right now, so a group's embed code
// never breaks when a month is quiet.
export function embedTopics() {
  const out = [];
  const seen = new Set();
  for (const d of loadDoors().doors) {
    for (const [slug, label] of Object.entries(d.topics)) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, label });
    }
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

// Every town the content check accepts, as { slug, name }.
export const embedTowns = () => TOWNS.map((name) => ({ slug: slugify(name), name })).sort((a, b) => a.name.localeCompare(b.name));

// The dates a widget shows: upcoming within EMBED_DAYS, filtered by one topic
// or one town (both optional), at most EMBED_MAX. `total` is how many matched
// before the cut, so the widget can say "see all".
export function embedDates(entries, { topic, town } = {}, today = todayYmd()) {
  const all = upcoming(entries, today, EMBED_DAYS)
    .filter((e) => !topic || (e.topics ?? []).includes(topic))
    .filter((e) => !town || e.town === town);
  return { items: all.slice(0, EMBED_MAX), total: all.length };
}

// The iframe code a group pastes into its own page. `height` is a starting
// point; the group can change it.
export function iframeCode(src, title, height = 600) {
  return `<iframe src="${src}" title="${title}" width="100%" height="${height}" style="border:1px solid #ddd6ca;border-radius:8px;max-width:640px" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
}
