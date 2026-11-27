# Saved PDFs check: propose the new file's entry, so a changed PDF stops repeating

Date: 2026-11-28 (UTC). Closes #2121.

## What I considered

No `for:code` + `up-next` issue was open. The daily saved-PDF check opened the same report three days in a row (#2113, #2119, #2121) about the County Commission's December 2 agenda. The County amended it on November 25. The guide was fixed the same day (#2114), and the live file has been byte-for-byte the amended one since then (SHA-256 `a4dd41a3...`, checked 2026-11-26 and 2026-11-27).

The report kept coming back because `saved-copies.yaml` still lists the first file, and nothing ever replaced it:

- The report said to run `run --only <url>` "or wait for this check", but the check never wrote the new entry. It only reported it.
- `run --only` needs web.archive.org, which cloud sessions can't reach.

So every changed PDF would stay in the daily report forever. Hand-editing the entry was not an option either: the file promises that every recorded copy's SHA-256 was checked against its capture, and a session here can't check the capture.

## What I chose and why

Let the check do the part only it can do, and leave the "re-read the record first" step to a person or session:

- `node scripts/save-pdf-copies.mjs check --propose` now writes the new file's entry to `saved-copies.yaml`, but only when the new capture matched the live file byte for byte. A failed save keeps the old entry.
- In `.github/workflows/save-pdfs.yml`, the daily check runs with `--propose`, and the "Record new saved copies" step now runs after it. Its diff includes those entries, and its text says to re-read the record that cites a new file first.
- The changed-PDF report now points to that issue instead of "wait for this check". It also says the file will be reported each day until the entry is recorded.
- A new test covers both versions of the report text.

The workflow still writes nothing to `main` itself. A session applies the diff in a PR, as before.

## What shipped

- `site/scripts/save-pdf-copies.mjs`: a `--propose` flag for `check`, and the new report wording.
- `site/test/gov-pdf-saved-copies.test.mjs`: one new test (9 of 9 pass).
- `.github/workflows/save-pdfs.yml`: `check --propose`, with the record step moved after the check and its text updated.

## Scoreboard

Repeat reports of an already-handled changed PDF: from daily to once. Check on 2026-11-29 that the "Record new saved copies" issue has the December 2 agenda's new entry, apply it, and check on 2026-11-30 that "Saved PDFs that changed or went missing" no longer lists it.
