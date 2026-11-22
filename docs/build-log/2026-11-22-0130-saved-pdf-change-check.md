# Daily check that saved PDFs have not changed (#2079 follow-up)

**What:** Once a day the "Save overwritten PDFs" check (`.github/workflows/save-pdfs.yml`) now reads every saved PDF on `content/sources/gov-pdfs/saved-copies.yaml`, not only the County Clerk's `draft.pdf`. If a file changed at the same address, it saves the new file to the Internet Archive and opens (or updates) one `for:code` issue, "Saved PDFs that changed or went missing", naming the records that cite it. A file that is gone is listed there too. Source lines now say "saved versions" for an overwritten address, the same as the minutes and agenda links.

**Why:** Only `draft.pdf` was watched, but any PDF can be replaced at the same name: an amended agenda, a new fee schedule, a reprinted form. Without a check the hub would keep showing facts from a file that no longer says them.

**How:** `node scripts/save-pdf-copies.mjs check` downloads each file (robots.txt first, two seconds apart) and compares its SHA-256 with the one we recorded. A site that cannot be reached is skipped for that run, not reported as gone. The recorded entry is left alone, since it is still the file the record was read from; after a person re-reads the record, `run --only <url>` records the new file. First run, 2026-11-22: 31 checked, all unchanged.

**Cost:** free. About 32 downloads a day and a minute or two of a free runner.
