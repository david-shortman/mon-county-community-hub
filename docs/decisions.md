# Decisions

Decisions that shape this repo. Newest first. Small or private decisions live in the Notion Activity log instead.

| Date | Decision | Why | Decided by |
|---|---|---|---|
| 2026-10-28 | Calendar dates come from public feeds at build time where a source publishes one, with a committed last-good copy as fallback; hand-checked YAML wins on a slug clash | Dates stay current without copying by hand, and a feed outage never breaks the build or empties the page | Claude Code (under the charter) |
| 2026-10-28 | Added "Finding real problems" to the charter: a sourced, ranked needs register built from public data, service demand, public voices, and our own tests drives what gets built | Start from real problems, not what is easy to build; also matches how funders like Cities Deliver frame impact | David |
| 2026-10-28 | Run Claude Code in GitHub Actions too: `@claude` mentions and the `up-next` label start a run right away, alongside the daily scheduled run | Instant handoffs from Duet, no gateway limits, and runs are visible in the Actions tab | David |
| 2026-10-28 | First build: the community deadlines calendar (page plus subscribable iCal feed) | Time-sensitive help is the easiest to miss, Duet is already researching it, and it is useful to nearly everyone | Claude Code (under the charter) |
| 2026-10-28 | Licenses: MIT for code, CC BY 4.0 for content | Lets libraries, nonprofits, reporters, and other tools reuse the work with credit | Claude Code (under the charter) |
| 2026-10-28 | Site: Astro static site built from `content/`, hosted on GitHub Pages, rebuilt every morning | Fast and cheap, works on old phones, free for public repos; Duet's content PRs show up with no extra step | Claude Code (under the charter) |
| 2026-10-28 | Adopted the project charter: Claude runs a daily loop fully autonomously, measured on findability, use, action, and recognition, with hard limits on contacting people, public alerts, money, and partisanship | David wants Claude to come up with and ship ideas without his intervention, with goals to drive toward | David |
| 2026-10-28 | Agents merge their own PRs once the checklist passes; only the cases in COORDINATION.md wait for David (replaces "David merges") | While incubating, speed matters more than review, and any bad merge can be reverted | David |
| 2026-10-28 | No direct agent-to-agent messaging for now; Duet and Claude Code coordinate only through GitHub issues and Notion | Direct routes (Remote Control, Notion agent sessions) are not reachable from the cloud session without more setup or a Notion Business plan, and the async channels already cover the work | David |
| 2026-10-27 | GitHub issues are the shared work queue; Notion is the private planning space and journal | Duet and Claude Code can both read and write both, and nothing important lives only in one chat | David |
| 2026-10-27 | Repo is public, hosted under `david-shortman` | Free GitHub Actions and Pages (or Vercel), and openness fits the mission | David |
| 2026-10-27 | All changes go through PRs that David merges (replaced 2026-10-28, see above) | Keeps a human in the loop on anything public | David |
