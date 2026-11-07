# Automations dashboard: what runs on a schedule, and how runs are reported

David checks one page each week to see what ran, what is stuck and what needs him:
**Everything Morgantown Automations**, https://claude.ai/artifact/MXAnE6rXKGztdwSRtQbsZM (private to David's account).

It lists every scheduled job for the hub, its latest run, and when the next one is due. A job turns red once its last run is more than 1.5 schedule periods old. Every run links to the session that did it, or to the GitHub run or PR.

## Every scheduled job

| job_id | Job | Where it runs | Schedule |
|---|---|---|---|
| `hub-build` | Build run | Cloud routine `trig_01GEWj8ipWBGwzuUBtFpQ4TZ` | 5:41 AM, 12:41 PM, 6:41 PM Eastern |
| `hub-findability` | Weekly findability check | Cloud routine `trig_011rdzyYy4gvU9yoN32mhHYi` | Sunday 7:23 PM Eastern |
| `hub-retro` | Weekly retro and plan | Cloud routine `trig_01WeLYAYGMNZPTJGsnWqACUC` | Monday 7:52 AM Eastern |
| `hub-visibility` | Weekly visibility (SEO and AEO) | Cloud routine `trig_01T6anwEvqJiRCecmQbpvKZr` | Wednesday 1:37 PM Eastern |
| `hub-budget` | Weekly budget check | Cloud routine `trig_01Lnx1Z7FASKhdsPUMV9jQv5` | Thursday 12:13 PM Central |
| `hub-identity` | Monthly local identity refresh | Cloud routine `trig_01AbWadczSMQU1ZGzGXwkANa` | 3rd of the month, 3:17 PM Eastern |
| `gh-site` | Site build and deploy | `.github/workflows/site.yml` | Daily, and every merge to `main` |
| `gh-sources` | Source check | `.github/workflows/sources.yml` | Daily |
| `gh-health` | Health check | `.github/workflows/health.yml` | Every 4 hours (GitHub skips some) |
| `gh-agendas` | Agenda guides | `.github/workflows/agendas.yml` | Daily |
| `gh-scorecard` | Weekly scorecard | `.github/workflows/scorecard.yml` | Monday |
| `gh-chronicle` | Chronicle | `.github/workflows/chronicle.yml` | Monday |
| `gh-311` | 311 totals | `.github/workflows/311-totals.yml` | Monday |
| `gh-indicators` | Indicators | `.github/workflows/indicators.yml` | 3rd of the month |
| `prs-for-david` | PRs waiting on David | Open PRs labeled `for:david` | Checked by the sweep each day |
| `duet-sweeps` | Claude Duet sweeps | Claude Duet | About 2 a day. Not tracked yet: no run history the sweep can read |
| `hub-dashboard-sweep` | Dashboard sweep | Scheduled task on David's Mac | Daily |

Each cloud routine posts every firing into one standing session, so its runs always link to that session.

A new job, or a changed schedule, goes to David or an interactive session, which updates this table and the dashboard's jobs list in the same change.

## Report the run (last step of a scheduled run)

Do this last, after the run's own summary is written. It must never block the real work. If it fails, say so in the summary and do not retry more than once.

**Cloud routines skip this step.** Their sessions have no tool that can write to the dashboard, so the daily sweep reads each routine's run history instead. Nothing extra is needed from them.

Any other scheduled run that has the `ArtifactData` tool (or the `Artifact` tool's `write_db`) writes **one new document** to the dashboard's store:

- `url`: the dashboard link above
- collection `inbox`, doc id = the `run_id`, `action: "set"`, no `if_version` (it is a new document)

```json
{"run_id": "<job_id>-<UTC time, e.g. 2026-11-12T15:10Z>",
 "job_id": "<job_id from the table above>",
 "at": "<UTC ISO time the run finished>",
 "result": "ok | needs-you | blocked | failed",
 "summary": "<one sentence, under 200 characters>",
 "session": "<app link from get_session(\"self\").link, or empty>",
 "session_web": "<https link to this session on claude.ai, or empty>",
 "machine": "cloud | Mac | GitHub",
 "link": "<optional: the PR or GitHub run>"}
```

- `ok`: finished, nothing for David.
- `needs-you`: finished, but David has to act (for example a PR labeled `for:david`).
- `blocked`: could not finish because of a sign-in, a permission or a check that stopped it.
- `failed`: something broke.

Lead the summary with what David needs to do, if anything. No private individuals' names.

**Never delete anything on the dashboard, and never upload files to it or edit its page.** Only the sweep touches the runs file.

## The daily sweep

The sweep runs once a day on David's Mac. It needs `RemoteTrigger`, `ArtifactData`, the `Artifact` tool and `gh`.

1. **Read** the dashboard's `datasets/runs` document (note its `version` and the file's `url`), the runs file itself, and the `inbox` collection.
2. **Cloud routines.** For each routine in the table, `RemoteTrigger` `get` gives `last_run` (`fired_at`, `status`) and `persistent_session_id`. For every firing since the newest run already filed for that job, read `get_run_log` on the persistent session: a firing starts at an `Allocating sandbox` line, and its last `result:` line is its summary. Shorten it to one sentence. The result is `failed` if the run status is failed or the run says it broke, `blocked` if it stopped on a refusal or sign-in, `needs-you` if it left a PR labeled `for:david` or asks David to act, and `ok` otherwise. `session_web` is `https://claude.ai/code/<persistent_session_id>`; `link` is the PR it opened, if any.
3. **GitHub Actions.** `gh run list --event schedule --json workflowName,conclusion,createdAt,url,databaseId` since the newest filed run for each workflow: `success` is `ok`, `failure` or `startup_failure` is `failed`, `cancelled` is skipped. `link` is the run's URL.
4. **PRs waiting on David.** One `prs-for-david` run per day: `needs-you` with the PR numbers and the oldest one's date when any are open, else `ok`. `link` is the `for:david` PR list.
5. **Inbox.** File each inbox note as a run, unchanged.
6. **Write.** Merge everything into the runs file (one row per `run_id`, newest first, drop rows older than 60 days). Add the sweep's own `hub-dashboard-sweep` row. Upload the new file with the `Artifact` tool (`action: "publish"`, `url`, `file_path`, `asset: true`), then `update` `datasets/runs` with the new `url`, `updated` and `edit` (pass `if_version`).
7. **Clean up.** Delete each filed inbox document (`ArtifactData` `delete`, with its `version`). Delete the old runs file with the `Artifact` tool's `delete`, **always passing its id as `path`**. Without `path`, delete removes the whole dashboard.

If any step fails twice, stop, keep the inbox as it is, and say what happened. The next day's sweep picks up where this one stopped.
