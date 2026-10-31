# Reach check: who our pages reach, and who they miss (#112)

Our rubrics check each page. This note asks a different question: which residents does the site leave out? It uses public, aggregate numbers only, all from [Who lives here](../playbook/audience-facts.md) (checked October 28, 2026, with sources there). It never profiles a person. Rerun it when a new group of pages ships, or every few months.

Checked against the live site and `content/` on 2026-10-31.

## The groups, how many people, and what we offer them

| Group | How many in Mon County | What our pages offer | What is missing |
|---|---|---|---|
| **No home internet, or data runs out** | 7.1% of households have no internet subscription; 14.2% (about 6,400 households) rely on a cell data plan only. 19.4% of households under $20,000 have no internet. | Pages are about 30 KB, so they load on a weak signal. Pages you have opened work offline (service worker). Phone numbers are tap-to-call. "Pass it on" prints or copies a listing (#157). 211 by phone or text is on every urgent page. | Someone with no internet at all cannot reach us. Printed cards and area printouts are being built (#160, #405); in-person reach through helpers is David's decision (#163). |
| **Older adults** | 13.6% are 65 or older (about 14,800). Among them, 7.7% have no computer and another 8.5% have no internet. About 38% have a disability, most often walking or hearing. | Turning 65 page, an older adults page, medical rides, text that grows with the phone's text size, large tap targets. | Phone is the main next step on most cards, and hearing loss is common at this age. No card mentions the 7-1-1 relay or a text option when a call is the only step (#835). |
| **Read another language** | 6.6% speak a language other than English at home; 1.8% (about 1,800 people) speak English less than very well. Spanish, Arabic, Chinese and Vietnamese are among the most spoken. | Some cards say a provider has interpreters (Legal Aid). "Reading or English lessons" on the Family door. | No page in any other language, and no list of which places offer free interpreters. Research and a listing field are open (#181, #177). |
| **Low reading skills** | 16% of adults read at the lowest level (11% to 20%), 26% for math. Data from 2012 to 2017, the newest county estimate. | Plain-language rule (about grade 8), short cards, answer first (#88). | Nothing checks the grade on its own. The source benchmark found one opening at about grade 12 (#804), and no build check would have caught it (#835). |
| **Disability** | 13.4% of residents; 6.2% cognitive, 5.6% walking, 4.0% hearing, 2.1% vision. | Accessibility scan (axe) on every PR, contrast checks, a disability and caregivers page. | Hearing: see the relay gap above. Whether a place has step-free access is not yet a listing field (#177). |
| **No car** | 8.9% of households, 16.7% of renter households. | Medical rides page; bus info is planned. | Phone-friendly bus times and "last bus back" are open (#61, #407). |
| **Rural parts of the county** | 26.7% live in rural areas (2020 Census); about 72% live outside Morgantown city limits. | 19 community centers and halls, 11 of them outside Morgantown, many with their own events. | Of 106 resource listings, 29 have an in-person address, and 22 of those are in Morgantown (by mailing address). Rural residents mostly get phone or statewide options. Nothing tracks this (#835). |
| **College students** | About 21,700, about 20% of residents. | A WVU student branch on the food pages. | Not a gap: well served by WVU. Students pull county poverty numbers up, so we say so where it matters. |

## What this means

- **We reach phone users well.** Light pages, tap-to-call, offline once opened, and 211 everywhere fit the 14% of households on cell data only.
- **We miss people with no internet, people who do not read English well, and much of the rural county.** The first two already have open work (#160, #163, #181). The rural gap has no issue yet.
- **A call is still the main next step.** That is hardest for people with hearing loss, people who cannot call during work hours, and people whose phones are cut off.

## Ideas filed from this check

- #833 A build warning when a page's opening reads above about grade 9.
- #834 Count in-person listings by area (Morgantown and the rest of the county) on the scoreboard, so the rural gap shows and can move.
- #835 Show the 7-1-1 relay, or a text or online option, on cards where a phone call is the only next step.

## Limits

These are group sizes, not a count of who uses our site. The site has no analytics (David's decision, #41), so we cannot see who visits. County margins of error are wide; treat the numbers as rough.
