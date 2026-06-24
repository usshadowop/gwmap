# CLAUDE.md — working notes for this repo

Guidance for any AI assistant (or human) picking up `gwmap`. Keep this short and
current; it's the first thing to read.

## What this project is

An interactive Leaflet + OpenStreetMap map of local hobby stores that offer
discounts on Games Workshop models, hosted on GitHub Pages. The site root links
out to per-region maps (`twincities/`, `coloradosprings/`, `denver/`) plus a
combined `allcities/` view. Each region has an `index.html` and a
`data/<region>.json`; all regions share `css/style.css` + `js/app.js`.

See [`README.md`](README.md) for architecture and how to add a region.

## Working on features (not store data)?

The site is a plain static front-end — no build step, no framework. Read
[`README.md`](README.md) for the architecture and how to run it locally, then:

- **Shared logic lives in [`js/app.js`](js/app.js)** (with `js/site-info.js` and
  `js/vendor/oms.js` for marker spiderfying); styling is in
  [`css/style.css`](css/style.css). `index.html` is the landing page and each
  `<region>/index.html` is a thin, near-identical shell that loads
  `data/<region>.json` — put behavior changes in the shared files, not per-region.
- **Verify by running the site locally** (see README) — CI only runs
  `scripts/validate-stores.js` against the *data*, so it won't catch a broken UI.
- Ship via the **Landing changes** rule below (branch → PR into `main` → merge).

## Standing rules

- **Landing changes:** develop on the working branch, then open a PR into `main`
  and merge it (direct push to `main` is branch-protected). No need to ask first.
- **Don't add `[skip ci]`** to commits or merges — merging is what triggers the deploy.
- **Match the existing schema** of whatever region file you're editing; don't
  introduce a third variant (see Data below).
- **Verify, don't trust, search-summary claims.** A web-search summary can
  assert a store carries Warhammer when the page text doesn't. Fetch the literal
  source and quote it before treating anything as confirmed. A blocked/empty
  fetch (403/503/login wall) is a capability gap, not a negative.
- **A city isn't done until Phases A, B, *and* C all run.** Phase C — searching
  for GW stockists *not* on the official Store Finder — is the easiest to skip; a
  city with only A+B is partially researched, so say so. See
  [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md).

## Data

- Validation: `node scripts/validate-stores.js` (also runs in CI on every PR).
  It requires only `id`, `name` (non-empty strings), `category` ∈
  `{15, 10, loyalty, none, unconfirmed}`, and `lat`/`lng` as number-or-null.
- **Schema variance is intentional and allowed:** `data/twincities.json` uses a
  richer ~31-field flat schema (discount details, game systems, socials, play
  space, etc.); `data/coloradosprings.json` and `data/denver.json` use a minimal
  schema (`id`/`name`/`address`/`lat`/`lng`/`discount`/`category`/`website`/
  `phone`/`note`). Both pass validation. When adding to a region, follow that
  region's existing shape.
- **Default-include policy** (current): every store on the official GW Store
  Finder goes into the data as `category: "unconfirmed"` unless there's citable
  *contradicting* evidence (confirmed closure, wrong/stale address, duplicate).
  Corroboration is only used to *upgrade* a listing to a real `category` —
  never required just to include one. Full process:
  [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md).

## Documentation map

- [`README.md`](README.md) — architecture, running locally, adding a region.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — store schema + how to add a store.
- [`docs/project-plan.md`](docs/project-plan.md) — high-level roadmap (setup + per-city workflow).
- [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md) — canonical, city-agnostic store-finding process (Phase A pull + Phase B verify/tier).
- `docs/research-process/results/<region>.md` — what was actually found per region (Twin Cities, Colorado Springs, Denver).
- [`docs/form/form-reference.md`](docs/form/form-reference.md) — Google Form field/entry-ID map.
- [`docs/form/form-sync-operations.md`](docs/form/form-sync-operations.md) — how the form → PR automation runs, and its gotchas.

## GW Store Finder API (quick reference)

`GET https://www.warhammer.com/api/storefinder` — unauthenticated, ~11 MB,
~8,200+ global entries. Each has `_geoloc: {lat, lng}` (use it directly instead
of re-geocoding), `isWarHammerStore`, address fields, and `phone`. Distance-filter
by true haversine distance, **never by state code alone** — cross-state-line
stores near a target city would be silently dropped. Full how-to + the buggy
patterns to avoid are in the process doc above.
