# Colorado Springs — store contact emails (for outreach)

Outreach pass for the verification emails. Two independent contact lists
(one rapid web-search pass, one from a Google Doc the maintainer compiled via
Gemini) were cross-checked against each store's own site/contact page before
trusting any address — see "Verify, don't trust" in `CLAUDE.md`.

_Last gathered: 2026-06-28._

## Approved — ready for outreach (drafts sent this pass)

| Store | Email | Source |
|---|---|---|
| Tabletop Citadel | `tabletopcitadelco@gmail.com` | **Site-verified** — quoted directly off tabletopcitadelcos.com's contact section |
| Petrie's Family Games | `PetriesFG@gmail.com` | **Site-verified** — quoted directly off petriesgames.com footer |
| Valkyrie's Loft Toys and Games (Monument) | `info@valkyriesloft.games` | **Maintainer-approved** — agreed by two independent passes (prior session + Gemini); site is a JS-rendered SPA WebFetch couldn't read (capability gap, not a contradiction) |
| Chaos Games and More (Pueblo) | `john@chaosgamesandmore.com` | **Maintainer-approved** — agreed by two independent passes; official Contact Us page loaded but didn't surface an email in the fetched excerpt (capability gap) |
| Gamer's Haven | `Mgr.GamersHavenco@gmail.com` | **Maintainer-approved, sent on guess** — own `/contact` page shows only a form + phone (no literal email confirmed); conflicts with an earlier independent guess (`gamershavenco@gmail.com`, no "Mgr." prefix). Maintainer opted to send anyway (low-risk bounce) rather than wait on further verification. |
| Hobby Smith | `hobbysmithinfo@gmail.com` | **Maintainer-approved, sent on guess** — sourced from Facebook; FB page is login-walled so unconfirmed (capability gap, not disproof). |
| Van's Comics Games Cards | `vanscomics@gmail.com` | **Maintainer-approved, sent on guess** — fetching vansccg.com actually resolved to an unrelated store in Ridgeland, MS, so the domain didn't confirm this email either way. |
| Impact Sports Cards & Collectibles | `info@impactsportscards.com` | **Maintainer-approved, sent on guess** — the store's own `/pages/contact` page lists phone/address/socials and explicitly **no email**, a direct contradiction; sent anyway per maintainer call. |
| J & J Games N Hobbies | `azrielsdad@yahoo.com` | **Maintainer-approved, sent on guess** — personal Yahoo address unconnected to the business domain, weak sourcing ("distributor networks"); sent anyway per maintainer call. |

All 9 are `category: unconfirmed` → unconfirmed-listing template used. Gmail drafts created 2026-06-28 (verified via `list_drafts`, no duplicates: 4 in the first pass, 5 more after the maintainer chose to accept the unverified guesses). **Note markers not yet added to `data/coloradosprings.json`** — pending maintainer confirming these get sent (see handoff).

## No email found — phone / social / contact form (confirmed both passes)

| Store | Best contact |
|---|---|
| Theo's Toys & Games (Manitou Springs) | (719) 247-8126 · [theostoys.com](https://www.theostoys.com/) — built-in contact form, no email |
| Squatch Bros. Retro Arcade (Cripple Creek) | (719) 419-1539 — phone only; retro arcade, GW-stocking doubtful |

## Removed

- **Kev J Art (Fort Carson)** — removed from `data/coloradosprings.json`
  entirely (was `kev-j-art-fort-carson`). A Gemini-sourced list initially
  claimed the business was "Closed," which a direct site fetch disproved (the
  site is live and taking commissions) — but the maintainer confirmed
  separately that Kev J Art no longer sells Warhammer models, which is the
  actual disqualifying fact. Treated as a contradicting-evidence exclusion
  under `CLAUDE.md`'s default-include policy (not a generic "unconfirmed,"
  but a known non-stockist), so it's dropped rather than left in as
  unconfirmed.

## Excluded (Games Workshop corporate — no owner outreach)

- **Warhammer — Colorado Springs** (2912 N Powers Blvd) — GW-owned retail store.

---
**Next:** maintainer reviews/sends the 4 drafts; mark each with `Store email
confirmation sent on <date>` in `data/coloradosprings.json` once actually sent.
Deeper research pass for Gamer's Haven / Hobby Smith / Van's / Impact Sports /
J&J if email outreach is wanted for them; otherwise phone/social.
