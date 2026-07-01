# gwmap — Project Handoff for Google AI Studio (Gemini)

A self-contained orientation for an AI assistant (Gemini via Google AI Studio, or
any other model) picking up work on this repository without the prior chat
history. Read this top to bottom once and you should be able to continue work.

> This is a **cross-tool handoff** (written for a different model to take over).
> The rolling session snapshot ("what the last session did, what's next") lives
> separately in [`handoff.md`](handoff.md) — read that too for the latest state.
> `CLAUDE.md` in the repo root holds the standing rules; they apply to any
> assistant, not just Claude.

---

## 1. What this project is (in one paragraph)

`gwmap` is a **static website** — an interactive [Leaflet](https://leafletjs.com/)
+ OpenStreetMap map of local hobby stores that sell Games Workshop / Warhammer
models, tagged by whether each store offers a **discount**. It is hosted on
**GitHub Pages** at **warhammerdiscounts.com** (custom domain, see `CNAME`).
There is **no build step and no framework** — just HTML, one CSS file, and a
little vanilla JavaScript. You edit files, push to `main`, and GitHub Pages
redeploys automatically. The bulk of the ongoing work is **data**: researching
stores and recording them in per-region JSON files.

---

## 2. Repository map

```
/
├── index.html               Landing page: links to every region, grouped by state
├── CNAME                     Custom domain (warhammerdiscounts.com)
├── removed-stores.json       Archive of stores confirmed NOT to belong (e.g. don't sell GW)
├── README.md                 Architecture + how to run locally / add a region
├── CONTRIBUTING.md           The store JSON schema + how to add a store
├── CLAUDE.md                 Standing rules / working notes (READ THIS — applies to you too)
│
├── css/
│   └── style.css             All styling for every page
├── js/
│   ├── app.js                ALL shared map logic (loads data, builds pins + popups)
│   ├── site-info.js          "Site Info" modal wiring
│   └── vendor/oms.js         OverlappingMarkerSpiderfier (fans out stacked pins)
│
├── location/                 One folder per region — each is a thin HTML shell
│   ├── twincities/index.html      (a CITY map → data/twincities.json)
│   ├── minnesota/index.html       (a STATE combined view → multiple data files)
│   ├── allcities/index.html       (ALL regions combined into one map)
│   └── <state or city>/index.html …  (~58 of these)
│
├── data/                     One JSON file per region (an array of store objects)
│   ├── twincities.json            curated CITY file (hand/form edited)
│   ├── colorado.json / denver.json / …  curated city files
│   └── <state>-storefinder.json   GENERATED supplements — DO NOT hand-edit
│
├── storefinder/
│   ├── storefinder-YYYY-MM-DD.json  Dated snapshot of the GW Store Finder API (~11 MB)
│   └── README.md
│
├── scripts/                  Node.js tooling (no deps; plain `node scripts/x.js`)
│   ├── validate-stores.js         Data validator (runs in CI)
│   ├── new-city.js                Scaffold a new region (HTML shell + data + nav links)
│   ├── pull-storefinder.js        Refresh the GW Store Finder snapshot (~monthly)
│   ├── gen-state-storefinder.js   Build one <state>-storefinder.json from the snapshot
│   ├── gen-all-state-pages.js     Scaffold+generate pages/supplements for EVERY state
│   ├── prefill-link.js            Build per-store prefilled Google Form links (outreach)
│   └── apps-script/form-sync.gs   Google Apps Script: Form submission → PR (runs on Google's servers)
│
├── docs/                     Documentation (this file lives here)
│   ├── handoff.md                 Rolling session snapshot (read for latest state)
│   ├── project-plan.md            High-level roadmap
│   ├── research-process/          The store-research method + per-region results
│   ├── form/                      Google Form field map + outreach email templates
│   └── outreach/                  Per-city contact lists / outreach status
│
└── .github/workflows/
    ├── deploy.yml                 Push to main → deploy to GitHub Pages
    └── validate.yml               PR/push touching data → run validate-stores.js
```

### The three kinds of pages (important mental model)

Every page under `location/*/index.html` is the **same ~40-line shell**. They
differ only in a few `<script>` globals near the bottom and the `<h1>` text:

- **City map** — sets `window.GWMAP_DATA_URL = '../../data/<city>.json'` (single file).
- **State combined view** — sets `window.GWMAP_DATA_URLS = [ ...several files... ]`
  (an array: the state's curated city files **plus** its generated
  `<state>-storefinder.json` supplement).
- **All Cities** — same as a state view but the array lists **every** region file.

`js/app.js` reads `window.GWMAP_DATA_URLS` if present, otherwise falls back to
`[window.GWMAP_DATA_URL]`. It also honors `window.GWMAP_CENTER` (`[lat, lng]`)
and `window.GWMAP_ZOOM` for the initial view. Region pages are two levels deep,
so they load shared assets as `../../css/`, `../../js/`, `../../data/`.

---

## 3. The data model (the thing you'll edit most)

Each `data/<region>.json` is a **JSON array of store objects**, all sharing one
**flat ~31-field schema**. Keep the **full key set on every entry** even when
values are blank — blanks are `""`, `false`, `[]`, or `null` as appropriate.
`app.js` only renders a field when it's populated, so blank fields are invisible.
When adding a store, **copy an existing entry** and fill in what you know rather
than emitting a subset.

Only three fields are **required** (enforced by the validator):

| field      | rule |
|------------|------|
| `id`       | non-empty string, lowercase kebab-case, **unique within the file** |
| `name`     | non-empty string |
| `category` | one of `15`, `10`, `loyalty`, `none`, `unconfirmed` |

`lat`/`lng` must be a number **or** `null` (null → the browser geocodes the
`address` via OpenStreetMap Nominatim at load time; setting them skips geocoding
and pins exact coordinates — prefer setting them when you have them).

### `category` → pin color + meaning

| category      | color  | meaning                             |
|---------------|--------|-------------------------------------|
| `15`          | green  | 15% standing discount               |
| `10`          | blue   | 10% standing discount               |
| `loyalty`     | yellow | Discount via a store loyalty/membership program |
| `none`        | red    | Confirmed: no discount              |
| `unconfirmed` | purple | Found but not verified (hidden by default; a legend toggle shows them) |

### Full field list (canonical order lives in `data/twincities.json`)

```jsonc
{
  "id": "unique-slug",
  "name": "Store Name",
  "address": "Street, City, ST Zip",
  "lat": null,                    // number or null
  "lng": null,                    // number or null
  "category": "15",               // 15 | 10 | loyalty | none | unconfirmed
  "discount": "Human sentence describing the GW discount",
  "discountExclusions": "",       // e.g. "Excludes paints and Black Library"
  "discountDetails": "",          // extra prose about the discount
  "loyaltyDetails": "",           // how the loyalty/membership program works
  "newReleases": false,           // TRUE only means "the DISCOUNT applies to launch-day releases"
  "preorders": false,             // TRUE means "the store takes pre-orders" (see gotcha below)
  "preorderUrl": "",              // optional link in the yellow pre-order box
  "preorderLinkText": "",         // the pre-order instructions text / link label
  "mapsUrl": "",                  // "View on Google Maps" link; defaults to an address search
  "website": "",
  "phone": "",
  "affiliation": "",              // e.g. "Owner" — who verified the listing
  "note": "",                     // free HTML note shown under the popup (see note gotcha)
  "gameSystems": [],              // array of strings, e.g. ["40k","Age of Sigmar"]
  "stockLevel": "",               // e.g. "50 - 100"
  "discord": "", "facebook": "", "instagram": "", "twitter": "", "otherSocials": "",
  "playSpaceTables": "",          // "Yes" | "Yes, but with restrictions" | "No"
  "playSpaceCost": "",            // "Free" | "Cost"
  "playSpacePrice": "",
  "playSpaceRestrictions": "",
  "playSpaceReserve": "",
  "stockImages": []               // array of image KEYS (not URLs) — see below
}
```

**Two subtle-but-important behaviors in `js/app.js` (`buildPopupHtml`):**

1. **Discount tags vs. the pre-order box are decoupled.** The popup shows a
   "✓ Discount applies to pre-orders" (and "…to new releases") tag **only when
   the store actually has a discount** — i.e. `category` is `15`, `10`, or
   `loyalty`. A `none`/`unconfirmed` store with `preorders: true` will **not**
   show that discount tag. Separately, the **yellow pre-order instructions box**
   renders whenever `preorders` is true OR `preorderUrl`/`preorderLinkText` is
   set — so a no-discount store that takes pre-orders still surfaces its
   instructions. Keep this distinction if you touch that function.

2. **`note` is injected as raw HTML** (`<p class="popup-note">${store.note}</p>`,
   no escaping). That's deliberate — it lets a note contain a link, e.g.
   `"... <a href=\"…\" target=\"_blank\" rel=\"noopener\">Membership Info</a>"`.
   It also means note text with a literal `<`, `&`, etc. can break rendering, so
   escape those if you ever put non-HTML angle brackets in a note.

**`stockImages`** holds **keys relative to a base host**, not full URLs. The host
is `IMAGE_BASE_URL` at the top of `js/app.js` (currently
`https://img.warhammerstores.com`, a Cloudflare R2 bucket) and is prepended at
render time. A key looks like `"twincities/hub-hobby-richfield/stock/photo1.jpg"`.
Keys must be URL-safe (lowercase, no spaces). Leave `[]` until photos exist.

### Generated files — do NOT hand-edit

Any `data/<state>-storefinder.json` is **generated** by
`scripts/gen-state-storefinder.js <ST>` from the `storefinder/` snapshot. It
lists every Store-Finder entry in that state (GW-owned → `none`, others →
`unconfirmed`, note "Found in Games Workshop Store Finder."), **minus** stores
already in that state's curated **city** files (deduped by proximity/name). Edits
you make by hand get **overwritten** on the next regen — to change one of these
stores, curate it in the relevant **city** file instead, and the dedup drops it
from the supplement on regen.

---

## 4. How to run and validate locally

**Run the site** (no build step — any static server works):

```sh
python3 -m http.server 8000
# then open http://localhost:8000  (landing page → click into a region)
```

CI only validates the *data*; it does **not** exercise the UI. So if you change
`js/app.js`, `css/style.css`, or an HTML shell, **you must open the site in a
browser and click a store pin** to confirm nothing broke.

**Validate the data** (this is exactly what CI runs — always run before pushing
a data change):

```sh
node scripts/validate-stores.js
```

It checks every `data/*.json` for valid JSON, the required fields, a valid
`category`, `lat`/`lng` being number-or-null, and duplicate `id`s within a file.

There are **no npm dependencies** — every script is plain `node scripts/<name>.js`.

---

## 5. The scripts (what each one is for)

| script | what it does | when to run |
|--------|--------------|-------------|
| `validate-stores.js` | Validate all data files. Blocks CI on failure. | Before every data push. |
| `new-city.js <slug> "City, ST" <lat> <lng>` | Scaffold a region: HTML shell, empty `data/<slug>.json`, landing-page link (grouped by state), state combined-view entry, and an entry in All Cities. Aborts if the region already exists. | Adding a brand-new city. |
| `pull-storefinder.js` | Re-fetch the GW Store Finder API (~11 MB, ~8,200 global entries) into a new dated `storefinder/` snapshot, validating and replacing the old one. | ~Monthly, when the snapshot date is >~1 month old. Don't re-pull every session — read the existing snapshot. |
| `gen-state-storefinder.js <ST>` | Build/refresh one `data/<state>-storefinder.json` from the snapshot (deduped against city files). | After a fresh snapshot, or after promoting stores into a city file. |
| `gen-all-state-pages.js` | Idempotently scaffold a page + supplement for **every** state in the snapshot, link them on the landing page, and wire each into All Cities. | Bulk state rollout. |
| `prefill-link.js <region>` | Generate a personalized prefilled Google Form URL per store in a region (used to draft outreach emails). | During outreach. |

The GW Store Finder API (for reference): `GET https://www.warhammer.com/api/storefinder`
— unauthenticated. Each entry has `_geoloc:{lat,lng}` (use directly, don't
re-geocode), `isWarHammerStore`, address fields, `phone`. **Filter by true
haversine distance to a target city, never by state code alone** (cross-state-line
stores near a city would be dropped). Prefer the cached snapshot over re-pulling.

---

## 6. How changes ship (the deploy loop)

1. `main` is **branch-protected** — you cannot push to it directly.
2. Do work on a branch, open a **pull request into `main`**, let CI finish,
   then **squash-merge**.
3. Merging to `main` triggers `.github/workflows/deploy.yml` → GitHub Pages
   redeploys the whole repo root. The change is live within a minute or two.
4. **Never add `[skip ci]`** to a commit or merge — the merge is what triggers
   the deploy.
5. `validate.yml` runs `validate-stores.js` on any PR/push that touches
   `data/**.json`, the validator, or its own workflow. Docs/UI-only changes
   don't trigger it (another reason to test UI changes by hand).

> `CLAUDE.md` grants standing authorization to **create and merge** the PR
> automatically as part of shipping. If you (Gemini) are operating under
> different guardrails in AI Studio and can't merge, just push the branch and
> open the PR, then tell the human it's ready to merge.

---

## 7. The store-research workflow (the main ongoing work)

Adding real data for a city is a **three-phase** process (canonical writeup:
[`research-process/step1-store-finder.md`](research-process/step1-store-finder.md)):

- **Phase A — Pull.** Take every store in the target area from the GW Store
  Finder snapshot (haversine-filtered around the city). Default-include them all
  as `category: "unconfirmed"` unless there's citable *contradicting* evidence
  (confirmed closure, wrong/stale address, duplicate).
- **Phase B — Verify & tier.** Try to corroborate each store and, where you can,
  upgrade it from `unconfirmed` to a real category. **Corroboration is only used
  to upgrade — never required just to include a store.**
- **Phase C — Off-list.** Search for GW stockists **not** on the official Store
  Finder and add them too. This is the easiest phase to skip; a city with only
  A+B is **partially** researched — say so if you stop there.

Two standing rules that matter a lot here:

- **Verify, don't trust, search-summary claims.** A web-search snippet can assert
  a store carries Warhammer when the page itself doesn't. Fetch the literal
  source and quote it before treating it as confirmed. A blocked/empty fetch
  (403/503/login wall) is a *capability gap*, not negative evidence.
- Stores confirmed **not** to belong (e.g. verified they don't sell GW) are moved
  out of the region file and archived in root `removed-stores.json`.

### Store verification via Google Form (automated)

Store owners verify/correct their own listing through a **Google Form**. On
submit, a Google Apps Script (`scripts/apps-script/form-sync.gs`, which runs on
Google's servers, **not** in this repo's CI) builds a store object, routes it to
whichever `data/<region>.json` already contains that store, and opens a **PR**
with the change (emailing the maintainer an approve/merge link). Key behaviors to
know if you edit data by hand alongside this:

- It stamps a dated `"Verified by store via form on <date>."` line into `note`
  and strips stale machine markers (the Store-Finder seed note, the pending
  "Store email confirmation sent" marker).
- It **preserves** fields the form never collects (`lat`, `lng`, `website`,
  `phone`, `preorderUrl`) and won't blank an existing `address`/`mapsUrl` on a
  submission that left them empty.
- Field/entry-ID map: [`form/form-reference.md`](form/form-reference.md).
  Operational notes: [`form/form-sync-operations.md`](form/form-sync-operations.md).

Phone/email verifications are transcribed **by hand** into the region file using
the same conventions (dated note line like `"Verified by store via phone on
<date>."`, `affiliation: "Owner"`, etc.).

---

## 8. Conventions & gotchas checklist (skim before you commit)

- [ ] Keep the **full key set** on every store entry; blanks stay present.
- [ ] `id` is unique **within its file** and lowercase kebab-case.
- [ ] `category` is one of the five valid values.
- [ ] `lat`/`lng` are numbers or `null` — never a string.
- [ ] Ran `node scripts/validate-stores.js` and it printed "Store data OK".
- [ ] For a UI change (`app.js`/`css`/HTML): opened the site in a browser and
      clicked a pin to confirm popups still render.
- [ ] Didn't hand-edit any `*-storefinder.json` (regenerate instead).
- [ ] Behavior/logic changes go in the **shared** files (`js/app.js`,
      `css/style.css`), not copied into per-region HTML shells.
- [ ] Discount tags require an actual discount; the pre-order box does not (§3).
- [ ] No `[skip ci]`. Ship via PR → squash-merge into `main`.
- [ ] Overwrite [`handoff.md`](handoff.md) with the new state before you wrap up.

---

## 9. Where to read more

| topic | file |
|-------|------|
| Standing rules / working notes (applies to you) | `CLAUDE.md` |
| Latest session state ("pick up here") | `docs/handoff.md` |
| Architecture, run locally, add a region | `README.md` |
| Store schema + adding a store | `CONTRIBUTING.md` |
| High-level roadmap | `docs/project-plan.md` |
| Store-finding process (Phases A/B/C) | `docs/research-process/step1-store-finder.md` |
| Outreach step (contacts → forms → emails) | `docs/research-process/step2-outreach.md` |
| Per-region findings | `docs/research-process/results/<region>.md` |
| Google Form field map | `docs/form/form-reference.md` |
| Form → PR automation details | `docs/form/form-sync-operations.md` |
| GW Store Finder snapshot how-to | `storefinder/README.md` |

---

*Written as a cross-tool handoff so work can continue in Google AI Studio during
a usage pause. If anything here drifts from the code, the code and `CLAUDE.md`
win — and please correct this doc.*
