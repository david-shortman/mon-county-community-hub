# wvmedicaidhelp.org refuses plain automated reads

- **Found:** 2026-11-01, re-reading the state's Medicaid 2027 page for #1175 (plain words on Keep your Medicaid in 2027)
- **What we found:** wvmedicaidhelp.org, the state's site for the 2027 Medicaid rules, returned HTTP 403 to a plain scripted read (curl). A page-reading tool did load it, and it still says DoHS asks for information "in writing by U.S. Mail, or online in your PATH account", that "you must respond within 30 days, or you may lose your Medicaid coverage", and "If you are not contacted, you do not need to send anything." bms.wv.gov loaded with no trouble.
- **Why it matters:** The site's scheduled source checks may report this page as broken when it is not, so a person may need to check it by hand.
- **Who keeps it:** West Virginia Department of Human Services
- **Status:** open
