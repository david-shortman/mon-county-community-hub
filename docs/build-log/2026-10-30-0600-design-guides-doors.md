# 2026-10-30: Design guides updated to the door structure (#253)

- **Considered:** the presentation guide still described the old home screen and a flat site map, and listed blocks as planned that now exist. New pages would have been built the old way.
- **Chose:** update both guides to match what shipped in #249, #250, #235, #251, #252 and #175, and record the door structure as a decision.
- **Shipped:**
  - `presentation.md`: "How the site is organized" rewritten around the four levels (Help now, door, topic, answer page), a table of doors with what is live and what is still to come, and how new content slots in (tags, door data files, flat links, empty doors off the home page). A new "Door pages" pattern. Building block statuses updated: crisis strip, quick exit, door cards, pick what fits, place card, breadcrumb, send by text and print now exist. The listing needs note now says hours and address are in the data. The crisis pattern points to the live page.
  - `identity.md`: each door may carry its own ridge and tint once #241 builds the library, and crisis pages use the strip with existing tokens only.
  - Decision record `2026-10-30-0600-door-structure.md`.
- **Scoreboard:** none directly. The guides now match the site, so the next agent builds pages the new way.
