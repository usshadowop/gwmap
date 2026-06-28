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
- **New this session — reply-by-email outreach variant.**
  [`docs/form/outreach-email-inline-template.md`](form/outreach-email-inline-template.md):
  a **trust-first** outreach email that puts **every question inline** in the body
  for a plain reply — **no form link, no button** (owners were reading the
  "Verify" button as phishing). Trade-off: a free-form reply can't be parsed by
  `form-sync.gs`, so **no auto-publish** — replies are transcribed into
  `data/<region>.json` **by hand**, then shipped via PR. It's an *additional*
  variant, not a replacement; cross-linked from the three button templates,
  `form-reference.md`, the `CLAUDE.md` doc map, and `step2-outreach.md` Phase C.
  Shipped in **PR #61**.
- **New this session — full inline RESEND batch sitting in Gmail Drafts (NOT
  sent).** Re-drafted outreach to every not-yet-confirmed Twin Cities + Colorado
  Springs store in the new inline format. **Drafts only — the user reviews/sends
  manually.**
  - **Master copy = the user's hand-edited version** (they edited the first draft
    in Gmail and told us to use it as the template). Subject: **"Sorry my first
    email may have looked like a phishing attempt (my bad)"**; intro "Jon H, here
    again from warhammerstores.com"; a paragraph acknowledging the earlier
    form-button email looked phishy; loyalty sub-questions trimmed so the question
    set is **renumbered 1–22**; play-space section tagged "for phase 3 of the
    website". The **The Forge** draft is the canonical edited single-store body.
  - **35 active drafts:** 31 single-store (22 Twin Cities singles incl. The Forge,
    + 9 Colorado Springs) **+ 4 combined chain emails** (Dreamers Vault ×7, Hub
    Hobby ×2, Tower Games ×2, Level Up ×3 — one email per shared inbox, per-location
    boxes + the shared question set once). The Forge sample counts in the 31.
  - **On-file box rules:** discount stores show discount (+ applies-to lines we
    actually know); `unconfirmed` stores show **name + address only** (never the
    internal "discount status unknown" note). Only hyperlink is the public region
    page.
  - **⚠️ The repo template doc still has the PRE-edit wording.**
    `outreach-email-inline-template.md` was written before the user's Gmail edits,
    so its subject/intro/question-numbering don't match the sent drafts yet.
    **Folding the user's edits back into the repo doc is an open follow-up.**
  - Generator + per-store data were scratch files (ephemeral, not committed). To
    make more inline drafts, regenerate from `data/<region>.json` + the
    `docs/outreach/<region>-contacts.md` email maps.
- **Galaxy Games removed from Twin Cities** (confirmed via form they do **not**
  sell Warhammer/GW models). TC 43 → **42**. Instead of deleting, its full record
  is archived in new **root-level `removed-stores.json`** (an object: `_about` +
  `stores[]`, each entry carries a `removed` block with `fromRegion`/`date`/`reason`).
  Kept **outside `data/`** on purpose so the future general hobby-store project
  isn't bound to the GW schema / `validate-stores.js`. Its resend draft was moved
  to Gmail **Trash**. `email-status.md` + `twincities-contacts.md` annotated.
  Shipped in **PR #62** (validate green).
- **Form → PR automation still live** for the *button* form path (`form-sync.gs`);
  the inline variant deliberately bypasses it.

## Per-region status snapshot

| Region | Stores | Outreach |
|---|---|---|
| Twin Cities | 42 | Button outreach done; **inline resends now drafted (not sent)** for all not-yet-confirmed stores. Confirmed: Battleground (form), Lewis (phone), Games By James (phone). Galaxy Games removed. |
| St Cloud | 1 | Lewis – St Cloud. Phone-confirmed `loyalty`. |
| Colorado Springs | 12 | Button outreach sent earlier; **inline resends now drafted (not sent)** for the 9 emailable `unconfirmed`. Squatch Bros confirmed (`none`); Theo's phone-only. |
| Denver | 27 | Discovery (A+B+C) done; 2 no-discount, 25 unconfirmed. **No outreach yet — biggest unstarted region.** |
| Duluth | 4 | Stockists confirmed, discounts unverified. |
| Rochester | 1 | Stockist confirmed, discount unverified. |
| Mankato | 3 | Stockists confirmed, discounts unverified. |

