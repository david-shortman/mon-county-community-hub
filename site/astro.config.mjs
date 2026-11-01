import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { astroI18n, sitemapI18n, inUnpublishedLocale } from './src/lib/i18n.mjs';
import { isMoved } from './src/lib/moved.mjs';
import { pruneCssIntegration } from './src/lib/prune-css.mjs';

// Served from GitHub Pages at the custom domain everythingmorgantown.org (#89).
export default defineConfig({
  site: 'https://everythingmorgantown.org',
  trailingSlash: 'ignore',
  // Inline the CSS so a phone on a slow connection paints in one request.
  build: { inlineStylesheets: 'always' },
  // Other languages (#1067, #1083): English stays at the root and never gets
  // a prefix. A language gets /<lang>/ pages only once it is in PUBLISHED in
  // src/lib/i18n.mjs. Until then this is English only and nothing changes.
  i18n: astroI18n(),
  // Printable center flyers (#465) are print copies of a center's page, so
  // they stay out of the sitemap. So are embeds (/embed/<widget>/, small pages
  // other sites show in a frame), pages in a language that is off,
  // and old addresses that only send people on (src/lib/moved.mjs).
  integrations: [sitemap({
    filter: (page) => !page.endsWith('/flyer/') && !/\/embed\/.+/.test(page) && !inUnpublishedLocale(page) && !isMoved(new URL(page).pathname),
    ...(sitemapI18n() ? { i18n: sitemapI18n() } : {}),
  }),
  // Drop inlined CSS a page cannot use (slow phones, wave 8). See the file.
  pruneCssIntegration()],
});
