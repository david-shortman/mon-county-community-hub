# How to add a translation

The site is in English only today. This page explains the setup for other languages. On November 1, 2026 David decided on #1067: Spanish goes first, and Claude may draft Spanish text, but a fluent person reviews it before it goes live (crisis, shelter, food and benefits text is never machine-only). The plan behind it is [`docs/plans/2026-10-31-languages.md`](../plans/2026-10-31-languages.md).

**Unreviewed text is only ever a draft** (`reviewed: false`, see "Drafts stay hidden" below). Nothing in this setup shows anything new to residents until a language is turned on and a fluent reviewer marks the words reviewed.

## The parts

| Part | Where | What it does |
|---|---|---|
| The switch | `PUBLISHED` in [`site/src/lib/i18n.mjs`](../../site/src/lib/i18n.mjs) | Lists the languages residents can see. Empty means English only. Turning one on is David's call, and the High stakes check labels that PR `for:david`. |
| Machine drafts | `ALLOW_MACHINE_DRAFTS` in the same file | Off. While off, the `machine-plus-review` method fails the check (#1067, decision 3). |
| Routing | [`site/astro.config.mjs`](../../site/astro.config.mjs) | English stays at `/` with no prefix. A language gets `/es/` pages. No automatic fallback: a `/es/` page exists only when someone wrote and reviewed it. |
| Page language | `lang` prop on `Base.astro` | Sets `<html lang>` and, for right-to-left languages, `dir`. Defaults to `en`. |
| hreflang | `Base.astro`, `alternatesFor()` in `i18n.mjs` | Adds `<link rel="alternate" hreflang>` links when a page exists in a published language. English-only pages get none. |
| Sitemap | `astro.config.mjs` | Pages in a language that is off never go in the sitemap. Once a language is on, each URL lists its language pairs. |
| Switcher | [`site/src/components/LanguageSwitcher.astro`](../../site/src/components/LanguageSwitcher.astro) | Built, not shown. Names each language in that language, never with a flag. Renders nothing when a page has no other language. |
| Translated pages | `site/src/pages/<lang>/_pages/<route>.astro` (templates) and the router `site/src/pages/<lang>/[...page].astro` | A template never builds by itself. The router builds a page only when the language is on and its words file is reviewed and current ([`locale-pages.mjs`](../../site/src/lib/locale-pages.mjs)). |
| Translation files | `content/translations/<lang>/<kind>/<name>.yaml` | The translated words, kept apart from the English records. |
| The check | [`site/scripts/check-translations.mjs`](../../site/scripts/check-translations.mjs), part of `npm run check-content` | Checks every translation file and the language folders. |
| Loader | [`site/src/lib/translations.mjs`](../../site/src/lib/translations.mjs) | `loadTranslation()` and `translatedField()` give a page the translation, or the English when there is none or it is hidden. |
| High stakes | [`site/scripts/high-stakes.mjs`](../../site/scripts/high-stakes.mjs) | A translation of a high-stakes record, page or part waits for David, just like the English. So do pages in `site/src/pages/<lang>/` that match a high-stakes English page. |
| Tests | [`site/test/translations.test.mjs`](../../site/test/translations.test.mjs) | Run with `npm test` in `site/`. |

## Facts are never translated

Phone numbers, addresses, hours, prices, dates and links come from the English record when the page is built. A translator only changes the words around them. So a translated page can never show an old number.

The check enforces this:

- A record translation cannot include fact fields (`contact`, `hours`, `cost`, `sources`, `url` and the others in `FACT_FIELDS` in `translations.mjs`).
- Every phone number, price and number with three or more digits in a translation must also be in the English. A translation cannot add or change one.

## The translation file

One file per English record, page or part. The path says what it translates:

| `kind` folder | English source | Example path |
|---|---|---|
| `resources`, `orgs`, `calendar`, `places` | `content/<kind>/<slug>.yaml` | `content/translations/es/resources/wvu-medicine-language-services.yaml` |
| `pages` | `site/src/pages/<path>.astro` or `<path>/index.astro` | `content/translations/es/pages/help-in-your-language.yaml` |
| `parts` | `site/src/components/<Name>.astro` | `content/translations/es/parts/SourceLine.yaml` |

```yaml
of: resources/wvu-medicine-language-services   # matches the path
lang: es                                       # matches the folder
fields:                                        # records use fields; pages and parts use strings
  title: (the reviewed Spanish title)
  who_it_is_for: (the reviewed Spanish text)
english_hash: 3f9a1c0e5b2d                     # 12 characters; see below
method: community-reviewed                     # official-link | professional | community-reviewed | machine-plus-review (off)
translated: 2026-11-10
reviewed: 2026-11-12                           # required: nothing goes on the site before a fluent person checks it
reviewer: es-reviewer-1                        # a role ID, never a name
second_review:                                 # required for high-stakes files
  reviewer: es-reviewer-2
  reviewed: 2026-11-13
notes: optional, for the reviewer
```

- **`fields`** (records): only fields that exist in the English record, and never fact fields.
- **`strings`** (pages and parts): any keys the page reads, for example `heading` or `intro`.
- **`reviewer`**: a role ID such as `es-reviewer-1`. Who that is stays in private Notion unless David decides to credit reviewers by name (#1067, decision 8).

## Drafts stay hidden

A translation that no fluent person has checked yet is a **draft**: write `reviewed: false` and leave out `reviewer` and `second_review`. The check still tests it (no facts, no new numbers, a real `english_hash`) and prints a `draft` warning, but:

- the site shows the English instead of a draft, everywhere;
- a page whose words file is a draft builds nothing: no `/es/` page, no sitemap entry, no hreflang link and no language switcher.

To publish it, the reviewer checks every string against the English, fixes what is wrong, then sets `reviewed` to the date and `reviewer` to their role ID (and a second reader adds `second_review` on high-stakes files). That PR changes what residents see, so it waits for David.

## Getting `english_hash`

The hash records which English the translation was made from.

- For a record, it covers only the fields the file translates. Changing a phone number does not make the translation stale; changing the `who_it_is_for` text does.
- For a page or part, it covers the words a reader sees (no code, no markup).

To get it, write the file with any 12 letters and numbers as `english_hash`, then run this in `site/` and copy the result in:

```sh
node scripts/check-translations.mjs --hash ../content/translations/es/resources/<slug>.yaml
```

## When the English changes

The check prints a `stale` warning for each translation whose English changed since it was reviewed. On the site:

- **High stakes** (shelter, food, benefits, crisis lines: the same rules as the High stakes check): the translation is hidden and the English shows, until a reviewer checks it again.
- **Everything else:** the translation shows with a "this part changed" note for up to 30 days after the English changed, then the English shows. When git history is not available (a shallow clone), it is hidden to be safe.

To clear a stale warning, a reviewer compares the new English with the translation, fixes the translation if needed, updates `reviewed` (and `second_review` for high-stakes files), and copies in the new hash.

## Adding a translated page

1. Write the words file, `content/translations/<lang>/pages/<route>.yaml`, with `strings` for every sentence the page shows. Start it as a draft (`reviewed: false`).
2. Write the template, `site/src/pages/<lang>/_pages/<route>.astro`. It reads the words with `loadTranslation()` and takes every phone number, address, hour and link from the English records. Pass `lang="<lang>"` to `Base.astro`.
3. Run `npm run check-content`. The check refuses a template with no English page or no words file, and any other `.astro` file in the language folder.
4. Nothing builds until the language is in `PUBLISHED` (David's call, #1067) and a reviewer marks the words reviewed. Then the router builds the page, `Base.astro` adds the hreflang links and the language switcher, and the page joins the sitemap. Site search and `llms.txt` stay English only for the pilot.

Cost: $0. Everything here runs in the build and on GitHub Pages, which do not change.
