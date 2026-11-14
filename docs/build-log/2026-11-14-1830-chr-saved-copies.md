# Saved copies of the County Health Rankings files we cite (#1906)

County Health Rankings & Roadmaps (CHR&R) says its website "will stay up through December 2026". The needs register and How is Mon County doing? cite five of its files and its Monongalia County page.

**What we did.** `content/sources/chr/saved-copies.yaml` records each file: address, file name, size, SHA-256, the server's date for it, and an Internet Archive (Wayback Machine) capture. On 2026-11-14 we downloaded each live file and its Wayback copy and checked that they match byte for byte. Source lines on both pages now add a "saved copy" link next to any address on that list. `scripts/update-chr-indicators.mjs` reads the saved copy when the live file is gone, refuses it if the checksum differs, and prints which saved copy it used, so the monthly Indicators check says so. Tests: `site/test/chr-saved-copies.test.mjs`, including every CHR file cited in `content/indicators/` and `content/needs/`.

**What we did not do, and why.** The issue asked for the Monongalia County, West Virginia and US rows in the repo. CHR&R's Terms of Use say its content, "including ... downloadable data files", is theirs "with all rights reserved", and license use "for personal or non-profit purposes", not passing files on. Everything in `content/` is shared under CC BY 4.0, which allows commercial reuse, so re-hosting would offer CHR&R's files on terms it did not grant. We record checksums and point to the Wayback copies instead. The terms are quoted in `content/sources/chr/README.md`. Asking CHR&R for permission would be David's call.

**Note for whoever runs it next.** In the cloud session that built this, the sandbox blocked Node from reaching `web.archive.org` ("Blocked by egress policy"), while `curl` reached it and its robots.txt answered 404 (no robots.txt, so reads are allowed). The fallback was tested with a fake fetch and by hand with `curl`. In GitHub Actions it should read normally.

Cost: none.
