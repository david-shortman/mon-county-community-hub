# Cookieless analytics options for the site (#41)

The site has no visit counts yet (Level 2, Use, in the charter). GitHub Pages logs visitor IP addresses "for security purposes", but its docs do not offer site owners logs or visitor stats ([GitHub Docs, What is GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), read 2026-11-01). So any count needs an outside service, and every option below needs an account or a server. That is David's call (`docs/CHARTER.md`, Autonomy). No account was created for this note.

All pages below were read on 2026-11-01.

## The short answer

**Recommend GoatCounter's free hosted service.** It costs nothing, sets no cookies, keeps no personal data, shows referring sites (so we can see visits from AI tools, as asked on #41), and can count with a tiny image instead of a script. Second choice: Cloudflare Web Analytics, also free, if David would rather use a larger company's account.

## Side by side

| | GoatCounter (hosted) | Cloudflare Web Analytics | Umami Cloud (Hobby) | Plausible Cloud | Self-host (Plausible CE, Umami, GoatCounter) |
|---|---|---|---|---|---|
| **Cost** | $0. "Free for reasonable public usage"; donations welcome | $0 | $0 | $9 a month (Starter, 10K pageviews); $14 Growth, $19 Business | Software is free; a server and database cost money and upkeep |
| **Limits** | "Running your personal website or small-to-medium business on it is fine, but sending millions of pageviews/day isn't" | Keeps full data 7 days, then about 10% samples | 100K events a month, 1 website, 6 months of data | By pageviews; asks you to move up a tier after 2 months over | Whatever the server can handle |
| **Account** | GoatCounter account | Cloudflare account | Umami account | Plausible account and a card after the 30 day trial | A hosting account, plus someone to keep it patched |
| **Cookies** | None | None ("no client-side state, such as cookies or localStorage") | Not checked today | None | Same as the hosted versions |
| **Personal data** | Keeps a visit ID in memory for 8 hours, made from site, browser and IP; says it stores no personal data long term | Says it does not fingerprint visitors by IP or browser | Not checked today | Does not store raw IP addresses or browser strings | On our own server |
| **Needs JavaScript?** | No. A 1x1 image pixel works too, or a small script | Yes, a small script ("beacon") | Yes | Yes | Yes (GoatCounter: no) |
| **Works with GitHub Pages?** | Yes, one line in the layout | Yes, without changing DNS or using Cloudflare's proxy | Yes | Yes | Yes, but the counter runs somewhere else |
| **Shows referring sites** | Yes | Yes ("top referrers") | Not checked today | Not checked today | Depends on the tool |
| **Ad blockers** | GoatCounter estimates about a third of pageviews are missed | Its docs say ad blockers block the beacon | Likely the same (not checked) | Likely the same (not checked) | Fewer misses if served from our own address |
| **Open source** | Yes | No | Yes | Yes (Community Edition, AGPL) | Yes |

Nonprofit note: Plausible gives a 15% discount "only to nonprofits, educational institutions and open-source projects." We have no nonprofit status, so that would not apply today.

## What any count can and can't tell us

- **It is a floor, not a total.** Ad blockers, saved offline copies (#150) and AI apps that send no referrer all go uncounted or show as "direct".
- **Count only page views and outside link clicks.** No session recording, no custom IDs, no cross-site tracking (`docs/playbook/measurement.md`).
- **Publish totals, hide small numbers.** Keep any count under 10 off public pages so no one can be singled out.

## What David would do for GoatCounter

1. Make a free account at https://www.goatcounter.com/ and pick a site code (for example `everythingmorgantown`). This is an outside account, so only David makes it.
2. Tell a build session the site code. Nothing secret is needed: the code is public, like the site's address.
3. The session then adds the GoatCounter script to the shared layout with the image pixel as a no-script fallback, turns on referring sites, keeps admin and test pages out, updates the Privacy page (`/privacy/` says the site has no analytics today) and publishes monthly totals on the scoreboard.
4. Optional: a donation through GitHub Sponsors, which GoatCounter accepts to cover server costs. Spending money is David's call.

If David prefers Cloudflare, steps 1 and 2 are the same with a Cloudflare account, and the snippet comes from its Web Analytics page.

## Sources

- GoatCounter: [home](https://www.goatcounter.com/), [terms](https://www.goatcounter.com/help/terms), [sessions](https://www.goatcounter.com/help/sessions), [tracking pixel](https://www.goatcounter.com/help/pixel), [FAQ](https://www.goatcounter.com/help/faq)
- Cloudflare: [Web Analytics](https://www.cloudflare.com/web-analytics/), [about](https://developers.cloudflare.com/web-analytics/about/), [get started](https://developers.cloudflare.com/web-analytics/get-started/), [FAQ](https://developers.cloudflare.com/web-analytics/faq/)
- Umami: [pricing](https://umami.is/pricing)
- Plausible: [home page price table](https://plausible.io/), [plans and nonprofit discount](https://plausible.io/docs/subscription-plans), [data policy](https://plausible.io/data-policy), [self-hosted Community Edition](https://plausible.io/self-hosted-web-analytics)
- GitHub: [What is GitHub Pages, data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

Prices and limits change. Recheck them on these pages before David signs up.
