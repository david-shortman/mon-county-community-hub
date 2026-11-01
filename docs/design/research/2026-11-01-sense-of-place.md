# Sense of place: a visual vernacular for Mon County

Research for the visual identity wave (#396, sprint log #529). Lane: Mon County sense of place. Phase 1 is research only. Phase 2 lanes build three directions as hidden preview pages, and David picks.

- **Date:** November 1, 2026
- **By:** Claude Code (sense of place lane)
- **Cost of everything proposed here:** $0. All sources are public domain or our own drawings. All fonts are under the SIL Open Font License.
- **Status:** proposals, not decisions. Nothing here changes `docs/design/identity.md` until David picks a direction.

## The short version

The site looks generic because its local cues are colors and words only, and the colors (green, cream, brick) are the same ones any "warm civic" template uses. The fix is not more drawings. Three drawn motifs already failed in October because they read as decoration ([no drawn motif](../../decisions/2026-10-30-1000-no-drawn-motif.md)). The fix is **local structure**: shapes that come from real data about this place and that do a job on the page.

The strongest building blocks I found:

1. **The real land, measured.** The USGS publishes elevation for every spot in the county, free and public domain. A ridge line drawn from a real elevation profile across the Monongahela valley is ours, is exact, and can't be mistaken for clip art or for anyone's logo. Contour lines from the same data make section rules. A sample profile is below.
2. **The map maker's rules.** USGS topographic maps have a printed grammar residents have seen on trail maps for decades: brown contours, blue water in *italic* letters, black for things people built, green for woods. Borrowing the grammar (not any map image) gives us a palette with roles that already mean something.
3. **The survey line.** The county's north edge is the Mason-Dixon Line, run by surveyors who stopped in what is now Monongalia County in 1767. Straight survey lines, tick marks and numbered stones fit a site built on "mileposts" and steps.
4. **The river as a staircase.** The Mon is a chain of locks and dams. A pool, a lock, the next pool is a clear picture of "step 1, step 2" that is true to this river.
5. **The quilt grid as layout, not ornament.** Quilt block geometry (squares split into triangles on a grid) suits card corners and empty states, if we use it as structure and stay plain.

What to stay away from: coal scrip and company store imagery, 1930s poverty photos of Scotts Run, "hillbilly" anything, WVU or PRT colors, anything round and seal-like, and statewide symbols that say "West Virginia" but not "here" (rhododendron, ramps, the state outline). Details in [Risks](#risks-nostalgia-stereotype-and-false-official-looks).

## Hard limits every idea was checked against

- WCAG contrast. The project rule is stricter than AA: **7:1 for text** (identity.md, "Design principles" 7). Every text color below passes 7:1 on every surface it sits on, in light and dark. AA (4.5:1) is the floor the brief asked for, so all of them clear it easily.
- Works at 320px wide and at 200% text size.
- `prefers-reduced-motion` respected. Nothing here needs motion at all.
- Weight budget ([presentation.md](../presentation.md#weight-budget)): urgent pages under 50 KB, everyday pages under 150 KB. Every motif here is under 1.5 KB of inline SVG. New fonts are the only real cost (see [Lettering](#lettering-cues-mapped-to-open-fonts)).
- The crisis strip and Quick exit stay the first and plainest thing on crisis pages. **No motif goes near them.** Nothing here touches the Help now bar or the tab bar.
- No logos, seals, marks or colors that imitate WVU, the city, the county, the state, or any company.
- Fonts open licensed and self-hosted. Images our own SVG, or public domain with credit.

## Sources, and the license for each

I looked at these. No images from them go in the repo. They are references for drawing our own shapes.

| Source | What it shows | License or rights | How we can use it |
|---|---|---|---|
| [USGS historical topographic maps](https://www.usgs.gov/faqs/are-us-topo-maps-copyrighted): Morgantown North and Morgantown South 7.5 minute quadrangles (1957, 1976, 1994 and 1997 editions), and the 1:100,000 Morgantown sheet (1979), from [The National Map](https://apps.nationalmap.gov/downloader/) | Contours of the river valley and ridges, river and creek lines, the map's color and lettering grammar | Public domain. USGS asks for credit: "Source: U.S. Geological Survey." The only exceptions are some 2009 and later US Topo maps with licensed imagery, which we don't need. | Trace shapes, copy the color roles and lettering rules. Credit USGS in the page's sources. |
| [USGS 3DEP elevation, Elevation Point Query Service](https://epqs.nationalmap.gov/v1/docs) | Ground height at any point, at 1 meter resolution here | Public domain (USGS) | Make real ridge profiles and contours ourselves. See the [sample](#a-real-ridge-line-measured-not-drawn). |
| [Library of Congress, FSA/OWI photographs](https://www.loc.gov/rr/print/res/071_fsab.html), searched for Morgantown | 1935 and 1938 photos by federal photographers: "View of Morgantown" (1935, [record](https://www.loc.gov/item/2017759177/)), "A rainy Saturday afternoon, courthouse square" (1938, [record](https://www.loc.gov/item/2017752907/)), "Main street, Morgantown" (1935, [record](https://www.loc.gov/item/2017733327/)), barns on the road toward Elkins (1938, [record](https://www.loc.gov/item/2017799355/)), and many photos of Scotts Run mining camps | "No known restrictions on images made by the U.S. government." The LOC says this is not a legal clearance; check each record. | Look only. Most of the Morgantown set documents poverty, and many show people who could be identified. **Don't put these photos on the site.** See [Risks](#risks-nostalgia-stereotype-and-false-official-looks). |
| [Library of Congress, WPA Poster Collection](https://www.loc.gov/collections/works-progress-administration-posters/) | 1936 to 1943 silkscreen posters: flat color, two or three inks, big condensed letters | Most records say "No known restrictions on publication" (for example [this record](https://www.loc.gov/item/98517062)). Check each one. | A style reference for flat color and simple shapes. No WPA poster I found is about Mon County, so copying one adds nothing local. |
| *West Virginia: A Guide to the Mountain State* (WPA Writers' Program, 1941), [HathiTrust record](https://catalog.hathitrust.org/Record/001874221) | The state guide, with a Morgantown section and woodcut-like line drawings | **Not cleared.** The book carries a 1941 copyright notice for the Conservation Commission of West Virginia ([UK copy](https://exploreuk.uky.edu/catalog/xt731z41v99z/text)). I could not confirm whether it was renewed. | Read for history and tone. Don't copy its drawings or text. |
| [e-WV: Monongalia County](https://www.wvencyclopedia.org/entries/1963), [Coopers Rock State Forest history](https://wvstateparks.com/parks/coopers-rock-state-forest/park-history/), [Living New Deal: Coopers Rock](https://livingnewdeal.org/projects/coopers-rock-state-forest-bruceton-mills-wv/) | Facts: the river, the CCC stonework at the Coopers Rock overlook (1930s) over the Cheat River gorge | Text is copyrighted; facts are free to state with a link | Facts and citations only. |
| [Mason and Dixon Survey Terminal Point, NRHP nomination (WV Culture)](https://wvculture.org/wp-content/uploads/2021/03/Mason-dixon-survey-terminal-point.pdf), [summary](https://en.wikipedia.org/wiki/Mason_and_Dixon_Survey_Terminal_Point) | Mason and Dixon set their last point on Brown's Hill, in today's Monongalia County, on October 19, 1767. The line was carried to Pennsylvania's southwest corner in 1784. A stone was set on the 1767 mound in 1883. | Facts | The survey line idea. One marker database says a marker there is missing, so don't state the stone's current state. |
| [Morgantown Lock and Dam](https://en.wikipedia.org/wiki/Morgantown_Lock_and_Dam), [Hildebrand Lock and Dam](https://en.wikipedia.org/wiki/Hildebrand_Lock_and_Dam), [Point Marion Lock and Dam](https://en.wikipedia.org/wiki/Point_Marion_Lock_and_Dam) | The Mon runs through the county as a chain of pools held by locks and dams, run by the Army Corps of Engineers, Pittsburgh District | Facts | The staircase idea. Lift heights differ between sources, so don't print a number. |
| Traditional quilt block patterns (Log Cabin, Flying Geese, Churn Dash, Bear's Paw, Ohio Star) | Square grid geometry | Traditional patterns are shared folk designs. A specific painted barn quilt or a named designer's pattern is someone's artwork. | Draw our own blocks from the basic grid. Don't trace any barn quilt photo. |

## A real ridge line, measured, not drawn

The earlier ridge motif was invented: a wavy line that could be any hills anywhere. This one is measured. I asked the USGS elevation service for the ground height at 61 points on a straight line running west to east across town at latitude 39.630, from longitude -80.030 (west of Westover) to -79.880 (east of town), about 13 km. The river is the low point in the middle.

What came back (queried November 1, 2026, 60 of 61 points answered, heights in feet):

- **Lowest:** 797 ft at longitude -79.960, the Monongahela by downtown.
- **Highest:** 1,391 ft at -79.8825, the ridge east of town.
- **Shape, west to east:** an uneven ridge around 1,100 to 1,240 ft on the Westover side, a dip to about 860 ft (a hollow on the Westover side), back up to about 1,120 ft, the deep drop to the river, a climb to about 1,130 ft through town, a second drop to about 845 ft near -79.935 (in line with the Deckers Creek valley), then a long climb to the eastern ridge.

That is three valleys, not one: a real shape nobody would draw by hand. As a 600 by 40 SVG it is 464 characters of path data, about 0.7 KB with the wrapper:

```html
<!-- Measured ridge: ground height across the Monongahela valley at latitude 39.630,
     longitude -80.030 to -79.880, from USGS 3DEP (public domain), queried 2026-11-01.
     Height is stretched about 4.5 times in the viewBox so the shape reads at 40px. Decorative. -->
<svg aria-hidden="true" focusable="false" viewBox="0 0 600 40" width="100%" height="40" preserveAspectRatio="none" style="color: var(--line)"><path d="M0 18 L10 11 L20 17 L30 19 L40 20 L50 12 L60 19 L70 13 L80 14 L90 12 L100 13 L120 20 L130 18 L140 21 L150 23 L160 33 L170 35 L180 32 L190 26 L200 24 L210 24 L220 18 L230 18 L240 22 L250 21 L260 21 L270 36 L280 39 L290 35 L300 32 L310 32 L320 25 L330 17 L340 20 L350 18 L360 25 L370 34 L380 36 L390 35 L400 32 L410 29 L420 25 L430 23 L440 15 L450 17 L460 22 L470 22 L480 13 L490 11 L500 10 L510 12 L520 14 L530 13 L540 15 L550 16 L560 14 L570 5 L580 7 L590 1 L600 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>
```

Notes for a builder: the jagged steps come from sampling about every 215 m. Sampling every 100 m, or rounding corners with a light curve fit, gives a softer line that is still true. The vertical stretch is a design choice; say so in the SVG comment so nobody reads it as a to-scale chart. The service took about 14 seconds per point, so run it once at design time and paste the path in. Never call it from the browser or at build time.

How a builder makes more of these, for $0:

1. Pick a straight line (two points). Ask `https://epqs.nationalmap.gov/v1/json?x=<lon>&y=<lat>&units=Feet&wkid=4326` for 40 to 80 points along it, a second or so apart, to be polite.
2. Scale heights into a short, wide box (for example 0 to 600 wide, 0 to 40 tall), and draw one `path`. Keep the real shape. Don't smooth it into a sine wave.
3. Round to whole numbers. The path stays well under 1 KB.
4. Credit "Elevation: U.S. Geological Survey" in the sources line where it appears, and note the line and date in a comment in the SVG.

Contour rules work the same way, from a 3DEP elevation tile (GeoTIFF, free from The National Map) run through `gdal_contour` and simplified with `mapshaper` (both free and open source). Keep 3 to 5 lines, 1px, in the contour color. A good first subject is the hill on either side of the river at downtown, the same view the site icon shows.

## Palettes drawn from the place

Each palette keeps the project's rule that **one color means "you can act on this"** (links, dates, focus). Every other color is a surface, a quiet edge, or decoration. Every text color passes 7:1 on the page background, the card, and the tint, in both modes. I measured with the WCAG relative luminance formula (the same math as `npm run check-contrast`).

"deco" means lines and fills that carry no meaning. They are marked when they fall under 3:1, so nobody uses them for an edge a person needs to see.

### 1. Topo sheet (USGS map inks)

From the color grammar of USGS topographic maps: brown contours, blue water, green woods, black for what people built, on warm paper. The roles map almost one to one: water blue becomes the action color, because rivers are the one thing on a topo map you follow.

| Role | Light | Dark | Lowest text contrast (bg, card, tint) |
|---|---|---|---|
| Paper (`--bg`) | `#f7f4ea` | `#151613` | |
| Card | `#ffffff` | `#1c1e1a` | |
| Woods tint (callouts) | `#e3ead8` | `#1f2a1f` | |
| Ink (text) | `#1c1b18` | `#ecebe4` | 13.96 / 12.47 |
| Muted text | `#4e4a42` | `#b8b4a8` | 7.15 / 7.19 |
| Water blue (**action**: links, dates, focus) | `#1d4c74` | `#8cbde3` | 7.28 / 7.45 |
| Contour brown (headings accent, rules) | `#683f1b` | `#ddb38c` | 7.35 / 7.74 |
| Road red (deco, thin rules only) | `#a1362b` | `#e58b7d` | 5.53 / 5.90 |

Watch: red reads as "warning." Use road red only for a 1px rule, or drop it.

### 2. Sandstone and hemlock (Coopers Rock and the Cheat)

From the sandstone cliffs and CCC stone walls at the Coopers Rock overlook, the hemlock woods, and the green water of the Cheat River below.

| Role | Light | Dark | Lowest text contrast |
|---|---|---|---|
| Page | `#f6f1e6` | `#171613` | |
| Card | `#fffdf8` | `#1f1d19` | |
| Sandstone tint | `#ece2cd` | `#2a261e` | |
| Text | `#1f1d19` | `#eeeae0` | 13.08 / 12.54 |
| Muted | `#4a453b` | `#bcb5a6` | 7.40 / 7.39 |
| Hemlock (**action**) | `#24493d` | `#93cdb6` | 7.79 / 8.35 |
| Cheat water (second accent: headings, rules) | `#1c4a50` | `#8ccbd1` | 7.61 / 8.30 |
| Lichen (deco only) | `#7f8d63` | `#8f9d72` | 2.77 light on tint: deco only |

Watch: hemlock and Cheat water are close in hue. Use only one of them for anything a person reads as a signal.

### 3. Wharf brick and river slate (downtown and the Wharf District)

Closest to today's palette, but pushed further: real deep brick, river slate instead of hill green, mortar lines. This is the "same site, more itself" option.

| Role | Light | Dark | Lowest text contrast |
|---|---|---|---|
| Page (limestone) | `#f8f6f1` | `#161615` | |
| Card | `#ffffff` | `#1e1e1c` | |
| Brick tint | `#efe6dc` | `#2b221e` | |
| Text | `#1e1d1b` | `#ecebe7` | 13.65 / 13.04 |
| Muted | `#4a4742` | `#b8b4ad` | 7.50 / 7.53 |
| River slate (**action**) | `#264a5c` | `#93bdd3` | 7.68 / 7.75 |
| Brick (headings, thick rules, big dates) | `#7a3322` | `#e59d86` | 7.32 / 7.03 |
| Mortar (deco lines) | `#d9cfc1` | `#3a3732` | deco |

Brick now passes 7:1, so it can hold big display text like dates (identity.md today keeps brick for edges only; changing that is David's call).

### 4. Pressed glass (the glass factories)

Flat colors that nod to the colored glass made here from the 1890s on (identity.md, "Glassmaking"). **Flat fills only, never see-through, shine or "stained glass" effects** (identity.md already rules those out). These are not matched to any company's catalog, so don't call them "Seneca colors."

| Role | Light | Dark | Lowest text contrast |
|---|---|---|---|
| Page | `#f8f7f3` | `#151514` | |
| Card | `#ffffff` | `#1d1d1b` | |
| Amber tint | `#f1e9d6` | `#2a2416` | |
| Text | `#1d1c1a` | `#edece8` | 14.08 / 13.04 |
| Muted | `#4e4b45` | `#b9b6ae` | 7.19 / 7.61 |
| Cobalt (**action**) | `#2b3d8c` | `#a9b7f0` | 8.08 / 7.87 |
| Amber (display, rules) | `#6e4108` | `#e7b56a` | 7.17 / 8.23 |
| Moss (second display) | `#33502a` | `#a8c78f` | 7.48 / 8.24 |

Watch: cobalt plus amber is the loudest of the five. Keep the amber to dates and one rule per screen.

### 5. Seasons on the ridge (one small accent that changes)

Not a full palette. One accent that changes four times a year, for the dateline rule and the "This season" card edge only. Type and layout never change (identity.md: "Lightly seasonal, 2 of 4"). All tested on today's `--bg` `#f9f7f2` / `#161714` and `--card`.

| Season | What it's from | Light | Dark | Lowest contrast |
|---|---|---|---|---|
| Spring (March to May) | New leaves in the hollows | `#2a5a27` | `#9fd39a` | 7.57 / 9.70 |
| Summer (June to August) | Full hill green (today's accent) | `#1e5847` | `#8fd1b5` | 7.72 / 9.46 |
| Fall (September to November) | Sugar maple and oak on the ridges | `#843710` | `#f0a271` | 7.74 / 8.00 |
| Winter (December to February) | Snow shadow blue on the hillsides | `#2f4d72` | `#a8c3e6` | 8.09 / 9.19 |

Watch: never use the season color for links, so "you can act on this" stays one color all year.

## Motifs we can draw ourselves

Rules for all of them, learned from the three October tries:

- **One motif, used the same way everywhere.** Not one per door. Per-door landmarks were the noisiest of the three.
- **It has a job.** It separates sections, marks an empty state, or ends a page. It never sits beside a title or inside the menu.
- **1px to 1.5px lines, in a deco or muted color, `aria-hidden="true"`.** Under 1.5 KB each, inline, sized in the HTML so nothing shifts.
- **No motion.** Nothing to turn off for reduced motion.
- **Never on crisis pages above the fold,** never in the crisis strip, Help now bar or tab bar.
- **Show David screenshots first** (identity.md, "No drawn motif").

| Motif | What it is | Built from | Where it goes | Size |
|---|---|---|---|---|
| **Measured ridge rule** | A thin line of the real profile across the valley (above) | USGS 3DEP elevation | The rule above the footer. The top of the 404 page. | ~0.8 KB |
| **Contour rule** | Three to five stacked contour lines of one real hill, cropped to a strip | USGS 3DEP via `gdal_contour` | Between major sections on long guides. Door page tops, very faint. | ~1 to 1.5 KB |
| **River line divider** | One flat line with a single gentle bend, the way the Mon curves past downtown, traced from USGS hydrography | USGS National Hydrography Dataset (public domain) | Under page titles on door pages, or as an `hr` style. | ~0.3 KB |
| **Lock steps** | A short line that drops in two or three square steps, like pools behind dams | The lock and dam chain on the Mon | Beside step lists (the Route component's rail), replacing the soft `--ridge` rail. Only on routes. | ~0.3 KB |
| **Survey ticks** | A straight line with small tick marks at even spacing and a tiny square "stone" at each end | The Mason-Dixon survey line | The dateline rule in the header, or the top of the footer. Fits the milepost idea. | ~0.4 KB |
| **Quilt corner** | One half-square triangle (a square cut corner to corner), 12 to 16px, in a card's top-left corner. Two triangles make a "Flying Geese" arrow for "next step". | Traditional quilt block grid | Door cards and "who to ask" boxes. Empty states (a single Log Cabin block, drawn in lines). | ~0.2 KB each |

Two tiny examples, so a builder sees the scale. Both use `currentColor` so they follow the theme:

```html
<!-- Survey ticks: header or footer rule. Decorative. -->
<svg aria-hidden="true" focusable="false" viewBox="0 0 600 8" width="100%" height="8" preserveAspectRatio="none" style="color: var(--line)">
  <path d="M0 4H600" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>
  <path d="M60 1V7M120 1V7M180 1V7M240 1V7M300 1V7M360 1V7M420 1V7M480 1V7M540 1V7" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/>
</svg>

<!-- Quilt corner: half-square triangle on a card. Decorative. -->
<svg aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="16" height="16" style="color: var(--brick)">
  <path d="M0 0H16L0 16Z" fill="currentColor"/>
</svg>
```

At 320px and 200% text: rules scale to the width (`preserveAspectRatio="none"` with `vector-effect="non-scaling-stroke"` keeps the line 1px), and corner marks are fixed size outside the text, so nothing reflows.

## Lettering cues mapped to open fonts

Atkinson Hyperlegible Next stays the reading face for headings in every direction: it is the best thing the site has for readers with low vision. The cues below are for one display role at most (big dates, door names, the 404 headline). Each adds about 12 to 25 KB for one weight, Latin only, so **keep it off urgent pages** (under 50 KB) or replace a font instead of adding one.

| Local cue | What the lettering looks like | Open font (license) | Use for | Watch |
|---|---|---|---|---|
| USGS map lettering | Upright roman for places, *italic for water* (rivers, creeks, lakes) | [Source Serif 4](https://github.com/adobe-fonts/source-serif) (OFL), or [Newsreader](https://github.com/productiontype/Newsreader) (OFL) | Water and place names in italic, inside text: *Monongahela River*, *Deckers Creek*, *Cheat Lake*. A small, true detail people can notice. | Italic only for short names, never for whole sentences. |
| Painted downtown wall signs and railroad lettering, 1890s to 1940s | Tall, narrow, plain capitals | [League Gothic](https://github.com/theleagueof/league-gothic) (OFL) | Big dates ("NOV 14") and door names, in capitals, large only | Narrow capitals are hard for some readers. Never below about 1.5rem, never for sentences. Use real text, not images. |
| 19th century broadsides and the brick downtown | Heavy slab serif (Clarendon style) | [Besley](https://github.com/indestructible-type/Besley) (OFL) | The 404 and empty state headlines, maybe page titles | Can feel "Old West." Use upright, one weight, no wood grain effects. |
| WPA silkscreen posters | Flat, geometric, condensed sans | [Barlow Condensed](https://github.com/jpt/barlow) (OFL) | Labels on door cards | Very common on the web, so it can feel generic. Lowest local value of the four. |
| The logo (keep) | Soft, warm serif | Fraunces, already in use | Site name only | No change. |

Fonts to avoid: Public Sans (federal look, identity.md already says so), Overpass and other highway sign faces (official road sign look), any font sold as "Western," "rustic" or "hand-carved," and any font from a WVU style guide.

## Where each piece would appear

| Spot | Best building blocks | Notes |
|---|---|---|
| **Header** | Survey ticks as the rule under the dateline, season accent on that rule | Keep the logo and dateline as they are. Nothing beside the name. |
| **Section dividers** | Contour rule (long guides) or river line divider (door pages) | One kind per page. Never between a title and its answer. |
| **Door pages** | River line under the title, quilt corners on door cards | Same motif on all five doors. |
| **Step lists (routes)** | Lock steps rail | Lock steps say "one step, then the next" and are true to the river. |
| **Empty states** ("Nothing on this date yet") | A single Log Cabin quilt block in lines, about 48px, `--muted` | One plain line of text under it and a link to try next. |
| **The 404** | Measured ridge profile across the top, a Besley or Atkinson headline: "We can't find that page." Then search and the doors. | Calm, not a joke. A real place, not a "lost in the woods" gag. |
| **Footer** | Measured ridge rule above it (replaces the plain brick line), plus "Elevation: U.S. Geological Survey" in the credits | The ridge ends every page the way the hills end every view in town. |
| **Crisis pages, Help now, tab bar** | Nothing | Stay exactly as plain as today. |

## Risks: nostalgia, stereotype, and false official looks

| Idea | Risk | Call |
|---|---|---|
| Coal scrip, company store signs, mine portals, coal tipples | Coal-romance. Scrip was company money, usually good only at the company store ([e-WV: company store](https://www.wvencyclopedia.org/entries/1425), [NPS: scrip](https://www.nps.gov/biso/learn/historyculture/scrip.htm)). How hard it was on families is still argued by historians, which is exactly why it is not a neutral decoration. Energy and mining are live political topics (identity.md already avoids coal). | **Avoid.** Don't use scrip lettering or shapes, even abstractly. |
| FSA photos of Morgantown and Scotts Run (1935, 1938) | Poverty tourism. The LOC set for Morgantown is mostly about hardship ("Center of a rundown mining territory," "Interior of unemployed man's house"). On a site people use when money is tight, that says "this is what we think of you." Many show people who could be identified. | **Avoid on the site.** Fine to cite in a history page about relief work, with care, and David's review. |
| Barn quilts | I found no barn quilt trail in Monongalia County. Trails exist in Pocahontas, Hardy, Monroe, Randolph and Putnam counties ([WV Tourism](https://wvtourism.com/iconic-quilt-patterns/)). Painted barn quilts would be borrowed from other counties and can feel like a tourism brochure. | **Use quilt geometry as a grid, not "barn quilts."** Never call it a barn quilt. Don't trace any real barn quilt. |
| Ramps | Statewide spring custom, often played for jokes about the smell. Says "WV," not "here." | **Words only,** in a seasonal note if there's a real local event with a source. No ramp drawing. |
| Rhododendron, the state outline, the state flag colors, "Montani Semper Liberi" | State symbols. Read as official and statewide. | **Avoid** (already in identity.md). |
| PRT cars, guideway, and the Flying WV colors | Belong to WVU. Would read as a WVU site. | **Avoid.** A plain concrete curve could pass, but it adds little and invites the link. |
| Round badges, stars in circles, ribbons, "est. 1785" lockups | Look like a seal or an official emblem. | **Avoid any round mark.** Keep motifs as lines and squares. |
| USGS benchmark disks (the round brass survey markers) | A federal mark, and round. | **Avoid.** Survey ticks are fine; the disk is not. |
| WPA poster style | Can turn into "vintage National Park poster" nostalgia, which is everywhere and says "anywhere." | **Use only the flat color idea.** No fake print texture, no scenic poster layouts. |
| Woodcut or linocut texture | Texture costs weight, hurts contrast behind text, and drifts toward "rustic." | **Skip texture.** If wanted, a single carved-edge line in one empty state, drawn as simple SVG. |
| Glass | See-through or shiny effects hurt contrast. | **Flat fills only** (palette 4). |
| Mountain "folk" words, dialect spelling | Stereotype. | **Plain words** (identity.md voice notes). |

## Discoveries

Holes in the public record I ran into, for `docs/discoveries/` later if the team wants them:

- No official page I found lists a barn quilt trail for Monongalia County, while several other counties have one. This is not a gap to fill; it's a reason not to borrow the image.
- Sources disagree on the Morgantown lock's size and lift. A cruising guide and a Corps-derived dataset give a 17 foot lift; I found no current Corps page that states it. Don't print a number.
- The 1941 WPA state guide's copyright status is unclear (1941 notice, renewal unknown).

## Suggested next steps for phase 2

- **Direction "Measured land":** palette 1 (Topo sheet), measured ridge in the footer and 404, contour rules, italic water names in Source Serif 4. Strongest "only from here" feel.
- **Direction "Old downtown":** palette 3 (Wharf brick), survey ticks in the header, League Gothic big dates, Besley 404. Closest to today, most "made with care."
- **Direction "Quiet craft":** palette 2 (Sandstone and hemlock) with quilt corners on cards, Log Cabin empty states, lock steps on routes. Warmest.
- Palette 5 (seasons) can sit on top of any of them.
- Run identity.md's "Is it too much?" check on each preview at 390px, light and dark, before showing David.
