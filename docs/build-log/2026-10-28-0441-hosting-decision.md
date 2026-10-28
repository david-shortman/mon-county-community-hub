# 2026-10-28: Hosting decision recorded in the architecture records

- **Considered:** David's feedback on the architecture: the monorepo works well, and he weighed GitHub Pages against Vercel, which might seem to need separate repos.
- **Chose:** GitHub Pages, for cost, with every app on a subpath of one site (David's call). Vercel, Netlify, and Cloudflare Pages all support one repo with many apps, and Pages can serve extra domains from deploy-only repos, so none of the fallbacks split the code.
- **Shipped:** ADR 0004 (repo layout) and ADR 0006 (hosting) marked accepted, with a table of hosting options and what each needs. The target architecture page says the same.
- **Scoreboard:** no change.
