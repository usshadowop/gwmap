# Rochester, MN — store research results

Center 44.0121, -92.4802. Radius 30 mi (tightened from Duluth's 50 to avoid
overlap with Owatonna/Northfield in this denser area). Process:
[`../step1-store-finder.md`](../step1-store-finder.md).

## Phase A — Store Finder pull
1 candidate within 30 mi: **Gamez & More** (511 Northern Hills Dr NE). Owatonna
(Atlantis Hobby) and Northfield (VB Games) fall outside 30 mi and are left for
their own buckets. See `data/rochester.json`.

## Phase B — verify + tier
- **Gamez & More** — confirmed GW stockist via first-party site: dedicated
  Warhammer 40,000 and Warhammer shop categories and the full Citadel paint line
  (surfaced by a domain-scoped `site:gamezandmore.com` search — the homepage
  fetch was an empty JS shell, a capability gap, not a negative). No discount
  sourced, so it stays `category: unconfirmed` pending an outreach call.

## Phase C — off-list (community-sourced) search
- **NerdinOut** (Rochester MN) — comics / toys / cards; no Games Workshop
  evidence found → **not included** (Tier C requires first-party GW evidence).
- **Millennium Games** — disambiguation false positive; that's Rochester **NY**.
- GameStop ×2 — video-game chain, n/a.
- **No additions.**

## Status
A + B + C complete. Open item: discount unverified (needs an outreach call).
