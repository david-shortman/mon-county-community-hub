# What AI answers say about us: 2026-11-14

The first monthly AI answer check (#1045). We asked AI answer tools 10 persona questions from [`content/personas.yaml`](../../content/personas.yaml) (#1036) plus a search for the site's own name, and recorded whether the answer cited one of our pages, whether it named the right local place, and anything it got wrong about the site or a listing. Run once on 2026-11-14 (UTC), in a Claude Code cloud session, with no accounts and no cost.

## Summary

- **No AI answer cited us.** 0 of 11 answers cited or named Everything Morgantown. Asked about the site by name, the answer said it found nothing from everythingmorgantown.org and could not confirm the site exists. This matches the weekly visibility runs ([2026-11-11](2026-11-11.md)): the site is not in search results yet, so AI answers built on search can't cite it. The step that can change this is #89 (search engine accounts and sitemap submission, David, free).
- **Nothing wrong was quoted from our pages**, because nothing was quoted from them. No fix issue was needed.
- **Right local place: 7 of 10.** The misses were the two people our site serves most carefully: someone with nowhere to sleep got only hotel listings, and someone looking for care for an aging parent got agencies in Charleston, Parkersburg and Wheeling. The mental health answer led with a private counseling chain, not local crisis help.
- **Only one AI tool could be checked this month** (Claude, below). The others block automated reads.

## Which tools we could reach

The rule is in [automated reads](../operations/automated-reads.md): read a site automatically only when its robots.txt allows it, and never work around a block. We read each tool's robots.txt on 2026-11-14.

| Tool | Free? | robots.txt for all robots | Checked? |
|---|---|---|---|
| Claude, with the session's web search | Yes, within the session | Not a website read | Yes: all 11 questions |
| Claude, no web (its training only) | Yes | Not a website read | Yes, one note below |
| ChatGPT (chatgpt.com) | Free tier needs a browser | Allows only the home page and shared pages | No |
| Perplexity (perplexity.ai) | Yes | Disallows `/search` | No |
| Google AI Overviews (google.com) | Yes | Disallows `/search` | No |
| Bing and Copilot answers in Bing (bing.com) | Yes | Disallows `/search` | No |
| Microsoft Copilot (copilot.microsoft.com) | Yes | Allows `/` | No: the answers come only through the chat app, which needs a person at a browser |
| DuckDuckGo and Duck.ai (duckduckgo.com) | Yes | Disallows `/` | No |

So this month's results are one AI tool's view. Answers in ChatGPT, Perplexity and Google, which many residents use, still need a person to check them by hand on a phone, or paid API access, which waits for David (#1045).

**Claude with no web.** Claude's training data ends before this project started (October 2026), so without web search it has no knowledge of Everything Morgantown and can only answer from general knowledge. Nothing to record per question.

## Results: Claude with web search

The session's web search tool returns a list of results and a short written answer built from them. Each question uses the persona's exact search words from `content/personas.yaml`. "Right local place" compares the answer with the organizations our landing page sends people to. We did not re-check each phone number or hour in the answers; where an answer gave details, it mostly said they came from directories and to call ahead.

| Persona | Search words | Our page | Cites us? | Right local place? | Notes |
|---|---|---|---|---|---|
| Nowhere to sleep tonight | where can I stay tonight morgantown | /stay-tonight/ | No | **No** | Only hotels and booking sites, with nightly prices. No shelter, no 211. Our page lists the Grace Shelter and other free places to stay. |
| In crisis, or scared for someone | mental health help today morgantown | /mental-health/ | No | Partly | Led with Thriveworks (a private counseling chain) and therapist directories. Named 988 and the state's Help4WV line further down. Did not name Valley HealthCare, which our page lists. |
| Shutoff notice | help paying electric bill morgantown | /utility-bills/ | No | Yes | Named Christian Help, the Salvation Army, Community Action, LIEAP and the state office, the same groups our page lists. Mostly from needhelppayingbills.com, a directory. |
| Short on food | food pantry open today morgantown | /help/food/ | No | Yes | Named local pantries with hours from directories (foodpantries.org, feedam), said it found none open on a Saturday, and pointed to 211. |
| No insurance | free clinic morgantown | /no-insurance/ | No | Yes | Named Milan Puskar Health Right, from the state's free clinic list and the City's PATHWAYS to Help page. Flagged that an older PBS story conflicts with the City page on Medicaid. |
| Aging parent | in home care for elderly parent wv | /for/older-adults/ | No | **No** | Agencies in Charleston, Parkersburg, Wheeling and Martinsburg, plus A Place for Mom. Mentioned the state's Aged and Disabled Waiver. Nothing in Mon County. The search words don't name Morgantown, which explains part of it. |
| New baby | wic morgantown | /pregnant-or-new-baby/ | No | Yes | Named the Monongalia County WIC office, from the state's nutrition services page and a 2022 state contact sheet. Said to confirm the phone because the sheet is old. |
| Lost a job | file unemployment wv | /unemployment/ | No | Yes | WorkForce West Virginia, from its own site. Noted third-party pages that conflict with it. |
| Just moved here | morgantown trash pickup | /for/new-to-mon-county/ | No | Yes | Republic Services and the City's Waste and Sustainability page. Warned that some results were for other towns named Morgantown. |
| Curious long-time resident | what's going on in morgantown this week | /pulse/ | No | Yes | Morgantown Magazine's events list and the City calendar. Eventbrite results were mostly other Morgantowns. |
| (Site name) | Everything Morgantown everythingmorgantown.org | Home | No | n/a | "The search didn't turn up everythingmorgantown.org itself." Only other Morgantown sites. |

## What this tells us

- **The shelter and aging answers are where an AI answer could send someone the wrong way.** Our persona landing pages for both (/stay-tonight/ and /for/older-adults/) point to local help, so these two are the strongest cases for getting indexed (#89). In the 2026-11-11 weekly run, a different search for shelter did reach the City's PATHWAYS to Help page, so the wording of the search matters.
- **Official pages win when they exist.** WIC, unemployment, the free clinic and trash all came from an official page or a City page. Where no official page lists the help in one place (bills, food), answers lean on national directories.
- **Answers already say "call ahead."** Most answers flagged that their hours came from directories that may be out of date.

## Next run

Around 2026-12-14. Use the same 10 personas and the site name, the same search words, and the same table. Re-read each tool's robots.txt first, since these change. If David decides on paid API access or a person checks ChatGPT, Perplexity or Google by hand, add a column per tool.

## Sources checked (2026-11-14)

- robots.txt files: https://chatgpt.com/robots.txt, https://www.perplexity.ai/robots.txt, https://www.google.com/robots.txt, https://www.bing.com/robots.txt, https://copilot.microsoft.com/robots.txt, https://duckduckgo.com/robots.txt
- Our landing pages: the `.astro` files in `site/src/pages/` named in the table, read on `main` on 2026-11-14.
