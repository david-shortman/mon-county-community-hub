# 2026-10-30: Link preview image matches the new icon (#389)

- **Considered:** the link preview image (`share.png`) was a plain green banner, while David's new bridge icon (#390) shipped in the tab and on home screens.
- **Chose:** redraw the preview with the icon beside the site name and one plain line, in token colors only.
- **Shipped:** a new `site/public/share.png` (1200 by 630, about 49 KB), drawn by `site/scripts/make-share-image.mjs` from `favicon.svg` and the heading font, so it can be redrawn when the icon changes. `identity.md` has a new "The icon" section: what it shows, the files, colors, and the rules David set during review. `docs/visibility/README.md` updated.
- **Scoreboard:** none directly. Shared links now look like the rest of the hub.
