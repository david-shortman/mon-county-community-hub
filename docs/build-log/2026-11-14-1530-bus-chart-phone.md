# 2026-11-14: Bus routes chart on a phone (#1427)

Follow-ups from the review of #1426 ("When the buses run" on /bus-routes/), checked in Chromium at 320 and 390px wide, light and dark.

- **Label size (fixed).** The chart's route and time labels drew at 6 to 7.3px at 320px and 7.8 to 9.1px at 390px. The drawing is now narrower (`G.W` 250 instead of 340 in `site/src/lib/bus-day.mjs`), so it scales up more, and on phones the step charts and the tool's chart use the card's full width. Labels now draw at 9.4 to 9.9px at 320px and 11.8 to 12.3px at 390px. On wide screens the chart is capped at 26rem so its labels stay near 13px. The words did not change; only the drawing's width.
- **Sticky chart (checked, adjusted).** The taller chart now holds at the top only on phones at least 46rem tall (was 40rem). Shorter phones, and phones set to a larger default text size, get a still chart in each step, as before. `scroll-padding-top` went from 350px to 460px to match. Tabbing through the whole page at 390x844 and 320x760 (142 focus stops), no focused item was hidden under the chart.
- **Slider announcements (fixed).** The result line under the slider was a live region that changed on every step. Now screen readers hear the slider's own value while it moves, and the result line once, 0.7 seconds after the slider or a day button settles. Not tested with VoiceOver or TalkBack here; a person should listen on a phone.
- **Long third step (done).** The 8:30 p.m. step is now five shorter sentences with the same facts.
- **200% text.** The chart's labels are part of the drawing, so they do not grow with the text setting. The chart is hidden from screen readers, and every fact in it is also in the step text, the summary and the tool's lists, which do grow. Nothing scrolls sideways at 320px with 200% text.
- **Cost:** $0.
