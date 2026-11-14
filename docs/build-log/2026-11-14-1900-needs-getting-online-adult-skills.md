# Needs register: getting online and adult skills (#1908, #1909)

Two needs joined the register (`content/needs/`), scored with the rules on `/needs/` ("How we rank them"):

- **Getting and keeping internet at home** (`getting-online`), rank 9, score 10 of 12: severity 2, reach 3 (about 1 in 10 households has no broadband subscription), agreement 3 (County Health Rankings, the West Virginia Office of Broadband's Mon County summary, and the 2025 Ruby Memorial survey), room to help 2. Last among the 10s on the tie rules.
- **Reading, math and finishing school as an adult** (`adult-skills`), rank 13, score 9 of 12: severity 2, reach 3 (16% of adults at the lowest reading level, NCES, 2012 to 2017), agreement 2, room to help 2. Last among the 9s because it had the fewest 211 requests.

School results were scored (8 of 12, room to help 1) and not added; the note is in `docs/research/life-areas-coverage-map.md`.

The needs below each new one moved down, and each moved file's `rank_why` says why. Each new need has a persona (`no-internet-at-home`, `finish-school`) and a findability question (q77, q78), with matching site search tests. Gaps found became #1935 and #1936. Two discoveries: the county adult skills estimate is from 2012 to 2017, and the state's county broadband summaries are image-only PDFs.

This PR waits for David: the moved needs include housing (people without a place to sleep) and money (wages), and the need files name 211, so the High stakes check labels it.

Sprint wave 18, new needs lane (#529).

Site search: the new question "how do I get internet if I can't afford it" first missed `/internet/` (the page never says "afford", and `/needs/` came first). Two "Also called" entries on `/internet/` in `content/also-called.yaml` ("help paying for internet", "can't afford internet") fixed it; both describe the page's Lifeline section. Run saved as `content/findability/search-runs/2026-11-14-1933.json`: 295 of 300 (98.3%), all 52 question searches in the top 3.
