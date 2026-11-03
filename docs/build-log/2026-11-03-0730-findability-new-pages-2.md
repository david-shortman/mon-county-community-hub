# 2026-11-03: Findability for four more new pages (#1612, #529)

- **Considered:** pages that landed on `main` tonight: `/keep-learning/`, `/choosing-a-care-home/`, `/grief/` and `/grants-for-nonprofits/`. Same checks as the first batch: door, Topics page, sitemap, `llms.txt`, links from related pages, "Also called" words, and title and description length.
- **Found:** all four were in their door, the Topics page, the sitemap and `llms.txt`, and three already had "Also called" words. Each had links from only 1 to 3 other pages. Descriptions ran 204 to 307 characters.
- **Shipped:**
  - "Also check" links: Choosing a care home from Caregivers, Help at home and Disability and aging; Keep learning from Pay for training and Staying active; Grants for nonprofits from Start a group, Check a charity and Get money for a project; and lists on each new page.
  - "Also called" words for Grants for nonprofits.
  - Descriptions of 157 to 168 characters. The care home description leaves out "free" for the ombudsman, as the page does until a person confirms it.
  - The "nursing home" search query now expects Choosing a care home first; it is the page that answers it.
  - 14 new search test queries.
- **Search test:** 13 of the 14 new queries hit before and after (these pages came with good words). Still missed: "how do I pick a nursing home for my mom".
- **Found for David:** "suicide" returns the 988 and AFSP group pages and Grief, with Mental health out of the top 3. Mental health is a high-stakes page, so its words go in the batched `for:david` PR.
- **Cost:** $0.
