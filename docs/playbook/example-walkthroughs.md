# Example walkthroughs: "here is how someone like you could do it"

A walkthrough is a short, step-by-step story about a made-up person in a common situation, using real local programs and places. It shows that taking a step is normal and doable. This page is the pattern and the rules. From #190, part of #155 (idea 11 in [reaching people](reaching-people.md#11-show-how-someone-like-me-did-it)).

The first one is [Example: new in town, working from home, and wanting to meet people](../../site/src/pages/meet-people/example.astro) at `/meet-people/example/`.

## Why

- **Picturing someone like you helps.** In rural Appalachia, where handling things yourself is a strong value, a walkthrough frames using a program as a smart, normal step, not as giving up. Research with Appalachian women suggests working with values of strength and endurance, not against them (Snell-Rood and others, https://pmc.ncbi.nlm.nih.gov/articles/PMC5173451, via [reaching people](reaching-people.md#people-on-their-own)).
- **Many people prefer to help themselves first.** A walkthrough is a self-serve guide with a human face, open at any hour ([reaching people](reaching-people.md#people-on-their-own)).

## The rules

### Never a real person

1. **Label it "Example" three times:** in the page title, in a tag at the very top of the page, and in the note at the bottom. The words: "This is a made-up person, not a real story. The places and programs are real."
2. **No names.** Say "someone," "a parent," "they." A first name makes a made-up person read like a real one.
3. **No real cases, even blended.** Do not build an example from a report, a question someone sent, a news story, or a post. Start from a common situation in the findability questions or [what people search for](what-people-search-for.md).
4. **Real people's stories go through David.** Even with consent, a real story is David's call. Agents never ask for or collect them.

### Every step is real and sourced

5. **Each step uses a record in `content/`** (a resource, org, place or calendar entry) and shows its `SourceLine`. Pull the facts from the record in code, so the walkthrough changes when the record does and never says something the record does not.
6. **Wrap each step in its record.** If a record is hidden or removed, its step disappears instead of showing an old fact.
7. **"Could," not "did."** The example person could do each step. We never say what happened to them, how they felt, or that it worked.
8. **No promises.** No "they got approved" or "they made friends." Programs decide who qualifies; people decide what helps.

### Shape

9. **Use the step path** (`Route` and `Milepost`, the Trailhead pattern in `docs/design/presentation.md`). Three to six steps, each with a short time ("Week 1," "Next month") and one clear action.
10. **Open with one or two sentences of situation.** Describe the situation, not the person's worth or struggles (see [help tone](help-tone.md), rules 4 and 5).
11. **Always offer the plain guide.** End with a link to the main page for people who would rather skip the story.
12. **Link it from its guide** with a short line that says it is an example.

### Which situations

13. **Start with paths that are not high stakes:** meeting people, a library card, getting around, starting to volunteer, a first city board meeting. Walkthroughs about food, bills, housing, benefits or crisis help are welcome, but they fall under "When a PR waits for David" in `docs/COORDINATION.md` and the High stakes check labels them.
14. **Leave out who the person is, beyond the situation.** No race, religion, immigration status, health condition or income unless a program's own rule needs it, and then only in the program's words.

## Checklist for a new walkthrough

- [ ] "Example" in the title, the top tag and the bottom note
- [ ] No names, no real case
- [ ] Every step reads from a `content/` record and shows its source
- [ ] "Could," no outcomes, no feelings
- [ ] 3 to 6 steps, a link back to the plain guide, and a link from that guide
- [ ] `node scripts/high-stakes.mjs origin/main` in `site/`: if it lists the page, label the PR `for:david`

## Ideas for the next ones

These need build work and are tracked in a follow-up issue for #190:

- Getting around without a car in your first week (bus pass, trip planner).
- A first city council or county commission meeting: finding the agenda, signing up to speak.
- Starting to volunteer: picking one cleanup and going.

## Sources checked

Research findings are quoted from [reaching people](reaching-people.md), whose sources were checked October 28, 2026. The example page's facts come from records checked October 30, 2026. Re-check by April 30, 2027.
