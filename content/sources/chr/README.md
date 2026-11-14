# County Health Rankings files: saved copies (#1906)

County Health Rankings & Roadmaps (CHR&R) says "The CHR&R website will stay up through December 2026" and asks users to download data "before the end of the year" ([program FAQ](https://www.countyhealthrankings.org/findings-and-insights/blog/faq-chrr-program-status-and-funding), read 2026-11-14). Our needs register and the How is Mon County doing? page cite five of its files and its Monongalia County page. This folder makes sure those citations can still be checked if the site goes away.

## What is here, and why the files themselves are not

[`saved-copies.yaml`](saved-copies.yaml) lists each file we cite: its address, file name, size, SHA-256 checksum, the date CHR&R's server gives for it, and a saved copy in the Internet Archive's Wayback Machine. We read every file on 2026-11-14, downloaded its Wayback copy the same day, and checked that the two match byte for byte.

We did **not** put copies of the files, or of their Monongalia County rows, in this repo. CHR&R's [Terms of Use](https://www.countyhealthrankings.org/terms-use) (last updated December 16, 2024, read 2026-11-14) say:

> All content on the CHR&R Website, including but not limited to designs, text, graphics, pictures, video, information, downloadable data files, applications, software, music, sound and other ﬁles, and their selection and arrangement (together, the "Content"), is the property of CHR&R or its licensors with all rights reserved. CHR&R grants you a non-exclusive license to access and use those portions of the CHR&R Website without a password or logon for personal or non-profit purposes including educational, research, or public health, subject to the terms of this Agreement, provided that you keep all copyright or other proprietary notices intact.

> The CHR&R website Content may not be copied or otherwise used for commercial use (including without limitation, use to train AI models intended to be offered as commercial products) without CHR&R's express prior written consent.

Using the numbers for a nonprofit, public-health purpose with credit is allowed, and that is what the site does. But the terms keep "all rights reserved" and give no right to pass the files on. Everything in `content/` is shared under [CC BY 4.0](../../LICENSE.md), which lets anyone reuse it for any purpose, including commercial use. Putting CHR&R's files here would offer them under terms CHR&R did not grant. So we record the files exactly and point to a copy the Wayback Machine already keeps. Asking CHR&R for permission to re-host would be David's call.

The handful of numbers the site shows are in `content/indicators/` and `content/needs/`, each with its source and checked date, as before.

## How the site uses this list

- `site/scripts/update-chr-indicators.mjs` reads the live file first. If the live file is gone (any answer other than 200, or no answer), it reads the saved copy instead, refuses it if its checksum does not match, and says so in its output. The monthly Indicators check shows that output. Test: `site/test/chr-saved-copies.test.mjs`.
- Source lines that cite one of these addresses add a "saved copy" link to the Wayback capture.

## Credit

The citation CHR&R asks for: University of Wisconsin Population Health Institute. County Health Rankings & Roadmaps. www.countyhealthrankings.org.

## Re-check

If CHR&R posts a new file, or a new address for these files in 2027, add it here with its own checksum and saved copy. Re-read the terms when you do.
