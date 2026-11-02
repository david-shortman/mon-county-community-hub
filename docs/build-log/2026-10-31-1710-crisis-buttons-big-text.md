# 2026-10-31: Home page crisis buttons fit with big text (#971)

- **Considered:** on the home page, the three buttons under "Right now" (Call 988, Text 988, Call 911) always sit three across. With text at 200%, each label spills out past its button, and on some phones the page scrolls sideways. Found by the new 200% text check in #1008.
- **Chose:** the buttons now sit three across at normal text size and stack one per row when the text is big (each needs at least 5rem). The door pages already did this for their "Can't wait" buttons. No numbers, words or links change.
- **Checked:** with Playwright at 320px and 390px: three across at 100% text, one per row at 200%, and nothing spills or scrolls sideways.
- **Waits for David:** this changes how the crisis buttons look, so it is labeled `for:david` under "When a PR waits for David".
- **Cost:** $0.
