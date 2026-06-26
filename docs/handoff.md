# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite this whole
file each session** — replace the contents wholesale with the current state;
this is not an append-only log or an archive. For durable rules read
[`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table read
[`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

_Last updated: 2026-06-26_

## Current state

- **Site is live and healthy** at warhammerdiscounts.com. Six city regions (Twin
  Cities, Colorado Springs, Denver, Duluth, Rochester, Mankato), per-state
  combined views (`location/minnesota/`, `location/colorado/`), and the All
  Cities combined view. Landing page groups cities under clickable state headers.
- **"Begin city outreach" is now a one-command workflow.** The
  `begin-city-outreach` skill (`.claude/skills/begin-city-outreach/SKILL.md`)
  drives: scaffold region if new → discovery (A/B/C) → compile contacts →
  generate prefilled links (`scripts/prefill-link.js`) → draft outreach emails
  (Gmail `create_draft`, **drafts only**). Submissions auto-publish.
- **Contact-email files exist for the two warmest regions** (new this session,
  both merged to `main`):
  - `docs/outreach/twincities-contacts.md` — full pass, mostly site-verified.
  - `docs/outreach/coloradosprings-contacts.md` — rapid search pass, **not yet
    verified** (4 email leads + phone/social-only stores).
- **Auto-publish works for any city now.** `form-sync.gs` no longer hardcodes
  Twin Cities — on each submission it scans every `data/<region>.json`, finds the
  store (pre-seeded during discovery), updates that file, and opens a PR.
  Unmatched submissions land in the default region flagged `[triage]`.
  - ⚠️ **Apps Script is a manual copy.** The new routing code only goes live once
    the updated `form-sync.gs` is re-pasted into the Apps Script editor. Until
    then the live automation still writes only to `data/twincities.json`.
- **Branch hygiene:** "Automatically delete head branches" is ON, so merged PR
  branches clean themselves up. The last working branch
  (`claude/cool-hamilton-8y0kcp`) was fully merged via PRs #26 + #27 and is
  closed out; only `main` should remain.

## Mid-flight / open items

- **Twin Cities contacts — finish the review.** The "no public email" stores
  (#10–22 in `twincities-contacts.md`) are still marked **pending decision**: for
  each, the maintainer needs to approve as phone/social, supply an email, or ask
  for a deeper dig. **Games By James** is parked in "further research required"
  (unverified lead + GW-stocking itself unconfirmed).
- **Colorado Springs contacts — verify.** All emails there are unverified search
  leads. Next: confirm the 4 leads (Gamer's Haven, Petrie's, Valkyrie's Loft,
  Chaos Games) against each store's own site, dig the phone/social-only set, and
  confirm whether **Kev J Art** (looks like a solo artist) and **Squatch Bros
  Retro Arcade** are genuine GW stockists at all.
- **Re-paste `form-sync.gs` into Apps Script** — required before non–Twin-Cities
  outreach, or those submissions route wrong / silently default.
- **Live end-to-end form test** still recommended (see `form-sync-operations.md`
  "Open item"): submit once through each discount branch + an update that leaves
  the Maps-link blank, and confirm routing lands in the right region file.

## Next up (priority order)

1. **Twin Cities outreach** — contacts compiled; finish the #10–22 review, then
   generate prefilled links + draft emails for the confirmed-email stores (steps
   2–4 of `begin-city-outreach`; discovery already ran). 19 stores `unconfirmed`.
2. **Colorado Springs outreach** — verify the contacts file first (above), then
   links + drafts. 13 unconfirmed.
3. **Denver outreach** — discovery (A+B+C) done; needs contacts + drafts. 25
   unconfirmed.
4. **New cities** — say "begin city outreach &lt;city&gt;" and the skill scaffolds
   + discovers + drafts from scratch.

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 45 | contacts compiled (review of no-email stores pending); 12 confirmed discounts, 14 no-discount, 19 unconfirmed |
| Colorado Springs | 13 | contacts gathered (unverified search pass); all 13 unconfirmed |
| Denver | 27 | barely started — 2 no-discount, 25 unconfirmed |
| Duluth | 4 | stockists confirmed, discounts unverified |
| Rochester | 1 | stockist confirmed, discount unverified |
| Mankato | 3 | 2 stockists confirmed, discounts unverified |

(Authoritative counts live in `data/<region>.json`; this table is a snapshot.)
