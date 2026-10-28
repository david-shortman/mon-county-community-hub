# 0002: Provenance fields on every record

Status: proposed, 2026-10-28

## Context

The charter says every fact has a source URL and a last-checked date. Hand-written YAML already has `sources: [{url, checked}]`. Live feeds (PR #53) add a separate `feed` object with the feed URL and fetch time. As we add watched pages, exports, an API, and an MCP server, each consumer needs to tell, in one consistent way, where a record came from and how fresh it is. An AI that reads our MCP server should be able to cite the source and date, and a resident should see "checked by hand" versus "pulled from a feed."

## Decision

Every record, whatever its tier, carries a `sources` list. Each source has:

| Field | Required | Meaning |
|---|---|---|
| `url` | yes | A public page a person can open to check the fact |
| `checked` | yes | Date (YYYY-MM-DD, Eastern time) a person or agent last confirmed the fact against that page |
| `method` | no, defaults to `hand` | `hand`, `feed`, or `watched-page` |
| `fetched` | for `feed` and `watched-page` | When the machine got the data (ISO date-time, UTC) |
| `feed` | for `feed` | The adapter id |

Rules:
- The loader fills `method`, `fetched`, and `feed` for machine-made records. People only write `url` and `checked`.
- For feed records, `checked` is the fetch date, because the feed itself is the publisher's own statement.
- Exports and the API pass provenance through unchanged. HSDS `last_modified` is the newest `checked`.
- Every surface shows the source and checked date next to the fact.
- A record whose newest `checked` is older than 6 months is flagged stale. Surfaces may hide stale records or mark them, but never show them as current.

## Consequences

- Good: one shape for the site, the API, the MCP server, and the stale-entry checks.
- Good: residents and other tools can judge freshness themselves.
- Cost: PR #53's `feed` object is folded into `sources[]`. That is a small change in the Builder's lane, filed as an issue rather than done here.
- Hand entries do not change at all, since the new fields are optional or filled by the loader.
