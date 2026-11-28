# Interest chips: the list and what each chip lifts

**Issue:** #2026 (part of the Topics explorer, #2025)

New file `content/explore-chips.yaml`: 20 interest chips for /topics/ and a starter list for Flip through. It holds only names and web paths, like `content/also-check.yaml`. A test (`site/test/explore-chips.test.mjs`, run by `npm test` after every build) checks every path is a tagged page, every chip has 4 to 12 pages, ids are unique, names are 3 words or fewer, and no Help now page or page naming 988, 211 or 911 is in a chip or the starter list.

Changes from the issue's starting list, to meet its own rules:

- **Left out because the page names a crisis line:** /who-serves-me/, /utility-bills/, /families-and-kids/, /home-safety/, /staying-well/, /mental-health/, /dental-and-prescriptions/, /needs/. "Stay well" then had 3 pages, so it now lists /care/, /flu-shots/, /diabetes-and-weight/, /no-insurance/, /staying-active/.
- **Names shortened to 3 words:** "Grow food and flowers" to "Grow things", "Make the town nicer" to "Improve your town", "Babies and little kids" to "Babies and toddlers", "School kids and teens" to "School and teens", "How the county is doing" to "How we're doing" (the page's own label).

Nothing shows on the site yet; #2027 adds the chips to /topics/. Cost: $0.
