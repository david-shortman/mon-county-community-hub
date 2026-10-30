# Measurement and evaluation

This page covers how we measure what the site does without fooling ourselves or anyone else. It borrows from program evaluation, federal evidence practice, and research ethics, scaled down to a small static site. Each practice says which of the charter's four levels it serves: 1 Findability, 2 Use, 3 Action, 4 Recognition.

## Claim contribution, not attribution

**What it is.** Attribution says "our link caused this sign-up." Contribution analysis, set out by evaluator John Mayne in 2001, asks a smaller question: is it reasonable to believe our work was one of the causes, alongside others? It builds a written "contribution story" from a theory of change, the evidence for each step, and the other explanations that could also be true. Outcome harvesting, developed by Ricardo Wilson-Grau, works backward: it collects changes in what people or groups actually do, then checks how the work plausibly contributed.

**Why it matters here.** Level 3 (Action) and Level 4 (Recognition). A resident who signs up to volunteer heard about it from many places. The charter goal of "one action we can credibly attribute" is met honestly only by a contribution claim with evidence.

**How we apply it.** For each claimed action, write a short contribution story in that build's entry in `docs/build-log/`: what we built, the evidence chain (tracked clicks, partner number, feedback), and other likely causes. Use the words "contributed to," never "caused." For Level 4, log each recognition (a group linking to us, a correction submitted) as a harvested outcome with a source link. We will not add up partner totals and call them ours.

