# 2026-10-30: A checked home for the needs register

- **Considered:** #74 asks for a schema and checker for `content/needs/`, so Duet's research in #44 has a place to land that the site, the API and planning all read. #44 lists the fields it collects (need, summary, evidence with source, figure, date and checked date, people affected, severity, trend, who is working on it, gaps, related findability questions, ideas). The schema follows that list and the charter's wording.
- **Chose:** a JSON Schema in `content/schemas/need.schema.json` for the shape, and `site/scripts/check-needs.mjs` for the rules a schema cannot say well: every evidence item has a source and checked date, counts are whole numbers, `working_on` names groups (an org slug, or a name with its public url), topics and orgs exist, ranks are unique, and nothing looks personal (an email, a phone number, or a quoted passage of six or more words). Fields outside the schema are errors here, not warnings, since a stray field is the easiest way for personal details to slip in.
- **Tested:** the checker tests itself on every run. `site/scripts/fixtures/needs/` holds one clearly fake good need (must pass) and one fake bad need (must fail with nine named problems). No example needs were added to `content/`.
- **Shipped:** `npm run check-content` now also runs the needs check. `content/README.md` documents the format.
- **Next:** once #72's API is merged, needs will be added to `/api/v1/needs.json` (empty until #44 adds entries).
- **Cost:** $0.
