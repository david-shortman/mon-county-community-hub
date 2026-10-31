# Keeping the project going

What this project costs to run, what could cost money later, and what someone else would need to take it over. Written 2026-10-30 (#113). Anything we are not sure of is marked **Not sure**.

The lasting product is the open data in `content/` (CC BY 4.0) and the docs. The website and the AI helpers are ways to keep that data current and easy to use. If everything else stopped, the data and the code would still be here for anyone to pick up.

## What it costs today

| Part | What it does | Cost | Who pays |
|---|---|---|---|
| GitHub repository | Holds the code, data, docs and issues | $0 (public repos are free) | Nobody |
| GitHub Actions | Builds and checks the site on every change, rebuilds it every morning, runs the Health check every 4 hours | $0 (free for public repos on standard runners) | Nobody |
| GitHub Pages | Hosts the website | $0 | Nobody |
| Domain name (`everythingmorgantown.org`) | The web address | About $10 to $20 a year for a `.org`. **Not sure:** the exact price, the registrar and the renewal date are not written down in this repo | David |
| Claude plan | Runs the AI helpers: Claude Duet, the scheduled build runs, Claude reviews on PRs, the Health investigator | David's own plan, shared with his other work. **Not sure:** the price is not written down here. See [operations/budget.md](operations/budget.md) for how we pace use | David |
| Notion | Private planning and the Activity log | **Not sure:** which plan the workspace is on. The public site does not need Notion at all | David |
| Software (Astro, Pagefind, the `yaml` package, Node.js) | Builds the site and its search | $0 (open source) | Nobody |
| Data sources | Public pages and feeds from local groups and government | $0 | Nobody |

**Total today: about $0 plus the domain**, not counting the Claude plan, which David already pays for his other work.

### Free limits to stay inside

- GitHub Pages: a published site under 1 GB, and a soft limit of about 100 GB of traffic a month. The built site is about 2 MB today.
- No secrets in any build. The only secret is the Claude token, used only by the Claude workflows ([ADR 0006](architecture/adr/0006-hosting-cost-and-secrets.md)).

## What would cost money later

None of these are on. Each one is David's call, through a `for:david` issue.

| Idea | Rough cost | Notes |
|---|---|---|
| Visit counts (analytics) | $0 to about $10 a month | Free tools exist that count visits without tracking people. See #41 |
| Forms, alerts or an API that needs a server | $0 on a free tier, more with heavy use | Needs an outside account. See ADR 0006 for the order we would try hosts in |
| Text or email alerts to the public | A few cents a message for texts; email has free tiers | Turning alerts on for real people is David's call |
| A paid data source | Varies | We use public data first |

Many free or discounted programs (for example nonprofit plans from software companies) are only open to registered nonprofits. The project is not one today.

## If things stop

- **If the Claude plan stops:** the site stays up. GitHub still rebuilds it every morning, so past dates still drop off and live feeds still update. What stops is new pages, reviews, and the re-checking of sources. After about 6 months, entries start showing as past their re-check date in the Health report.
- **If nobody re-checks anything for 30 days:** every page shows a notice that the site is not being kept up right now, with the date of the last re-check, and points people to the groups themselves and to 211 (#497). It turns on by itself: the build looks at the newest `checked` date in `content/` and the newest Corrections entry, and the page checks the same date in the browser, so it still appears if the daily rebuild stops. It changes nothing else. A real re-check of any listing turns it off. To turn it off on purpose, set `UPKEEP_NOTICE_DAYS` to 0 in `site/src/lib/upkeep.mjs`.
- **If the domain lapses:** the site stops loading at `everythingmorgantown.org`. Someone with admin rights on the repo would remove the custom domain in the repo's Pages settings so the site serves from its GitHub address again, and update `site` in `site/astro.config.mjs`. **Not sure:** exactly how GitHub handles the old address in that case; test before relying on it.
- **If GitHub Actions is down:** the site stays up with its last good build.
- **If GitHub itself went away:** the site is standard static files (Astro and npm), so moving to another free static host would take hours, not weeks.

## What someone would need to take it over

### Skills

- **To keep the data current (most of the work):** reading a web page carefully, editing short text files (YAML, see [content/README.md](../content/README.md)), and basic GitHub (edit a file, open a pull request). No coding.
- **To change the site:** basic HTML, CSS and JavaScript. The site uses Astro, which is close to plain HTML.
- **To run the AI helpers:** a Claude plan, and comfort reading what the agents did in pull requests and the build log.

### Time

**Not sure, rough estimate:** each resource or org takes about 5 to 10 minutes to re-check against its source. With about 60 records today, that is about 5 to 10 hours every 6 months, plus a few minutes a week to look at the Health issue and new suggestions. Without AI helpers, adding new pages would take more.

### Accounts and access

- A GitHub account with admin rights on the repository, or the repository transferred to their account or organization.
- Access to the domain registrar, or the domain moved to them.
- Optional: a Claude plan to keep the AI helpers running. The workflows read the token from a repository secret named `CLAUDE_CODE_OAUTH_TOKEN`.
- Not needed: Notion. It holds private planning only. Anything public that matters is already in this repo.

### Where to start

1. Follow "Run it yourself" in the [root README](../README.md) to build and check the site on your own computer.
2. Read the [charter](CHARTER.md) for what the project is for and its rules.
3. Read [content/README.md](../content/README.md) for how the data works and what the checks look for.
4. Read [operations/README.md](operations/README.md) for the Health check and who reacts to what.
