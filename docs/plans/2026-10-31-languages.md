# Plan: the site in other languages

A plan for a secondary project David named on October 31, 2026: making Everything Morgantown useful to people who read another language better than English. This is a plan only. Nothing here changes the site. The decisions only David can make are listed at the end and tracked in a `for:david` epic issue.

It builds on [`docs/research/language-help.md`](../research/language-help.md) (#181), [`docs/research/immigrant-help-statement.md`](../research/immigrant-help-statement.md) (#229) and the [Help in your language](../../site/src/pages/help-in-your-language.astro) page (#840), which today says: "This site is in English only for now. We do not use machine translation, because a wrong phone number, date or rule could send someone to the wrong place." This plan keeps that promise. It adds translation only where a person who reads the language has checked it, and it never translates a phone number, date or address at all (see "Facts are never translated" below).

## Summary

- **Start with Spanish, small.** Spanish has the most speakers in the county, the most official materials already translated, and the most local groups that already work in it.
- **Pilot two things:** the crisis strip and the Help in your language page, in Spanish, reviewed by a fluent person before they go live. About 500 English words.
- **Link before we translate.** For benefits and health rules, point to the official Spanish (or other) pages the agency already publishes, instead of writing our own version of the rules.
- **Facts stay in one place.** Phone numbers, addresses, hours and links come from the same English record at build time, so a translated page can never show an old number.
- **A translation that falls behind the English is hidden** on high-stakes pages, and the English shows instead.
- **Cost:** the pilot is $0 with a volunteer reviewer, or roughly $50 to $150 per language if David chooses to pay a professional (an estimate to confirm with quotes).

## 1. Which languages, and the evidence

### Census: language spoken at home (the main evidence)

Table C16001, American Community Survey 2020 to 2024 5-year estimates, Monongalia County, people age 5 and over. Downloaded on October 31, 2026 as a published table through Census Reporter's free table download ([county profile](https://censusreporter.org/profiles/05000US54061-monongalia-county-wv/), [table C16001](https://censusreporter.org/data/table/?table=C16001&geo_ids=05000US54061)). The Census Bureau's own data API now asks for a key, so we did not use it.

Of 102,307 people age 5 and over, 95,568 speak only English at home. About **1,836 people (1.8%) speak English less than "very well"**. Census calls this group limited English proficient. By language:

| Language group (as Census groups them) | Speak it at home | Speak English less than "very well" (margin of error) |
|---|---|---|
| Chinese (including Mandarin and Cantonese) | 817 | **458** (plus or minus 209) |
| Spanish | 1,575 | **335** (plus or minus 169) |
| Other Indo-European languages | 1,343 | **328** (plus or minus 221) |
| Arabic | 968 | **260** (plus or minus 172) |
| Vietnamese | 296 | 150 (plus or minus 102) |
| Korean | 141 | 89 (plus or minus 73) |
| Other Asian and Pacific Island languages | 344 | 63 (plus or minus 66) |
| Russian, Polish or other Slavic languages | 406 | 62 (plus or minus 79) |
| French, Haitian or Cajun | 153 | 52 (plus or minus 61) |
| Tagalog (including Filipino) | 204 | 16 (plus or minus 22) |
| Other and unspecified languages | 283 | 14 (plus or minus 31) |
| German or other West Germanic languages | 209 | 9 (plus or minus 19) |

What this tells us, and what it does not:

- **The top four are close, and the margins overlap.** Chinese, Spanish, "other Indo-European" and Arabic cannot be ranked against each other with confidence. Only Spanish clearly has the most speakers overall.
- **"Other Indo-European" is many languages in one row** (for example Hindi, Urdu, Bengali, Nepali, Persian, Gujarati and Greek). The current county table does not break it down, so it is not one translation target. Census published finer language detail for counties only in older special tables; checking those is a follow-up.
- **Many speakers are likely WVU students and their families,** who come and go. That makes the numbers move year to year.
- **No single language reaches 1,000 people with limited English here.** Federal language access guidance from 2002 used "5 percent or 1,000 people, whichever is less" as a safe harbor for when agencies that get federal money should translate key written documents ([2003 Federal Register notice](https://www.govinfo.gov/content/pkg/FR-2003-05-29/pdf/03-13125.pdf)). We are not a federal grantee and federal language access policy changed in 2025, so this is only a yardstick: it says why so few local offices translate their pages, and why we should rely on interpreters and official translations more than on our own.

### WVU international students

- The Open Doors 2025 fact sheet for West Virginia (school year 2024/25) counts **967 international students at West Virginia University** and 2,434 in the state. The leading places of origin for the state as a whole are Canada (7.8%), India (7.5%), Nigeria (5.2%), the United Kingdom (5.1%) and Spain (4.7%). ([Open Doors, West Virginia 2025](https://opendoorsdata.org/wp-content/uploads/2025/11/OpenDoors_FactSheet_West-Virginia_-2025.pdf), read October 31, 2026.)
- We did not find a current public WVU report of international students by country. That is a gap; WVU's institutional research office or ISSS may publish one.
- International students must show English skills to be admitted, so they are a weak signal for this project. Their spouses, parents and children may be a stronger one, and we have no public count of them.

### Refugee resettlement

- Catholic Charities West Virginia's program page, checked October 31, 2026, still describes refugee resettlement in the present tense ("the only Refugee Resettlement agency in West Virginia") and does not name a Morgantown office or say the program is paused. ([program page](https://www.ccwva.org/programs/west-virginia-immigration-refugee-resettlement-services/))
- A newsletter post found in search says West Virginia can no longer take refugees after the U.S. Conference of Catholic Bishops left the federal resettlement program. We could not open the post, it has no date we could see, and it is not an official source, so we do not rely on it.
- We found no public count of recent arrivals to Monongalia County by country or language. The State Department's Refugee Processing Center publishes state arrival reports; checking them is a follow-up. Whether new families are arriving in Morgantown now would need a phone call, which is David's call (already noted in the #229 statement).

### Schools

- We found no public count of English learners in Monongalia County Schools. The state's data dashboard, ZoomWV, is the likely place, but it did not load in our session. The district's 2024-25 to 2025-26 headcount (11,159 to 11,070) is in the state's [Education Snapshot](https://wvde.us/sites/default/files/2025-11/Education%20Snapshot%20Booklet%202024-2025.pdf), with no English learner column.
- A search result quotes the district's welcome page as saying students speak 53 native languages and come from 60 countries. The page did not load for us, so this is unconfirmed and not used.

### What local groups already offer (from #181 and #229, checked October 30, 2026)

- **Interpreters, free:** WVU Medicine hospitals, the Monongalia County Health Department, the state courts, and the state Department of Human Services under its June 2023 language access plan (bilingual staff for Spanish, outside interpreters when needed).
- **Pages in other languages:** Mountain State Justice has pages in Spanish and Arabic. DoHS posts its nondiscrimination notice in Spanish ([nondiscrimination page](https://dohs.wv.gov/nondiscrimination-policies-and-plans), checked October 31, 2026).
- **Spanish speakers on staff:** Literacy Volunteers of Monongalia and Preston Counties says "Hablamos Español" (`docs/groups/new-residents.md`).
- **Crisis line:** the 988 Lifeline home page says its text and chat services are available in Spanish, and it links an interpretation services page (checked October 31, 2026). News reports say calls get interpreters in over 200 languages and that pressing 2 reaches Spanish speakers; we have not checked those details on 988's own pages yet, so they stay off the site until we do.
- **Learn English:** MTEC adult education and Literacy Volunteers.

### Recommendation

1. **Spanish first.** It has the most speakers, the most official translated material to link, and the most local helpers who already work in it, which means reviewers are easiest to find.
2. **Then Chinese (Simplified) and Arabic, as David decides.** Both are in the top four for limited English and both have local signals (Mountain State Justice's Arabic pages; the Chinese count is the largest single group). The choice between them, or both, should follow where a reviewer or partner is available.
3. **Not "other Indo-European" as one target** until we know which languages it holds.
4. **For every other language, interpreter help instead of translation:** a small "I need an interpreter" card the reader can show at an office, and the Help in your language page. That is the help that works for a language we will never translate.

## 2. Which pages first

Ranked by how much harm a missing or wrong page could do, and by how many people it reaches. Pages marked high stakes already wait for David under the High stakes check.

| Rank | Page or part | Why | Risk if wrong | How |
|---|---|---|---|---|
| 1 | **Crisis strip** (on pages a person in danger may read) | One line, read in emergencies | Very high, but the text is short and the numbers come from records | Human translation, reviewed; numbers stay from records |
| 2 | **Help in your language** page | How to ask for an interpreter anywhere; the bridge to everything else | Medium | Human review; this is the pilot page |
| 3 | **"I need an interpreter" card** | Works in any office, in many languages, with no page to read | Low (one short sentence per language) | Short phrase per language, each checked by a fluent reader |
| 4 | **Food today and food help** | Most-ranked need in the needs register draft (PR #984) | Medium: hours and places change | Translate the frame text; hours, places and phones come from records |
| 5 | **Shelter tonight** | Urgent, at night | High | Translate the frame text; link providers' own pages |
| 6 | **Getting health care** (clinics, the hospital, the Health Department) | Interpreters are free here, and people often do not know | Medium | Short page; link WVU Medicine and Health Department language help |
| 7 | **Benefits** (SNAP, Medicaid, WIC) | Rules are complex and change | **Highest** for our own wording | Link official translated pages first; translate only "where to apply and how to ask for an interpreter", never our own summary of the rules |

Everything else stays in English, with the language switcher hidden on those pages.

## 3. How to translate, and the risks

### The options

| Option | What it is | Good for | Risks | Cost |
|---|---|---|---|---|
| **A. Link official translations** | Point to pages agencies already publish in Spanish and other languages (988, federal health and benefits sites, DoHS notices) | Benefits rules, health coverage, legal rights | The link can break or the page can be older than the English; we check it like any source | $0 |
| **B. Human translation, professional** | A paid translator, ideally certified for the language pair | Crisis, shelter, benefits "how to apply" | Cost; turnaround for each update | Market rates are often quoted at roughly 10 to 30 cents per English word (estimate, get quotes) |
| **C. Human translation, community reviewed** | A fluent volunteer translates or reviews | The pilot; frame text on most pages | Uneven skill; volunteers leave; need for a second reader on high-stakes text | $0, plus David's time to find people |
| **D. Machine draft plus human review** | Claude drafts, a fluent person corrects and signs off | Lower-stakes text, and updates to text a reviewer already approved | Machine errors that look fluent: a wrong word for "free", a rule turned around, a false friend. Only as good as the review | $0 for the draft; reviewer time |
| **E. Reader's own browser translation** | Chrome, Safari and phones already translate pages | Everything, today | Unreviewed; we cannot control it | $0 |

### Recommendation

- **Use E today, on purpose.** Write English pages that translate well: plain words, short sentences, no text inside images, real `lang` tags, phone numbers as plain text. This helps every language at once and costs nothing. The Help in your language page can say how to use the phone's translate button, with the same warning it gives now: check numbers and dates with the office.
- **High-stakes pages (crisis, shelter, food, benefits): A first, then B or C with a second fluent reader.** Never D alone.
- **Other pages: C or D,** always with a named reviewer role and a review date.
- **Never publish an unreviewed machine translation as our own page.** That keeps the promise on the Help in your language page. Changing that sentence is itself a resident-facing change and is part of David's decision.

### Accuracy and the "facts must match sources" rule

Every fact on the site must match a current official source. Translation adds a second step where meaning can drift, so:

- **Facts are never translated.** Phone numbers, addresses, hours, prices, dates and links are read from the English record at build time and shown inside the translated page. A translator only touches the sentences around them. When the record changes, the translated page changes too.
- **Hours shown in words** come from the machine-readable `opening_hours` field when an entry has one, formatted for the language by the browser's date tools, so there is no "hours" sentence to translate.
- **A translated sentence makes the same claim as the English sentence, no more.** The reviewer checks it against the English, and the English is already checked against the source.
- **Most sources are in English only.** A translated page cites the same source with a note "(en inglés)", so readers know the source page will be in English.
- **Program names stay official.** SNAP, WIC and Medicaid keep their names, with a short explanation, so a reader can say the name at the office.
- **Back-translation for David.** Each translation PR includes a machine back-translation to English, so David can check meaning without reading the language.

## 4. Technical design (Astro)

The site runs Astro 5 with content in YAML records (`content/`) loaded by `site/src/lib/content.mjs`.

### Routing

- Turn on Astro's built-in i18n routing in `site/astro.config.mjs`: `locales: ['en', 'es']`, `defaultLocale: 'en'`, `routing: { prefixDefaultLocale: false }`. English URLs do not change. Spanish pages live under `/es/`.
- **Keep English slugs under `/es/`** at first (`/es/help-in-your-language/`), so each page maps one-to-one to its English page. Translated slugs can come later.
- **No automatic fallback.** Astro can fall back to English for missing pages; we turn that off so a `/es/` page exists only when it has been translated and reviewed. A missing page links back to the English page with one sentence in Spanish saying it is only in English.
- Links inside `/es/` pages use Astro's `getRelativeLocaleUrl()`. A link to a page with no Spanish version goes to the English page and is marked "(en inglés)".

### Language switcher

- A small link in the header of `Base.astro`, shown only on pages that exist in more than one language. It names each language in that language ("Español", "English"), never with a flag.
- It goes to the same page in the other language, not the home page.
- No cookies or stored choice at first; the URL carries the language.

### Page markup

- `Base.astro` takes a `lang` prop and sets `<html lang>` (today it is always `en`).
- Each translated page adds `<link rel="alternate" hreflang="en" ...>`, `hreflang="es"` and `hreflang="x-default"` (pointing to English).
- The sitemap integration's `i18n` option adds the same pairs to `sitemap.xml`.
- Site search, `llms.txt` and the API stay English-only in the pilot. Later, the API can add a `lang` field.

### Content schema

Translations live in **separate sidecar files**, so English records stay clean and two PRs rarely touch the same file:

```yaml
# content/translations/es/resources/wvu-medicine-language-services.yaml
of: resources/wvu-medicine-language-services   # the English record
lang: es
fields:                                         # only text fields, never phones, addresses, hours or links
  name: Servicios de idiomas de WVU Medicine
  summary: Intérpretes gratis en los hospitales de WVU Medicine. ...
english_hash: 3f9a1c0e                          # hash of the English text these were made from
method: community-reviewed                     # official-link | professional | community-reviewed | machine-plus-review
translated: 2026-11-10
reviewed: 2026-11-12
reviewer: es-reviewer-1                        # a role ID; who that is stays in private Notion unless David decides otherwise
second_review: null                            # required for high-stakes records
```

Page-level text (headings and paragraphs written in `.astro` files) goes in a matching file per page, `content/translations/es/pages/<page>.yaml`, with the same `english_hash`, `reviewed` and `reviewer` fields. The `/es/` page reads those strings and the records' facts.

### Keeping translations in sync

- **`english_hash`** is a short hash of the English text fields the translation was made from. A new script, `check-translations.mjs`, runs with `npm run check-content` and in the daily build.
- **When the English changes, the hash no longer matches** and the translation is stale:
  - **High-stakes records and pages** (the same rules as `high-stakes.mjs`): the stale translated text is **not shown**. The page shows that item's English text with a short note in Spanish: "Esta parte cambió y la estamos revisando." The facts (numbers, hours) are always current anyway.
  - **Other records:** the translation shows for up to 30 days with the same note, then falls back to English.
  - The script prints a list of stale translations and opens or updates one issue per language for the reviewer queue (the same way `source-issue.mjs` does for sources).
- **Translations have their own checked date.** The reviewed date is shown on the page next to the English "last checked" date.

### The High stakes check and David's review

- Extend `site/scripts/high-stakes.mjs` so a translation file counts as high stakes when its English record does (topic `housing`, `money` or `food`, or a crisis line), and so `site/src/pages/es/` follows the same page rules as English pages. Those PRs get `for:david` on their own.
- `check-translations.mjs` fails the check when a high-stakes translation has no `reviewed` date or no `second_review`.
- A translation PR's description lists: the method, the reviewer role, the review date, and the back-translation.
- David approves the first Spanish pages as a set. After that, updates to already-approved text follow the normal high-stakes rule.

### Accessibility and reading level

- `check-reading.mjs` measures English reading level only. For Spanish, the reviewer is asked to keep the 8th grade target; a Spanish readability score (for example Fernández Huerta) can be added later.
- Screen readers depend on correct `lang` tags, which the plan sets on every page and on any English phrase inside a Spanish page.

## 5. Costs, free options first

| Option | Cost | Needs a nonprofit? | Needs an outside account? | Who acts |
|---|---|---|---|---|
| Make English pages translate well in the browser (option E) | $0 | No | No | Claude |
| Link official translated pages (option A) | $0 | No | No | Claude |
| Astro i18n plumbing, switcher, schema, sync checks | $0 (build time only; GitHub Pages hosting does not change) | No | No | Claude |
| Machine first drafts by Claude (option D, draft only) | $0 beyond the sessions we already run | No | No | Claude |
| Volunteer reviewers: WVU students and faculty in Spanish, Chinese and Arabic, WVU international student groups, Literacy Volunteers, MTEC adult education, faith and cultural groups | $0 | No | No | **David** (outreach) |
| WVU service learning or class projects | $0 | No | Maybe a WVU partnership agreement | **David**. Note: WVU cut its World Languages department in 2023; a WVU news story from October 2024 says it still offers minors in Spanish, French, Chinese and Arabic ([WVU Today](https://enews.wvu.edu/articles/2024/10/23/world-languages-program-offers-minors-in-spanish-french-chinese-and-arabic)). Who teaches now needs checking. |
| In-kind help from a local translation business or a bilingual professional | $0 | No | No | **David** |
| Translators without Borders (CLEAR Global) volunteer community | $0 | Its partner page lists eligible kinds of work and excludes legal, fundraising and campaign documents; it appears to require a partner organization | Yes, a partner account | **David** |
| Grants (for example a local funder's basic-needs or community grant) | $0 to apply; funds paid translation | Yes, most local grants require a 501(c)(3) (see [`local-grants-and-funders.md`](../research/local-grants-and-funders.md)) | Usually | **David** |
| Professional translation (option B) | Pilot about 500 words: roughly $50 to $150 per language. Phase 2 (food, shelter, health, benefits frame text, about 5,000 words): roughly $500 to $1,500 per language. Updates: small, per change. All estimates from commonly quoted per-word rates; get real quotes | No | Yes, a vendor account or invoice | **David** (spending) |
| Paid machine translation services (DeepL, Google Cloud Translation) | Not needed; Claude drafts at no extra cost | No | Yes | Not recommended |

## 6. Roadmap

### Phase 0: now, $0, no new decisions needed

- Make English pages translate better in the browser (lang tags, plain words, no text in images), as part of normal work.
- Research follow-ups, each a small issue: the 988 language options on 988's own pages; official Spanish pages for SNAP, Medicaid, WIC and health coverage that we could link; the WVU international student count by country; the Refugee Processing Center's West Virginia arrival reports; finer Census language detail for the "other Indo-European" group; ZoomWV English learner counts.
- Build the i18n plumbing behind the scenes (config, `lang` prop, `check-translations.mjs`, sidecar schema), with no Spanish pages published yet. This is safe to merge on its own because residents see no change.

### Phase 1: Spanish pilot (after David's decisions)

- `/es/help-in-your-language/` and the Spanish crisis strip on `/es/` pages, plus the "I need an interpreter" card in Spanish.
- Translated by Claude or a volunteer, reviewed by one fluent reader, with a second reader for the crisis strip. David approves the PR (high stakes).
- Runs for 8 weeks.

**How we measure the pilot** (aggregate only, following the [measurement plans README](../measurement-plans/README.md)):

| Measure | Target | How |
|---|---|---|
| Errors found | 0 errors in facts; any wording problem fixed within 7 days | A second fluent reader audits the pages at week 4 and week 8; corrections go to the Corrections page |
| Staleness | No high-stakes translation shown stale; reviewer turnaround under 14 days | `check-translations.mjs` output, logged weekly |
| Findability in Spanish | Spanish questions ("¿Dónde pido un intérprete gratis en Morgantown?") find the page | Add Spanish questions to `content/findability/questions.yaml` and the answer audit |
| Use | Page views of `/es/` pages | Only if David chooses analytics (#41); until then, not measured |
| Recognition | At least one local group links to, shares or comments on the Spanish page | Feedback and partner reports through David |

**Stop rule:** if no reviewer is found in 6 weeks, nothing is published, and the plumbing stays dark.

### Phase 2: Spanish high-need pages

Food today and food help, shelter tonight, getting health care, and a benefits page built on official Spanish links. Each with a second reader. Reviewer queue issues from the stale check.

### Phase 3: more languages

Chinese (Simplified) and Arabic, or as David decides, starting with the interpreter card and the Help in your language page only. Arabic needs right-to-left layout checks (`dir="rtl"`), which the design system should be tested for first.

### Phase 4: keep it running

Spanish site search, a `lang` field in the API and MCP data, a Spanish reading-level check, and a yearly review of the Census numbers (next ACS 5-year release in December).

## 7. Decisions only David can make

Tracked in the `for:david` epic issue opened with this plan.

1. **Go or no go,** and whether Spanish is the first language.
2. **Second and third languages:** Chinese (Simplified), Arabic, both, or wait for a partner.
3. **Machine drafts:** whether Claude-drafted text, after a fluent person reviews it, is acceptable for lower-stakes pages. This also means changing the sentence on the Help in your language page that says we do not use machine translation.
4. **Who reviews,** and the bar for high-stakes pages (for example: a professional or certified translator for crisis and benefits, a fluent volunteer for the rest, and always a second reader on high-stakes text).
5. **Whether to pay,** and a budget cap (the pilot is roughly $50 to $150 per language if paid).
6. **Outreach to reviewers and partners:** WVU language faculty and students, WVU international student groups, Literacy Volunteers, MTEC, the Health Department, Catholic Charities, Mountain State Justice, translation businesses, Translators without Borders. Only David contacts people.
7. **Applying to nonprofit programs or grants,** which need a nonprofit or fiscal sponsor and an outside account.
8. **Reviewer credit:** name volunteer reviewers on the site (with their consent) or keep them as role IDs with names in private Notion.
9. **Approving the first Spanish pages** (they are high stakes).
10. **Analytics** (already #41): without it, the pilot cannot measure use.

## Sources checked

- U.S. Census Bureau, ACS 2020 to 2024 5-year, table C16001, Monongalia County, via [Census Reporter](https://censusreporter.org/data/table/?table=C16001&geo_ids=05000US54061), downloaded October 31, 2026.
- Institute of International Education, [Open Doors 2025 fact sheet, West Virginia](https://opendoorsdata.org/wp-content/uploads/2025/11/OpenDoors_FactSheet_West-Virginia_-2025.pdf), read October 31, 2026.
- Catholic Charities West Virginia, [refugee resettlement program page](https://www.ccwva.org/programs/west-virginia-immigration-refugee-resettlement-services/), checked October 31, 2026.
- WV Department of Education, [Education Snapshot 2024-2025](https://wvde.us/sites/default/files/2025-11/Education%20Snapshot%20Booklet%202024-2025.pdf), read October 31, 2026.
- WV Department of Human Services, [nondiscrimination policies and plans](https://dohs.wv.gov/nondiscrimination-policies-and-plans), checked October 31, 2026.
- 988 Suicide and Crisis Lifeline, [home page](https://988lifeline.org/), checked October 31, 2026.
- U.S. Department of Justice, [LEP guidance, 2003 Federal Register notice](https://www.govinfo.gov/content/pkg/FR-2003-05-29/pdf/03-13125.pdf), cited for the 2002 safe harbor yardstick only.
- WVU Today, [World Languages program offers minors in Spanish, French, Chinese and Arabic](https://enews.wvu.edu/articles/2024/10/23/world-languages-program-offers-minors-in-spanish-french-chinese-and-arabic), October 23, 2024 (from a search result; not opened).
- Translators without Borders, [partner eligibility](https://translatorswithoutborders.org/partners/Eligibility/) (from a search result; not opened).
- Earlier checks from October 30, 2026 are in [`language-help.md`](../research/language-help.md), [`immigrant-help-statement.md`](../research/immigrant-help-statement.md) and [`docs/groups/new-residents.md`](../groups/new-residents.md).
