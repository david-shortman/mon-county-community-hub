import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served from GitHub Pages at the custom domain everythingmorgantown.org (#89).
export default defineConfig({
  site: 'https://everythingmorgantown.org',
  trailingSlash: 'ignore',
  // Inline the CSS so a phone on a slow connection paints in one request.
  build: { inlineStylesheets: 'always' },
  // Printable center flyers (#465) are print copies of a center's page, so
  // they stay out of the sitemap.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/flyer/') })],
});
