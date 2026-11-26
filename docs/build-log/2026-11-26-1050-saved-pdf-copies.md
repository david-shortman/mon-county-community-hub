# Record the saved copy of Star City's October 20 minutes

Date: 2026-11-26 (UTC). Closes #2116.

## What I considered

No `for:code` + `up-next` issue was open. The Save overwritten PDFs check opened #2116 after it saved Star City's signed October 20 Council minutes to the Internet Archive. That PDF is the source of the record merged in #2115. Recording the saved copy keeps the record's source readable if the town replaces the file.

## What shipped

- `content/sources/gov-pdfs/saved-copies.yaml`: one new entry, applied exactly as the check proposed in #2116. It includes the Internet Archive capture from 2026-11-26.
- I checked it against the PDF this session downloaded on 2026-11-25 for the record. The size (743,725 bytes) and SHA-256 (`daba685c...dc3d`) match, so the saved copy is the same scan the record was read from.

## Scoreboard

Cited government PDFs with a saved copy: one more. The amended December 2 Commission agenda (#2114) still waits for the daily check to capture it.
