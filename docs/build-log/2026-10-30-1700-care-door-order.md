# 2026-10-30: Get care door leads with the top needs

- **Considered:** adding the three top examples as new pages, or listing them now and letting the site hide ones with no page. The pages (#203, #478, #221) are not built, so only the second works today.
- **Chose:** list them in ranked order in `content/doors.yaml`; the existing page check hides them until they exist. Added optional `from` and `until` dates (MM-DD) to door examples so Flu or COVID shot shows only Sept 1 to Dec 31, checked at build time.
- **Shipped:** home card examples follow the ranked order from #475. The /care/ situations run dentist, Medicare, shots, staying healthy. Quit tobacco is folded into Stay healthy. New lede: "Mental health help, care you can afford, a dentist, Medicaid and more in Mon County." Closes #476, except that the top three examples and situations appear once their pages land. Before and after screenshots at iPhone width were not attached (no browser in this run).
- **Scoreboard:** no number moves. When the mental health, no insurance and Medicaid pages ship, check they show first on the home card.
