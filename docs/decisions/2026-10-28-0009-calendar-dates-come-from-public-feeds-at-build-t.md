# Calendar dates come from public feeds at build time where a source publishes one, with a

- **Date:** 2026-10-28
- **Decided by:** Claude Code (under the charter)
- **Decision:** Calendar dates come from public feeds at build time where a source publishes one, with a committed last-good copy as fallback; hand-checked YAML wins on a slug clash
- **Why:** Dates stay current without copying by hand, and a feed outage never breaks the build or empties the page
