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
  Colorado Springs, Denver, Duluth, Rochester, Mankato, plus per-state combined
  views (`location/minnesota/`, `location/colorado/`) and the All Cities view.
- **Colorado Springs outreach sent.** 9 Gmail drafts created and sent (4
  site-verified, 5 on unverified-guess emails per maintainer call); Squatch
  Bros. Retro Arcade phone-confirmed and promoted to `category: "none"`. Kev J
  Art removed (confirmed no longer sells Warhammer). Only Theo's Toys & Games
  remains phone/contact-form only. Full detail in
  `docs/outreach/coloradosprings-contacts.md`.
- **New this session: a local cache of the GW Store Finder dataset.**
  `storefinder/storefinder-<date>.json` (committed, ~11 MB, ~8,200 stores) —
  discovery reads this instead of hitting `warhammer.com/api/storefinder`
  every session. Refresh with `node scripts/pull-storefinder.js` once the
  filename date is **older than ~1 month** (currently 2026-06-28, so due
  ~2026-07-28). Documented in `storefinder/README.md`,
  `step1-store-finder.md` Phase A, `CLAUDE.md`, the `begin-city-outreach`
  skill, and `project-plan.md` — all five checked for consistency.
- **New convention: two-state metros** (e.g. Kansas City, MO/KS). Scaffold as
  **two separate regions**, one per state side, each with its own center/
  radius — the dataset isn't state-filtered, so both will legitimately pull in
  the same physical stores near the line. Keep store `id`s unique per file
  (data hygiene only — does **not** affect form routing, see caveat below).
  Don't merge/dedupe; when a duplicate gets verified in one region's file,
  copy the result into its twin by hand. Outreach rule: don't re-email a store
  that's already been emailed under its other region (check the twin's
  `note` first). Documented in `step1-store-finder.md` ("Two-state metros")
  and `step2-outreach.md` (A.6).
  - **Form-routing caveat (verified against the actual code, not assumed):**
    `form-sync.gs` does **not** route by store `id`. The prefilled link
    carries no id; form-sync rebuilds one from the submitted *name*
    (`slugify_`) and routes by name match, taking the first matching region
    file (alphabetical) and stopping. So for same-named twins, a submission
    always updates exactly one file regardless of id — the unique-id
    suggestion was originally justified with an incorrect mechanism, caught
    and corrected this session (PR #55).
- **Form → PR automation is live**, `form-sync.gs` is current (no re-paste
  pending) — region routing, the bulletproof button, stale-note replacement,
  and email-marker auto-removal on form submit all active.
- **Outreach process is a repeatable runbook:**
  [`research-process/step1-store-finder.md`](research-process/step1-store-finder.md)
  (discovery A/B/C) and
  [`research-process/step2-outreach.md`](research-process/step2-outreach.md)
  (contacts → prefilled links → pick template → draft). Three email templates:
  standard, unconfirmed, multi-store/chain.

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 43 | **Essentially complete** — ~33 sent, ~8 no-email (phone/FB/contact-form), 2 GW-corporate excluded. Rockhopper Comics still awaiting a Facebook reply. |
| St Cloud | 1 | Lewis – St Cloud, own `data/stcloud.json`. Phone-confirmed `loyalty`. |
| Colorado Springs | 12 | **Outreach sent.** 1 confirmed (`none`, Squatch Bros.), 11 unconfirmed — 9 of those have drafts sent, awaiting form replies; Theo's Toys is phone-only. |
| Denver | 27 | Discovery (A+B+C) done; 2 no-discount, 25 unconfirmed. **No outreach yet — next up.** |
| Duluth | 4 | Stockists confirmed, discounts unverified. |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

(Authoritative counts live in `data/<region>.json`; this is a snapshot.)

## Next up (priority order)

1. **Await Colorado Springs replies** — flip each of the 9 emailed stores to
   its confirmed category as form responses come in.
2. **Denver outreach** — discovery's done; needs contacts + drafts (25
   unconfirmed, no outreach sent yet). Biggest unstarted region.
3. **Twin Cities loose ends** — Rockhopper reply; flip any store that submits
   the form from its email-marker note to verified.
4. **New cities** — "begin city outreach <city>" scaffolds + discovers +
   drafts. If the next city is a two-state metro (Kansas City was the example
   discussed), use the new two-region convention above from the start.
