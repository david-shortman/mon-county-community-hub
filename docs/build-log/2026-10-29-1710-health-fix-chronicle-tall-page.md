# 2026-10-29: Chronicle snapshots no longer fail on very tall pages

- **Considered:** skipping tall pages, or switching tall shots to JPEG.
- **Chose:** crop the WebP conversion to the first 16000 pixels of height. WebP cannot encode images taller than 16383 pixels, and the 390 px wide calendar page went past that.
- **Shipped:** fix in `site/scripts/chronicle.mjs`. Health issue #302.
- **Scoreboard:** Health check `actions-main` should pass on the next Chronicle run (check 2026-10-30).
