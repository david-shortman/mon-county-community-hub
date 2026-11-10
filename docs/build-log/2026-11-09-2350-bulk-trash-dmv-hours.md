# 2026-11-09: Bulk trash and DMV hours now find their pages (#1764)

- **Considered:**
  - No `for:code` issue was `up-next`.
  - The week 3 plan's next items (#219 and #863 warming shelter line, #202 housing, #60 pantry finder) are shelter, housing and food pages, which wait for David.
  - #1764 lists four questions no page answered. Two of them are not high stakes: bulk trash and DMV hours.
- **Chose:** those two. AA meetings and stolen SNAP benefits stay on #1764. SNAP is a benefits topic, and AA needs a provider source.
- **Shipped:**
  - **Bulk trash:** a fact record, `content/facts/recycling/bulk-items.yaml`, from Westover's utilities page, read 2026-11-09. In Westover, call City Hall (with a Call button). Everywhere else we say we could not find an official page, and to ask whoever picks up your trash or the Solid Waste Authority.
    - It shows under "Hard items" on `/recycling/`, with a link to donating, and as a lookup row, "Furniture, mattresses and other big items".
    - Morgantown and Star City have no official page on this. That went to a `needs-verification` issue (#1777, with a call for David) and a discovery file.
  - **DMV hours:** the Morgantown office card already had its hours. Re-read on the DMV's office page today (8:30 a.m. to 5 p.m., Monday to Friday), so its checked date is now 2026-11-09. The miss was a search problem, so `/drivers-license/` gets "Also called: dmv hours, dmv office".
  - `/recycling/` also gets "bulk trash" and "bulk pickup".
  - A saved search run: `content/findability/search-runs/2026-11-09-2354.json`.
- **Not done:** Republic Services' Morgantown page loads its text by script. A browser read was refused in this session, so we did not read it and did not try another way.
- **Measured:** the search test went from 282 to 284 of 289 (98.3%).
- **Scoreboard:** site search test 98.3%. Recycling findability (60) should move once bulk pickup is confirmed for Morgantown. Check at the November 15 findability run.
- **Cost:** $0.
