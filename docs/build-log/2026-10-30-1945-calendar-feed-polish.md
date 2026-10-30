# 2026-10-30: Calendar feed polish: NAME, REFRESH-INTERVAL and an escape test

- **Considered:** #108's three fixes from the open data playbook and the PR #91 review: add RFC 7986 `NAME` and `REFRESH-INTERVAL`, put a real host in each event's `UID`, and add a test with `;` and `,` in a summary so the #77 fix stays covered.
- **Chose, on UIDs:** keep `<slug>@mon-county-community-hub`. The site already moved to everythingmorgantown.org, so there is no later move to fold the change into, and a new UID makes every current subscriber see each event twice. RFC 5545 only suggests a domain on the right side; ours is unique in practice. The new test fails if the UID format changes, so it cannot change by accident.
- **Shipped:** `NAME`, `REFRESH-INTERVAL;VALUE=DURATION:P1D` and `X-PUBLISHED-TTL:P1D` next to the `X-WR-` lines in `site/src/lib/ics.mjs`. `site/scripts/test-ics.mjs` runs after every build: a summary with `;`, `,`, a backslash and a line break must be escaped, folded at 75 octets, and read back to the same text, and the same check must catch the old escape from #77. Fixed the #77 build log, which showed the old and new code the same way.
- **Cost:** $0.
