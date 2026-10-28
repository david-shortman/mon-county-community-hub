# Project playbook

Proven practices from civic tech, open data, nonprofit work, evaluation, and fact-checking, boiled down to what this project should do. We build on what has worked elsewhere instead of inventing everything ourselves.

Every session should skim this page before picking work in the [daily loop](../CHARTER.md#how-claude-works-the-daily-loop). If a practice here conflicts with the [charter](../CHARTER.md) or [COORDINATION.md](../COORDINATION.md), those win.

## The 15 practices we adopt

**Build for residents**

1. **Start from a real resident question.** Every build begins with a question someone here would ask, recorded in the findability test. [Detail](civic-tech.md#start-with-real-resident-questions)
2. **Works on any phone, for everyone.** Meet WCAG 2.2 AA and design for small screens on a weak signal. [Detail](civic-tech.md#works-for-everyone-on-any-phone)
3. **Plan for who keeps it running.** Volunteer civic tech often dies when its makers leave, so open data and clear docs must outlast us. [Detail](civic-tech.md#plan-for-who-keeps-it-running)

**Open data**

4. **Publish listings in HSDS.** Keep YAML as the source, and also export Open Referral's shared format so other tools can reuse our listings. [Detail](open-data.md#publish-service-listings-in-hsds)
5. **Use open topic labels, not the 211 taxonomy.** The 211 taxonomy is copyrighted and licensed, so never copy its codes or terms. [Detail](open-data.md#use-open-topic-labels-not-the-211-taxonomy)
6. **License every export.** State CC BY 4.0 and the credit line, and never mix in data with stricter terms. [Detail](open-data.md#license-what-we-publish-every-time)

**Work alongside the community**

7. **Write down our theory of change.** Check each build against the assumptions it rests on. [Detail](community-practice.md#theory-of-change)
8. **Measure with Results-Based Accountability's three questions.** How much did we do (Use), how well (Findability), is anyone better off (Action and Recognition). [Detail](community-practice.md#results-based-accountability)
9. **Lead with assets.** Treat `content/orgs/` as a map of who already helps, before naming gaps. [Detail](community-practice.md#asset-based-community-development)
10. **Connect, don't compete.** Link out, credit by name, keep data open, and never fundraise against local groups. [Detail](community-practice.md#connect-dont-compete-the-directory-problem)

**Measure honestly**

11. **Claim contribution, not attribution.** Say "helped" or "contributed to," backed by evidence, never "caused." [Detail](measurement.md#claim-contribution-not-attribution)
12. **Write the measurement plan before shipping.** Commit what we will measure and what counts as success before the change goes live. [Detail](measurement.md#write-a-measurement-plan-before-a-change-ships)
13. **Report honestly.** Publish results that show no change, show raw counts, and report counts under 10 as "fewer than 10." Analytics stay cookieless and aggregate. [Detail](measurement.md#report-honestly-nulls-no-cherry-picking-small-numbers)

**Earn trust**

14. **Disclose AI, and never state a fact a source does not support.** Say plainly that AI writes the site. Every fact traces to a source the agent opened. [Detail](trust-and-ai.md#disclose-ai-involvement-in-plain-words), [sourcing rule](trust-and-ai.md#treat-ai-output-as-unchecked-until-sourced)
15. **Fix errors in the open.** Publish a corrections policy and put a "report a problem" link on every listing. [Detail](trust-and-ai.md#publish-a-corrections-policy-and-follow-it)

## The areas

| File | Covers |
|---|---|
| [civic-tech.md](civic-tech.md) | GOV.UK Service Standard, U.S. Digital Services Playbook, 18F methods, Code for America, Digital Public Goods Standard, accessibility |
| [open-data.md](open-data.md) | Open Referral HSDS, the 211 taxonomy, Open311, iCalendar, schema.org, West Virginia and county data portals, licensing |
| [community-practice.md](community-practice.md) | Theory of change, logic models, Results-Based Accountability, collective impact, asset-based community development, community-centered design, the directory problem |
| [measurement.md](measurement.md) | Contribution analysis, tracked links, partner numbers, baselines, measurement plans, ethical tests, privacy-respecting analytics, honest reporting |
| [trust-and-ai.md](trust-and-ai.md) | AI disclosure, sourcing rules, review of high-stakes information, corrections, reporting problems, transparency |
| [landscape.md](landscape.md) | Living map of peer projects putting AI to work for communities, including failures and shut-downs, with what we can adopt and how we could amplify each |
| [funder-lens-cities-deliver.md](funder-lens-cities-deliver.md) | What the Cities Deliver AI program funds, its seven principles mapped to our charter, lessons to adopt, and project directions for Mon County |

## Keeping this current

- Each file ends with the date its sources were checked. Re-check sources every 6 months, the same rule as `content/`.
- Some source sites blocked our automated reader. Where we relied on search results for a page instead of reading it, the PR that added the file says so.
- To change a practice, open a PR that edits the detail file and this summary together.
