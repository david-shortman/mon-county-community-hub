# 2026-10-30: "What happens next" on listing cards

- **Considered:** #159. People stall between "here is a phone number" and getting help. Telling them what to have ready and what the first call is like makes the call easier.
- **Chose:** four optional fields on resource records: `what_to_bring` (a list), `what_happens`, `best_time` and `if_you_want_help` (resource slugs, so each helper brings its own source). A small `WhatHappensNext.astro` box shows on resource and place cards, only with the fields a record has. `npm run check-content` validates them and checks that each helper slug exists.
- **Shipped:** the fields, the box, the schema in `content/README.md`, and the first two records: starting Mon Power and Hope Gas service, from their own pages, re-read today. Their "have this ready" sentences moved out of `what_to_do` into the list.
- **Next:** fill the fields for shelter, food and utility bill programs as they are re-checked (a `for:duet` follow-up). Those PRs wait for David.
