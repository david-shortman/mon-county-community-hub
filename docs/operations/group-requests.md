# Group requests: the one-week clock

When a group asks us to fix, remove or add one of its listings, we act within a week (#502, #521). This page is how.

The number of days is one setting: `REQUEST_DAYS` in `site/src/lib/group-requests.mjs`. It is 7 today. If David picks a different promise (#502), change that number and nothing else. The two warning days move with it (4 and 2 days before the end).

## 1. Log the request

Every fix, removal or add request from a group gets one issue with the `group-request` label, however it came in (the GitHub form, or a non-GitHub way in from #522 after David says yes to it).

Use the **Group request (project team)** issue form. It asks for only what we need to act:

- **Item:** the content file, like `content/resources/grace-shelter.yaml`, and the page it shows on. The clock can only hide an item when the file is named.
- **Kind:** `fix`, `removal` or `add`.
- **What to change:** one or two lines in our words.
- **Received date:** the Morgantown date it came in.

**Never** put the sender's name, email, phone, or their message text in the issue. The repo is public. Who sent what stays in the private Notion home.

The clock adds `Due: <received date + 7 days>` to the top of the issue on its next run. You can add it yourself.

## 2. Act on it

- **Removal:** hide the item the same day (`content/README.md`, "Hiding an item", `reason: group-request`). Before you hide, check that the request matches the group's own official page, so no one can pull a listing that is not theirs. Merge the same day, then close the issue.
- **Fix:** check the change on the group's own public page.
  - It is there: update the listing, re-check the source, and add a Corrections file with `found_by: works-there` (or the helper kind that fits). Close the issue.
  - It is not public yet, and the item scores 6 or more on the #97 risk rubric (crisis line, shelter, deadline, benefit rule): hide it (`reason: unconfirmed-risky`) until the group's page shows the change.
  - It is not public yet, and the item is lower risk: hide nothing. Comment where the group says it will post the change, and check back.
- **Add:** build the listing like any other, from the group's own page.

Close the issue as completed when the request is done. GitHub records the closed date, and the public numbers (#523) use it.

## 3. The clock

The Health workflow (`.github/workflows/health.yml`, job `requests`) runs every 4 hours. For each open `group-request` issue it looks at the days since the received date:

| Day | What happens |
|---|---|
| Any | Adds the `Due:` line if it is missing |
| 3 | Adds `priority` and comments: move it to the top of the `for:code` and `for:duet` queue |
| 5 | Adds `for:david` and comments, so it shows in David's decisions |
| 7 | Opens a PR that hides the item with `reason: overdue`, merges it, starts the Site build, adds `overdue-hidden` and comments on the issue |

A missed deadline means the item comes down, never that it stays up and wrong. Each step happens once; the label it adds is the record.

On day 7 the clock does nothing if the item is already hidden. It cannot hide anything when the request is an `add` or the issue names no file; it comments once instead, and a session acts by hand. If GitHub will not let the workflow open or merge the PR (a repo setting can block that), it adds `for:code` and comments once, and a session hides the item by hand the same day.

The clock never contacts anyone. It only edits labels, comments and issue bodies in this repo.

To see what it would do without changing anything, from `site/`: `node scripts/group-requests.mjs --plan /tmp/hides.json --dry-run`.

## Costs

GitHub Actions on a public repo: $0.
