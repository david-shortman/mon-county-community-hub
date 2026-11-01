// Site-level data for search engines (#1044): the site's name, the
// breadcrumb trail a page shows, and the newest "checked" date on a page.
// Kept free of content loading so astro.config.mjs can use it for the sitemap.
export const SITE_NAME = 'Everything Morgantown';
export const SITE_ORIGIN = 'https://everythingmorgantown.org';

const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

// The trail in the page's visible breadcrumb (components/Breadcrumb.astro),
// as [{ name, href }], or [] when the page shows none.
export function crumbsFromHtml(html) {
  const nav = html.match(/<nav class="crumbs"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  if (!nav) return [];
  return [...nav.matchAll(/<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map(([, href, name]) => ({ href, name: decode(name) }));
}

// schema.org BreadcrumbList for that trail, or null.
export function breadcrumbNode(crumbs) {
  if (crumbs.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: new URL(c.href, SITE_ORIGIN).href })),
  };
}

export const websiteNode = () => ({ '@type': 'WebSite', name: SITE_NAME, url: `${SITE_ORIGIN}/` });

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CHECKED = new RegExp(`\\b[Cc]hecked (?:on )?(${MONTHS.join('|')}) (\\d{1,2}), (20\\d{2})\\b`, 'g');

// The newest "Checked <Month D, YYYY>" date shown on a page, as YYYY-MM-DD,
// or null when the page shows none. Dates after `today` are ignored.
export function newestChecked(html, today = new Date().toISOString().slice(0, 10)) {
  let best = null;
  for (const [, m, d, y] of html.matchAll(CHECKED)) {
    const iso = `${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, '0')}-${d.padStart(2, '0')}`;
    if (iso <= today && (!best || iso > best)) best = iso;
  }
  return best;
}