(Authoritative counts live in `data/<region>.json`.) Minnesota state map also shows
the generated `data/minnesota-storefinder.json` supplement (15 `unconfirmed` pins),
not counted above.

## Next up (priority order)

1. **Review + send the inline resend drafts** (35 in Gmail Drafts). User sends
   manually, 10–20/day. The **Dreamers Vault** draft was the multi-store-layout
   sample worth a look first.
2. **As email replies come in:** transcribe by hand into `data/<region>.json`
   (set the real `category`, add `Verified by store via email on <YYYY-MM-DD>`,
   strip the `Store email confirmation sent on <date>` marker), then branch → PR →
   merge. **No auto-publish for inline replies.**
3. **Fold the user's edited copy into `outreach-email-inline-template.md`** so the
   repo doc matches what actually went out (subject, intro, 1–22 numbering,
   phase-3 note).
4. **Denver outreach** — discovery done; needs contacts + drafts (25 unconfirmed).
5. **Store-finder supplements for other states** (`gen-state-storefinder.js CO`, …).
6. **Storefinder cache refresh** ~2026-07-28, then re-run the supplement generator.

## Conventions worth remembering

- **Removed stores:** archive the full record in root `removed-stores.json`
  (`stores[]`, each with a `removed` block), don't just delete. It's outside
  `data/` so it's not validated as GW data. Future removals append here.
- **Inline outreach (reply-only) ≠ auto-publish.** Form/button submissions
  auto-publish via `form-sync.gs`; inline-email replies are manual — transcribe
  then PR.
- **Template choice:** confirmed → standard button; `unconfirmed` → unconfirmed
  button; chain (shared inbox) → multi-store button; **owner wary of links →
  inline reply-only variant.**
- **Ship:** branch → PR → squash-merge into `main` (deploy runs on merge; no
  `[skip ci]`). **Create and merge the PR without asking** (standing rule). Data
  PRs must pass `node scripts/validate-stores.js`.
- **Confirmation notes:** direct confirmation → `Verified by store via <channel>
  on <YYYY-MM-DD>`; outreach-sent marker → `Store email confirmation sent on <date>`.
- **Known doc nit:** templates sign off `Jon@warhammerstores.com`, but the
  `begin-city-outreach` skill text says `Jon@warhammerdiscounts.com` in one spot
  — pre-existing inconsistency, not yet reconciled.

## Session log

### 2026-06-28 (inline reply-by-email outreach + resend batch)

- Built the reply-by-email **inline-questions** outreach variant (trust-first, no
  link/button, no auto-publish) and wired it through the docs (PR #61).
- User edited the first draft (The Forge) into the master copy; generated the full
  **inline resend batch as Gmail drafts** — 31 single-store + 4 combined chain
  emails (35 active) across Twin Cities + Colorado Springs. Drafts only, not sent.
- **Galaxy Games removed** from Twin Cities (form-confirmed non-stockist) and
  archived to new root `removed-stores.json`; resend draft trashed; outreach docs
  annotated (PR #62, validate green).
- **Open:** repo inline-template doc still has pre-edit wording (next session:
  reconcile to the sent copy).

### 2026-06-28 (earlier: store-finder state-supplement feature)

- Per-state GW Store Finder supplements: `scripts/gen-state-storefinder.js` →
  `data/<state>-storefinder.json`, deduped against curated city files, wired into
  the state page. Applied to Minnesota (15 net-new `unconfirmed` pins). PR #59.
  Auto-PR authorization made explicit in `CLAUDE.md`.

### 2026-06-28 (earlier: review + storefinder-cache infrastructure)

- Storefinder local-cache system (`scripts/pull-storefinder.js`, dated snapshot
  under `storefinder/`). Two-state-metro convention; corrected form-sync routing
  note (routes by name). PRs #54–#57.
