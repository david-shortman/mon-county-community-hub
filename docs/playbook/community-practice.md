# Nonprofit and community practice

This page collects tested ideas from nonprofits, funders, and community builders about how to plan, measure, and work alongside others. Each practice ends with what it means for this repo. The goal is simple: help people reach the good work already happening in Monongalia County, without getting in its way.

## Theory of change

**What it is.** A theory of change is "a comprehensive description and illustration of how and why a desired change is expected to happen." You start from a long-term goal and work backward to the conditions (preconditions) that must be true first. The Annie E. Casey Foundation guide calls the process "making explicit collective assumptions about how change will happen," and treats the result as a living tool to test and revise.

**Why it matters here.** The charter names a mission and four measurement levels, but not the chain of reasons linking them. Writing it down lets every session check whether a build idea actually moves us toward the goal.

**How we apply it.** Draft theory of change for this project:

> If residents can quickly find accurate, current, plain-language answers that point to the local organizations, programs, and offices already doing the work, and if those groups can reuse that information freely, then more residents will act on help that already exists (apply, sign up, register, show up, give), and local groups will spend less effort just being found. Over time this helps the county feel more connected and shows that technology can lift up local work. This rests on assumptions we must keep testing: that finding information is a real barrier, that local groups want to be found, that accuracy and neutrality earn trust, and that we can see action only through tracked links and numbers partners choose to share.

We revisit this paragraph when a measurement result contradicts one of its assumptions, and record changes in `docs/decisions.md`.

