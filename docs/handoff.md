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

- **Site is live, healthy, and NATIONWIDE** at warhammerdiscounts.com — every US
  state + DC has a map page, the All Cities view spans the country, and curated
  city pages (Twin Cities, Colorado Springs, **Denver**, Duluth, Rochester,
  Mankato, St Cloud) are intact. Nothing structural changed this session.
- **This session was all about Denver outreach + discount data.** Two PRs merged
  to `main` and deployed green:
  - **PR #73 — Denver intro outreach wave 1.** Generated the first-contact
    "hello" intro emails for the 25 independent Denver shops (intro template:
    no form, no button). **15 Gmail drafts** (14 single-store + 1 bundled for
    Colpar's HobbyTown's shared inbox covering Lakewood/Aurora/Littleton).
    Appended `Intro email sent on 2026-06-29.` to all 17 emailed stores' notes;
    added [`../outreach/denver-contacts.md`](../outreach/denver-contacts.md)
    (emails + sources + confidence, 8 no-email stores, 2 excluded GW stores).
  - **PR #74 — Denver discount/stock fold-in (Gemini pass).** Applied a Gemini
    web-search pass of discount/stock details. **Category upgrades** (maintainer
    chose to trust the pass): Gamers Guild→`15`, Denver Central Games→`10`,
    Mythic Games→`10`, Retro Gaming→`15`, The Wizard's Chest→`loyalty`, Atomic
    Goblin→`10`. Stores that carry Warhammer but have no reported discount stayed
    `unconfirmed` with enriched notes (Total Escape, Colpar's ×3, Crit Castle,
    Mind Goblin, Advantage). PlayForge kept `unconfirmed` (reported little/no GW
    stock; no removal). Every one of the 14 touched entries carries two
    transparency markers: a dated `reported via web-search pass on 2026-06-29
    (not independently store-verified)` line **and** `Pending confirmation of
    details from store or user submission.`
- **After PR #74, 6 more intro drafts** were created for the **alternate/secondary
  inboxes** the Gemini contact pass listed (Timbuk `Buyer@`, Total Escape
  `orders@`, Atomic Goblin `orders@`, Coffee Cat `info@`+`sales@`, Newcastle
  `steve@`, Retro Gaming `legal@`). Recorded in `denver-contacts.md`. This change
  (contacts doc + this handoff) is **committed locally on the working branch but
  NOT yet pushed** — see "Mid-flight" below.

## Mid-flight (needs a push)

- **Unpushed local commit on `claude/game-store-contacts-rm1x9v`:** the
  `denver-contacts.md` "additional inboxes" update + this handoff rewrite. The 6
  alternate-inbox Gmail drafts are already created. **Decide: push live (PR →
  squash-merge) or keep batching.** (Data file `data/denver.json` was NOT changed
  by the additional-inbox step — those stores are already marked intro-sent.)

## Gmail drafts staged (DRAFTS ONLY — never auto-sent)

- **Denver: 21 intro "hello" drafts** awaiting maintainer review/send (10–20/day):
  15 primary-inbox + 6 alternate-inbox. Subject: `Hello from warhammerdiscounts.com
  — is this the right contact for <Store>?`
- **Twin Cities + Colorado Springs: ~35 inline resend drafts** from prior sessions
  (still not sent). Dreamers Vault is the multi-store-layout sample worth a look.

## Per-region status snapshot (curated regions)

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 42 | Confirmed: Battleground (form), Lewis (phone), Games By James (phone), Dumpster Cat (form, `15`). Inline resend drafts staged (not sent). |
| St Cloud | 1 | Lewis – St Cloud. Phone-confirmed `loyalty`. |
| Colorado Springs | 12 | Button outreach sent; inline resends drafted (not sent) for the 9 emailable `unconfirmed`. Squatch Bros `none`; Theo's phone-only. |
| **Denver** | 27 | **Discovery A+B+C done. Discounts folded in (Gemini pass): 2×`15`, 3×`10`, 1×`loyalty`, 2×`none` (GW corporate), 19×`unconfirmed`. 21 intro drafts staged (not sent). All discount/stock entries marked "pending confirmation."** |
| Duluth | 4 | Stockists confirmed, discounts unverified. |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

Plus **50 state + DC store-finder supplements** (`data/<state>-storefinder.json`,
~2,500 `unconfirmed`/`none` pins) — generated, not hand-edited.

