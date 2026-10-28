import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served from GitHub Pages at /mon-county-community-hub until we have a domain.
// When a custom domain is set, change `site` and remove `base`.
export default defineConfig({
  site: 'https://david-shortman.github.io',
  base: '/mon-county-community-hub',
  trailingSlash: 'ignore',
  // Inline the CSS so a phone on a slow connection paints in one request.
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap()],
});
