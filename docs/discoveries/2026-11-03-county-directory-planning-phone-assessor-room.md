# County contact directory: Planning phone and Assessor room differ from the offices' own pages

- **Found:** 2026-11-03, while building a "which county office handles it" page for the topic depth lane (#529)
- **What we found:** The county's contact directory lists the Monongalia County Planning Commission at (304) 291-9570 and the Assessor in Room 315 of the Courthouse. The Planning Office's own page lists 304-284-7302 (fax 304-291-9573) at Room 026. Our Assessor record, read from the Assessor's own site on 2026-11-01, says Room 335.
- **Evidence:**
  - County directory, read 2026-11-03: https://www.monongaliacounty.gov/contact_information_for_county_agencies_and_departments/index.php ("Phone: (304) 291-9570" under Monongalia County Planning Commission; "243 High Street Rm 315" under Monongalia County Assessor)
  - Planning Office page, read 2026-11-03: https://www.monongaliacounty.gov/moncpc/index.php ("Phone: 304-284-7302", "Fax: 304-291-9573")
  - Assessor's site, read 2026-11-01 for `content/orgs/monongalia-county-assessor.yaml`: https://www.assessor.org/ (Room 335). It reset our connection on 2026-11-03, so it was not re-read.
- **Why it matters:** A resident who uses the directory may call a number that is not the one the office lists, or go to the wrong room in the Courthouse.
- **Who keeps it:** Monongalia County Commission (the directory page), the Planning Office and the Assessor's Office.
- **Status:** open. The site uses each office's own page.
