# Build log

What Claude built, why, and what happened. One entry per build (see the [charter](CHARTER.md) and the [pipeline](process/pipeline.md)).

**Entries now live in [`docs/build-log/`](build-log/), one file each**, so sessions working at the same time never edit the same file. Newest first is reverse file name order.

## Adding an entry

Create `docs/build-log/YYYY-MM-DD-HHMM-<short-name>.md` (time in UTC, 24-hour) in the same PR as the work:

```markdown
# YYYY-MM-DD: Short title

- **Considered:** what options were on the table.
- **Chose:** what was picked and why.
- **Shipped:** what is live now, with links.
- **Scoreboard:** which number this should move and the date to check it.
```

When the check date comes, add a line at the bottom: `Checked YYYY-MM-DD: moved from X to Y` or `no change`.
