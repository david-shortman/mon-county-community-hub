# 2026-10-30: Check orgs and resources before they ship (#259, #8)

- **Considered:** `check-content` checked calendar entries, feed snapshots and doors, but not `content/orgs/` or `content/resources/`. Pages build call, text and map buttons straight from those files (211, 988, door steps), so a typo in a phone number would ship a wrong link with a green build.
- **Chose:** add org and resource checks to the same script, which CI already runs on every PR (`site.yml`), and add orgs and resources to the Health re-check list instead of a new weekly workflow. Health already runs every 4 hours and keeps one issue current, so Duet sees past-due entries in one place. Cost: $0.
- **Shipped:**
  - `site/scripts/check-content.mjs`: required fields, slug format and file name match, unique slugs, `org` slugs that exist, `kind` and `area` from a fixed list, phone and text line format (`211`, `898-211`, `304-555-0100`, `1-877-716-1212`), `hours`, `cost`, `contact.place` and `contact.email` shape, source links, checked dates not in the future, no em dashes. Warnings for unknown fields and sources over 6 months old.
  - `site/scripts/health.mjs`: `content-recheck` now covers orgs and resources too.
  - `content/README.md`: the list of what is checked.
- **Found in the data:** nothing. All 26 orgs and 35 resources pass.
- **Scoreboard:** none directly. Protects every call and text button on the site.
