import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Served from GitHub Pages at /mon-county-community-hub until we have a domain.
// When a custom domain is set, change `site` and remove `base`.
export default defineConfig({
  site: 'https://david-shortman.github.io',
  base: '/mon-county-community-hub',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
