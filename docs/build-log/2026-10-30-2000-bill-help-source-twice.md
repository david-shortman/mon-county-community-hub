# 2026-10-30: Bill help shows each utility's source once; hours never end in two periods

- **Considered:** the Claude review of #468 flagged two small glitches. On Bill help, step 1 showed the Mon Power and MUB source lines twice: once under each utility and again right after the list (#472). PlaceCard adds a period after the hours, so hours that already end in a period would show two (#471).
- **Chose:** remove the repeated pair after the list and keep the one under each utility, which sits next to the facts it backs. Keep the separate Mon Power source line in step 4, since it backs a different fact. In PlaceCard, strip a trailing period from the hours before adding one. "Call to confirm." stays on every listing with hours, including 24-hour ones, because #453 (David's yes) asked for it next to any hours.
- **Cost:** $0.
