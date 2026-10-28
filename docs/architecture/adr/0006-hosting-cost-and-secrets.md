# 0006: Static hosting on GitHub Pages, $0 by default, no secrets in any build

Status: proposed, 2026-10-28

## Context

The project is a small community effort with no budget. The charter says spending money, creating accounts, and handling secrets are David's call. The site, calendar feed, and planned API are all read-only. On 2026-10-28 every Actions run failed at startup (#66), which showed how much depends on GitHub Actions.

## Decision

1. **Host on GitHub Pages** for the site, apps, API files, and calendar feeds. Build and deploy with GitHub Actions.
2. **No secrets in the data, site, API, or MCP builds.** A source that needs a key is not used until David decides. The only secret is the Claude token, and only the Claude workflow uses it.
3. **$0 is the default.** Anything that costs money or needs an account goes to David as a `for:david` issue: a custom domain, analytics, hosted MCP or API, package registry publishing, paid data.
4. **Triggers to revisit hosting:** a need that only a server can meet (form submissions, counting API use, alerts), the site nearing 1 GB, or traffic nearing the Pages soft limit of 100 GB a month.
5. **Make outages visible.** The site shows when it was last built, so a stalled pipeline is obvious to residents and to the Watchdog lane.

## Consequences

- Good: no bills, no servers to patch, nothing private to leak.
- Good: if Actions goes down, the site stays up with the last good build.
- Limit: no server features. Reporting problems, counting API use, and alerts all wait for a decision.
- Limit: the site lives at a GitHub subpath until David picks a domain. Moving later changes every URL, so the move should come before the API and calendar feeds have many users.
- Limit: we depend on GitHub. The repo and build are standard (Astro, npm, static files), so moving to another static host would take hours, not weeks.