## Next up (priority order)

1. **Push the mid-flight commit** (additional-inbox contacts doc + this handoff)
   once the user says go.
2. **Review + send the staged Gmail drafts** — 21 Denver intro + ~35 TC/CO Springs
   inline resends. Maintainer sends manually, 10–20/day.
3. **Denver wave 2 — `unconfirmed` verification emails.** Once an owner replies to
   an intro, follow up with the
   [`unconfirmed` template](../form/outreach-email-unconfirmed-template.md)
   ("Confirm Your Listing" button). Per `prefill-link.js`.
4. **As email replies come in (Denver especially):** transcribe by hand into
   `data/denver.json` — set the real `category`, add `Verified by store via email
   on <YYYY-MM-DD>`, and **drop the `reported via web-search…` + `Pending
   confirmation…` caveats** for that store. Branch → PR → merge. **No auto-publish
   for intro/inline replies** (only form/button submissions auto-publish).
5. **Denver no-email stores (8)** need a deeper contact pass or phone outreach if
   wanted: Twist & Shout, Bad Habit Hobbies, Atomic Games West, HobbyTown USA
   Westminster, Advantage Games, Mythic Games, Do Gooder Games Cafe, Collectormania.
6. **Fold the user's edited copy into `outreach-email-inline-template.md`** (still
   pre-edit wording).
7. **Storefinder cache refresh** ~2026-07-28 (`scripts/pull-storefinder.js`), then
   **re-run `node scripts/gen-all-state-pages.js`**.
8. **Doc nit:** templates sign off `Jon@warhammerstores.com` but the
   `begin-city-outreach` skill says `Jon@warhammerdiscounts.com` in one spot.

## Conventions worth remembering

- **This session the user asked to batch changes and be asked before going live**
  ("I'll tell you to push live"). That overrode CLAUDE.md's standing
  "create+merge automatically" rule *for this session*. Confirm the user's
  preference at the start of the next session before auto-merging.
- **Map rendering only shows `discount` (bold), the new-release/pre-order tags,
  website/phone, and `note`.** `discountDetails`/`loyaltyDetails`/
  `discountExclusions` are stored + round-tripped by `form-sync.gs` but **never
  displayed** — put fan-facing text in `discount`/`note`. Marker color +
  default visibility come from `category` (`unconfirmed` is hidden behind the
  "Show unconfirmed stores" toggle).
- **Outreach markers:** intro → `Intro email sent on <date>`; verification-sent →
  `Store email confirmation sent on <date>`; direct confirmation → `Verified by
  store via <channel> on <YYYY-MM-DD>`. Form submissions also stamp `Verified by
  store via form on <date>` (via the live Apps Script).
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). Data PRs must pass `node scripts/validate-stores.js`. After a
  squash-merge, **reset the working branch onto `origin/main`** before the next
  commit (the merged branch is auto-deleted on GitHub, so the next push recreates
  it — a plain `git push -u` works, no force needed).
- **All-states regen is one command:** `node scripts/gen-all-state-pages.js`
  (idempotent). Supplement dedup is PROXIMITY-based; don't reintroduce name-based
  dedup (PR #68 bug). Generated `*-storefinder.json` are not hand-edited.
- **`form-sync.gs` is a repo MIRROR of the live Apps Script** — editing the repo
  file does nothing until pasted into the Apps Script editor.
- **Commit-signing note:** this environment has no GPG/SSH signing key, so commits
  show as "Unverified" on GitHub (committer email is still correct,
  `noreply@anthropic.com`). The stop-hook flags this; nothing to fix — and never
  amend the GitHub squash-merge commit (`noreply@github.com`) that becomes the
  branch tip after `reset --hard origin/main`.

## Session log

### 2026-06-29 (Denver outreach + discounts)

- **PR #73** — Denver intro wave 1: 15 intro drafts (incl. 1 bundled Colpar's);
  `Intro email sent on 2026-06-29.` markers; new `denver-contacts.md`.
- **PR #74** — Denver discount/stock fold-in from a Gemini pass: 6 category
  upgrades (2×`15`, 3×`10`, 1×`loyalty`), enriched `unconfirmed` notes, and dated
  "reported via web-search" + "pending confirmation" caveats on all 14 entries.
- **Post-#74 (mid-flight, unpushed):** 6 alternate-inbox intro drafts created;
  `denver-contacts.md` updated; this handoff rewritten.
