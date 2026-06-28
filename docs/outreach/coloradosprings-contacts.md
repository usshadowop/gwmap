# Colorado Springs — store contact emails (for outreach)

Outreach pass for the verification emails. A second contact list (sourced via
Gemini) was cross-checked against each store's own site/contact page before
trusting any address — see "Verify, don't trust" in `CLAUDE.md`. One Gemini
claim (Kev J Art "Closed") was directly **disproved** by fetching the live
site, which is why nothing here is treated as confirmed without a direct
source check or two independent passes agreeing.

_Last gathered: 2026-06-28._

## Approved — ready for outreach (drafts sent this pass)

| Store | Email | Source |
|---|---|---|
| Tabletop Citadel | `tabletopcitadelco@gmail.com` | **Site-verified** — quoted directly off tabletopcitadelcos.com's contact section |
| Petrie's Family Games | `PetriesFG@gmail.com` | **Site-verified** — quoted directly off petriesgames.com footer |
| Valkyrie's Loft Toys and Games (Monument) | `info@valkyriesloft.games` | **Maintainer-approved** — agreed by two independent passes (prior session + Gemini); site is a JS-rendered SPA WebFetch couldn't read (capability gap, not a contradiction) |
| Chaos Games and More (Pueblo) | `john@chaosgamesandmore.com` | **Maintainer-approved** — agreed by two independent passes; official Contact Us page loaded but didn't surface an email in the fetched excerpt (capability gap) |

All 4 are `category: unconfirmed` → unconfirmed-listing template used. Gmail drafts created 2026-06-28 (verified via `list_drafts`, no duplicates). **Note markers not yet added to `data/coloradosprings.json`** — pending maintainer confirming these get sent (see handoff).

## Further research required (Gemini lead contradicted or unconfirmed by direct check)

| Store | Gemini's claim | What direct check found |
|---|---|---|
| Gamer's Haven | `Mgr.GamersHavenco@gmail.com` | Own `/contact` page shows **only a contact form + phone**, no literal email. Conflicts with prior session's separate guess (`gamershavenco@gmail.com`, different casing/no prefix) — two unverified guesses disagree, so neither used. |
| Hobby Smith | `hobbysmithinfo@gmail.com` ("sourced from Facebook") | Facebook page blocked by login wall (capability gap, not disproof) — single source, no quote available. |
| Van's Comics Games Cards | `vanscomics@gmail.com` ("trading card event listings") | vansccg.com fetch resolved to an unrelated store in Ridgeland, MS — domain doesn't reliably serve the Colorado Springs location's contact info. Prior session also found no email, only a Square site. |
| Impact Sports Cards & Collectibles | `info@impactsportscards.com` ("sourced from Facebook") | Official `/pages/contact` page **explicitly lists phone/address/socials and no email** — direct contradiction, not just unverified. |
| J & J Games N Hobbies | `azrielsdad@yahoo.com` ("tabletop distributor networks") | Personal Yahoo address unrelated to business domain; own site has no email; Facebook page returned a login wall. Weak provenance — not used. |

These stay on phone/social/contact-form outreach for now rather than a guessed email; a deeper pass (e.g. calling, or a second research tool) is the next move if email outreach is wanted for them.

## No email found — phone / social / contact form (confirmed both passes)

| Store | Best contact |
|---|---|
| Theo's Toys & Games (Manitou Springs) | (719) 247-8126 · [theostoys.com](https://www.theostoys.com/) — built-in contact form, no email |
| Squatch Bros. Retro Arcade (Cripple Creek) | (719) 419-1539 — phone only; retro arcade, GW-stocking doubtful |

## Corrected this pass

- **Kev J Art (Fort Carson)** — Gemini claimed "Closed." **False:** direct fetch of kevjart.com shows an active site, currently taking commissions. Still flagged from the prior pass as likely an individual artist (Kevin A. Johnson) rather than a genuine storefront — whether they're a real GW stockist at all is still unconfirmed, separate from the (incorrect) closure claim. No email available either way (contact form + phone only).

## Excluded (Games Workshop corporate — no owner outreach)

- **Warhammer — Colorado Springs** (2912 N Powers Blvd) — GW-owned retail store.

---
**Next:** maintainer reviews/sends the 4 drafts; mark each with `Store email
confirmation sent on <date>` in `data/coloradosprings.json` once actually sent.
Deeper research pass for Gamer's Haven / Hobby Smith / Van's / Impact Sports /
J&J if email outreach is wanted for them; otherwise phone/social.
