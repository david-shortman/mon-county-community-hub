# Saved copies of government PDFs

`saved-copies.yaml` lists every government PDF cited in `content/minutes/`, `content/agendas/` and `content/pdf-pages/`, with a copy the Internet Archive's Wayback Machine keeps (#2079). It has the same shape as the County Health Rankings list in `content/sources/chr/` (#1906), and the site reads both the same way: a source line, an "Official minutes" or "Official agenda" link, or a PDF page's link to its PDF gets a "saved copy" link next to it.

## Why

Some local governments replace their PDFs instead of keeping them. The County Clerk posts only the newest draft of the County Commission's minutes, always at one address, so each new draft overwrites the last (see [`docs/discoveries/2026-11-21-commission-draft-minutes-overwritten.md`](../../../docs/discoveries/2026-11-21-commission-draft-minutes-overwritten.md)). Other PDFs move or disappear when a site is rebuilt. A saved copy lets anyone check what a record was read from.

## Why links and not the files

Government meeting records are public records, so keeping the PDFs here may be allowed. But the minutes name county employees, and the hub writes them as `[name]`. Linking to the Wayback copies keeps those names out of this repo.

## How it is kept

- `site/scripts/save-pdf-copies.mjs run` reads each cited PDF (after checking the host's robots.txt), looks for a Wayback capture of that exact file in the CDX index, asks Save Page Now for one if there is none, downloads the capture and records it only if its SHA-256 matches the live file. `list` shows what is saved. Both are free public Internet Archive services, and the script waits between requests.
- The "Save overwritten PDFs" check (`.github/workflows/save-pdfs.yml`) runs every six hours. It saves a new capture of each `overwritten:` address whenever the file there changes, and saves any newly cited PDF, opening a `for:code` issue with the entries to add here. Cloud sessions cannot reach web.archive.org with Node's fetch, so this check is how a new record's PDFs get saved when the author could not run the script.
- `not_saved` lists PDFs we could not save and why (for example, a robots.txt that asks robots not to read PDFs). A person can save those by hand at https://web.archive.org/save and add the entry.
- `site/test/gov-pdf-saved-copies.test.mjs` checks each entry and lists any cited PDF that is not on the list yet.

For an overwritten address, `saved_copy` is the Archive's list of every saved version, since the newest capture may be a later file than the one a record read.
