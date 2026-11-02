# 2026-11-02: Privacy page names the three quiet protections (#1422)

- **Considered:** three protections the site already had but the Privacy page left out: no referrer from crisis pages, no Text or Share on domestic or sexual violence listings, and the same saved offline list for everyone.
- **Found:** two group pages (the Rape and Domestic Violence Information Center and the magistrate court) showed those listings without Quick exit or the no-referrer rule. The listings' own pages had both.
- **Chose:** word each protection plainly and only as far as the code goes (pages you open are saved too, and Quick exit does not erase history), and give a group page the crisis strip when it shows a `private_trace` listing, so "their pages have Quick exit" is true everywhere.
- **Shipped:** a "Extra care on pages for hard moments" section on `/privacy/`, and the crisis strip on group pages with a `private_trace` listing. Waits for David: it speaks for the project and changes crisis pages.
