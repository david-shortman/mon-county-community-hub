// Page addresses that changed when two duplicate records were merged into one
// (#1170). Each old address gets a small page that sends people on to the
// new one, so old links and bookmarks keep working. Old address on the left,
// new one on the right, both with a trailing slash. Keep sorted.
export const MOVED = {
  '/groups/irs/': '/groups/internal-revenue-service/',
  '/groups/mountain-line-transit/': '/groups/mountain-line-transit-authority/',
  '/groups/north-central-wv-community-action/': '/groups/ncwvcaa/',
};

// True for an old address. The sitemap leaves these out.
export const isMoved = (pathname) => Object.hasOwn(MOVED, pathname.replace(/\/?$/, '/'));
