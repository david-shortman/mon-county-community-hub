# Mon County Community Hub: notes for Claude

A continually updated community resource hub for Morgantown and Monongalia County, WV, built on top of the work already being done by nonprofits, government, community groups and businesses.

Several Claude instances work on this project: Claude Duet (background partner) and Claude Code sessions (build sessions). **Read [`docs/CHARTER.md`](docs/CHARTER.md) and [`docs/COORDINATION.md`](docs/COORDINATION.md) before doing anything.** The charter covers the mission, the daily loop, how we measure, and what you may do on your own. Coordination covers roles, labels, branching, and logging.

## Must-follow rules

- **This repo is public.** Never commit secrets, private individuals' personal info, unverified claims, or private planning. That goes in Notion.
- **Never push to `main`.** Branch (`code/<name>` or `duet/<name>`), open a PR, then merge it yourself once the PR checklist passes, always with `scripts/safe-merge.sh <number>` (it refuses `for:david` PRs and waits for the High stakes check). Never merge with a raw `gh api .../merge` call. Leave it open for David only in the cases listed under "When a PR waits for David" in `docs/COORDINATION.md`.
- **Claim the issue** (`in-progress` label + comment) before working on it.
- **Log every session** as one row in the Notion Activity log (data source `collection://2f1e6d31-c6ef-44f4-9374-551f5b56b210`): What, Type (Milestone, Research, Build, Decision, Note), Who, Date, Link.
- **Cite a source URL and a last-verified date** for every resource.
- **Can't confirm a fact on a current official page? Leave it off the site** and open a `needs-verification` issue with the last-known info, conflicts, sources to check, and the human follow-up. See [`docs/decisions/2026-10-30-0640-unverified-facts-get-an-issue.md`](docs/decisions/2026-10-30-0640-unverified-facts-get-an-issue.md).
- **Log discoveries.** When you find a hole in the public record (a needed fact no official page states, official sources that disagree, a broken or parked official page, data that can't answer its question), add a file to [`docs/discoveries/`](docs/discoveries/). Describe, never blame.
- **Neutral, common-good framing.** Describe; do not promote or advocate.
- **Avoid merge conflicts.** Logs are folders of files, never add to the top of a shared file, and stay in your lane. See "Avoiding merge conflicts" in `docs/COORDINATION.md`.
- **Wait on PRs with `scripts/pr-wait.sh <number>`, then `scripts/pr-wait.sh main` after merging.** GitHub runs no checks on a PR that conflicts with `main`, and two PRs can break `main` when they land together. See [`docs/operations/merge-conflicts.md`](docs/operations/merge-conflicts.md).
- **No em dashes** in any writing. Use commas, colons, or separate sentences.
- **Plain language.** Aim for an 8th grade reading level on anything residents will read.
- **Low or no cost first.** When you come up with ideas, pick tools or services, or build, look for free or low cost options first (free tiers, nonprofit and open source programs, in-kind donations, public data). Say what each option you propose would cost. See "Guardrails" in `docs/CHARTER.md`.

## Where things are

- Notion home (private planning, Activity log): https://app.notion.com/p/40717805570781abbde2e8c1975f5f94
- `content/`: structured resource data. Schema in [`content/README.md`](content/README.md).
- `site/`: the public website (Astro, deployed to GitHub Pages).
- `docs/decisions/`: decisions that shape the repo, one file each. `docs/build-log/`: what was built and why, one file each.
- Agent HQ (your notebook, the Forum, Learnings): https://app.notion.com/p/4071780557078180b8c2ef64006413af

## Topic areas (from the brainstorm)

Poverty resources, managing medical care, small business resources, local government (structure, policies, contacts), local philanthropy, recycling and safe disposal, community health metrics (education, crime, and similar).
