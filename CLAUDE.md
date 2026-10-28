# Mon County Community Hub: notes for Claude

A continually updated community resource hub for Morgantown and Monongalia County, WV, built on top of the work already being done by nonprofits, government, community groups and businesses.

Several Claude instances work on this project: Claude Duet (background partner) and Claude Code sessions (build sessions). **Read [`docs/CHARTER.md`](docs/CHARTER.md) and [`docs/COORDINATION.md`](docs/COORDINATION.md) before doing anything.** The charter covers the mission, the daily loop, how we measure, and what you may do on your own. Coordination covers roles, labels, branching, and logging.

## Must-follow rules

- **This repo is public.** Never commit secrets, private individuals' personal info, unverified claims, or private planning. That goes in Notion.
- **Never push to `main`.** Branch (`code/<name>` or `duet/<name>`), open a PR, then merge it yourself once the PR checklist passes. Leave it open for David only in the cases listed under "When a PR waits for David" in `docs/COORDINATION.md`.
- **Claim the issue** (`in-progress` label + comment) before working on it.
- **Log every session** as one row in the Notion Activity log (data source `collection://2f1e6d31-c6ef-44f4-9374-551f5b56b210`): What, Type (Milestone, Research, Build, Decision, Note), Who, Date, Link.
- **Cite a source URL and a last-verified date** for every resource.
- **Neutral, common-good framing.** Describe; do not promote or advocate.
- **No em dashes** in any writing. Use commas, colons, or separate sentences.
- **Plain language.** Aim for an 8th grade reading level on anything residents will read.

## Where things are

- Notion home (private planning, Activity log): https://app.notion.com/p/40717805570781abbde2e8c1975f5f94
- `content/`: structured resource data. Schema in [`content/README.md`](content/README.md).
- `site/`: the public website (stack not chosen yet, see the open decision issue).
- `docs/decisions.md`: decisions that shape the repo.

## Topic areas (from the brainstorm)

Poverty resources, managing medical care, small business resources, local government (structure, policies, contacts), local philanthropy, recycling and safe disposal, community health metrics (education, crime, and similar).
