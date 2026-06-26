# CLAUDE.md — working notes for this repo

Guidance for any AI assistant (or human) picking up `gwmap`. Keep this short and
current; it's the first thing to read.

> **Starting a session?** Read [`docs/handoff.md`](docs/handoff.md) first — it's
> the "pick up here" snapshot of where the last session left off and what to do
> next. Overwrite it (whole file) before you wrap up.

## What this project is

An interactive Leaflet + OpenStreetMap map of local hobby stores that offer
discounts on Games Workshop models, hosted on GitHub Pages. The site root
(`index.html`) links out to per-region maps that live under `location/`
(`location/twincities/`, `location/coloradosprings/`, `location/denver/`, …)
plus per-state combined views (`location/minnesota/`, `location/colorado/`) and a
combined `location/allcities/` view. The landing page groups cities under
clickable state headers. Each city region has a
`location/<region>/index.html` and a `data/<region>.json`; all regions share
`css/style.css` + `js/app.js`. Region pages sit two levels deep, so they
reference shared assets as `../../css/`, `../../js/`, `../../data/`.

See [`README.md`](README.md) for architecture and how to add a region.

## Working on features (not store data)?

The site is a plain static front-end — no build step, no framework. Read
[`README.md`](README.md) for the architecture and how to run it locally, then:

- **Shared logic lives in [`js/app.js`](js/app.js)** (with `js/site-info.js` and
  `js/vendor/oms.js` for marker spiderfying); styling is in
  [`css/style.css`](css/style.css). `index.html` is the landing page and each
  `location/<region>/index.html` is a thin, near-identical shell that loads
  `../../data/<region>.json` — put behavior changes in the shared files, not per-region.
- **Verify by running the site locally** (see README) — CI only runs
  `scripts/validate-stores.js` against the *data*, so it won't catch a broken UI.
- Ship via the **Landing changes** rule below (branch → PR into `main` → merge).

## Standing rules

- **Landing changes:** develop on the working branch, then open a PR into `main`
  and merge it (direct push to `main` is branch-protected). No need to ask first.
- **Don't add `[skip ci]`** to commits or merges — merging is what triggers the deploy.
- **Match the unified schema** — every region file uses the same flat rich
  schema; keep the full key set and don't introduce a variant (see Data below).
- **Verify, don't trust, search-summary claims.** A web-search summary can
  assert a store carries Warhammer when the page text doesn't. Fetch the literal
  source and quote it before treating anything as confirmed. A blocked/empty
  fetch (403/503/login wall) is a capability gap, not a negative.
- **A city isn't done until Phases A, B, *and* C all run.** Phase C — searching
  for GW stockists *not* on the official Store Finder — is the easiest to skip; a
  city with only A+B is partially researched, so say so. See
  [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md).

## Data

- Validation: `node scripts/validate-stores.js` (also runs in CI, but only on
  PRs that change `data/**`, the script, or its workflow — docs/UI-only PRs
  don't trigger it). It requires only `id`, `name` (non-empty strings),
  `category` ∈ `{15, 10, loyalty, none, unconfirmed}`, and `lat`/`lng` as number-or-null.
- **One unified schema for all regions:** every `data/<region>.json` store uses
  the same flat ~31-field rich schema (the field set in `data/twincities.json`:
  discount details, `newReleases`/`preorders`, `mapsUrl`, socials, `gameSystems`,
  play-space, etc.). Only `id`/`name`/`category` are required; unknown fields are
  left blank (`""`, `false`, `[]`, or `null` as appropriate) — but keep the full
  key set on every entry so the schema stays identical across files. `app.js`
  only renders a field when it's populated, so blanks are invisible. When adding
  a store, copy an existing entry's full field list rather than emitting a subset.
  (The canonical key order lives in `data/twincities.json`; see also
  [`CONTRIBUTING.md`](CONTRIBUTING.md).)
- **Default-include policy** (current): every store on the official GW Store
  Finder goes into the data as `category: "unconfirmed"` unless there's citable
  *contradicting* evidence (confirmed closure, wrong/stale address, duplicate).
  Corroboration is only used to *upgrade* a listing to a real `category` —
  never required just to include one. Full process:
  [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md).

## Documentation map

- [`docs/handoff.md`](docs/handoff.md) — session handoff: where the last session left off, what's next (read first; overwrite when done).
- [`README.md`](README.md) — architecture, running locally, adding a region.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — store schema + how to add a store.
- [`docs/project-plan.md`](docs/project-plan.md) — high-level roadmap (setup + per-city workflow).
- [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md) — canonical, city-agnostic store-finding process (Phase A pull + Phase B verify/tier).
- `docs/research-process/results/<region>.md` — what was actually found per region (Twin Cities, Colorado Springs, Denver).
- [`docs/form/form-reference.md`](docs/form/form-reference.md) — Google Form field/entry-ID map.
- [`docs/form/form-sync-operations.md`](docs/form/form-sync-operations.md) — how the form → PR automation runs, and its gotchas.
- [`docs/form/outreach-email-template.md`](docs/form/outreach-email-template.md) — store-owner verification email template (subject, button-styled HTML body, city-link rules) — use for every outreach email.
- [`docs/form/outreach-email-unconfirmed-template.md`](docs/form/outreach-email-unconfirmed-template.md) — variant of the outreach email for `unconfirmed` stores (found-but-not-verified, hidden by default); "Confirm Your Listing" button.
- [`.claude/skills/begin-city-outreach/SKILL.md`](.claude/skills/begin-city-outreach/SKILL.md) — the "begin city outreach &lt;city&gt;" runbook: discover → contacts → prefilled-link drafts → auto-publish. Ties the above together.

## "Begin city outreach" workflow

When the user says **"begin city outreach"** + a city, the `begin-city-outreach`
skill drives the whole pipeline: scaffold the region if new (`scripts/new-city.js`),
run discovery (Phases A/B/C, seeding `data/<region>.json`), compile contacts,
generate prefilled form links (`node scripts/prefill-link.js <region>`), and draft
one outreach email per store (Gmail `create_draft`, drafts only — never auto-send).
Submitted responses auto-publish: `form-sync.gs` routes each submission to the
region file that already holds the store (no region question on the form).

## GW Store Finder API (quick reference)

`GET https://www.warhammer.com/api/storefinder` — unauthenticated, ~11 MB,
~8,200+ global entries. Each has `_geoloc: {lat, lng}` (use it directly instead
of re-geocoding), `isWarHammerStore`, address fields, and `phone`. Distance-filter
by true haversine distance, **never by state code alone** — cross-state-line
stores near a target city would be silently dropped. Full how-to + the buggy
patterns to avoid are in the process doc above.