5. **Storefinder cache** — no action needed until ~2026-07-28; then
   `node scripts/pull-storefinder.js`.

## Conventions worth remembering

- **Confirmation notes:** a store confirmed directly (not via form) gets
  `Verified by store via phone on <YYYY-MM-DD>`; put stock/discount/loyalty in
  their own fields, not the note.
- **Email-sent marker:** `Store email confirmation sent on <date>` appended to
  a store's `note` when outreach is sent; `form-sync.gs` strips it on form
  submit.
- **Template choice:** confirmed tier → standard; `unconfirmed` → unconfirmed
  variant; chain (one inbox, many stores) → multi-store variant.
- **Two-state metros:** see "Current state" above — two regions, unique ids
  (hygiene only, not routing), no duplicate outreach, manual sync on verify.
- **Store Finder data:** read the local cache (`storefinder/`), don't hit the
  live API each session; refresh only past ~1 month old.
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). Data changes must pass `node scripts/validate-stores.js`.
  This session's branch was `claude/handoff-review-planning-0dwts0` (PRs
  #54–#57, all merged; branch can be treated as spent).

## Session log

### 2026-06-28 (review + infrastructure session)

- Reviewed prior session's Colorado Springs work under a model switch
  (Sonnet → Opus): re-verified the Squatch Bros. phone-confirmation data edit
  and the 9 email-sent markers, both clean (PR #54).
- Discussed full city-deployment procedure end-to-end (discovery → outreach →
  sending → auto-publish) using Kansas City as a concrete example; surfaced
  that KC is a two-state metro and that the site's state pages are a
  cumulative file-list with no per-store state filtering (confirmed against
  `app.js` + an existing real case: two River Falls, WI stores already ride
  along on the Minnesota page via `twincities.json`).
  Decision: keep that file-list behavior; for two-state metros, scaffold two
  regions and handle duplicate stores manually.
- Documented the two-state-metro convention — then, on review, caught that the
  stated reason for unique ids (claimed `form-sync.gs` id-based routing) was
  factually wrong. Traced the real mechanism in `form-sync.gs` +
  `prefill-link.js` and corrected the doc to match the actual name-based
  routing/`break`-on-first-match behavior (PR #55).
- Built the Store Finder local-cache system per a feature request: pull once,
  cache as a dated snapshot outside `data/` (so it doesn't trip
  `validate-stores.js` or the CI path filter), refresh monthly via
  `scripts/pull-storefinder.js` (downloads + validates before replacing the
  old snapshot). Committed the first snapshot (8,229 stores). Documented in
  `storefinder/README.md` + `step1-store-finder.md` (PR #56).
- Audited every `.md` file for stale "pull the live API" instructions after
  being asked directly; found two the first pass missed
  (`begin-city-outreach` SKILL.md, `project-plan.md`) and fixed both (PR #57).

### 2026-06-28 (Colorado Springs outreach)

- Verified a Gemini-generated contact list for all 13 Colorado Springs stores
  against each store's own site/contact page rather than trusting it outright.
- Created 9 Gmail drafts (4 site-verified, 5 on unverified guesses per
  maintainer call). 2 stores had no email (Theo's Toys, Squatch Bros.).
- Removed Kev J Art (13 → 12 stores) — a "Closed" claim was disproved by a
  direct site check, but the maintainer confirmed separately the store no
  longer sells Warhammer, the real reason for exclusion.
- Later in the next session: Squatch Bros. phone-confirmed and promoted; all
  9 drafts marked sent in the data file.

### 2026-06-27 (outreach + housekeeping session)

- Site housekeeping: Warhammer rebrand, mailto icon, footer "Have a request?".
- Twin Cities outreach run end-to-end: contacts, drafts, sends, no-email
  stores worked by phone/FB.
- Confirmations folded in: Battleground Cafe, Games By James (loyalty), both
  Lewis shops (loyalty). Removed All Systems Go (doesn't carry Warhammer).
- St Cloud Lewis split into its own region file.
- `form-sync.gs` re-pasted (marker auto-removal added).

### 2026-06-26

- Per-state pages + nested landing page (PR #24). "Begin city outreach"
  workflow + region routing in `form-sync.gs` + `prefill-link.js` + the skill
  (PR #25). Enabled "Automatically delete head branches."
