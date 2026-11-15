# Interest chips on /topics/, and Back keeps your place

**Issues:** #2027 and #1369 (part of the Topics explorer, #2025)

"What are you curious about?" now sits right under Help now on /topics/, with the 20 chips from `content/explore-chips.yaml`.

- **No script:** each chip is a link to a built page, `/topics/pick/<id>/`, listing that chip's pages with their labels and summaries. These 20 pages are in the sitemap and `llms.txt`, not in the A to Z or the door lists.
- **With a script:** each chip becomes a toggle button (`aria-pressed`). Picking chips shows "Picked for you": the pages ranked by how many picked chips include them, then by their place in each chip, then by chip order (`rankPicks()` in `site/src/lib/explore-rank.mjs`). Each line says which chips matched. A polite live line says "12 pages picked for you".
- **The bar:** Surprise me (jumps to "Show me something"), Clear picks and Close. It is sticky at the bottom of the screen, but only inside a wrapper that starts below Help now, so it can never sit over Help now, and it takes its own space at the end of the page, so it never covers the last line.
- **Kept on this phone only:** picks are saved in `localStorage` (`em-explore-picks`). Clear picks empties it. Nothing is sent anywhere. No motion.

**Back to the same spot (#1369).** #1822 already keeps each page's scroll spot and puts it back on Back if the browser lands at the top. This adds two things:

- Saved picks are drawn as soon as the script runs, before the page finishes loading, so the page is its full height when the browser restores the spot.
- The page-to-page fade is skipped on Back and Forward, which the #1369 notes named as the next thing to try for iPhone Safari.

An e2e test (`site/e2e/topics-explorer.test.mjs`) checks chips with scripts on and off, saved picks, Clear, the bar staying below Help now, and Back landing within 60 px of where you were with picks saved.

Weight: /topics/ went from 70.2 KB to 77.9 KB (budget 150 KB). Cost: $0.
