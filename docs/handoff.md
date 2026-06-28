# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite this whole
file each session** — replace the contents wholesale with the current state;
this is not an append-only log or an archive. For durable rules read
[`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table read
[`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

_Last updated: 2026-06-27_

## Current state

- **Site is live and healthy** at warhammerdiscounts.com. Regions: Twin Cities,
  Colorado Springs, Denver, Duluth, Rochester, Mankato, plus per-state combined
  views (`location/minnesota/`, `location/colorado/`) and the All Cities view.
  Landing page groups cities under clickable state headers.
- **Footer** is now a single **"Have a request?"** link (consolidated Google
  Form) + Site Info, across every page and the `new-city.js` templates.
- **Site rebranded** "Games Workshop" / "GW" → "Warhammer" in all user-facing
  copy (titles, store text, templates). A bottom-right **mailto envelope icon**
  (jon@warhammerstores.com) appears on every page via `js/site-info.js`.
- **Form → PR automation is fully live.** `form-sync.gs` is **freshly re-pasted
  into Apps Script (2026-06-27)** — so region routing, the bulletproof button,
  stale-note replacement, AND the new auto-removal of the
  `Store email confirmation sent on <date>` marker on form submission are all
  active. No re-paste pending.
- **Outreach process is documented as a repeatable runbook:**
  [`research-process/step1-store-finder.md`](research-process/step1-store-finder.md)
  (discovery A/B/C) and
  [`research-process/step2-outreach.md`](research-process/step2-outreach.md)
  (contacts → prefilled links → pick template → draft). Three email templates:
  standard (`outreach-email-template.md`), unconfirmed (`…-unconfirmed-…`), and
  multi-store/chain (`…-multistore-…`, with a forward-to-each-location line).

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 43 | **Essentially complete** — every store with an email has been **sent** (drafts only → user sent ~24 emails incl. chains); no-email stores worked by phone/FB/contact-form. ~33 sent, ~8 no-email, 2 GW-corporate excluded. |
| St Cloud | 1 | Lewis – St Cloud, own `data/stcloud.json` (>40 mi from Mpls; shows on MN + All Cities views, **not** Twin Cities). Phone-confirmed `loyalty`. |
| Colorado Springs | 13 | Discovery done; **all 13 unconfirmed**. Contacts CSV exported (`docs/outreach/coloradosprings-stores.csv`) for an email-research pass — **next city up**. |
| Denver | 27 | Discovery (A+B+C) done; 2 no-discount, 25 unconfirmed. No outreach yet. |
| Duluth | 4 | Stockists confirmed, discounts unverified (all unconfirmed). |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

(Authoritative counts live in `data/<region>.json`; this is a snapshot.)

## Twin Cities outreach — detail

- **Confirmed via email/phone this session:** Battleground Cafe (form), Games By
  James (phone → `loyalty`, points program), both Lewis Game Shops (phone →
  `loyalty`, stamp program; Monticello + St Cloud).
- **Removed:** All Systems Go Games — replied they don't carry Warhammer
  (exclusion recorded in `results/twincities.md`).
- **Emailed, awaiting form response:** the bulk of TC stores carry the
  `Store email confirmation sent on 2026-06-27.` note marker (auto-clears on form
  submit now that form-sync is re-pasted).
- **Still open:** **Rockhopper Comics** — Facebook outreach sent, awaiting reply
  (only remaining no-email store; sheet in `twincities-no-email-outreach.md`).
- Contacts source of truth: `docs/outreach/twincities-contacts.md`. Live
  sent/not-emailed snapshot: `docs/outreach/email-status.md`.

## Next up (priority order)

1. **Colorado Springs outreach** — the CSV is out for email research. As emails
   come back: record in a `coloradosprings-contacts.md`, generate prefilled links
   (`node scripts/prefill-link.js coloradosprings`), and draft (all 13 are
   `unconfirmed` → use the **unconfirmed** "Confirm Your Listing" template).
   Mark each sent store with the `Store email confirmation sent on <date>` note.
2. **Denver outreach** — discovery done; needs contacts + drafts (25 unconfirmed).
3. **Twin Cities loose ends** — Rockhopper reply; flip any store that submits the
   form (auto-published) from its email-marker note to verified.
4. **New cities** — "begin city outreach <city>" scaffolds + discovers + drafts.

## Conventions worth remembering

- **Confirmation notes:** a store confirmed directly (not via form) gets
  `Verified by store via phone on <YYYY-MM-DD>` (mirrors form-sync's
  `Verified by store via form on <date>`); put stock/discount/loyalty in their
  own fields, not the note.
- **Email-sent marker:** `Store email confirmation sent on <date>` appended to a
  store's `note` when outreach is sent; `form-sync.gs` strips it on form submit.
- **Template choice:** confirmed tier → standard; `unconfirmed` → unconfirmed
  variant; chain (one inbox, many stores) → multi-store variant.
- **Branch hygiene:** work on `claude/site-housekeeping-szxr7i`, but **start each
  change from fresh `main`** (squash-merges auto-delete the remote branch, so
  re-creating off `origin/main` avoids merge-conflict churn). PRs merged this
  session: #40–#52.
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). Data changes must pass `node scripts/validate-stores.js`.

## Session log

### 2026-06-27 (outreach + housekeeping session)

- Site housekeeping: Warhammer rebrand, mailto icon, footer "Have a request?".
- Twin Cities outreach run end-to-end: contacts compiled, drafts generated
  (single / unconfirmed / chain templates) and sent; no-email stores worked by
  phone/FB; built `email-status.md`, the no-email CSV, and the no-email
  outreach sheet.
- Confirmations folded in: Battleground Cafe, Games By James (loyalty), both
  Lewis shops (loyalty). Removed All Systems Go (doesn't carry Warhammer).
- St Cloud Lewis split into its own region file (MN/All Cities only).
- Built `step2-outreach.md`; multi-store template; documented marker + phone-
  confirmation note conventions.
- `form-sync.gs` re-pasted into Apps Script (clears the long-standing pending
  item) + added marker auto-removal.
- Colorado Springs contacts CSV exported for email research.

### 2026-06-26

- Per-state pages + nested landing page (PR #24). "Begin city outreach" workflow
  + region routing in `form-sync.gs` + `prefill-link.js` + the skill (PR #25).
  Enabled "Automatically delete head branches."
