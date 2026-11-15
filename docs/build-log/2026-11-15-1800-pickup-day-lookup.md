# Trash pickup day: Morgantown's address lookup, and where none exists

**Issue:** #2009 (sprint wave 21, address lookups, #529)

We looked for an official pickup day source for every hauler and town (read 2026-11-15):

| Place | Official source | What it gives |
|---|---|---|
| Morgantown, inside city limits | Republic Services' Morgantown page | A "View my service schedule" button: enter an address to see pickup and holiday days. Phone 304-366-8900. |
| Granville | Town of Granville, Community page | Every Monday or Tuesday, depending on location. No street list. |
| Westover | City of Westover, Garbage and Utilities | Recycling the same day as garbage. No days listed. |
| Star City | Town of Star City, Garbage page | No days listed. |
| Outside the towns | none found | Nothing. |

What changed:

- New record `republic-morgantown-trash` (Republic's page, phone and hours, with the Solid Waste Authority's page naming Republic for the city).
- The `pickup-days` fact now leads with Morgantown's lookup, gives Granville's two days, and says plainly that Westover, Star City and the county have no list or lookup.
- New fact `morgantown-holiday-delay`: Republic's six holidays that push pickup back a day, and its bad weather rule.
- /recycling/ lede and `#pickup`, the Living here door's "When is my trash pickup day?" (a new first step), and the New to Mon County link now point Morgantown residents to the lookup first. Elsewhere, the advice to call the Solid Waste Authority stays as it is, pending #901.
- Discovery: `docs/discoveries/2026-11-15-pickup-days-no-lookup-outside-morgantown.md`.

We link to Republic's lookup; the site never reads it or stores an address.
