# 2026-11-28: Google Search Console verification tag

- **Considered:** a Domain property (needs a DNS record at the registrar), an uploaded HTML file, or a meta tag on every page.
- **Chose:** a URL prefix property for https://everythingmorgantown.org/ with the meta tag, added in `site/src/layouts/Base.astro`. It needs no DNS access and lives in the repo, so anyone can see why it is there. David owns the property with his own Google account. Free.
- **Shipped:** the `google-site-verification` tag on every page. Next in the same session: verify, submit the sitemap, and import the site into Bing Webmaster Tools from Search Console (also free, no second tag). (#89)
- **Scoreboard:** should end "our pages in search: 0" in the weekly visibility and findability runs. Check 2026-12-13, two weeks after the sitemap goes in.
