# Architecture: how the project works today

This is a plain map of the system as it stands on 2026-10-28. It is for anyone joining the project, human or AI, who needs to know where things live, how data gets from a source to a resident, and what could break.

- Where we are going: [target.md](target.md)
- Why we chose what we chose: [adr/](adr/)

## The pieces

| Piece | What it is | Where it lives |
|---|---|---|
| **Content** | Resource data as YAML, one file per entry: `calendar/` (dates and deadlines), `orgs/` and `resources/` (empty so far). Licensed CC BY 4.0. Draft schema "v0" | `content/`, schema in [content/README.md](../../content/README.md) |
| **Content checker** | A Node script that blocks entries with missing fields, bad dates, no source, or em dashes. Warns on sources older than 6 months | `site/scripts/check-content.mjs` |
| **Site** | An Astro static site: home, Deadlines page, About, and a `calendar.ics` feed. Reads `content/` at build time. MIT licensed | `site/` |
| **Live feeds** (PR #53, merged 2026-10-28) | Adapters that fetch public calendars (City of Morgantown, Mountaineer Food Bank, Monongalia County) at build time, with a committed "last good copy" for when a feed is down | `site/src/lib/feeds/` |
| **Hosting** | GitHub Pages at `david-shortman.github.io/mon-county-community-hub`. No custom domain yet | Repo settings |
| **Site workflow** | Builds and deploys on every push to `main`, checks every PR, and rebuilds every morning at 10:17 UTC so past dates drop off | `.github/workflows/site.yml` |
| **Claude workflow** | Runs Claude Code in GitHub Actions when someone with repo access mentions `@claude`, or when a `for:code` issue gets the `up-next` label | `.github/workflows/claude.yml` |
| **Scheduled Claude runs** | A daily Claude Code run that works the charter's daily loop | Outside the repo (Claude Code scheduling) |
| **Claude Duet** | The always-on background partner: source sweeps, research, Notion upkeep, small content PRs | Outside the repo |
| **Claude Code sessions** | Hands-on build sessions, several in parallel, each in its own lane | Cloud and laptop sessions |
| **Notion** | Private planning, brainstorms, and the Activity log | [Notion home](https://app.notion.com/p/40717805570781abbde2e8c1975f5f94) |
| **GitHub issues** | The work queue, sorted by labels (`for:code`, `for:duet`, `for:david`, `type:*`) | GitHub |
| **Docs** | Charter, coordination rules, decisions, build log, playbook, rubrics, reviews, chronicle | `docs/` |

## How data flows from source to resident

```
  Public sources                 Repo (public)                     Build (GitHub Actions)            Residents
  --------------                 -------------                     ----------------------            ---------
  Agency web pages  --Duet/Code-->  content/*.yaml  --+
  (hand-checked)      PR + review                     |
                                                      +--> check-content --> astro build --> GitHub Pages --> web pages
  Public feeds (iCal, JSON) -----------(fetched at build time)-------+                                  --> calendar.ics
                                       fallback: committed snapshots                                         (phones, Google,
                                                                                                             Outlook)
```

1. **A person or agent finds a fact** on a public source (an agency page, a feed).
2. **It becomes a YAML file** in `content/`, with a source URL and a `checked` date, through a pull request. Or, for live feeds, an adapter turns the feed into the same shape at build time.
3. **The checker runs** on every PR and every build. A bad entry stops the build.
4. **Astro builds static pages** and the `.ics` feed, and GitHub Pages serves them.
5. **The morning rebuild** keeps dates current even when nobody commits.

There is no server, no database, and no login. Everything a resident sees is a file that was built ahead of time.

## Main risks and limits

| Risk or limit | Why it matters | What softens it today |
|---|---|---|
| **One repo, one pipeline** | Everything (content, code, docs, workflows) is in one place, so one broken workflow or setting stops everything. On 2026-10-28 every Actions run started failing at startup (#66), and merges stopped deploying | The live site stays up, since it is static files. It just stops updating |
| **Static hosting only** | No forms, no accounts, no server-side search, no request logs. We cannot count API use or take reports without an outside service | Most of what residents need is read-only. Issue #48 looks at reporting problems without a GitHub account |
| **No backend** | Anything that must react in real time (alerts, submissions) has nowhere to run | By design for now. The charter keeps public alerts as David's call |
| **Data model is young** | Schema v0 is a draft. Only the calendar has entries. Calendar items cannot hold times or places yet (#46). No IDs beyond slugs, no needs register schema, no standard exports | Small enough to change now without migrations. Changing it later will cost more |
| **Checker is calendar-only** | `check-content` only checks `calendar/`. Orgs and resources will slip through once they exist | Issue #8 covers CI validation |
| **Feeds are fetched at build time** | A feed that changes its format can silently drop items. Build output depends on the day it ran | Snapshots and warnings (PR #53). Nothing yet alerts a human when a feed goes quiet |
| **Many agents, shared files** | Every PR edits the top of `docs/build-log.md` and `docs/decisions.md`, which causes merge conflicts | The coordinating session plans one file per entry |
| **Secrets** | The only secret is `CLAUDE_CODE_OAUTH_TOKEN`, used by the Claude workflow. The site build needs none | Only repo owners, members, and collaborators can trigger the Claude workflow |
| **Cost** | Currently $0: public repo, free Actions minutes, free Pages | A custom domain, a hosted API or MCP server, or paid analytics would each need David |
| **GitHub Pages limits** | Published site up to 1 GB, soft limits of 100 GB of traffic per month and 10 builds per hour ([GitHub docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) | We are far below all of them. Pages of about 2 KB (site review, 2026-10-28) |
| **Subpath URL** | The site lives under `/mon-county-community-hub/`. Moving to a domain later changes every URL, including the calendar feed people subscribe to | `astro.config.mjs` has one place to change. Feed UIDs do not depend on the URL |

## Who owns which folders today

Several sessions work at once. To avoid stepping on each other, each has a lane.

| Folder | Lane |
|---|---|
| `site/src/lib/feeds/`, `content/calendar/` | Builder |
| `docs/rubrics/`, `docs/reviews/` | Design reviewer |
| `docs/playbook/` | Researcher |
| `docs/process/` | Process designer |
| `docs/scoreboard.md`, `content/findability/` | Findability scout |
| `docs/chronicle/` | Chronicler |
| `docs/operations/`, health workflows | Watchdog |
| `docs/architecture/` | Architect |

Shared files that every lane touches: `docs/build-log.md`, `docs/decisions.md`, `content/README.md`, `site/package.json`. These are where conflicts happen. [ADR 0005](adr/0005-agent-safety-and-ownership.md) proposes how to shrink that list.

Last checked: 2026-10-28.
