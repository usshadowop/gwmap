# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite this whole
file each session** — replace the contents wholesale with the current state;
this is not an append-only log or an archive. For durable rules read
[`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table read
[`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

**Note:** update this file only at the end of a session, when the user asks —
not mid-session.

_Last updated: 2026-06-30_

## Current state

- **Site is live, healthy, and NATIONWIDE.** The map site is
  warhammerdiscounts.com; store **stock photos are hosted on Cloudflare R2**,
  served via **img.warhammerstores.com**. Nothing structural changed on the map
  itself this session.
- **This session built the store stock-photos system** — 4 PRs merged &
  deployed green (#76–#79):
  - **#76** — new `stockImages` schema field across all 58 data files + a
    "Stock photos" **lightbox gallery** in `app.js` + an `IMAGE_BASE_URL`
    constant. `gen-state-storefinder.js`, `validate-stores.js`, and
    `CONTRIBUTING.md` updated to match.
  - **#77** — synced Dreamers Vault to R2 (dropped accidental terrain shots) and
    added a **"Photo taken on: &lt;date&gt;"** caption parsed from the filename.
  - **#78** — trimmed Dreamers Vault to 5 after the owner-curation pass.
  - **#79** — added **Hub Hobby Richfield (6)** and **Tower Games Minneapolis
    (8)** photos.
- **Outreach state is unchanged since 2026-06-29** (no outreach work this
  session) — see "Carry-forward outreach" below.

## Stock-photos system — how it works (NEW; read before touching photos)

- **Hosting:** Cloudflare R2 bucket **`gwmap-images`**, public via custom domain
  **`img.warhammerstores.com`** (the `warhammerstores.com` zone is on Cloudflare,
  R2-proxied). Zero egress cost.
- **Folder convention:** `<region>/<store-id>/stock/<filename>` — e.g.
  `twincities/hub-hobby-richfield/stock/20260629_135842.jpg`. The `<store-id>`
  **must** match the `id` in `data/<region>.json`. Keys must be **URL-safe**
  (lowercase, no spaces — app.js interpolates them into the href unescaped).
- **Data:** each store carries a `stockImages` array of **host-relative keys**
  (NOT full URLs). `app.js` prepends `IMAGE_BASE_URL`
  (`https://img.warhammerstores.com`) at render time, so moving the host later is
  a one-line change. Empty `[]` ⇒ no link rendered.
- **Render:** a single **"Stock photos (N)"** link on the card opens a
  full-screen lightbox — prev/next, photo counter, Esc/arrow-key/backdrop close,
  focus restore. Filenames lead with `YYYYMMDD_HHMMSS`; the lightbox shows
  **"Photo taken on: Mon D, YYYY"** parsed from that prefix (`stockPhotoDate()` +
  `STOCK_MONTHS` in `app.js`). Built in `app.js` like the mail FAB, so it works
  on every region page without editing each HTML shell.
- **rclone (uploads happen on the maintainer's machine, never in-session):**
  remote `r2` (type `s3`, provider `Cloudflare`), **bucket-scoped** token, with
  **`no_check_bucket = true`** — REQUIRED, or uploads 403 on `CreateBucket`
  (scoped tokens can't create/list buckets). `rclone lsd r2:` (no bucket) also
  403s by design; always target `r2:gwmap-images`.
  - Upload: `rclone copy "<localdir>" r2:gwmap-images/twincities/<store-id>/stock --progress`
  - List:   `rclone lsf r2:gwmap-images/twincities/<store-id>/stock`
  - Delete: `rclone deletefile r2:gwmap-images/twincities/<store-id>/stock/<file>`
- **Workflow to add/curate photos:** (1) upload to R2 with rclone, (2) `lsf` the
  folder, (3) paste the filenames to Claude (it can't see the local `G:` drive)
  → it sets `stockImages` in `data/<region>.json`, (4) branch → PR → merge. Keep
  the data array in sync with the bucket or the lightbox shows dead-URL frames.

## Photos live so far (all Twin Cities)

| Store | Photos |
|---|---|
| Dreamers Vault Games St. Louis Park | 5 |
| Hub Hobby Richfield | 6 |
| Tower Games Minneapolis | 8 |

## Mid-flight / cleanup

- **Nothing uncommitted** — all four PRs are merged to `main`.
- **`.keep` placeholders** still sit in `hub-hobby-richfield/stock/` and
  `tower-games-minneapolis/stock/` (created to make the empty folders show in the
  dashboard). Harmless — `app.js` only loads keys explicitly listed in
  `stockImages`, so `.keep` is never requested — but delete when convenient:
  `rclone deletefile r2:gwmap-images/twincities/<store-id>/stock/.keep`.
- Photos are ~4 MB straight off the phone. No cost issue (R2 egress is free),
  but optionally resize to ~1600px for snappier mobile loads.
- Date caption format is "Mon D, YYYY" — change `stockPhotoDate()`/`STOCK_MONTHS`
  in `app.js` if a different format is wanted.

## Next up (priority order)

1. **More stock photos** as the maintainer uploads them — same
   upload → `lsf` → paste filenames → wire → PR flow.
2. **Carry-forward outreach (unchanged since 2026-06-29):**
   - **Send the staged Gmail drafts** — 21 Denver intro + ~35 TC/CO Springs
     inline resends (drafts only; maintainer sends 10–20/day).
   - **Denver wave 2** — `unconfirmed` verification emails once an owner replies
     to an intro (`unconfirmed` template, "Confirm Your Listing").
   - **Transcribe email replies** into `data/denver.json`: set the real
     `category`, add `Verified by store via email on <date>`, drop the
     `reported via web-search…` + `Pending confirmation…` caveats. No
     auto-publish for intro/inline replies (only form/button submissions
     auto-publish).
   - **Denver 8 no-email stores** — deeper contact/phone pass if wanted.
   - **Fold the user's edited copy** into `outreach-email-inline-template.md`.
3. **Storefinder cache refresh** ~2026-07-28 (`scripts/pull-storefinder.js`),
   then re-run `node scripts/gen-all-state-pages.js`.
4. **Doc nit:** templates sign off `Jon@warhammerstores.com` but the
   `begin-city-outreach` skill says `Jon@warhammerdiscounts.com` in one spot.

## Conventions worth remembering

- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). Data PRs must pass `node scripts/validate-stores.js`. After a
  squash-merge, **reset the working branch onto `origin/main`** before the next
  commit (the merged head branch auto-deletes on GitHub).
- **This session the user said "go live" / "push live" and approved auto-merge**
  — the CLAUDE.md standing "create + merge automatically" rule was in effect
  (confirm again next session before auto-merging).
- **UI changes are NOT covered by CI** (it only runs `validate-stores.js` on
  data). Verify in a browser. This session used a headless Chromium (Playwright
  at `/opt/pw-browsers/chromium`; global playwright under
  `/opt/node22/lib/node_modules`, run with `NODE_PATH` set) against
  `python3 -m http.server`, **fulfilling Leaflet + images from local copies**
  because the sandbox browser's proxy blocks unpkg/tiles/the image host (curl
  reaches them, Chromium doesn't).
- **Map rendering shows only** `discount` (bold), the new-release/pre-order tags,
  website/phone, `note`, and now the **Stock photos** link. `category` drives pin
  color + default visibility (`unconfirmed` hidden behind the toggle).
- **`form-sync.gs` is a repo MIRROR** of the live Apps Script — editing the repo
  file does nothing until pasted into the Apps Script editor. A form submission
  **preserves `stockImages`** (it's never in the form `entry`, so the
  `Object.assign({}, existing, entry)` merge keeps it).
- **Commit-signing** shows "Unverified" on GitHub (no GPG/SSH key) — expected,
  nothing to fix; never amend the GitHub squash-merge commit.
- **All-states regen is one command:** `node scripts/gen-all-state-pages.js`
  (idempotent). Supplement dedup is PROXIMITY-based. Generated
  `*-storefinder.json` are not hand-edited.

## Session log

### 2026-06-30 (Stock-photos system)

- **#76** — `stockImages` schema field across all 58 data files; "Stock photos"
  lightbox gallery + `IMAGE_BASE_URL` in `app.js`; validation/generator/docs
  updated.
- **#77** — Dreamers Vault R2 sync (terrain shots removed) + "Photo taken on:
  &lt;date&gt;" caption from the `YYYYMMDD` filename prefix.
- **#78** — Dreamers Vault trimmed to its 5 curated photos.
- **#79** — Hub Hobby Richfield (6) + Tower Games Minneapolis (8) photos wired in.
- **Infra:** stood up R2 bucket `gwmap-images`, custom domain
  `img.warhammerstores.com`, rclone with a bucket-scoped token +
  `no_check_bucket = true`, folder convention `<region>/<store-id>/stock/`.
