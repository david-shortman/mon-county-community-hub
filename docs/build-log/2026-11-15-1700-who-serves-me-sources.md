# Who serves my address: every row now cites a page that states it

**Issue:** #2008 (sprint wave 21, address lookups, #529)

Each row on /who-serves-me/ showed the first source of its record. For water, that was MUB's start service page, which names no town. We checked every row against current official pages on 2026-11-15.

What changed:

- **Westover water:** the City of Westover's utilities page lists MUB "for water and sewer services." Added it as a source, and the Westover row now cites it.
- **Star City water and police:** the rows now cite Star City's home page, which names MUB for water and sewer and says the town has no dispatch center of its own.
- **Morgantown water:** cites MUB's home page ("Proudly serving Morgantown").
- **Granville water: taken down.** The town's pages list MUB under public utilities, but its FAQ says the town provides water and sewer. The row now says we could not confirm it and points to the town office (new record `granville-town-office`). See `docs/discoveries/2026-11-15-granville-water-provider-unclear.md`. The same change is on the Granville town page, /which-office/ and /moving-here/.
- **Trash notes:** removed "The Solid Waste Authority can tell you who serves your address" from the Morgantown and outside-any-town rows (here and on town pages). No SWA page says it, and #901 is still waiting on a call to find out.
- **All other rows** (police, streets, sheriff, MECCA, trash in Westover, Star City and Granville, Blacksville, the state utility agency) match their sources as read on 2026-11-15.

The page code now takes an optional source for each row and fails the build if that source is not on the record.

Checked dates moved to 2026-11-15 only on records whose whole entry was re-read that day (Westover police and trash, Star City trash, Granville police and trash, Blacksville office, the Sheriff, MECCA, MUB).
