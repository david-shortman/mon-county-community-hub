# Presentation guide: showing information so it helps

This guide says what shape each kind of information takes on the hub, so a person can understand it fast and act on it, on any phone. It sits next to two other guides:

- [`identity.md`](identity.md) covers how things look: colors, the ridgeline, local words, and the mobile first rules (action buttons, tab bar, tap sizes).
- The [design rubrics](../rubrics/README.md) cover how we score what we ship.

This guide covers the part in between: **which building blocks to use for which information, and how the site is organized around people's needs.** When this guide and a rubric seem to disagree, the rubric wins and this guide gets fixed.

Last checked: October 28, 2026. The work to build it out is tracked in the epic #172.

## Who we design for

These facts set the floor. Each one is sourced; see [Sources](#sources). The full set of county numbers, with years and gaps, is in [audience facts](../playbook/audience-facts.md).

- **Almost everyone has a phone, and many have only a phone.** 91% of U.S. adults own a smartphone, and 16% use a smartphone with no home broadband (Pew, 2026). For many people the hub is a phone page or nothing.
- **Phones and data are often cheap and slow.** A typical phone today is about as fast as a $350 phone from 2020, on about 7 Mbps. A content site should load in 3 seconds on that phone, which means about 1.4 MB at most, with no more than 75 KB of script (Russell, 2024). Free or prepaid phones are slower than that, and data runs out.
- **About 1 in 6 adults here reads at the lowest level, and about 1 in 4 struggles with numbers.** PIAAC estimates for Mon County are 16% for literacy and 26% for numeracy, against 21% and 33% for West Virginia (PIAAC Skills Map). People with limited literacy often spend 15 seconds or less on a page, skip dense text, reread words, rarely go back to the menu, and click only one or two search results (Health Literacy Online).
- **People find help through other people.** Parents looking for services started with word of mouth, local Facebook groups, and professionals, not directories. Old info and broken links were what lost their trust (UK Department for Education research). So helpers who send a page to someone are a main audience too. The reaching people epic (#155) covers how we reach them; this guide covers what they see when they arrive.
- **Mon County households, in numbers** (ACS 2024 1-year, county estimates with wide margins). 14% of households have only a cell data plan for internet and 7% have no internet at all, rising to 19% of households earning under $20,000 (table S2801). 9% of households have no car, and 17% of renters (B25044). 13% of residents have a disability, most often with thinking and memory or with walking, and about 38% of people 65 and older do (S1810). About 72% of residents live outside Morgantown city limits.
- **What that means for pages.** Show the town and how to get there on every listing, not just "Morgantown". Say whether an entrance is step free when the source says so. Do the math for people instead of showing percents or formulas.
- **Not everyone reads English first.** About 1.8% of residents speak English less than very well. The most common languages at home after English include Spanish, Arabic, and Chinese (ACS 2020 to 2024 5-year, C16001). #181 looks at how local groups offer help in other languages.
- **Some readers are in danger or in crisis.** A person reading the stay tonight page may be fleeing someone who checks their phone.

## The rules

Every page follows these. The rubric criteria they come from are in brackets.

1. **One main message and one action first.** The first screen on a phone says what the page is for and what to do now. Put the most important thing in the first lines, show it with a visual cue, and back it with a picture or block when that helps (CDC Clear Communication Index items 1 to 5) [PL2, II1].
2. **Every icon has a word next to it.** Pictures with a few words help most for people with lower health literacy, but an icon alone is a guess (Schubbe and others, 2020). Icons stay decorative and hidden from screen readers, as `Icon.astro` already does [A3, II2].
3. **Show, don't just tell, when a picture explains faster.** A timeline for a process with dates, a days-left chip for a deadline, a labeled picture of a letter people get. Not decoration, not photos of people (see identity.md).
4. **Short words, short lines.** Sentences of 20 words or fewer, lists of 7 or fewer, numbers as people use them ("1 in 4", "in 3 days"), and we do the math for them [PL1, PL3, PL6].
5. **A list first, a map only on a tap.** In a study of map and text search on phones, people chose text when rushed (71%) and maps when they did not know the area (94%), and the authors recommended both (Church and others, 2010). A map also costs data, so it loads only when asked for.
6. **Every place is something you can act on.** Call, Directions, Add to calendar, Share, and Send by text, using the [`Actions`](../../site/src/components/Actions.astro) component. A button shows only when the source gives what it needs [II4, TR6].
7. **Say when it is true.** Hours in words always. An "Open now" or "Closes at 5" badge only as an extra the phone works out from its own clock, never instead of the hours. A "Last checked" date on every listing [II3, TR1, TR2].
8. **Works with no script, then gets better.** Every page is complete as plain HTML and CSS. Script only adds extras (the open now badge, Share, saving a checklist). No single page apps (GOV.UK Service Manual) [A8].
9. **Stay inside the weight budget.** See [Weight budget](#weight-budget) [A8].
10. **A person is always one tap away.** Every page, every empty state, and every dead end ends with a way to reach a person: the group itself, or WV 211 (call 211, text your ZIP code to 898-211, or chat at wv211.org). See [`HelpNow`](../../site/src/components/HelpNow.astro) [II6, TR6].
11. **Safe by default.** No tracking, no accounts, nothing sent from the phone. Pages about violence or abuse get a quick exit (GOV.UK Design System "Exit a page quickly") [TR4].
12. **Easy to keep and pass on.** Pages print cleanly on one or two pages, can be sent by text, and open with no signal once visited (#157, #160, #150).

## Weight budget

Measured as everything the page loads, compressed, on first visit. Tracked in CI by #180.

| Page kind | Examples | Budget | Script |
|---|---|---|---|
| Urgent | Stay tonight, food today, any crisis page | **Under 100 KB** | None required. Extras under 10 KB. |
| Everyday | Guides, deadlines, how do I pages | **Under 300 KB** | None required. Extras under 30 KB. |
| Never | Any page | Over 1 MB | Content that needs script to show |

These match rubric A8: under 300 KB scores 2, under 100 KB with no required script scores 3. Ways to stay inside it:

- System fonts only (identity.md already says this).
- Our own small SVG drawings, sized in the HTML. No photos unless they explain something, and then compressed and lazy loaded.
- No embedded widgets: no embedded maps, calendars, videos, social feeds, or job boards. Link out instead, and say where the link goes.
- CSS inlined, as the `Base` layout already does.

## Building blocks

Reuse these instead of inventing a new layout. "Status" says whether it exists yet.

| Block | What it is | No-script version | Status |
|---|---|---|---|
| **Crisis strip** | A line at the top of safety pages: "In danger? Call 911. In crisis? Call or text 988." | Two plain `tel:` and `sms:` links | #174 |
| **Quick exit** | A button that leaves the page fast, with a note that it does not erase history | A plain link to a neutral site; script adds the triple Shift shortcut | #174 |
| **Need picker** | Big buttons with an icon and a word: "A bed tonight", "Food", "Help with a bill" | Links to pages or to sections on the same page | #173 |
| **Place card** | Name, who it is for, hours in words, open now badge, tags, action buttons, last checked | Everything but the badge | #176 |
| **Tags** | Small icon plus word labels: walk in, appointment, no ID needed, free, hot meal, groceries, kid friendly, on a bus line | Plain text | #176 |
| **Day list** | "Open today" first, then each day of the week, with jump links | Anchor links | Use in #60 |
| **Days left chip** | "in 3 days", "closes Friday" next to the date | Worked out at build time; the site rebuilds every morning | Exists (calendar) |
| **Step path** | Numbered steps for "How do I...": what to do first, what to bring, cost, where, how long | Plain ordered list | #179 |
| **Question path** | One question per small page that leads to an answer: "Where should I go for care?" | Each answer is a link to the next page | #178 |
| **Checklist** | "What to bring" with tick boxes | Boxes work but do not save; script saves them on the phone only | #179 |
| **Timeline** | A dated line of what happens and when, such as an eviction case | An ordered list with dates | #179 |
| **Labeled picture** | A drawing of a letter or notice with numbered callouts that match a list below it | The list carries all the meaning; the picture only helps | #179 |
| **Printout** | A one page version that a pantry, library, or clinic can post | Print stylesheet | #157 and #160 |
| **Send by text** | A link that opens a text message with the page link filled in | An `sms:` link | #157 |
| **Map on tap** | A Directions button that opens the phone's own map app | A link to the map app | Exists (`Actions`) |
| **211 fallback** | The help now box | Plain links | Exists (`HelpNow`) |

## What every listing needs

People need these facts to decide whether to go, and they give up when the facts are missing (UK Department for Education research). A listing that cannot fill the first seven waits until it can.

1. **What it is**, in the words residents use.
2. **Who it is for**, including who it is not for.
3. **Where**, as the address the source publishes.
4. **When**, as hours the site can read, plus any note like "first come, first served".
5. **Cost**, even when it is free.
6. **How to get in:** walk in, appointment, or call first.
7. **How to reach them:** phone, text, or web, from the source.
8. **What to bring**, when the source says.
9. **Languages and access**, such as an interpreter or a step-free entrance, only when the source says. Never guess.
10. **Last checked date and source**, always (already required).

Items 4, 6, 8, and 9 are not in the content schema yet. #177 adds hours, how to get in, and languages and access; #159 adds what to bring and what happens next. Both update `content/README.md` and the content check. #139 already moves the stay tonight hours into the data.

## How the site is organized

The site is organized by what people need, not by who provides it. Labels use residents' own words (rubric IA3).

### Home screen

The home page opens with the need picker: up to eight buttons with an icon and a word, then the help now box, then what is coming up. A button appears only when its page exists, so nobody lands on an empty section. Proposed buttons, in order of urgency:

1. A bed tonight (live: `/stay-tonight/`)
2. Food
3. Help with a bill (live: `/utility-bills/`)
4. Health care
5. Housing help
6. Deadlines (live: `/calendar/`)
7. City and county: how do I
8. All pages

The bottom tab bar stays as identity.md describes. The tab bar and the need picker should use the same words for the same page (rubric II8).

### Site map by need

| Need | Page | Main blocks | Status |
|---|---|---|---|
| Crisis and a place to stay tonight | `/stay-tonight/` | Crisis strip, quick exit, need picker, place cards | Live; redesign in #175 |
| Food | `/food/` | Day list, place cards, tags, printout | Planned in #60 |
| Deadlines | `/calendar/` | Days left chip, add to calendar, checklist | Live |
| Help with a bill | `/utility-bills/` | Step path, place cards | Live |
| Health care | `/health/` | Question path, place cards with cost tags | Needs research (#21) |
| Housing help | `/housing/` | Step paths, timeline, labeled picture | Not started |
| Jobs | `/jobs/` | Short cards with tags, links to local job help | Not started |
| Events | inside `/calendar/` for now | Day list, tags, add to calendar, printout | Live as part of the calendar |
| City and county services | `/how-do-i/` | Step paths, "City or county?" question path | Research in #20 and #86 |
| Recycling | `/recycling/` | Place cards, days left chip | Live |

## Patterns by area

What each kind of information should look like, and how it holds up on a cheap phone.

### Crisis and a place to stay tonight

- **Shape:** crisis strip at the very top, then four big choices (a bed tonight, a warm place right now, food tonight, safe from someone), each jumping to its place cards. Place cards lead with a big Call button, hours in words, who it is for, and how to get in. Safety content has a quick exit.
- **Why:** people here may be scared, cold, or out of battery. One clear action beats everything else on the page.
- **On a cheap phone:** under 100 KB, no script needed, saved for offline once visited (#150), readable at 320px wide.
- **Mockup:** [`mockups/stay-tonight.html`](mockups/stay-tonight.html). It uses made-up places only.

### Food

- **Shape:** "Open today" first, then each day of the week. Tags say walk in, no ID needed, hot meal or groceries, and delivery. A one page weekly printout that pantries can post.
- **On a cheap phone:** a plain list with jump links. No map unless tapped.

### Deadlines

- **Shape:** a days left chip in words, not only color. Add to calendar on every item (already built). A "what to bring" checklist where the source lists documents.
- **On a cheap phone:** calendar files open in any calendar app with no account. Checklists work without script but only save with it.

### Health care

- **Shape:** a question path, "Where should I go?", that points to emergency care, urgent care, a clinic, or free and sliding fee care, each with a cost tag. One main message per page. Risk and numbers follow the CDC Clear Communication Index: say what the risk is, what to do, and use "1 in 4", not percents.
- **On a cheap phone:** each question is its own small page, so it needs no script and loads fast.
- **Care:** high stakes. Content needs the extra review in #97, and we describe options, never give medical advice.

### Housing help

- **Shape:** step paths such as "Got an eviction notice?" and "Behind on rent", each with what to do first. A dated timeline of the court process. A labeled drawing of a sample notice so people can match it to the paper in their hand.
- **On a cheap phone:** small SVG drawings with the meaning in the list beside them.
- **Care:** legal timelines must come from a court or legal aid source, with a checked date.

### Jobs

- **Shape:** short cards with tags for pay, schedule, on a bus line, and no degree needed, plus links to local job help.
- **On a cheap phone:** link out to job boards instead of embedding them.

### Events

- **Shape:** this week, grouped by day, with tags for free, kid friendly, and accessible. Add to calendar and a printable flyer.
- **On a cheap phone:** no embedded calendar widgets.

### City and county services

- **Shape:** "How do I..." step paths with the steps, what to bring, cost, hours, and online or in person. A "City or county?" question path, since people often do not know which one handles something. Voting questions point to the WV Secretary of State (charter rule).
- **On a cheap phone:** plain numbered steps.

## Using this guide

1. Start a new page by finding its need in the site map, then use the blocks listed for it.
2. Fill every listing field you can source. Leave out what you cannot source.
3. Check the weight budget and the rubrics at 320px and 390px, light and dark, as identity.md says.
4. If no block fits, propose a new one by PR to this file, with the evidence that called for it.

## Sources

Read on October 28, 2026.

- Pew Research Center, [Mobile fact sheet](https://www.pewresearch.org/internet/fact-sheet/mobile/) (2026 survey)
- Barbara Bush Foundation, [West Virginia literacy card](https://literacy.fathom.info/assets/cards/BBFFL-Literacy-Card-WV.pdf) (PIAAC)
- U.S. Office of Disease Prevention and Health Promotion, [Health Literacy Online](https://odphp.health.gov/hlo/2016/full)
- CDC, [Clear Communication Index user guide](https://www.cdc.gov/ccindex/pdf/clear-communication-user-guide.pdf)
- Schubbe and others, [Using pictures to convey health information](https://www.epistemonikos.org/en/documents/235956b767ce72bb18530b059118e2910f4b9c88), Patient Education and Counseling, 2020
- Alex Russell, [The Performance Inequality Gap, 2024](https://infrequently.org/2024/01/performance-inequality-gap-2024/)
- GOV.UK Service Manual, [Building a robust frontend using progressive enhancement](https://www.gov.uk/service-manual/making-software/progressive-enhancement)
- GOV.UK Design System, [Exit a page quickly](https://design-system.service.gov.uk/patterns/exit-a-page-quickly)
- W3C, [Understanding Reflow (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/reflow) and [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable)
- Church, Neumann, Cherubini, and Oliver, [The "Map Trap"?](https://archives.iw3c2.org/www2010/proceedings/www/p261.pdf), WWW 2010
- UK Department for Education, [How parents find family services and information](https://design-histories.education.gov.uk/connect-families-to-support/single-directory-understanding-how-parents-find-family-services-and-information)
- Digital Government Hub, [Basics of texting safety net clients](https://digitalgovernmenthub.org/wp-content/uploads/2022/11/Basics-of-Texting-Safety-Net-Clients-2022.pdf), 2022
- West Virginia Bureau for Family Assistance, [West Virginia 211](https://bfa.wv.gov/page/west-virginia-211)
- U.S. Census Bureau, American Community Survey for Monongalia County: [county profile on Census Reporter](https://censusreporter.org/profiles/05000US54061-monongalia-county-wv/) and tables S2801, S1810, B25044, and C16001 on data.census.gov. Compiled for the hub's audience research on October 28, 2026; data.census.gov could not be reached from the session that wrote this guide, so re-check before quoting on a resident page.
- City Population, [Monongalia County population by place](https://www.citypopulation.de/en/usa/westvirginia/54061__monongalia/) (share outside Morgantown city limits)
- NCES, [PIAAC Skills Map, West Virginia](https://nces.ed.gov/surveys/piaac/skillsmap/src/PDF/WEST_VIRGINIA.pdf) (data 2012 to 2017)
