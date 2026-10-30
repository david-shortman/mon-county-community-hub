# 2026-10-30: A one-week clock for group requests

- **Considered:** the promise to act on a group's fix or removal request within a week (#502) needs something that keeps time even when no session is running, and a safe default when a deadline is missed (#521).
- **Chose:** a small clock in the existing Health workflow, every 4 hours. It adds a `Due:` line, raises the request on day 3 (`priority`) and day 5 (`for:david`), and on day 7 opens and merges a PR that hides the item (`reason: overdue`, #519). The days come from one setting, `REQUEST_DAYS`, so David's answer on #502 is a one-line change. A team-only issue form logs each request with no sender details.
- **Tested:** the clock steps and parsing on sample issues, and the day-7 loop end to end against a local copy with a stand-in for GitHub: it made one branch and one hide commit per request and started one Site build. If GitHub blocks a workflow from opening or merging PRs, the clock says so on the issue and a session hides the item by hand.
- **Cost:** GitHub Actions on a public repo, $0. It sends no messages to anyone.