**Sources:**
- [Center for Theory of Change: What is theory of change?](https://www.theoryofchange.org/what-is-theory-of-change/)
- [Annie E. Casey Foundation: Developing a Theory of Change, Part I (2022, PDF)](https://assets.aecf.org/m/resourcedoc/aecf-theoryofchange-guidance-2022.pdf)

## Logic models

**What it is.** A logic model is a one-page picture of a program. The W.K. Kellogg Foundation guide splits it into "your planned work" (resources and activities) and "your intended results" (outputs, outcomes, and impact). Outputs are the direct products of activities. Outcomes are changes in people's behavior, knowledge, or condition. Impact is the deeper change in a community over a longer time.

**Why it matters here.** It keeps us honest about the difference between things we made and changes in people's lives. Shipping a page is an output, not an outcome.

**How we apply it.**
- Resources: `content/` YAML, public sources, Claude sessions, David's time.
- Activities: the daily loop (look, think, build, measure, log).
- Outputs: entries in `content/orgs/`, `content/resources/`, `content/calendar/`, site pages, the `calendar.ics` feed.
- Outcomes: measurement levels 1 to 4.
- Impact: county-wide well-being, which many groups shape and no one project owns.

Build issues should name which output they create and which outcome level they hope to move. We will not report output counts as if they were outcomes.

**Sources:**
- [W.K. Kellogg Foundation: Logic Model Development Guide (2004, PDF hosted by NACCHO)](https://www.naccho.org/uploads/downloadable-resources/Programs/Public-Health-Infrastructure/KelloggLogicModelGuide_161122_162808.pdf)

## Results-Based Accountability

**What it is.** Results-Based Accountability (RBA) was developed by Mark Friedman for planning, budgeting, and measuring performance. It separates two kinds of accountability. Population accountability is about the well-being of everyone in a place, which no single program controls. Performance accountability is about how one program serves its own users. Performance measures answer three questions: "How much did we do?" "How well did we do it?" "Is anyone better off?"

**Why it matters here.** The three questions line up with our four levels and keep the most important one, "better off," in view.

**How we apply it.**

| RBA question | Our level | Example measures |
|---|---|---|
| How much did we do? | 2. Use (plus output counts) | Entries published, visits, tool uses, feed subscribers |
| How well did we do it? | 1. Findability | Question tests found or not, steps, share of entries `checked` in the last 6 months, plain language, works on a phone |
| Is anyone better off? | 3. Action and 4. Recognition | Tracked-link sign-ups or applications, partner-reported numbers, resident feedback, a local group using or linking our work |

County-level data such as health or education rates is population accountability. We may show it as context, with its source, but we never claim credit for changes in it.

**Sources:**
- [Connecticut DCF: Results Based Accountability (names Friedman and the three questions)](https://portal.ct.gov/dcf/rba/home)
- [Clear Impact: How RBA differs from other approaches](https://clearimpact.com/1-2-how-is-this-different-from-all-the-other-approaches-weve-seen-over-the-years-why-is-this-not-just-the-latest-fad/)

## Collective impact, with its critiques

**What it is.** Kania and Kramer (Stanford Social Innovation Review, 2011) described five conditions for groups tackling a shared problem: a common agenda, shared measurement, mutually reinforcing activities, continuous communication, and a backbone organization. Critics, such as Tom Wolff (2016), argued the model is top-down, leaves out the people most affected, and skips policy and systems change. In "Centering Equity in Collective Impact," the original authors and others named failure to center equity as the main reason efforts fall short, and urged listening to and acting with community and shifting power.

**Why it matters here.** It is tempting for a hub to act like a backbone. We have no mandate for that role.

**How we apply it.** We act as one mutually reinforcing activity: open, reusable information others can build on. We do not convene groups, set a shared agenda, or speak for coalitions. If a local collaborative already tracks shared measures, we link to it rather than build a rival dashboard. Any idea to support such a group becomes a `for:david` issue.

**Sources:**
- [Kania and Kramer, "Collective Impact," SSIR (2011)](https://ssir.org/articles/entry/collective_impact)
- [Wolff, "10 Places Where Collective Impact Gets It Wrong," Nonprofit Quarterly (2016)](https://nonprofitquarterly.org/voices-from-the-field-10-places-where-collective-impact-gets-it-wrong/)
- [Kania and others, "Centering Equity in Collective Impact," SSIR (2022)](https://ssir.org/articles/entry/centering_equity_in_collective_impact)

## Asset-based community development

**What it is.** Asset-based community development (ABCD) starts from what a community has, not what it lacks. The ABCD Institute, now at DePaul University, describes helping communities use "the skills, assets and talents community members have within their own neighborhoods." It frames this as a balance to a needs-based approach, built on the skills of residents, local associations, and local institutions. Asset mapping is the practice of listing those strengths.

**Why it matters here.** Our charter says the human work already exists. ABCD gives us a method for showing it.

**How we apply it.** `content/orgs/` is our asset map. The `kind` field already covers nonprofits, government, community groups, businesses, schools, and faith groups. Topic pages should lead with "who already helps with this" before any gap analysis. We describe gaps as missing information, not as a deficit in the community. We list only public organizations, never private individuals.

**Sources:**
- [DePaul University: ABCD Institute](https://www.depaul.edu/academics/research-and-innovation/institutes-centers-labs/steans-center-community-based-service-learning/abcd-institute)
- [ABCD Institute: About](https://resources.depaul.edu/abcd-institute/about)

## Community-centered design

**What it is.** The Design Justice Network principles include: "We center the voices of those who are directly impacted by the outcomes of the design process," and "Before seeking new design solutions, we look for what is already working at the community level." IDEO.org's human-centered design begins with learning "directly from the people you're designing for," then prototyping and testing. "Nothing About Us Without Us," a long-standing motto of the disability movement, was the United Nations theme for the 2004 International Day of Disabled Persons.

**Why it matters here.** Claude's question tests guess at what residents need. Guesses are a start, not a substitute for residents' own words.

**How we apply it.** Agents cannot interview anyone. We build low-cost ways for people to speak to us: a visible "suggest a correction" link on every page, and plain-language feedback prompts. Requests to talk with residents or groups become `for:david` issues. Before building a new tool, a session checks whether a local group already offers one. We test pages on a phone and at an 8th grade reading level.

**Sources:**
- [Design Justice Network: Principles](https://designjustice.org/read-the-principles)
- [IDEO.org Design Kit: What is human-centered design?](https://www.designkit.org/human-centered-design.html)
- [UN DESA: International Day of Disabled Persons 2004](https://static.un.org/esa/socdev/enable/iddp2004.htm)

## Connect, don't compete: the directory problem

**What it is.** Many groups each keep their own list of local services. Open Referral, which builds open standards for this data, describes these lists as "typically maintained in fragmented, redundant silos." Northwestern's Network for Nonprofit and Social Impact found that in "saturated" referral landscapes, each system keeps its own directory, so every change must be updated many times, which is "costly both in time and money." Extra systems can also add burden to the nonprofits receiving referrals.

**Why it matters here.** A new hub can become one more stale silo. Done badly, it pulls attention or donations away from local groups.

**How we apply it.**
- Link out. Every entry's `url` and `sources` point to the organization's own page, which stays the source of truth.
- Give credit by name on every page. Do not copy long text.
- Keep `checked` dates current, and drop entries we cannot re-verify.
- Publish our data openly so others can reuse it rather than rebuild it. A future issue can test mapping our YAML to the Open Referral format (HSDS).
- Never ask for donations to this project or rank which local group to give to.
- Check whether 211 or a local directory already covers a topic before building a rival list.

**Sources:**
- [Open Referral: The Resource Directory Dilemma talk (Chi Hack Night, 2022)](https://chihacknight.org/events/2022/11/15/resource-directory-dilemma)
- [Open Referral: FAQ and Human Service Data Specification](https://openreferral.readthedocs.io/en/3.0/faq.html)
- [Northwestern NNSI: Understanding and Navigating Saturated Referral Landscapes](https://nnsi.northwestern.edu/understanding-and-navigating-saturated-referral-landscapes)

## Checked

Sources checked 2026-10-28.
