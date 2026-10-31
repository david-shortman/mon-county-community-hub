# Plain language rubric

Can most adults read it once and know what to do? Our target is about an 8th grade reading level for anything residents read. Plain language is not "dumbing down." It is respect for people's time, especially people who are stressed, tired, reading on a phone, or reading in a second language.

**Standards this draws on**

- [plainlanguage.gov: Federal Plain Language Guidelines](https://www.plainlanguage.gov/guidelines/) (the Plain Writing Act of 2010)
- [GOV.UK: Writing for GOV.UK](https://www.gov.uk/guidance/content-design/writing-for-gov-uk) and the [GOV.UK style guide](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style)
- [CDC Clear Communication Index](https://www.cdc.gov/ccindex/index.html)
- [Digital.gov: Plain language](https://digital.gov/topics/plain-language)
- Our own rules in [CLAUDE.md](../../CLAUDE.md): 8th grade level, no em dashes, neutral framing

**Pass bar:** no criterion at 0, average at least 2.0, and **PL1 (reading level) and PL2 (action first) must each be at least 2.**

---

### PL1. Reading level

Text that residents read scores at about 8th grade or lower.

- **0:** Grade 12 or higher.
- **1:** Grade 9 to 11.
- **2:** Grade 8 or lower overall, with no single paragraph above grade 10.
- **3:** Grade 6 or lower overall, and it still sounds natural.
- **How to check:** Flesch-Kincaid grade on the page text (not menus or footers). In Python: `0.39 * words/sentences + 11.8 * syllables/words - 15.59`, with a simple vowel-group syllable count if a dictionary is not available. Formulas are rough; also read it aloud. Every build also warns when a page's first two sentences read above grade 9 (`site/scripts/check-reading.mjs`, #833).

### PL2. Action first

Each item leads with what the reader can do, who it is for, and by when. (GOV.UK: "front-load"; plainlanguage.gov: "Write for your audience")

- **0:** The action is missing, or buried at the end of background text.
- **1:** The action is there but not first.
- **2:** Titles say the action or the thing ("Sign up for health insurance", "Free tire drop-off"), and the first sentence says who it is for or what to do.
- **3:** All of 2, and every time-bound item states the deadline in the title or first line, with the day of the week.
- **How to check:** Read only the title and first sentence of each item. Can you act on that alone?

### PL3. Short sentences and paragraphs

- **0:** Many sentences over 35 words, or walls of text.
- **1:** Average sentence over 20 words, or paragraphs over five sentences.
- **2:** Average 15 to 20 words, at most one sentence over 30, paragraphs of one to three sentences.
- **3:** All of 2, and lists are used for steps or for things to bring.
- **How to check:** Split page text on sentence ends and count words; flag the longest five.

### PL4. Common words

Everyday words, with any needed term explained. (plainlanguage.gov: "Use simple words and phrases"; GOV.UK [words to avoid](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#words-to-avoid))

- **0:** Unexplained jargon, legal terms, or acronyms in key places.
- **1:** Mostly plain, with a few unexplained terms ("Marketplace", "exemption", "REAP") that a newcomer would not know.
- **2:** Necessary official terms are kept (people need them to search and ask) but explained in a few words the first time.
- **3:** All of 2, and acronyms are spelled out on first use on every page.
- **How to check:** List every term a new resident might not know. Check if each is explained nearby.

### PL5. Speak to the reader

Use "you", active voice, and a friendly, direct tone. (plainlanguage.gov: "Use pronouns", "Use active voice")

- **0:** Mostly passive voice and third person ("Applications must be submitted by eligible persons").
- **1:** Mixed.
- **2:** Mostly "you" and active verbs.
- **3:** Consistent throughout, and warm without being cute.
- **How to check:** Count passive constructions ("is/are/was/were/be" plus a past participle) in each item.

### PL6. Numbers, dates and times

Dates, times, and amounts are written the way people say them, the same way every time. ([GOV.UK style: dates and times](https://www.gov.uk/guidance/style-guide/a-to-z-of-gov-uk-style#dates))

- **0:** Ambiguous dates (10/12) or mixed formats that could cause a missed deadline.
- **1:** Clear, but inconsistent (8 a.m. here, 10:00 a.m. there; "on or before" here, "by" there).
- **2:** One format: "Monday, December 1, 2026", "10 a.m. to 11:30 a.m.", and deadlines say whether the last day counts.
- **3:** All of 2, and relative time is added where it helps ("in 5 weeks").
- **How to check:** List every date and time on the page and compare formats.

### PL7. Style rules

Our house rules are followed.

- **0:** Em dashes, ALL CAPS, or promotional language.
- **1:** One or two slips.
- **2:** No em dashes, sentence case headings, no hype words ("amazing", "best").
- **3:** All of 2, and link text is meaningful on its own (no "click here", no bare URLs in body text).
- **How to check:** `grep -P '\x{2014}|\x{2013}'` on built HTML and content files; read headings and link text.
