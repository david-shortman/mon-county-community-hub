# Local identity guide

This guide says how the things we build can feel like they come from Morgantown and Monongalia County, without getting harder to read or use. It is the source of truth for colors, the one motif, and local wording. Every site, app, and tool we build should follow it.

**Version 2 (October 29, 2026).** David chose a bolder, more distinct direction after the [Hub Identity Workshop](https://claude.ai/artifact/MR7VsryBth6f47tK2gnKmN) brainstorm. The decision is in [`docs/decisions/2026-10-29-1306-identity-v2.md`](../decisions/2026-10-29-1306-identity-v2.md). The new sections are "Personality," "Design principles," "Voice: this, not that," and "Three directions." The type and contrast rules changed.

**Rule one: readability first.** Local feel is seasoning, not the meal. Every change still has to pass all six [design rubrics](../rubrics/README.md). If a local touch ever gets in the way of reading or acting, the touch goes.

Last checked: October 29, 2026. Refreshed monthly (see "Keeping this current" below).

## What makes this place look like itself

These are the things a long-time resident, a newcomer, and a student would all recognize. Each one is sourced.

- **A river town in a ring of hills.** Morgantown grew where Deckers Creek meets the Monongahela River. The first settlement there was in 1758 ([e-WV: Monongalia County](https://www.wvencyclopedia.org/entries/1963)). The land is steep: the Deckers Creek Trail climbs about 1,000 feet in 19 miles ([Mon River Trails Conservancy](https://montrails.org/?p=177)). Wooded hills surround the town, so most views end in a green ridgeline.
- **Brick downtown.** The Downtown Morgantown Historic District (National Register, 1996) covers buildings from 1795 to 1945, in styles like Italianate, Romanesque, and Queen Anne. Many of its buildings are brick, such as the Brown Building and the Metropolitan Theatre, and a few are stone, such as the Old Stone House. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Downtown-morgantown-historic-district.pdf), [summary of the listed buildings](https://en.wikipedia.org/wiki/Downtown_Morgantown_Historic_District))
- **The Wharf District.** About 20 acres of two and three story masonry warehouses along the Mon, from about 1885 to 1948, listed on the National Register in 1998. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Morgantown-wharf-warehouse-district.pdf), [NPS record](https://npgallery.nps.gov/AssetDetail/NRIS/98001466))
- **Rail-trails on old rail lines.** Trails run along the river and up Deckers Creek on old railroad beds. The Deckers Creek Trail starts at Hazel Ruby McQuain Riverfront Park and runs about 19 miles. ([Mon River Trails Conservancy](https://montrails.org/?p=177), [TrailLink: Mon River Rail-Trail System](https://www.traillink.com/trail/mon-river-rail-trail-system/))
- **Glassmaking.** From the 1890s, more than 20 glass makers worked here. Seneca Glass (1896 to 1983) built a brick factory on the river in what is now Sunnyside. It is now the Seneca Center and is on the National Register (1985). The glass trade drew European immigrants who settled in Sunnyside. ([nomination form, WV Culture](https://wvculture.org/wp-content/uploads/2021/03/Seneca-glass-company-building.pdf), [Clio: Seneca Center](https://www.theclio.com/entry/28417))
- **The PRT.** Small automated cars on a concrete guideway, running since 1975 between downtown, the campuses, and the medical center. ([e-WV: Personal Rapid Transit](https://wvencyclopedia.org/entries/1779))
- **Rhododendron.** The great rhododendron (*Rhododendron maximum*) grows wild in the hills and has been the state flower since 1903. ([WV State Museum: state symbols](https://wvstatemuseumed.wv.gov/site/state-symbols.html))

## Personality

Set by David on the workshop sliders, October 29, 2026. Every design and writing choice should fit this line:

**A bold, serious-leaning hub that sounds casual and matter-of-fact, lightly seasonal, deeply rooted in Mon County, with the answer first and details after.**

| Spectrum | Where we sit | What it means in practice |
|---|---|---|
| Serious to playful | Serious-leaning (1 of 4) | Drawings only as quiet markers. Never jokes about hardship. |
| Formal to casual | Casual (3 of 4) | Talk like a helpful neighbor: "you," short words, contractions are fine. |
| Matter-of-fact to enthusiastic | Matter-of-fact (1 of 4) | State what to do. No exclamation points, no hype. |
| Quiet to bold | Bold (3 of 4) | Heavy display type for headings, big dates, strong blocks of color where they help action. |
| Timeless to seasonal | Lightly seasonal (2 of 4) | Type and layout never change. Any seasonal touch stays small and quiet. |
| Rooted to placeless | Deeply rooted (0 of 4) | Real local views, place names residents use, local materials in the palette. |
| Read it all to answer first | Answer first (4 of 4) | The answer or the action sits at the top of every page. Explanation comes after. |

## Design principles

Use these to settle arguments. Each one can be tested.

1. **Answer first, then explain.** The first screen of every page tells a person what to do or who to call.
2. **Two taps to help.** From the home page, a worried person reaches a phone number, a place, or a date in two taps or fewer.
3. **Point to people.** Every answer ends at a real organization: call, text, directions, or a date, with the date we checked.
4. **Bold, not loud.** Strength comes from type, size, and shape. Never from motion, noise, or more colors than needed.
5. **From here.** Local forms and words, never borrowed seals, mascots, or stereotypes.
6. **Light on any phone.** Every page works on an old Android with weak signal and with scripts off.
7. **Everyone, every time.** 7:1 text contrast, big targets, screen reader and voice control friendly, plain words.

## Voice: this, not that

- **Plain,** not childish
- **Warm,** not cheerful about hardship
- **Neutral,** not official
- **Local,** not folksy
- **Bold,** not loud
- **Fast,** not rushed
- **Confident,** never certain about someone's eligibility ("you may qualify," then the official next step)
- **Modern,** not trendy

## Three directions, used together

David chose a mix of all three workshop directions:

| Direction | Where it applies | What it means |
|---|---|---|
| **B. Front Door** | The home page | One question, "What do you need help with?", a visible search box, plain need buttons, and "Call or text 211" pinned on top. Short question flows end at real organizations. Answers live in the web address, so nothing is stored. |
| **A. Trailhead** | Every guide | Each need is a route with steps (mileposts), collapsed until needed, each step ending in an action. Based on the GOV.UK step-by-step pattern. Built as [`Route`](../../site/src/components/Route.astro) and [`Milepost`](../../site/src/components/Milepost.astro) (#240), first on `/utility-bills/`. |
| **C. Living Ridgeline** | The identity layer | Tried and removed on October 30, 2026 (#241): every drawn motif (wavy hills, per-door landmarks, a tiny skyline) read as noise. The menu border is now a plain line. Quieter ideas are being weighed instead. |

Each direction gets its own issue and PR. Until those ship, the rules below still apply as written.

**Front Door, shipped (#239), rebuilt on the doors (#250).** How the home page works, so new pages fit it:

- **Order on a phone:** the Help now bar (a place to stay tonight, 211 with a plain label, 911 and 988), the title and one line, "What do you need help with?" with the five door cards, search, the "This season" card (November to March), the next three dates, and "Rather talk to a person?" with 211. The help line sources sit in one line at the bottom.
- **Door cards** ([`DoorCards.astro`](../../site/src/components/DoorCards.astro)) come from `content/doors.yaml`. Each shows a few problems in residents' words that link straight to their page, so help is one tap from home. An example shows only once its page exists. A door with no pages yet shows its hint and leads to its section of the Topics page, which points to 211. Test: from home, two taps to a phone number, a place or a date for every live door.
- **Question flows** ([`Question.astro`](../../site/src/components/Question.astro)) use one page per answer, so the answers live in the web address, work without scripts, can be shared, and store nothing. Results say "you may qualify" and end at the official next step. The first flow is food (`/help/food/`).
- **Search** uses Pagefind, built with the site, and runs on the phone. The words go after "#" in the address, which is never sent to the host, though the host can see which search files load, as with any visit. The search box only appears when JavaScript runs, so words are never sent for a search that cannot run; without it, the home page links to All topics. Never promise more privacy than that. Pages are indexed from `<main>`; pass `searchable={false}` to `Base` to leave a page out.

**Trailhead, first route (#240).** How to turn a guide into a route, so new guides fit it:

- Wrap the steps in `<Route>` and make each one a `<Milepost n title when>`. Each step is a native `details`, so it opens and closes with no script, find-in-page opens a closed step that holds a match, and printing opens every step (with scripts off, only the open steps print).
- Open only step 1 (`open`), so the first thing to do is on the first screen. Keep a step's title a plain action ("Call your utility first").
- `when` is a short time like "Today" or "Later". Only say how long something takes when a source says so.
- End every step with an action: call, apply, text or go, using `Actions` or `.btn` links named for who you reach ("Call Mon Power"). Source lines stay under each fact inside the step.

## The cues we use

We use two cues. That is the whole list. Adding a fourth needs a note in this file and a fresh "is it too much?" check.

| Cue | Where it comes from | How we use it | Why this one |
|---|---|---|---|
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
| `--muted` | Secondary text, fine print | `#4f4e4a` | `#b7b5ae` |
| `--line` | Card and section borders (mortar) | `#ddd6ca` | `#363830` |
| `--accent` | Links, dates, focus ring (hill green) | `#1e5847` | `#8fd1b5` |
| `--accent-bg` | Callout and tag background | `#e6f0ec` | `#1f2c26` |
| `--brick` | Brick edge on callouts, footer line | `#9b4a34` | `#d98c72` |
| `--ridge` | Soft rail beside step lists | `#a9bcb1` | `#3f5449` |

**Color roles stay single.** Green means "you can act on this" (links, dates, focus). Brick is decoration only and never carries meaning, so it never conflicts with status colors later. Brick does pass 4.5:1 on the page background in both modes, so it could hold text if we ever need it, but don't use it for links.

### Measured contrast (WCAG AAA for text)

Run `npm run check-contrast` in `site/`. It reads the tokens straight from `Base.astro` and fails the build if any required pair drops below the minimum. It also runs after every `npm run build`.

**Text needs 7:1** (WCAG 2.2 AAA, criterion 1.4.6), our rule since October 29, 2026. Only about 31% of phone sites pass even the lower AA bar. Non-text parts that help people see an edge need 3:1. Decorative lines have no minimum and are kept faint on purpose.

| Pair | Kind | Light | Dark |
|---|---|---|---|
| `--fg` on `--bg` | text | 15.77:1 pass | 15.08:1 pass |
| `--fg` on `--card` | text | 16.88:1 pass | 13.92:1 pass |
| `--fg` on `--accent-bg` | text | 14.50:1 pass | 12.16:1 pass |
| `--muted` on `--bg` | text | 7.78:1 pass | 8.77:1 pass |
| `--muted` on `--card` | text | 8.33:1 pass | 8.10:1 pass |
| `--muted` on `--accent-bg` | text | 7.16:1 pass | 7.08:1 pass |
| `--accent` on `--bg` | text | 7.72:1 pass | 10.25:1 pass |
| `--accent` on `--card` | text | 8.26:1 pass | 9.46:1 pass |
| `--accent` on `--accent-bg` | text | 7.10:1 pass | 8.26:1 pass |
| `--card` on `--accent` | text | 8.26:1 pass | 9.46:1 pass |
| `--brick` on `--bg` | non-text | 5.73:1 pass | 6.81:1 pass |
| `--brick` on `--accent-bg` | non-text | 5.27:1 pass | 5.49:1 pass |
| `--ridge` on `--bg` | decorative | 1.87:1 | 2.21:1 |
| `--line` on `--bg` | decorative | 1.35:1 | 1.51:1 |
| `--line` on `--card` | decorative | 1.44:1 | 1.40:1 |

## Type

- **Headings:** Atkinson Hyperlegible Next, weight 800, for `h1` to `h3` and the site name. It was made by the Braille Institute so letters that look alike (l, I, 1, O, 0) are easy to tell apart. It is free under the SIL Open Font License ([`site/public/fonts/OFL.txt`](../../site/public/fonts/OFL.txt)).
- **How it loads:** self-hosted, never from a font service, so no third party sees our visitors. One weight, Latin characters only, about 11 KB. It uses `font-display: optional`: if it is not ready in a moment, the page uses the system font for that visit and never waits or jumps. Next visit it comes from the cache.
- **Body text:** the system font stack. Research finds no single font is fastest for everyone, and serif versus sans does not change legibility, so body text stays on what each phone does best, at no cost.
- **Don't** add more weights or families without updating this section and checking page weight. Don't use Public Sans: it reads as a federal government site.

## No drawn motif

The site has no drawn motif right now. On October 30, 2026 we tried three (a wavy ridge of hills under the menu, a named landmark drawing for each door, and a tiny skyline of local shapes on the menu line). David found each one distracting, so all three were removed ([decision](../decisions/2026-10-30-1000-no-drawn-motif.md)). The menu border is a plain 1px `--line` rule, under the header on wide screens and on top of the tab bar on phones.

Before adding any drawn shape again, show David screenshots first and run the "Is it too much?" check below.

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
- **Thumb reach.** The main menu is a tab bar at the bottom of the screen on phones, with icons and words, at least 48px tall, and the current page marked by bold text and a tinted pill (not color alone). It has four tabs: Home, Help now, Dates and Topics. The Topics tab is marked on any page inside a door. On wide screens the header shows Help now, the five doors, Dates and All topics. The footer lists the doors, All topics, About and For groups and helpers. All of it comes from `content/doors.yaml` (#250), so a new page never changes the menu: tag it with its door and topic (see `content/README.md`, "Tagging a site page") and it shows on the Topics page and its door.
- **Big targets.** Buttons and tabs are at least 48px tall. Nothing a person needs to tap is smaller than 44px.
- **Crisis pages.** A page a person in danger may read passes `crisis` to `Base`, which adds the crisis strip and the Leave this page button ([`CrisisStrip.astro`](../../site/src/components/CrisisStrip.astro), #174) and sends no referrer. The strip uses `--accent-bg` with a brick edge, and the button is `--fg` on `--bg`, so no new colors. It shows only on those pages, never across the site.
- **Name things in context.** Screen readers hear which event a button is for ("Add to calendar: Free tire drop-off, November 14, 2026"), so no two links on a page sound the same.
- **Local and plain.** Directions buttons use the place the source published. The card text around them uses names residents know (see the voice notes).
- **Light pages.** CSS is inlined so a page paints in one request. The only script is small and optional; the page works without it.
- **Check it.** Before shipping, test at 320px and 390px: no sideways scrolling, nothing hidden under the tab bar when you Tab through the page, and axe clean in light and dark.

## Applying it to new pages and apps

1. Use the `Base` layout, or copy its `:root` tokens exactly. Don't invent new colors. If you truly need one, add it here with its contrast ratio first.
2. Use the `Base` layout's header and tab bar. Don't add drawn shapes or motifs to pages.
3. Use `--brick` only for thin edges and rules, never for text people need to read or click.
4. Keep the layout, sizes, and type scale from the rubrics. Local identity never changes where things are.
5. Use local place names from the voice notes when they make an answer clearer.
6. Run `npm run build` (which runs the contrast check) and the rubric checks in light and dark mode at 390px and 1280px.

### Is it too much? A quick check

Answer each one by looking at a 390px screenshot. Any "yes" means pull back.

- Do you notice the local touch before you notice the page title?
- Is there any drawn decoration, or more than a few thin brick edges, on the screen?
- Would someone think this site belongs to the city, the county, WVU, or a business?
- Does any local touch carry meaning (status, warning, "click here")?
- Would a long-time resident, a newcomer, and a student each feel it is not about them?
- Did it make anything harder to read, slower to load, or harder to use with a keyboard or screen reader?

## Keeping this current

A monthly refresh re-checks this guide: new sources, new pages, and whether the cues still feel right. Each refresh adds a short build log entry and updates the "Last checked" date at the top. Feedback from residents and local groups (asked only by David, never by agents) outranks our own judgment.

Screenshots of the first version, before and after: [`screenshots/`](screenshots/).
