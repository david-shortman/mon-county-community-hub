# 2026-11-02: The scroll story shows the access checks and the no-signal copy (#1421)

- **Considered:** the "Follow one listing" story on How this site works (#1409) showed the checks as "Small enough for a phone" and the card going live, but not the access promises the site keeps.
- **Chose:** step 4 now ticks six checks, three of them about the reader: small for an old phone, easy to read in light or dark, and fits 320 px with big text. Step 6 swaps the feed chips for a second phone with no signal, showing the dated "Saved copy ... Call before you go" note the service worker adds. The step text says the same in words, since the drawings are hidden from screen readers. The feeds stay in the step 6 text. A line under the story says it follows its own rules.
- **Kept:** only opacity and transform move, nothing moves with reduced motion or Turn off motion, and it reads as a plain list without script (`e2e/promises.test.mjs` checks the last two). The `<script>` block is unchanged, so the shared motion kit (#1441) can land on top.
- **Shipped:** waits for David, because the component speaks for the project.
