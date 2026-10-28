# 0001: One canonical data layer in `content/`, checked by JSON Schemas, exported to open standards

Status: proposed, 2026-10-28

## Context

The project will have many surfaces: the main site, smaller apps, a calendar feed, a public API, an MCP server, and other people's tools. If each one keeps its own copy of the facts, they will drift apart, and one wrong item can undo months of trust (charter).

Today the data is YAML in `content/`, with a draft "v0" schema written in prose. Only `calendar/` has entries, and only the calendar is checked. The playbook recommends Open Referral HSDS for services and strict iCalendar for events. The charter adds a needs register.

## Decision

1. **`content/` is the only source of truth.** Every surface is built from it. No surface stores its own facts.
2. **YAML files in git stay the storage.** One file per record. Changes go through PRs.
3. **Each record type has a JSON Schema** in `content/schemas/<type>.schema.json` with a version number. The checker, the build, and every tool use these schemas. `content/README.md` stays the plain-language guide.
4. **Record types:** organizations, services (`resources/`), locations, events (`calendar/`), needs, metrics, findability runs. Service-like types follow HSDS field meanings. Events follow iCalendar meanings.
5. **IDs are `<type>/<slug>`.** Slugs never change and are never reused. Where a standard needs a UUID, derive it from the ID (UUID v5) so it is stable across builds.
6. **We export standards, we do not author them.** The build produces HSDS 3.x JSON and a Tabular Data Package for services, iCalendar for events, and our own JSON for everything.
7. **Data with stricter licenses than CC BY stays out** of `content/`. Link to it instead.

## Consequences

- Good: one fix shows up everywhere. Agents have one shape to learn. Other tools get formats they already read. Storage costs nothing and has full history.
- Good: schemas turn "the README says" into checks a PR cannot skip.
- Cost: someone has to write and maintain the schemas and exporters. That is the first roadmap item.
- Cost: YAML in git does not suit people without GitHub. Corrections from residents will need another route (#48) that ends in a PR.
- Limit: git as a database is fine for thousands of records, not millions. Large datasets (health metrics, census) are summarized into small files or linked, not copied whole.
- Changing a schema in a way that breaks old files needs a new version number and a migration in the same PR.
