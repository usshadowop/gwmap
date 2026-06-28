---
name: begin-city-outreach
description: Run the end-to-end store-outreach workflow for one city — discover stores, compile contacts, generate per-store prefilled verification-email drafts in Gmail, ready for the user to review and send. Submitted responses auto-publish via the form-sync automation. Use when the user says "begin city outreach" (and names a city), or asks to start/run outreach for a specific city or region.
---

# Begin city outreach

Take a city from nothing → a set of ready-to-send Gmail **drafts** (one per
store), each linking to a prefilled verification form. When a store owner
submits, the response publishes itself (see step 5). **Draft only — never
auto-send.** The user sends manually, 10–20/day.

**Input:** a city name (e.g. "Denver" or "Boise, ID"). Derive its slug, full
`"City, ST"`, and center lat/lng. If the user only gave a bare city, infer the
state; if genuinely ambiguous, ask.

This skill orchestrates existing pieces — read them, don't reinvent them:
- `docs/research-process/step1-store-finder.md` — the discovery process (A/B/C).
- `scripts/new-city.js` — scaffolds a new region.
- `scripts/prefill-link.js` — turns a store record into its prefilled form URL.
- `docs/form/outreach-email-template.md` — the exact email format.
- `scripts/apps-script/form-sync.gs` — the auto-publish pipeline (already live).

## Steps

### 0. Resolve / scaffold the region
- Pick the kebab slug and confirm coordinates (city center).
- **Two-state metro?** Scaffold it as two regions, one per state side (e.g.
  `kansascity-mo` + `kansascity-ks`) — see step1-store-finder.md "Two-state
  metros" for the id-uniqueness and no-duplicate-outreach rules before
  proceeding.
- If `data/<slug>.json` doesn't exist yet, scaffold it:
  `node scripts/new-city.js <slug> "City, ST" <lat> <lng>`
  (this also adds the landing-page link under the state, the per-state page, and
  the All Cities entry). Ship scaffolding via a branch → PR → merge (see below).

### 1. Discover stores — Phases A, B *and* C
- Follow `step1-store-finder.md` exactly. **A city isn't done until A, B, and C
  all run** — Phase C (off-Store-Finder stockist search) is the easy one to skip.
- Pull the GW Store Finder, haversine-filter (never by state code), verify/tier,
  and write every store into `data/<slug>.json` as `category: "unconfirmed"` per
  the default-include policy, using the full unified schema (copy an existing
  entry's complete key set). Use the Store Finder's `_geoloc` coords directly.
- Record what was found in `docs/research-process/results/<slug>.md`.
- **Pre-seeding the data file here is what makes auto-publish routing work** —
  form-sync matches a later submission to the store already sitting in this file.

### 2. Compile contacts
- For each store, find the best outreach email: store website contact page first,
  then a contact form / social DM as fallback. Capture `website`/`phone` into the
  store record when you find them.
- **Verify, don't trust search summaries** — fetch the literal page and confirm
  the address before quoting it.

### 3. Generate prefilled links
- `node scripts/prefill-link.js <slug>` prints a prefilled form URL per store
  (or pass a store id/name substring for just one). It only fills fields we
  actually have. Use its output as the button `href` — don't hand-assemble links.

### 4. Draft the emails
- Use `docs/form/outreach-email-template.md` verbatim: subject line, the
  **"Verify Store Details" button** (not a raw URL), a **direct** city link
  `https://warhammerdiscounts.com/location/<slug>/`, and the `Jon@warhammerdiscounts.com`
  sign-off. Fill the greeting with the owner's name if known, else greet the
  store generically.
- Create one Gmail draft per store with the Gmail `create_draft` tool
  (`htmlBody` = the rendered template). **Stop here** — drafts are reviewed and
  sent by the user; there is no auto-send.

### 5. Auto-publish (already wired — nothing to do)
- When a store owner submits the form, `form-sync.gs` scans every
  `data/<region>.json`, finds the store (pre-seeded in step 1), updates that
  file, and opens a PR; merging deploys it live. A submission matching no seeded
  store lands in the default region flagged `[triage]`.

## Shipping code/data changes
Per `CLAUDE.md`: develop on a fresh branch off `main`, open a PR into `main`, and
merge it (direct push to `main` is branch-protected; merged head branches
auto-delete). Don't add `[skip ci]`.

## Report back when done
Summarize: stores discovered (by tier), contacts found vs. missing, drafts
created, and confirm discovery ran A+B+C. Flag any store with no reachable
contact so the user can decide how to handle it.
