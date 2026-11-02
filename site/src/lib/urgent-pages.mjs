// Urgent pages: the one list (docs/design/presentation.md, "Weight budget").
// Any page with the crisis strip counts as urgent too. scripts/check-weight.mjs
// holds these pages to 50 KB, and src/layouts/Base.astro keeps the serif
// heading font off them so they stay under it.
// The hard-moment pages the service worker saves for offline use are all here.
export const URGENT = ['index.html', 'stay-tonight/index.html', 'tonight/index.html', 'help/food/', 'utility-bills/index.html', 'after-a-storm/index.html', 'mental-health/index.html', 'drugs-and-alcohol/index.html', 'protective-orders/index.html'];

// `where` is a built file path like "help/food/today/index.html".
export const isUrgentFile = (where) => URGENT.some((u) => (u.endsWith('/') ? where.startsWith(u) : where === u));

// The same test for a page's URL path, like "/help/food/today/".
export const isUrgentPath = (pathname) => isUrgentFile(`${pathname.replace(/^\/+/, '').replace(/\/?$/, '/')}index.html`.replace(/^\/index\.html$/, 'index.html'));
