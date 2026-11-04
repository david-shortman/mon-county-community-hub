# Image guide: when a picture helps, and how to add one

Pictures are one of the tools we use to explain things, next to the building blocks in the [presentation guide](presentation.md) and movement in the motion guide (`motion.md`, in PR #1377). A picture earns its place when it helps a resident do something faster: match the paper in their hand, find the right door, see where their town sits, or grasp how pieces fit together. Most pages need no picture at all.

This guide is for every agent that writes or changes pages. Read it before adding any drawing, map, diagram or photo.

Last checked: November 2, 2026. Research behind it: the images map ("Where images would help on Everything Morgantown") and the photo sourcing review ("Free local photos and maps for Everything Morgantown"), both done in Claude Duet on November 2, 2026. Questions only David can settle are marked **Open question for David** below. Until he answers, follow the proposed answer.

## The test

Before adding a picture, ask: **what will the reader do faster because of it?** If you can name it, add the picture. If the answer is "the page looks nicer," skip it. If a list, a [Timeline](../../site/src/components/Timeline.astro) or a step path already says it, use that instead.

## Which kind to use

| What the reader needs | Use | Block | Example |
|---|---|---|---|
| Find a part on a letter, notice, card or label they hold | A labeled drawing of generic paper | [`LabeledPicture`](../../site/src/components/LabeledPicture.astro) | The shutoff date on a shutoff notice, the form number on a DoHS letter, the REAL ID star |
| See how pieces fit together | A simple drawn diagram | `LabeledPicture`, or an inline SVG beside a list | Who decides what in Mon County |
| See where something is in the county | The county locator map, drawn from Census data | One shared map component (not built yet) | Which town an area is in |
| Do something in space | A small drawing of the steps | `LabeledPicture` | Where smoke alarms go; how to take a soil sample |
| Recognize a building or a door on arrival | A real photo, with no people in it | Place card photo (not built yet) | The DMV entrance |
| Feel the page is about their town or park | One small real photo | Town and park pages | Coopers Rock overlook |
| See a change over time or a process happen | A still picture first; motion only if the change is the point | See `motion.md` | How a listing gets checked |
| Read a trend in numbers | A chart with a table of every number | [`TrendChart`](../../site/src/components/TrendChart.astro) | How we're doing |

Real places get real photos. Paper, screens and ideas get drawings. The county map is the one drawing of a real place, and it is made from public boundary data, not imagined. It is a small still drawing, not an embedded map, and it sits after the list or words that name the town, never instead of them (presentation rule 5: a list first).

## When to skip a picture

- **Crisis and urgent pages.** Help now, Stay tonight, Tonight, protective orders, leaving an unsafe home, mental health, drugs and alcohol, the food help pages, and any page with the crisis strip. Scared readers need the phone number first, and these pages have a 50 KB limit. The one planned exception is the small shutoff notice drawing on `/utility-bills/`.
- **Anything that shows where a safe place is.** No photos of shelters, domestic violence services, or recovery housing, ever. Not even from the street.
- **The home page.** No hero photo. It would push Help now and the doors down.
- **Decoration.** No drawn motifs, borders, mascots or mood photos (decision [2026-10-30-1000-no-drawn-motif](../decisions/2026-10-30-1000-no-drawn-motif.md)).
- **Screenshots of other sites.** State forms and map tools change and go stale. Draw a simplified version with a "Last checked" date instead.
- **Embedded maps, videos and feeds.** The weight rules ban them. Link out and say where the link goes. The one exception is the bus planner's street map, made from Census data and loaded only on a tap ([decision](../decisions/2026-11-04-1500-street-map-on-tap.md)).
- **When it would push the answer down.** The first phone screen keeps the page's main message and action (presentation rule 1). A picture goes after them.

**Open question for David (Q4): the never-picture list.** Proposed: the pages in the first bullet above, plus anything that shows where a safe place is, plus the home page. Is anything missing, or anything you want to allow?

## Never

- Photos of people who can be identified. This includes faces, readable name tags and distinctive tattoos. Crop them out or pick another photo.
- Stock photos.
- AI-made pictures of real places or real people. The About page promises this.
- Photos or scans of real documents, even with details covered. Draw a generic copy instead.
- Real logos, seals, names, account numbers or phone numbers inside a drawing. Use plain placeholder words like "Account number."
- Photos licensed NonCommercial (NC) or NoDerivatives (ND), "all rights reserved" photos, and photos taken from Facebook, Google Maps or a business's own site.
- Pictures that make fun of people here ([identity.md](identity.md), "The cues we avoid").
- Any fact that lives only inside a picture. Every date, amount, phone number and step must also be real text on the page.

## The rules

1. **Pass the test above.** Every picture explains something.
2. **Words carry the meaning.** The text and lists on the page say everything. The picture only helps people find, match or grasp it.
3. **One picture per idea.** Do not stack two pictures that say the same thing.
4. **Keep it small.** See [Files and weight](#files-and-weight).
5. **Credit every picture that is not our own,** and record it. See [Credit and license](#credit-and-license).
6. **No people, no private details.** See [People and privacy](#people-and-privacy).
7. **Works in light and dark, and in print.** Drawings use the site's color tokens, never fixed colors.
8. **Works with no script.** A picture is plain HTML and SVG. Script never decides whether it shows.
9. **Say what is drawn and what is real.** A drawing of paper is captioned as an example ("A sample shutoff notice"), never as the real thing.
10. **Show David the first one of each kind.** The first labeled drawing, the first map and the first photo each get 390 px screenshots, light and dark, in their PR.

## Alt text and captions

Follow the W3C [alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/).

- **Labeled drawings and diagrams:** the drawing is hidden from screen readers (`aria-hidden="true"`), because the numbered list below it says everything. `LabeledPicture` already does this. Give the list a clear `label`.
- **The county map:** hidden from screen readers. The town names and what the map shows are in real text beside it.
- **Photos:** write `alt` that says what a reader needs from the photo, in one short sentence. Name what to look for: "Glass front door under a sign that reads Monongalia County Health Department." Do not start with "Photo of," and do not repeat the caption word for word.
- **Words inside a picture:** anything a reader needs must also be real text on the page.
- **Captions:** a short line that says the takeaway or what to look for ("The entrance faces the parking lot"). The credit line sits under it, in smaller text.
- **Spanish pages:** translate alt text and captions with the rest of the page.

## Credit and license

Creative Commons asks for four things: title, author, source and license, plus a note when the picture was changed ([CC recommended practices](https://wiki.creativecommons.org/Best_practices_for_attribution)).

- **Before the first photo from someone else:** the content license note must say that photos keep their own license, since everything in `content/` is CC BY 4.0. The same change adds a credits record, so a redesign cannot drop a credit. Both are in the photo sourcing issue drafts. Add no third-party photo until they land.
- **Record every picture:** file, title, author, license, license link, source link, changes made ("cropped"), date added. Our own drawings and David's own photos are recorded as "own."
- **CC BY-SA:** an edited copy stays CC BY-SA. Say so in the credit line.
- **Public domain and CC0:** no credit is required, but give one as thanks. Library of Congress photos use the credit line on their own record.
- **Volunteer photos:** only with a one-line written yes to CC BY 4.0 and the name to credit, kept in the credits record.

**Open question for David (Q3): how the credit line looks.** Proposed: one small line under each photo, in `--muted` text: "Photo: [title](file page) by Author, [license](license deed), cropped." Example: "Photo: Mon Court House by Stryker33, CC BY-SA 3.0, cropped." The map gets: "Map: U.S. Census Bureau, 2026 TIGER/Line, simplified."

## Where pictures come from

Take the first source that fits the need.

1. **Words or an existing block.** If a list or Timeline does the job, stop here.
2. **Draw it ourselves,** for paper, cards, screens, diagrams and steps. Check the layout against a real public sample (a posted agenda, a blank state form, an agency's own sample image), then draw it generic.
3. **Public data,** for maps. Census TIGER/Line boundaries are not copyrighted. Do not use OpenStreetMap data, since its share-alike rule is unclear for a drawn map file. Never redraw from the county's parcel viewer: link to the Assessor's site instead.
4. **Public domain and CC0 photos,** such as federal survey photos (HABS/HAER), U.S. Fire Administration pictographs, and CC0 files on Wikimedia Commons.
5. **David's own photos,** or a volunteer's with a written yes. These cover the doors people must find, since no free photo exists for most of them.
6. **CC BY and CC BY-SA photos** from Wikimedia Commons or Flickr, after reading the license on the file's own page.
7. **State and local sources** (the city, the county, WVU's history center, the State Archives, WV Tourism) only with a written yes for that photo. Treat them as "not now."

The photo sourcing review lists the photos that are ready to use and the ones David plans to take.

## People and privacy

- Open every photo at full size before using it. Previews hide faces.
- No identifiable people and no readable license plates. Crop, or pick another photo. Do not blur.
- No house numbers or the front of a private home.
- Strip location and camera data from every file before it goes in the repo. The repo is public.
- Keep full-size originals out of the repo. Only the resized copy goes in.
- Photos taken for the site are taken from a public sidewalk or road, on a quiet morning. On a private lot, such as a community center's, ask first.

## Files and weight

The [weight budget](presentation.md#weight-budget) counts images: under 50 KB for urgent pages and 150 KB for the rest, page and everything it loads. `site/scripts/check-weight.mjs` counts every `<img src>` and every `srcset` candidate, even inside a closed box.

| Kind | Format | Size to aim for |
|---|---|---|
| Labeled drawing or diagram | Inline SVG in the page, with a `viewBox` and no fixed width | Under 5 KB on urgent pages, under 10 KB elsewhere |
| County map | Inline SVG, simplified at build time | A few KB |
| Photo | WebP, about 600 px wide, with `width`, `height`, `loading="lazy"` and `decoding="async"` | 15 to 30 KB |

- **Drawings:** color with classes that use the site's tokens (`--fg`, `--card`, `--line`, `--muted`, `--accent`), the way `FollowOneListing.astro` does. The tokens change with the Press look (#1425), so never hard-code a color. Use `currentColor` where a shape should match the text.
- **Photos:** one size only, no `srcset`, since every candidate counts toward the budget. No PNG or JPEG photos, no GIFs.
- **Print:** pictures do not break across pages (`break-inside: avoid`, as `LabeledPicture` does).

**Open question for David (Q2): photos on a tap or on the page.** A photo inside a closed "See the entrance" box keeps first screens light. A photo on the page roots it faster. Proposed: on a tap for place cards, on the page for town and park pages. If on a tap, the photo should load only when the box opens (with a plain link to the photo when scripts are off), since the weight check counts it otherwise.

## Drawings made by agents

**Open question for David (Q1): do agent-made drawings count as "our own drawings"?** identity.md allows "our own drawings." The About page promises no AI-made pictures of real places or people, and `LabeledPicture` bars "AI-made pictures." Proposed: yes, small SVG drawings that agents write by hand in code count as our own, for generic paper, cards, screens and diagrams, never for real places or people. Pictures from image-making AI tools are never used. If yes, should the About page say that agents draw the sample notices and diagrams?

Until David answers, agents may draft these drawings in a PR, but none goes live.

## How it ties to motion

- A still picture comes first. Use movement only when the change itself is the point (`motion.md`, "When to reach for it").
- A picture inside a scroll story follows both guides: the still version reads fine on its own, and nothing moves on crisis pages.
- No animated GIFs, autoplay video, or SVG that moves on its own.

## Before you open the PR

- [ ] The picture passes the test, and the page says everything in words too.
- [ ] `npm run build` passes, including the weight check.
- [ ] Checked at 320 px and 390 px, light and dark, against the [rubrics](../rubrics/README.md), and `node scripts/a11y-deep.mjs` in `site/`.
- [ ] Every non-own picture has a credit line and a credits record entry.
- [ ] Every photo was checked at full size for people, plates and homes, and its location data is stripped.
- [ ] The first picture of its kind has screenshots for David.

Pictures on Help now or Get through this month pages get `for:david` from the High stakes check on their own.

## Sources

- W3C WAI, [An alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) and [Images tutorial](https://www.w3.org/WAI/tutorials/images/)
- Creative Commons, [Recommended practices for attribution](https://wiki.creativecommons.org/Best_practices_for_attribution)
- Schubbe and others, [Using pictures to convey health information](https://www.epistemonikos.org/en/documents/235956b767ce72bb18530b059118e2910f4b9c88), Patient Education and Counseling, 2020 (pictures with a few words help people with lower health literacy most)
- U.S. Census Bureau, [TIGER/Line shapefiles](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html)
- OpenStreetMap, [copyright and license](https://www.openstreetmap.org/copyright)
- U.S. Fire Administration, [smoke alarm pictographs](https://www.usfa.fema.gov/gallery/pictographs/smoke-alarms.html)
- License checks for individual photos were made on each file's own page on November 2, 2026, in the photo sourcing review.
