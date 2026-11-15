# Flip through: one topic at a time, Save or Skip

**Issue:** #2028 (part of the Topics explorer, #2025)

A "Flip through" button on /topics/ (under the chips, and in the picks bar) opens a full-screen deck of topic cards in a `<dialog>`. It shows the "Picked for you" pages, or the starter list from `content/explore-chips.yaml` when nothing is picked. It never opens by itself.

- **Each card:** the page's door, label and summary, with Skip, Open page and Save. Above it: Close, "3 of 12", Back (undo the last Save or Skip) and a thin progress bar. The last card says "You saved 4 of 12" with Start over and Close (and See My list once #2029 adds it).
- **Shortcuts, never the only way:** drag or swipe right to Save, left to Skip, with a small stamp while dragging; a short drag springs back. Keys: Right arrow Save, Left arrow Skip, Enter opens the page, Backspace goes back, Escape closes.
- **Focus:** `showModal()` keeps focus inside, puts it on the card heading when it opens, and returns it to the Flip through button when it closes. A polite live line reads "Card 4 of 12: Parks and trails".
- **Motion:** the fly-off, the drag tilt and the card peeking behind show only when `motionAllowed()` is true and the device does not ask for reduced motion. With motion off, the next card just appears.
- **Saved pages** go to `localStorage` `em-explore-saved` on this phone only. Pages Pass it on hides (domestic and sexual violence help, `isQuietPage()`) get no Save button.
- **No script:** no deck and no button; "Picked for you" and the /topics/pick/ pages do the same job.

The deck's state (Save, Skip, Back with undo) is pure (`newDeck()` and `deckAct()` in `site/src/lib/explore-rank.mjs`), with unit tests. The e2e test covers open, Save, Skip, Back, keys, Escape, focus return, the starter list, the last card, a drag right and a short drag, and no button with scripts off.

Weight: /topics/ 77.9 KB to 80.6 KB (budget 150 KB). Cost: $0.
