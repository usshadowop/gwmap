# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite this whole
file each session** — replace the contents wholesale with the current state;
this is not an append-only log or an archive. For durable rules read
[`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table read
[`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

**Note:** update this file only at the end of a session, when the user asks —
not mid-session.

_Last updated: 2026-06-28_

## Current state

- **Site is live and healthy** at warhammerdiscounts.com. Regions: Twin Cities,
  Colorado Springs, Denver, Duluth, Rochester, Mankato, St Cloud, plus per-state
  combined views (`location/minnesota/`, `location/colorado/`) and All Cities.
- **New this session: per-state GW Store Finder supplements.**
  `node scripts/gen-state-storefinder.js <ST>` reads the `storefinder/` snapshot
  and writes `data/<state>-storefinder.json` — every store-finder entry in that
  state, mapped to the unified schema, **minus** stores already in that state's
  curated city files (deduped by ~120 m proximity, or normalized name for
  coordinate-less entries). GW company-owned stores → `category: "none"`;
  everyone else → `unconfirmed` + note "Found in Games Workshop Store Finder."
  Title-cases ALL-CAPS names, formats US phones, drops the generic
  `warhammer.com` site. Idempotently wires the file into
  `location/<state>/index.html`'s `GWMAP_DATA_URLS`. **Applied to Minnesota**
  (`data/minnesota-storefinder.json`): 55 in-state entries → 40 deduped → **15
  net-new `unconfirmed` pins** in cities with no page yet (Brainerd, Owatonna,
  Bemidji, Fergus Falls, Thief River Falls, Hutchinson, …); both MN GW-corporate
  stores deduped into existing Twin Cities pins. New pins sit behind the existing
  "Show unconfirmed stores" toggle, so the **default MN view is unchanged**.
  Shipped in PR #59 (merged).
  - **Generated supplements are NOT hand-edited** (regen overwrites). To promote
    a store, curate it in the relevant **city** file; the dedup then drops it
    from the supplement on the next regen. Documented in `CONTRIBUTING.md`,
    `storefinder/README.md`, and `CLAUDE.md`.
  - **Only Minnesota has a supplement so far.** All Cities was intentionally NOT
    wired up — that's a deliberate follow-up to avoid lopsidedness until other
    states also have supplements.
- **Auto-PR is now standing-authorized.** `CLAUDE.md`'s "Landing changes" rule
  was updated to: create *and* merge the PR automatically as part of shipping —
  no asking (squash-merge, let CI finish, never `[skip ci]`). This overrides the
  harness default of asking before opening a PR. (The default itself lives in the
  harness system prompt, not a repo file, so CLAUDE.md is where we encode the
  override.)
- **Local GW Store Finder cache:** `storefinder/storefinder-2026-06-28.json`
  (8,229 stores). Refresh with `node scripts/pull-storefinder.js` when the
  filename date is older than ~1 month (due ~2026-07-28). **After any re-pull,
  also re-run `gen-state-storefinder.js` for every state that has a supplement**
  so the supplements reflect the fresh snapshot.
- **Form → PR automation is live**, `form-sync.gs` current. **Two-state metros:**
  scaffold as two separate regions, keep ids unique (hygiene only — form-sync
  routes by submitted *name*, not id), no duplicate outreach, manual sync on
  verify.

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 43 | **Essentially complete** — ~33 sent, ~8 no-email (phone/FB/contact-form), 2 GW-corporate (no owner outreach). Rockhopper Comics still awaiting a Facebook reply. |
| St Cloud | 1 | Lewis – St Cloud, own `data/stcloud.json`. Phone-confirmed `loyalty`. |
| Colorado Springs | 12 | **Outreach sent.** 1 confirmed (`none`, Squatch Bros.), 11 unconfirmed — 9 emailed, awaiting form replies; Theo's Toys is phone-only. |
| Denver | 27 | Discovery (A+B+C) done; 2 no-discount, 25 unconfirmed. **No outreach yet — next up.** |
| Duluth | 4 | Stockists confirmed, discounts unverified. |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

(Authoritative counts live in `data/<region>.json`; this is a snapshot.) The
**Minnesota** state map additionally shows the generated
`data/minnesota-storefinder.json` supplement (15 `unconfirmed` pins) layered on
top of the city files — these are NOT counted above and are not a "region."

## Next up (priority order)

1. **Await Colorado Springs replies** — flip each emailed store to its confirmed
   category as form responses arrive.
2. **Denver outreach** — discovery's done; needs contacts + drafts (25
   unconfirmed). Biggest unstarted region.
