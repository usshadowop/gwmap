# Session handoff

Short-lived "pick up here" notes between chat sessions. **Overwrite the "Current
state" and "Next up" sections each session** — this is not an archive. For
durable rules read [`../CLAUDE.md`](../CLAUDE.md); for the roadmap/status table
read [`project-plan.md`](project-plan.md). This file is just: where we left off,
what's mid-flight, and what to do next.

_Last updated: 2026-06-26_

## Current state

- **Site is live and healthy** at warhammerdiscounts.com. Six regions (Twin
  Cities, Colorado Springs, Denver, Duluth, Rochester, Mankato) + the All Cities
  combined view. Landing page list is sorted by state, then city (PR #23).
- **Form → PR automation is built and deployed.** The form's combined
  "address or maps link" question was split into two (street address +
  optional Maps link); `form-sync.gs`, `form-reference.md`, and
  `form-sync-operations.md` are all reconciled to that split (PR #22).
  - ⚠️ **Apps Script is a manual copy.** The `form-sync.gs` changes are only live
    once the updated file is pasted into the Apps Script editor. Confirm this was
    done before trusting the next form submission.
- **Outreach email template** is formalized in
  [`form/outreach-email-template.md`](form/outreach-email-template.md) (button
  CTA, direct city-page link, fixed `Jon@warhammerdiscounts.com` sign-off).
- **Branches:** PRs from `claude/plan-feature-status-nuxitm` are squash-merged,
  so that branch shows perpetual "ahead/behind" vs `main` — cosmetic, not lost
  work. Stale branches to delete (no AI-side permission to do it):
  `claude/plan-feature-status-nuxitm`, `claude/keen-goldberg-660scr`,
  `form/hub-hobby-little-canada-1782369233539`.

## Mid-flight / open items

- **Live end-to-end form test** through the new split fields (address +
  Maps-link) — recommended in `form-sync-operations.md`, not yet run.
- **Stale branch deletion** — needs a maintainer with delete permission (UI
  trash-can or `git push origin --delete <branch>`).

## Next up (priority order)

1. **Twin Cities outreach** — 19 stores still `unconfirmed`. This is the warmest
   lead: discovery is done, the form + email pipeline works, responses publish
   themselves. Generate per-store prefilled links + emails and send 10–20/day.
2. **Colorado Springs & Denver outreach** — discovery (A+B+C) is done; they just
   need contacts + outreach. CO Springs: 13 unconfirmed. Denver: 25 unconfirmed.
3. **Verify the form pipeline once** with a real submission before bulk outreach,
   so a broken Apps-Script paste doesn't silently eat responses.

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
