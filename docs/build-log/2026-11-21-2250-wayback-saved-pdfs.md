# Saved copies of the government PDFs we cite (#2079)

**What:** Every PDF cited in `content/minutes/`, `content/agendas/` and `content/pdf-pages/` now gets a copy saved by the Internet Archive's Wayback Machine, checked byte for byte against the live file and listed in `content/sources/gov-pdfs/saved-copies.yaml`. A check every six hours saves each new version of the County Clerk's draft minutes file, which is replaced with every new draft. The site shows a "saved copy" link next to these PDFs.

**Why:** Some local governments replace their PDFs instead of keeping them. The County Clerk posts only the newest Commission draft minutes at one address, and the Wayback Machine had only 8 versions of it from 2019 to 2026 (see `docs/discoveries/2026-11-21-commission-draft-minutes-overwritten.md`). The drafts the hub read for October 28, November 4 and November 10 were already gone.

## What was built

- `site/scripts/save-pdf-copies.mjs` (`list`, `run`, `watch`) and `site/src/lib/wayback.mjs`. For each cited PDF: check robots.txt, download the live file, look for a capture of that exact file in the CDX index (by SHA-1), ask Save Page Now for one if there is none, download the capture and record it only if the SHA-256 matches. When an address redirects, the final address is saved (the County's agenda links redirect to `cms2.revize.com` with unencoded spaces, which Save Page Now could not follow). Pauses between requests and backs off on 429 or 5xx.
- `.github/workflows/save-pdfs.yml`, every six hours: `watch` saves a new capture of each `overwritten:` address if its file is not in the Archive yet, and `run` saves newly cited PDFs and opens one `for:code` issue with the entries to add. Writes nothing to the repo. A GitHub Action because cloud sessions cannot reach web.archive.org with Node's fetch (#1906).
- `SavedCopy.astro`: a "saved copy" link after the official minutes and agenda links (`DecidedCard`, `AgendaGuide`) and the PDF links on PDF pages (`FromPdf`). For an overwritten file it says "saved versions" and links the Archive's list, plus a line that the list may not include the version we read.
- Reused from #1906 (PR #1941, still open): the list shape, `site/src/lib/saved-copies.mjs` and the "saved copy" link in `SourceLine.astro`. Both are copied byte for byte from that PR, so either PR can merge first without a conflict.
- `site/test/gov-pdf-saved-copies.test.mjs`: the helpers, the draft file is watched, every entry is well formed and reaches the site's lookup. A PDF cited since the last run is listed, not failed, so a cloud session that cannot reach the Archive is not blocked.

## Results on 2026-11-21

80 PDFs cited. 32 saved and matched: 23 new captures made today, and 9 captures the Archive already had of the exact same file. The 9th known version of the Clerk's `draft.pdf` was saved. All minutes and agenda PDFs are saved.

48 not saved, all because the host's robots.txt says no or cannot be read, and our rule is never to work around a block (`docs/operations/automated-reads.md`):

- 43 Mountain Line schedule and form PDFs on `irp.cdn-website.com` and `irp-cdn.multiscreensite.com` (robots.txt answers 403)
- 4 health department PDFs on `cdn.sanity.io` (`Disallow: /*.pdf`)
- 1 MTEC catalog on `files-backend.assets.thrillshare.com` (robots.txt answers 403)

A person can save these by hand at https://web.archive.org/save and add the entries.

**Cost:** free. Save Page Now and the CDX lookup are free public services; the check uses a few minutes of a free runner.