3. **Twin Cities loose ends** — Rockhopper reply; flip any form submitter.
4. **New cities** — "begin city outreach <city>".
5. **Store-finder supplements for other states** —
   `node scripts/gen-state-storefinder.js CO` (etc.). Once multiple states have
   one, decide whether to wire the supplements into All Cities too.
6. **Storefinder cache refresh** ~2026-07-28 (`node scripts/pull-storefinder.js`),
   then re-run the supplement generator for each state that has one.

## Conventions worth remembering

- **Generated state supplements:** `data/<state>-storefinder.json` are produced
  by `gen-state-storefinder.js` — don't hand-edit; curate the city file instead;
  regenerate after each snapshot re-pull.
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). **Create and merge the PR without asking** (standing rule). Data
  changes must pass `node scripts/validate-stores.js` (CI runs it only on PRs
  touching `data/**`, the script, or its workflow).
- **Confirmation notes:** a store confirmed directly gets `Verified by store via
  phone on <YYYY-MM-DD>`; stock/discount/loyalty go in their own fields.
- **Email-sent marker:** `Store email confirmation sent on <date>` appended to a
  store's `note` on outreach; `form-sync.gs` strips it on form submit.
- **Template choice:** confirmed tier → standard; `unconfirmed` → unconfirmed
  variant; chain (one inbox, many stores) → multi-store variant.
- **Store Finder data:** read the local cache (`storefinder/`), don't hit the
  live API each session; refresh only past ~1 month old.

## Session log

### 2026-06-28 (store-finder state-supplement feature)

- Brainstormed + built per-state GW Store Finder supplements. Confirmed the state
  pages are a cumulative file-list with no per-store filtering, so the design is
  a generated `data/<state>-storefinder.json` added to the state page's URL list,
  deduped against the curated city files (never overriding them).
- Wrote `scripts/gen-state-storefinder.js` (state-agnostic), generated
  `data/minnesota-storefinder.json` (15 net-new pins), wired it into
  `location/minnesota/index.html`. Validator passes (8 files); regen is
  idempotent. Decisions taken with the maintainer: keep GW-corporate (→ `none`),
  build state-agnostic / MN-first, title-case names, leave All Cities out for now.
- Documented the generated supplements in `CONTRIBUTING.md`,
  `storefinder/README.md`, `CLAUDE.md`. Made the auto-PR authorization explicit in
  `CLAUDE.md`. Shipped live as PR #59 (squash-merged; `validate` CI green).

### 2026-06-28 (earlier: review + storefinder-cache infrastructure)

- Re-verified prior Colorado Springs work under a model switch (PR #54). Built the
  Store Finder local-cache system: `scripts/pull-storefinder.js` pulls + validates
  a dated snapshot under `storefinder/` (PR #56). Documented the two-state-metro
  convention and corrected a wrong claim about form-sync id routing (it routes by
  name) (PR #55). Audited docs for stale "pull live API" instructions (PR #57).

### 2026-06-27 (outreach + housekeeping)

- Warhammer rebrand, mailto icon, footer "Have a request?". Twin Cities outreach
  run end-to-end. Confirmations folded in (Battleground Cafe, Games By James,
  both Lewis shops). St Cloud Lewis split into its own region. `form-sync.gs`
  re-pasted (marker auto-removal).
