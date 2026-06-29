# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite this whole
file each session** — replace the contents wholesale with the current state;
this is not an append-only log or an archive. For durable rules read
[`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table read
[`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

**Note:** update this file only at the end of a session, when the user asks —
not mid-session.

_Last updated: 2026-06-29_

## Current state

- **Site is live, healthy, and now NATIONWIDE** at warhammerdiscounts.com. Every
  US state + DC has its own map page (`location/<state>/`), all linked
  alphabetically from the landing page, and the **All Cities** view spans the
  whole country. Curated city/region pages (Twin Cities, Colorado Springs,
  Denver, Duluth, Rochester, Mankato, St Cloud) are unchanged. All four PRs this
  session (#65–#68) merged to `main` and **deployed green**.
- **New this session — every form submission stamps a "Verified by store via form
  on <date>." note** (PR #65). `scripts/apps-script/form-sync.gs` now refreshes
  that dated line on *every* submission (update/new/triage), appended below any
  human note, with stale machine markers (Store-Finder seed note,
  `Store email confirmation sent` marker) stripped and no duplicate dates on
  re-submission. It renders via the existing `popup-note` line — no UI change.
  **The user has pasted the updated `form-sync.gs` into the live Apps Script
  project**, so it's active. Dumpster Cat Games was backfilled (its form PR #64
  merged before this fix existed).
- **New this session — nationwide state pages + Store Finder supplements** (PR
  #66). New idempotent driver **`scripts/gen-all-state-pages.js`**: for every US
  state in the snapshot it scaffolds `location/<state>/index.html` if missing
  (median-centered, outlier-robust + fitted zoom), runs `gen-state-storefinder.js`
  per state, and links it on the landing page. 50 states + DC, ~2,500 stores.
- **New this session — All Cities wired nationwide + cross-border dedup fix** (PR
  #67). `gen-all-state-pages.js` now also wires each supplement into
  `location/allcities/` (idempotent). `gen-state-storefinder.js` proximity dedup
  went **repo-wide** so a border store curated under an adjacent state's metro
  (e.g. a WI store in `data/twincities.json`) no longer double-pins on All Cities.
- **New this session — fixed dedup silently dropping same-named stores** (PR #68).
  The supplement generator had been deduping by **name**, collapsing every
  official "Games Workshop"/"Warhammer" store (and other same-named chains) to one
  per state — **130 of 190 official GW stores nationwide were missing** (the bug
  that surfaced "Games Workshop - Union Landing"). Name matching is now strictly
  the coordinate-less fallback; stores with coordinates dedup by **proximity
  only**. All 190 official stores now accounted for (185 as `none` supplement
  pins, 5 coincide with curated MN/CO pins).
- **New this session — first-contact "hello" outreach email** (PRs #70–#71).
  `docs/form/outreach-email-intro-template.md`: a short trust-first first touch
  (no form/button) that introduces the project and asks if it's the right inbox —
  sent *before* the verification email. No removal/opt-out (the listing is
  fan-sourced and stays; the fan reading the map is priority #1 — owners *update*
  their info, they don't *approve* being listed). Marker `Intro email sent on <date>`.

## Per-region status snapshot (curated regions)

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 42 | Confirmed: Battleground (form), Lewis (phone), Games By James (phone), **Dumpster Cat (form, this session — `15`)**. Galaxy Games removed. Inline resend drafts staged (not sent). |
| St Cloud | 1 | Lewis – St Cloud. Phone-confirmed `loyalty`. |
| Colorado Springs | 12 | Button outreach sent; inline resends drafted (not sent) for the 9 emailable `unconfirmed`. Squatch Bros `none`; Theo's phone-only. |
| Denver | 27 | Discovery (A+B+C) done; 2 no-discount (GW-owned), 25 unconfirmed. **Email generation is the NEXT TASK** — Gemini→Claude flow staged in [`../outreach/denver-email-discovery.md`](../outreach/denver-email-discovery.md). |
| Duluth | 4 | Stockists confirmed, discounts unverified. |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

Plus **50 state + DC store-finder supplements** (`data/<state>-storefinder.json`,
~2,500 `unconfirmed`/`none` pins) — generated, not hand-edited. Authoritative
counts live in `data/<region>.json`.

## Next up (priority order)

1. **Denver email generation — THE NEXT TASK.** Two-step flow staged in
   [`../outreach/denver-email-discovery.md`](../outreach/denver-email-discovery.md):
   **(a)** paste that doc's **Step 1** prompt into **Gemini** to find public
   contact emails for the 25 unconfirmed Denver shops (let Gemini's web search
   absorb the token cost); **(b)** paste the doc's **Step 2** handoff + Gemini's
   JSON into a fresh **Claude** session to draft the first-contact "hello" intro
   emails (Gmail drafts only — never send), mark each `Intro email sent on <date>`
   in `data/denver.json`, log contacts in `docs/outreach/denver-contacts.md`, and
   ship via PR. Skip the 2 GW-owned `Warhammer -` stores. Wave 2 (the unconfirmed
   verification email) follows once owners reply.
2. **Review + send the inline resend drafts** (35 in Gmail Drafts, Twin Cities +
   Colorado Springs). User sends manually, 10–20/day. Dreamers Vault is the
   multi-store-layout sample worth a look first.
3. **As email replies come in:** transcribe by hand into `data/<region>.json`
   (set real `category`, add `Verified by store via email on <YYYY-MM-DD>`, strip
   the `Store email confirmation sent on <date>` marker), then branch → PR → merge.
   **No auto-publish for inline/intro replies** (only form/button submissions auto-publish).
4. **Fold the user's edited copy into `outreach-email-inline-template.md`** so the
   repo doc matches what actually went out (subject, intro, 1–22 numbering,
   phase-3 note). Still has pre-edit wording.
5. **Storefinder cache refresh** ~2026-07-28 (`scripts/pull-storefinder.js`), then
   **re-run `node scripts/gen-all-state-pages.js`** to refresh all state pages +
   supplements + All Cities in one shot.
6. **Doc nit:** templates sign off `Jon@warhammerstores.com` but the
   `begin-city-outreach` skill says `Jon@warhammerdiscounts.com` in one spot.

## Conventions worth remembering

- **All-states regen is one command:** `node scripts/gen-all-state-pages.js`
  (idempotent) rebuilds every state page + supplement and re-wires the landing
  page and All Cities. Run it after each monthly snapshot re-pull. Per-state:
  `node scripts/gen-state-storefinder.js <ST>`.
- **Supplement dedup is PROXIMITY-based (~120 m, repo-wide curated + kept-this-run).**
  Name matching is *only* the fallback for coordinate-less curated stores — do
  **not** reintroduce name-based dedup of stores that have coordinates, or you'll
  re-collapse same-named chains like the official "Games Workshop"/"Warhammer"
  stores (the PR #68 bug). Generated `*-storefinder.json` are not hand-edited;
  curate in the city file instead.
- **`form-sync.gs` is a repo MIRROR of the live Google Apps Script.** Editing the
  repo file does nothing until it's pasted into the Apps Script editor. Every form
  submission now stamps `Verified by store via form on <date>.`
- **Confirmation notes:** direct confirmation → `Verified by store via <channel>
  on <YYYY-MM-DD>`; outreach-sent marker → `Store email confirmation sent on <date>`.
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). **Create and merge the PR without asking** (standing rule). Data
  PRs must pass `node scripts/validate-stores.js`. Note: after a squash-merge,
  continuing on the same branch leaves history diverged and bloats the next PR
  diff — reset the branch onto `origin/main` before the next commit.
- **All Cities is intentionally nationwide now** (was deferred until states had
  supplements). State supplement pins are mostly `unconfirmed` (hidden behind the
  map toggle); GW-owned stores show as `none` by default.

## Session log

### 2026-06-28/29 (form-verify stamping + nationwide expansion)

- **PR #65** — every form submission stamps/refreshes a dated "Verified by store
  via form" note (`form-sync.gs` + helper); backfilled Dumpster Cat. User pasted
  the new script into live Apps Script.
- **PR #66** — `gen-all-state-pages.js`; per-state pages + supplements for all 50
  states + DC, linked on the landing page.
- **PR #67** — wired all supplements into All Cities; made proximity dedup
  repo-wide to kill cross-border double-pins (3 WI + 1 NE).
- **PR #68** — fixed name-based dedup that was dropping 130/190 official GW stores
  (surfaced by "Games Workshop - Union Landing"); dedup is now proximity-only
  except the coordinate-less curated fallback.
- **PR #70** — added the first-contact "hello" intro outreach email template.
- **PR #71** — dropped the removal opt-out from it (fan-sourced listing stays).
- **Staged Denver email generation** as the next task: `docs/outreach/denver-email-discovery.md`
  holds the Gemini email-search prompt (25 unconfirmed stores embedded) + the
  Claude draft-generation handoff.
