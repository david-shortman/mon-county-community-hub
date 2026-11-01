# Keep following robots.txt strictly

- **Date:** 2026-11-01
- **Decided by:** David
- **Decision:** The site keeps following each website's robots.txt and known terms for automated reads, with no exceptions, as described in [`docs/operations/automated-reads.md`](../operations/automated-reads.md). That means some things stay manual: city events no longer arrive on their own, and the Mon County unemployment number stays frozen at its last saved value with the date it was read (BLS blocks automated reads). People can still check and update these by hand.
- **Why:** Asked during the November 1 sprint whether to exempt sources like BLS or the city calendar, David chose to keep it strict. Respecting a site's stated rules matters more than having a number update on its own.
