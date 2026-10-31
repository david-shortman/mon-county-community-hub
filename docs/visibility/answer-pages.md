# Answer-first pages

Search engines and AI answer tools (Google's AI answers, ChatGPT, Claude, Perplexity) quote pages that answer a question directly, name their sources, and show a date. Many residents read only that quote and never open the page (see [what people search for](../playbook/what-people-search-for.md)). So every page that answers a resident's question follows the same pattern. Source issue: #88.

## The pattern

1. **Title and H1 in residents' words.** Use the question or the plain need, the way people type it: "How do I apply for SNAP (food stamps) in Mon County?" or "Help paying a utility bill". Name the place in the title (the build check already asks for that). Not a program name, not "Resources".
2. **The answer in the first two sentences.** Say what to do and who does it, then the details. "Apply online at WV PATH, the state's own site. It is free." If the honest answer is "call", say who to call and why, with the number. Do not open by describing the page ("This page lists...").
3. **Lead with who already helps.** Name the organization that provides the help, and link to its own page. We point to the people doing the work; we are not the help.
4. **Sources and a checked date you can see.** Every fact has a source line with a checked date at a readable size (the cards and `SourceLine` do this for you).
5. **One handoff at the end.** End at a clear next step: apply here, call here, go here. If more than one, put them in order.
6. **Structured data where it fits.** Cards add schema.org `Service`, `Place` and `Event` data on their own (#37). Do not add FAQ data by hand for questions the page does not answer word for word.
7. **Plain words.** About grade 8 for the first two sentences. Short sentences.

Check before writing a page: does 211 or a local directory already cover this well? If so, link to it instead of copying it (see [connect, don't compete](../playbook/community-practice.md#connect-dont-compete-the-directory-problem)).

## How to check a page

After `npm run build` in `site/`, run `node ../content/findability/answer-audit.mjs`. For each built page it prints whether the H1 is a question, how many words the first two sentences use, whether a checked date shows, and which structured data it carries. It changes nothing. The source benchmark (`docs/scoreboard.md`, "Source benchmark") measures the rest: words before the answer, taps, and the reading grade of the answer.

## Pages that follow it

The pages that answer findability questions, as of 2026-10-31. "Answer first" means the first two sentences answer the question.

| Question | Page | H1 in residents' words | Answer first | Note |
|---|---|---|---|---|
| q01, q03 heating or water bill | /utility-bills/ | Yes | Yes | "If you cannot pay a heat, water or electric bill, act before service is shut off." |
| q04 apply for SNAP | /snap/ | Yes, the question | Yes | The model page. |
| q05, q08 doctor or dentist without insurance | /dental-and-prescriptions/ | Yes, the question | Yes | Opening reads at about grade 12 (#804). A page for q05 is planned (#478). |
| q07 flu or COVID shot | /flu-shots/ | Yes, the question | Yes | |
| q19 to q21 trash day, drop-off, glass | /recycling/ | Yes | Yes, since 2026-10-31 | The opening used to describe the page; it now says who to call for your pickup day and when carts go out. |
| q29 ride to a medical visit | /medical-rides/ | Yes, the question | Yes | |
| q31 serve on a city board | /make-it-better/boards/ | Yes | Mostly | |
| q12 speak at a meeting | /have-your-say/ | Yes | Mostly | |
| q02 food this week | /help/food/ | Yes, the question | No, by design | A two-question chooser; the answer page is /help/food/today/other/. |
| q25 eviction help | /money/#rent | Yes | Partly | The full Legal Aid card is two taps in (#803). |
| q26 stay tonight | /stay-tonight/ | Yes | No | Opens "All of these are free. Tap what you need." The first card answers it. A one-sentence answer above the tabs would follow the pattern; this is a Help now page, so the change waits for David. |
| q18 donate furniture or clothes | /sell-or-donate/ | Yes | No, by design | A chooser by item. |

## Choosers and answer pages

Door pages and choosers ("What's going on? Pick all that fit") help people who browse. They are not answer pages: an answer engine cannot tap. When a chooser is the only page for a question, the answer page behind it should follow the pattern and have its own clear title, so search can land there directly.