**Sources:**
- [Contribution analysis (BetterEvaluation)](https://betterevaluation.org/node/2708)
- [Revisiting Contribution Analysis, John Mayne, Canadian Journal of Program Evaluation, 2019](https://ces.journals.uvic.ca/index.php/cjpe/article/view/284)
- [About Outcome Harvesting (outcomeharvesting.net)](https://www.outcomeharvesting.net/about-oh)

## Tag outbound links, and know what a click is not

**What it is.** UTM parameters are labels added to the end of a link, such as `?utm_source=monhub&utm_campaign=lieap-2026-27`. Analytics tools read them to group visits by where they came from. A redirect counter is a page like `/go/<slug>` that records a count and then sends the visitor on.

**Why it matters here.** Level 2 (Use) and part of Level 3 (Action). These tags show that someone left our page toward a partner. They do not show that the person applied, registered, or showed up. Tags are also lost when people copy a bare link, and partners only see them if they run their own analytics.

**How we apply it.** Use one naming rule: `utm_source=monhub`, `utm_medium=site` or `calendar`, `utm_campaign=<content slug>`, all lowercase, since values are case sensitive. Only tag links whose owners have no objection; ask through a `for:david` issue if unsure. Never put anything about a person in a tag. Report outbound clicks as "clicks toward," never as completed actions. Government links that must stay clean (for example, voter registration) can be counted with an on-site click event instead of a tag.

**Sources:**
- [URL builders: collect campaign data with custom URLs (Google Analytics Help)](https://support.google.com/analytics/answer/10917952)
- [Track campaigns (GoatCounter help)](https://www.goatcounter.com/help/campaigns)
- [Manual link tagging (Plausible docs)](https://plausible.io/docs/manual-link-tagging)

## Ask partners for numbers only through David

**What it is.** A partner-reported number is a count the organization keeps itself, such as sign-ups that said "found you on Everything Morgantown" or form completions from our tagged links. It is the only way to see Level 3 actions that happen off our site.

**Why it matters here.** Level 3 (Action). The charter names partner-reported numbers as a core source. Agents never contact organizations, so every request goes through David.

**How we apply it.** Open a `for:david` issue that drafts the ask: which program, which tagged link, the date range, and one aggregate number wanted. Ask for counts only, never names or contact details. Suggest the partner suppress small counts (see the last section). Record the reply in the build log with who reported it, the date, and how they counted. Mark the number "partner-reported, not independently verified." Do not ask a partner to change their forms for us.

**Sources:**
- [Project charter: How we measure and Autonomy](../CHARTER.md)
- [OES Evaluation Policy (GSA Office of Evaluation Sciences)](https://oes.gsa.gov/assets/files/evaluationpolicy.pdf)

## Think in counterfactuals and start from a baseline

**What it is.** A counterfactual is what would have happened without the change. A baseline is the measurement taken before the change. Without a baseline, a rise in visits could be the season, a news story, or a deadline, not our work.

**Why it matters here.** All four levels. Many local needs are seasonal: heating help in fall, taxes in spring. Comparing October to September will mislead.

**How we apply it.** Before any change ships, record the current Findability score for that topic and at least two weeks of Use counts, if analytics exist. When judging a change, say what else changed in the same window (deadlines, school calendar, news). Prefer comparing the same page against itself over time, or a changed page against similar unchanged pages. If no fair comparison exists, say so and report the result as descriptive only. OES notes that a null result means no difference stood out from background variation, not proof of no effect.

**Sources:**
- [Unexpected and null results (OES, GSA)](https://oes.gsa.gov/assets/files/unexpected-results-2-pager.pdf)
- [Contribution analysis (BetterEvaluation)](https://betterevaluation.org/node/2708)

## Write a measurement plan before a change ships

**What it is.** Preregistration means writing down, before you collect or look at data, what you will measure and how you will judge it. The Center for Open Science runs the OSF registry for this. The GSA Office of Evaluation Sciences (OES) commits to an analysis plan before working with data and posts it on its own website. OES says a plan can be short, can be updated with a stated reason, and still allows exploration as long as it is labeled exploratory.

**Why it matters here.** All levels. It stops us from picking whichever number looks good after the fact, and it gives the public log a fixed promise to check against.

**How we apply it.** For any change we plan to evaluate, commit `docs/measurement-plans/<date>-<slug>.md` in the PR before or with the change. It lists: the question, the level, the one main measure, the baseline, the date we will check, what counts as "helped," and other things we may look at (marked exploratory). Later edits go in a dated "Changes" section with a reason. We will not use a third-party registry, since that needs an account. The template and the shared counting rules are in [`docs/measurement-plans/`](../measurement-plans/README.md).

**Sources:**
- [Preregistration as a tool for strengthening federal evaluation (OES, GSA)](https://oes.gsa.gov/assets/files/preregistration-as-a-tool-in-federal-evaluation.pdf)
- [Preregistration (Center for Open Science)](https://www.cos.io/initiatives/prereg)
- [OES methods resources](https://oes.gsa.gov/methods/)

## Test presentation only, and run tests ethically

**What it is.** An A/B test shows two versions of something to different visitors and compares results. The Belmont Report (1979) sets three principles for research with people: respect for persons, beneficence (do no harm, maximize benefit), and justice (fair sharing of burdens and benefits). OES commits to safeguarding participants' dignity, rights, safety, and privacy.

**Why it matters here.** Level 1 (Findability) and Level 2 (Use). Small tests can show which heading or layout helps people find a deadline faster. But the people we serve may be in hard situations.

**How we apply it.** Only test presentation: wording, order, layout, plain-language rewrites. Every version must contain the same help, the same links, and the same deadlines. We will never test whether a person sees a resource or not, never hide or delay help, and never test anything on voting content. Split by time period or page, not by tracking individuals. Write a measurement plan first. Put any test that touches people beyond page wording in a `for:david` issue.

**Sources:**
- [Read the Belmont Report (HHS Office for Human Research Protections)](https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/read-the-belmont-report/index.html)
- [OES Evaluation Policy (GSA)](https://oes.gsa.gov/assets/files/evaluationpolicy.pdf)

## Use cookieless, aggregate analytics, decided by David

**What it is.** Plausible, GoatCounter, and Umami count page views without cookies and without storing personal data. GoatCounter, for example, keys a visit to a random ID kept in memory for 8 hours and never writes IP addresses to disk. Plausible Cloud starts at $9 a month; its open source Community Edition is free to self-host on your own server. Umami Cloud has a free Hobby tier of 100,000 events a month, and self-hosting is free. GoatCounter.com says it is free "for reasonable public usage" and can be self-hosted.

**Why it matters here.** Level 2 (Use) has no data today. GitHub Pages logs visitor IP addresses for its own security, but its docs do not describe giving site owners logs or visitor stats.

**How we apply it.** Any hosted service needs an account, and self-hosting needs a server, so adoption is a `for:david` issue comparing the three. Until then, measure without analytics: Findability tests, outbound links counted by partners, and Recognition. Whatever is chosen, collect page views and outbound click events only. No session recording, no cross-site tracking, no custom user IDs. Publish the dashboard or monthly totals.

**Sources:**
- [GoatCounter home](https://www.goatcounter.com/) and [how sessions work](https://www.goatcounter.com/help/sessions)
- [Plausible pricing](https://plausible.io/#pricing) and [self-hosted Community Edition](https://plausible.io/self-hosted-web-analytics)
- [Umami pricing](https://umami.is/pricing)
- [What is GitHub Pages: data collection (GitHub Docs)](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

## Report honestly: nulls, no cherry-picking, small numbers

**What it is.** OES publicly records every evaluation it runs and publishes all findings, including null results. It reports that about one third of its completed evaluations had null results. Public data programs hide very small counts because they are unstable and can identify people. The CDC does not show cancer statistics based on fewer than 16 cases. CMS generally bars showing cells with values from 1 to 10.

**Why it matters here.** All levels. Our numbers will be small for months. A jump from 3 clicks to 6 is not a doubling of anything meaningful, and a count of 2 for a narrow program could point to real people.

**How we apply it.** Report every measurement plan's result in the build log, including "no change" and "could not measure." Report the main measure from the plan first, before anything exploratory. Show raw counts next to any percentage. Show any count under 10 as "fewer than 10," and never publish a breakdown that lets someone back out a small count. Add a plain-language caveat when totals are under 100. Never delete or revise past scoreboard entries without a dated note.

**Sources:**
- [OES Evaluation Policy (GSA)](https://oes.gsa.gov/assets/files/evaluationpolicy.pdf)
- [Unexpected and null results (OES, GSA)](https://oes.gsa.gov/assets/files/unexpected-results-2-pager.pdf)
- [Suppression of rates and counts (CDC, U.S. Cancer Statistics)](https://www.cdc.gov/united-states-cancer-statistics/technical-notes/suppression.html)
- [CMS cell size suppression policy (ResDAC)](https://resdac.org/node/1506)

## Checked

Sources checked 2026-10-28.
