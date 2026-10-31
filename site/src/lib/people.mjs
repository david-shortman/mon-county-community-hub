// The Find your people directory (#263): recurring groups and free places to
// sit, from content/places records with kind `group` or `library`.
import { loadAllPlaces, placeStatus, AREAS } from './places.mjs';

// What you're into: the finder's first question and the page's sections.
// Each bucket gathers a few `interests` values from the records.
export const BUCKETS = [
  { key: 'games-books', label: 'Games, books and writing', interests: ['games', 'books'] },
  { key: 'arts', label: 'Art, music, dance, crafts and theater', interests: ['arts', 'music', 'dance', 'crafts', 'theater'] },
  { key: 'active', label: 'Getting outside and moving', interests: ['outdoors', 'running', 'cycling', 'sports'] },
  { key: 'social', label: 'Meeting people and eating together', interests: ['food', 'newcomers', 'lgbtq'], fallback: ['social'] },
  { key: 'learning', label: 'Learning and languages', interests: ['learning', 'languages'] },
  { key: 'growing', label: 'Growing things', interests: ['growing'] },
  { key: 'service', label: 'Helping out', interests: ['service'] },
  { key: 'families', label: 'With kids', interests: ['families'] },
];

export const TAG_LABELS = {
  'come-alone': 'Fine to come alone',
  beginners: 'Beginners welcome',
  free: 'Free',
  weekly: 'Every week',
  'family-friendly': 'Family friendly',
  growing: 'Growing',
  'step-free': 'Step-free entrance',
};

// How often it meets, for the finder's second question: weekly, monthly or
// drop-in (a place you can go any open hour). Read from tags and the
// `regular` words; "other" when the source gives no pattern.
export function rhythm(p) {
  if (p.kind === 'library') return 'drop-in';
  if (p.tags?.includes('weekly')) return 'weekly';
  const words = (p.regular ?? []).join(' ').toLowerCase();
  if (/\bmonth|\bmonthly/.test(words)) return 'monthly';
  if (/\bevery (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\bweekly|mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays/.test(words)) return 'weekly';
  return 'other';
}

let cache;
export function loadDirectory() {
  cache ??= (() => {
    const all = loadAllPlaces();
    const bySlug = Object.fromEntries(all.map((p) => [p.slug, p]));
    const live = (p) => placeStatus(p).status !== 'closed';
    const groups = all.filter((p) => p.kind === 'group' && live(p)).map((p) => ({ ...p, venueRecord: p.venue ? bySlug[p.venue] : null }));
    const libraries = all.filter((p) => p.kind === 'library' && live(p));
    // Buildings whose weekly happenings include a meal (#263, eat with others).
    const meals = all.filter((p) => !['group', 'library'].includes(p.kind) && live(p) && (p.regular ?? []).some((r) => /\b(lunch|dinner|supper|breakfast|potluck|meal)/i.test(r)));
    return { groups, libraries, meals, bySlug };
  })();
  return cache;
}

// Groups in a bucket, active ones first, then A to Z.
export function inBucket(groups, bucket) {
  const rank = (p) => (placeStatus(p).status === 'active' ? 0 : 1);
  const other = BUCKETS.filter((b) => b !== bucket).flatMap((b) => b.interests);
  const fits = (p) => {
    const i = p.interests ?? [];
    // `social` alone puts a group here only when it fits no other section.
    return i.some((x) => bucket.interests.includes(x)) || (bucket.fallback && i.some((x) => bucket.fallback.includes(x)) && !i.some((x) => other.includes(x)));
  };
  return groups.filter(fits).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

// Parts of the county where we have found no free place to sit and no group
// that meets there (the gap map's first half).
export function areasWithout({ groups, libraries }) {
  const covered = new Set([...groups, ...libraries].map((p) => p.area));
  return AREAS.filter(([k]) => !covered.has(k)).map(([, label]) => label);
}
