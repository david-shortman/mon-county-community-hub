# Local identity guide

This guide says how the things we build can feel like they come from Morgantown and Monongalia County, without getting harder to read or use. It is the source of truth for colors, the one motif, and local wording. Every site, app, and tool we build should follow it.

**Rule one: readability first.** Local feel is seasoning, not the meal. Every change still has to pass all six [design rubrics](../rubrics/README.md). If a local touch ever gets in the way of reading or acting, the touch goes.

Last checked: October 28, 2026. Refreshed monthly (see "Keeping this current" below).

## What makes this place look like itself

These are the things a long-time resident, a newcomer, and a student would all recognize. Each one is sourced.

- **A river town in a ring of hills.** Morgantown grew where Deckers Creek meets the Monongahela River. The first settlement there was in 1758 ([e-WV: Monongalia County](https://www.wvencyclopedia.org/entries/1963)). The land is steep: the Deckers Creek Trail climbs about 1,000 feet in 19 miles ([Mon River Trails Conservancy](https://montrails.org/?p=177)). Wooded hills surround the town, so most views end in a green ridgeline.
- **Brick downtown.** The Downtown Morgantown Historic District (National Register, 1996) covers buildings from 1795 to 1945, in styles like Italianate, Romanesque, and Queen Anne. Many of its buildings are brick, such as the Brown Building and the Metropolitan Theatre, and a few are stone, such as the Old Stone House. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Downtown-morgantown-historic-district.pdf), [summary of the listed buildings](https://en.wikipedia.org/wiki/Downtown_Morgantown_Historic_District))
- **The Wharf District.** About 20 acres of two and three story masonry warehouses along the Mon, from about 1885 to 1948, listed on the National Register in 1998. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Morgantown-wharf-warehouse-district.pdf), [NPS record](https://npgallery.nps.gov/AssetDetail/NRIS/98001466))
- **Rail-trails on old rail lines.** Trails run along the river and up Deckers Creek on old railroad beds. The Deckers Creek Trail starts at Hazel Ruby McQuain Riverfront Park and runs about 19 miles. ([Mon River Trails Conservancy](https://montrails.org/?p=177), [TrailLink: Mon River Rail-Trail System](https://www.traillink.com/trail/mon-river-rail-trail-system/))
- **Glassmaking.** From the 1890s, more than 20 glass makers worked here. Seneca Glass (1896 to 1983) built a brick factory on the river in what is now Sunnyside. It is now the Seneca Center and is on the National Register (1985). The glass trade drew European immigrants who settled in Sunnyside. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Seneca-glass-company-building.pdf), [Clio: Seneca Center](https://www.theclio.com/entry/28417))
- **The PRT.** Small automated cars on a concrete guideway, running since 1975 between downtown, the campuses, and the medical center. ([e-WV: Personal Rapid Transit](https://wvencyclopedia.org/entries/1779))
- **Rhododendron.** The great rhododendron (*Rhododendron maximum*) grows wild in the hills and has been the state flower since 1903. ([WV State Museum: state symbols](https://wvstatemuseumed.wv.gov/site/state-symbols.html))

## The cues we use

We use three cues. That is the whole list. Adding a fourth needs a note in this file and a fresh "is it too much?" check.

| Cue | Where it comes from | How we use it | Why this one |
|---|---|---|---|
| **Ridgeline** | The wooded hills you see from almost anywhere in town | One thin, hand-drawn line of rolling hills: under the site header on wide screens, and as the top edge of the tab bar on phones ([`RidgeLine.astro`](../../site/src/components/RidgeLine.astro)) | Everyone here sees these hills every day. It is about the land, not any group. It is quiet enough to ignore. |
| **Hill green** | The same wooded hills | The accent color for links, dates, and focus (`--accent`, kept from before) | Already readable and trusted. Green from the hills, not from a team or agency. |
| **Brick** | Downtown and the old glass factories | A thin edge on "who to ask" boxes (`.note`) and the line above the footer (`--brick`) | Brick is what the old town is built from. It ties the site to downtown without copying any building or sign. |

The page background also moved a little warmer (`--bg: #f9f7f2`), closer to sandstone and old paper than to cold white. Most people will not notice, which is the point.

## The cues we avoid

| Cue | Why we avoid it |
|---|---|
| WVU gold and blue, the Flying WV, the Mountaineer | Belongs to the university. Would suggest we are WVU or endorsed by it. This also rules out the PRT's blue and gold cars as a color source. |
| City or county seals, logos, or official color systems | Would suggest we are the government. |
| The state flag, state seal, or "Montani Semper Liberi" | Official state symbols. Also statewide, not ours in particular. |
| Rhododendron as a decoration | It is a state symbol and shows up all over West Virginia, so it says "WV," not "Morgantown." Fine to mention in content about plants or seasons. |
| Coal, mining, and orange creek water | Deckers Creek ran orange from acid mine drainage for decades, and cleanup is ongoing ([WVDEP](https://dep.wv.gov/news/Pages/WVDEP%E2%80%99s-Richard-Mine-Treatment-Plant-Celebrates-Successful-Restoration-Efforts-in-Deckers-Creek.aspx)). Energy and mining are tied to live economic and political debates. |
| Hillbilly or "country" images, banjos, moonshine, outhouses | Stereotypes. They make fun of people here. |
| Couch fires, game day, and party culture | Tied to one group and to bad news. |
| Stock photos, or photos of people | People who are not here, or privacy risks. If we use images later, they must be our own drawings or openly licensed with credit, and never show people who can be identified. |
| Glass textures, gradients, or "stained glass" effects | The glass history is real and worth telling, but glass effects hurt contrast and look like a theme. Tell the story in words on a page instead. |

## Palette

All colors are CSS variables in [`site/src/layouts/Base.astro`](../../site/src/layouts/Base.astro). Dark mode uses dark grays, never pure black, and lighter tints of the same hues.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | Page background (sandstone paper) | `#f9f7f2` | `#161714` |
| `--card` | Card background | `#ffffff` | `#1d1f1b` |
| `--fg` | Main text | `#1d1d1b` | `#ecebe6` |
| `--muted` | Secondary text, fine print | `#5b5a55` | `#a9a79f` |
| `--line` | Card and section borders (mortar) | `#ddd6ca` | `#363830` |
| `--accent` | Links, dates, focus ring (hill green) | `#1f5c4a` | `#8fd1b5` |
| `--accent-bg` | Callout and tag background | `#e6f0ec` | `#1f2c26` |
| `--brick` | Brick edge on callouts, footer line | `#9b4a34` | `#d98c72` |
| `--ridge` | Ridgeline motif stroke | `#a9bcb1` | `#3f5449` |

**Color roles stay single.** Green means "you can act on this" (links, dates, focus). Brick is decoration only and never carries meaning, so it never conflicts with status colors later. Brick does pass 4.5:1 on the page background in both modes, so it could hold text if we ever need it, but don't use it for links.

### Measured contrast (WCAG 2.2 AA)

Run `npm run check-contrast` in `site/`. It reads the tokens straight from `Base.astro` and fails the build if any required pair drops below the minimum. It also runs after every `npm run build`.

Text needs 4.5:1. Non-text parts that help people see an edge need 3:1. Decorative lines have no minimum and are kept faint on purpose.

| Pair | Kind | Light | Dark |
|---|---|---|---|
| `--fg` on `--bg` | text | 15.77:1 pass | 15.08:1 pass |
| `--fg` on `--card` | text | 16.88:1 pass | 13.92:1 pass |
| `--fg` on `--accent-bg` | text | 14.50:1 pass | 12.16:1 pass |
| `--muted` on `--bg` | text | 6.46:1 pass | 7.47:1 pass |
| `--muted` on `--card` | text | 6.91:1 pass | 6.89:1 pass |
| `--muted` on `--accent-bg` | text | 5.94:1 pass | 6.02:1 pass |
| `--accent` on `--bg` | text | 7.30:1 pass | 10.25:1 pass |
| `--accent` on `--card` | text | 7.81:1 pass | 9.46:1 pass |
| `--accent` on `--accent-bg` | text | 6.71:1 pass | 8.26:1 pass |
| `--brick` on `--bg` | non-text | 5.73:1 pass | 6.81:1 pass |
| `--brick` on `--accent-bg` | non-text | 5.27:1 pass | 5.49:1 pass |
| `--ridge` on `--bg` | decorative | 1.87:1 | 2.21:1 |
| `--line` on `--bg` | decorative | 1.35:1 | 1.51:1 |
| `--line` on `--card` | decorative | 1.44:1 | 1.40:1 |

## Type

We keep the system font stack (`system-ui` and friends). It loads instantly on old phones and slow connections, reads well, and needs no outside font service. A self-hosted font would add weight for little gain, and a hosted font service would mean a third party sees our visitors, which would be a `for:david` decision. Local feel comes from color, the ridgeline, and words, not from a typeface.

## The motif: the ridgeline

- **What:** One thin line of rolling hills, drawn by us as an SVG path. On wide screens it sits on the header's bottom border, so the hills rise out of the line. On phones it is the top edge of the bottom tab bar, filled underneath so the bar's top looks like a hillside.
- **Where:** Once per screen. Header on wide screens, tab bar on phones (the CSS hides the other one). Not in cards, not as a background, not repeated down the page.
- **How:** Use the [`RidgeLine`](../../site/src/components/RidgeLine.astro) component. It has `aria-hidden="true"` and `focusable="false"`, so screen readers skip it. It crops instead of stretching (`preserveAspectRatio="xMidYMax slice"`), so the hills keep their shape from 320px to wide screens. The stroke stays 1.5px at any size.
- **Never:** animate it, fill it with color, put text on it, or use it as a logo.

## Voice notes

Use the names residents use, when it makes directions clearer. Always give the full or official name once on a page, then the short name.

- **"Mon County"** is how people here say Monongalia County. Use "Monongalia County" once, then "Mon County."
- **"The Mon"** is the Monongahela River (as in the Mon River Trail). Write "the Monongahela River" first.
- **Neighborhoods and towns:** Sunnyside, Wiles Hill, South Park, Evansdale, Suncrest, the Wharf District, downtown. Westover, Star City, Granville, Cheat Lake, and Blacksville are their own places; don't fold them into "Morgantown."
- **Landmarks for directions:** "the rail-trail," "Hazel Ruby McQuain Riverfront Park," "the Seneca Center on Beechurst Avenue," "the PRT." Landmarks help people find a place, but always give a street address too.
- **Don't** use slang, dialect spelling, or sports chants. Plain, warm, and neutral.

## Mobile first

Nearly everyone reaches the hub on a phone. Design for a 390px screen first, then let it grow. These rules come from the first mobile pass (#126).

- **Act first.** Every card leads with when it is (a big date and "in 3 days"), then what it is, then big buttons to act: Details, Call, Directions, Add to calendar, Share. Use the [`Actions`](../../site/src/components/Actions.astro) component. Each button shows only when we have a sourced link, phone, or place.
- **Thumb reach.** The main menu is a tab bar at the bottom of the screen on phones, with icons and words, at least 48px tall, and the current page marked by bold text and a tinted pill (not color alone).
- **Big targets.** Buttons and tabs are at least 48px tall. Nothing a person needs to tap is smaller than 44px.
- **Name things in context.** Screen readers hear which event a button is for ("Add to calendar: Free tire drop-off, November 14, 2026"), so no two links on a page sound the same.
- **Local and plain.** Directions buttons use the place the source published. The card text around them uses names residents know (see the voice notes).
- **Light pages.** CSS is inlined so a page paints in one request. The only script is small and optional; the page works without it.
- **Check it.** Before shipping, test at 320px and 390px: no sideways scrolling, nothing hidden under the tab bar when you Tab through the page, and axe clean in light and dark.

## Applying it to new pages and apps

1. Use the `Base` layout, or copy its `:root` tokens exactly. Don't invent new colors. If you truly need one, add it here with its contrast ratio first.
2. Use the `Base` layout's header and tab bar, which already place the ridgeline. Don't add another one.
3. Use `--brick` only for thin edges and rules, never for text people need to read or click.
4. Keep the layout, sizes, and type scale from the rubrics. Local identity never changes where things are.
5. Use local place names from the voice notes when they make an answer clearer.
6. Run `npm run build` (which runs the contrast check) and the rubric checks in light and dark mode at 390px and 1280px.

### Is it too much? A quick check

Answer each one by looking at a 390px screenshot. Any "yes" means pull back.

- Do you notice the local touch before you notice the page title?
- Is there more than one ridgeline, or more than a few thin brick edges, on the screen?
- Would someone think this site belongs to the city, the county, WVU, or a business?
- Does any local touch carry meaning (status, warning, "click here")?
- Would a long-time resident, a newcomer, and a student each feel it is not about them?
- Did it make anything harder to read, slower to load, or harder to use with a keyboard or screen reader?

## Keeping this current

A monthly refresh re-checks this guide: new sources, new pages, and whether the cues still feel right. Each refresh adds a short build log entry and updates the "Last checked" date at the top. Feedback from residents and local groups (asked only by David, never by agents) outranks our own judgment.

Screenshots of the first version, before and after: [`screenshots/`](screenshots/).
