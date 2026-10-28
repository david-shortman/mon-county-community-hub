# Operations: keeping the hub healthy

This is the runbook for noticing problems with the site and the pipeline, and for reacting to them. The Watchdog session owns this folder.

- **Health check:** [`site/scripts/health.mjs`](../../site/scripts/health.mjs). Run it with `npm run health` in `site/`.
- **Latest status:** [`status.md`](status.md).
- **Incidents:** [`incidents/`](incidents/), one file per incident, from [the template](incidents/TEMPLATE.md).

## Running the check

```sh
cd site
npm ci
GITHUB_TOKEN=... npm run health -- --json health.json --md health.md
```

| Option | What it does |
|---|---|
| `--site URL` | Site to check. Default: the live GitHub Pages site. |
| `--repo owner/name` | Repo for pipeline checks. Default: `GITHUB_REPOSITORY` or this repo. |
| `--json FILE` | Write the full report as JSON. |
| `--md FILE` | Write the short markdown summary. Without it, the summary prints to the screen. |
| `--skip-links` | Skip outbound link checks (faster). |
| `--skip-github` | Skip pipeline checks. |
| `--no-fail` | Always exit 0. Without it, the script exits 1 if any check fails. |

Without `GITHUB_TOKEN` the pipeline checks use unauthenticated calls, which have a low rate limit. In a Claude Code cloud session, run it with `NODE_USE_ENV_PROXY=1` so Node uses the session's proxy.

The JSON report has `status` (`ok`, `warn`, or `fail`), `counts`, `agent_fixable` (true when a failing check is one an agent can fix), and a list of `checks`. Each check has `id`, `area`, `status`, `summary`, `details`, `owner`, and `agent_fixable`.

## What is checked, and the thresholds

Statuses: **OK** is fine. **WARN** needs a look soon but residents are not hurt yet. **FAIL** means residents are affected now, or soon will be. **SKIP** means the check could not run.

### The product (what residents see)

| Check | FAIL when | WARN when | Who reacts |
|---|---|---|---|
| `site-up` | Home page is not 200 | | Claude Code; David if it is hosting or settings |
| `pages-200` | Any page linked from the site is not 200 | | Claude Code |
| `not-found` | | A missing page does not return 404 | Claude Code |
| `deploy-fresh` | The "Updated" date on the calendar page is more than 1 day old | | Claude Code; David if Actions or Pages settings |
| `ics-parses` | `calendar.ics` is missing, does not parse, lacks required fields, has lines over 75 octets, has unescaped `;` or `,` in text, or is not served as `text/calendar` | | Claude Code |
| `ics-entries` | The feed has no upcoming events | Fewer than 3 upcoming, or nothing starts more than 14 days out | Duet adds dates (#17); Claude Code for feeds (#31) |
| `content-recheck` | | An upcoming entry's oldest source was checked more than 6 months ago (also lists those due within 30 days) | Duet |
| `content-ended` | | A calendar file ended more than 30 days ago | Duet |
| `content-upcoming` | | No hand-checked entries in the next 62 days | Duet |
| `feeds` | A saved feed copy is not valid JSON | A live feed source does not respond, is empty, or its saved copy is more than 14 days old | Claude Code (Builder, #31) |
| `links` | An outbound link returns 404 or 410 | A link returns another 4xx, 5xx, or no answer (often bot blocking or a blip) | Claude Code fixes the link; Duet finds the new page |
| `a11y-basic` | | A page is missing `lang`, a title, the viewport tag, `<main>`, or has more or fewer than one h1, images without alt, empty links, skipped heading levels, or an em dash | Claude Code; the Design reviewer confirms with the full rubric |

`a11y-basic` is a fast guard against regressions, not a full review. The full review uses Playwright and axe ([`docs/rubrics/accessibility.md`](../rubrics/accessibility.md)).

### The pipeline (how work gets shipped)

| Check | FAIL when | WARN when | Who reacts |
|---|---|---|---|
| `actions-main` | The latest run of any workflow on `main` failed, timed out, or failed at startup | | Claude Code for code failures; **David** for `startup_failure` (a settings or billing problem agents cannot see) |
| `deploy-age` | No successful Site deploy in 30 hours | | Same as above |
| `main-deployed` | Commits merged to `main` more than 30 minutes ago are newer than the last good deploy | | Same as above |
| `prs-old` | | A PR has been open more than 3 days | The PR's author; David for `for:david` PRs |
| `prs-conflicts` | | A PR has merge conflicts (also lists files that show up in more than one) | The PR's author: rebase on `main`, keep every build-log entry |
| `issues-stuck` | | An `in-progress` issue has had no activity for 3 days | Whoever claimed it |
| `up-next-queue` | | No issues are waiting with `up-next` | Duet or the daily run: pick the next `for:code` issue |
| `for-david` | | (count only) | David |
| `daily-run` | | The newest build-log entry is more than 1 day old (2 days before 9 AM Eastern) | David: the daily scheduled run (6:41 AM Eastern) lives outside the repo |

Change thresholds in the `T` object at the top of `health.mjs`, and update this table in the same PR.

## How to react

1. **Run the check** and read the summary. Start with FAIL rows.
2. **Is it already known?** Search open issues for the check id or the error. If there is an issue, add new facts to it in a comment only if they change the picture.
3. **Can an agent fix it?** Code, content, links, and feeds: yes. Repo settings, Actions permissions, billing, secrets, outside accounts, and anything involving a person or organization: no, that is David's.
   - Agent-fixable: open a `for:code` issue (add `bug` for a defect), or fix it on a `code/<name>` branch if it is small and in your lane.
   - David's: open a `for:david` issue that says exactly what to check and where.
4. **If residents were affected** (site down, wrong or missing dates, a broken subscribe link, merged fixes not going live for a day or more), write an incident file in `incidents/` once it is fixed. Name it `YYYY-MM-DD-short-name.md`.
5. **Update [`status.md`](status.md)** when you run a baseline by hand.

Never work around a permission refusal or a settings problem. Report it and wait.

### Allowed actions

The repo only allows actions created by GitHub (`actions/*`) and `anthropics/claude-code-action`. Any new workflow must use only those, or it will fail at startup. Adding another action needs David to change the setting.

### Common failures

| You see | Likely cause | What to do |
|---|---|---|
| Every run is `startup_failure`, no steps ran | Repo or account setting: allowed actions, workflow permissions, spending limit, or a GitHub outage. On 2026-10-28 it was the allowed-actions list (see [the incident](incidents/2026-10-28-actions-startup-failure.md)) | `for:david` issue. Check [githubstatus.com](https://www.githubstatus.com) first. Agents cannot fix this. |
| Site build fails at `check-content` | A content entry is missing a field, a source, or has an em dash | Fix the entry; the error names the file |
| Site build fails at `npm run build` | Code change broke the build | Revert or fix forward on a `code/` branch |
| `deploy-fresh` FAIL but Actions green | Pages deploy step skipped or Pages settings changed | Check the deploy job; if settings, `for:david` |
| `links` FAIL | A source moved its page | Find the new page, re-check the fact, update the entry and its `checked` date |
| `ics-entries` WARN | Calendar is running dry | Add dates from #17, or ask the Builder about feeds |
| `prs-conflicts` lists `docs/build-log.md` many times | Every PR adds to the top of the same file | Rebase right before merging and keep every entry. If it keeps happening, propose a new layout (one file per entry) |

## Continuous monitoring (proposed)

A workflow that runs this check every few hours and after each deploy, keeps one pinned "Health" issue up to date, and asks Claude to fix agent-fixable failures is proposed in a separate `for:david` PR. Until David merges it, sessions run the check by hand.
