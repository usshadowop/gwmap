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
- **Auto-publish works for any city now.** `form-sync.gs` no longer hardcodes
  Twin Cities — on each submission it scans every `data/<region>.json`, finds the
  store (pre-seeded during discovery), updates that file, and opens a PR.
  Unmatched submissions land in the default region flagged `[triage]`.
  - ⚠️ **Apps Script is a manual copy.** The new routing code only goes live once
    the updated `form-sync.gs` is re-pasted into the Apps Script editor. Until
    then the live automation still writes only to `data/twincities.json`.
- **Branch hygiene:** "Automatically delete head branches" is now ON, so merged
  PR branches clean themselves up. Old stale branches are already deleted; only
  `main` and the working branch remain.

## Mid-flight / open items

- **Re-paste `form-sync.gs` into Apps Script** — required before non–Twin-Cities
  outreach, or those submissions route wrong / silently default.
- **Live end-to-end form test** still recommended (see `form-sync-operations.md`
  "Open item"): submit once through each discount branch + an update that leaves
  the Maps-link blank, and confirm routing lands in the right region file.

## Next up (priority order)

1. **Twin Cities outreach** — 19 stores still `unconfirmed`; warmest lead
   (discovery done, pipeline proven). Run `begin-city-outreach` for Twin Cities,
   or just steps 2–4 (contacts → links → drafts) since discovery already ran.
2. **Colorado Springs & Denver outreach** — discovery (A+B+C) is done; need
   contacts + drafts. CO Springs: 13 unconfirmed. Denver: 25 unconfirmed.
3. **New cities** — say "begin city outreach &lt;city&gt;" and the skill scaffolds
   + discovers + drafts from scratch.

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 45 | underway — 12 confirmed discounts, 14 no-discount, 19 unconfirmed |
| Colorado Springs | 13 | not started — all 13 unconfirmed |
| Denver | 27 | barely started — 2 no-discount, 25 unconfirmed |
| Duluth | 4 | stockists confirmed, discounts unverified |
| Rochester | 1 | stockist confirmed, discount unverified |
| Mankato | 3 | 2 stockists confirmed, discounts unverified |

(Authoritative counts live in `data/<region>.json`; this table is a snapshot.)
