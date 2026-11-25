# Record the saved copy of the December 2 Commission agenda

Date: 2026-11-25 (UTC). Closes #2109.

## What I considered

No `for:code` + `up-next` issue was open. The Save overwritten PDFs check opened #2109 after it saved the County Commission's December 2 agenda PDF to the Internet Archive. That PDF is the source of the guide merged in #2106. Recording the saved copy keeps the guide's source readable if the county replaces the file.

## What shipped

- `content/sources/gov-pdfs/saved-copies.yaml`: one new entry, applied exactly as the check proposed in #2109. It includes the Internet Archive capture from 2026-11-25.
- I checked the entry against the PDF this session downloaded on 2026-11-24 for the guide. The size (107,620 bytes) and SHA-256 (`234e897c...ea4d`) match, so the saved copy is the same file the guide was written from.

## Scoreboard

Cited government PDFs with a saved copy: one more. Check on 2026-12-01, when the guide is re-read, that the agenda file has not changed.
