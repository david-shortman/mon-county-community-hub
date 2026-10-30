# 2026-10-30: Help now: Stay tonight on the crisis pattern (#175, #174)

- **Considered:** Stay tonight is the Help now lane in the site plan (#248): its own tab on phones and the bar on top of the home page. #175 asks to rebuild it on the crisis pattern from the presentation guide, with the crisis strip and quick exit from #174, using only real, sourced places, and with a second check before merge because it is high-stakes (#97, #138).
- **Chose:** a crisis strip at the top of the page, built as a component pages opt into (`crisis` on the layout), then four big choices that jump to sections. Places come from resource records, with hours and the address now in the data (#139). Where we have no sourced place yet (a daytime warm place, a meal tonight), the section says so and points to 211, the warming shelter note and the food pages, rather than listing anything unconfirmed.
- **Shipped:**
  - The strip reads "Danger? Call 911. Crisis? Call or text 988," with a Leave this page button. The button opens weather.gov and replaces this page, so Back skips it. Pressing Shift three times also leaves. Without scripts it is a plain link.
  - Grace Shelter (a bed tonight) and the RDVIC hotline (safe from someone) appear as place cards with Call and Directions buttons. Each source link names its place (#140).
  - Call and Text 988 buttons sit under "Safe from someone".
  - A note at the end says leaving does not erase history, and links to the National Domestic Violence Hotline's internet safety tips.
  - The `/stay-tonight/` link is unchanged.
- **Checked:**
  - Grace Shelter and the RDVIC hotline were re-checked against their sources on October 30 (#138): address, phone, 24/7 hours, 19 beds (13 for men, 6 for women), first come first served, no pets or service animals; the hotline number, 24-hour service, counties, and emergency shelter.
  - axe is clean on 19 pages at 320, 390 and 1280px in light and dark, with no sideways scroll.
  - The page is about 31 KB, under the 100 KB budget, and works with no script.
- **Waits for:** David's review before merge, as a high-stakes page.
