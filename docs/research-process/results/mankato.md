# Mankato, MN — store research results

Center 44.1636, -93.9994. Radius 30 mi (tightened to avoid overlap with
Owatonna/Northfield/Waconia). Process:
[`../step1-store-finder.md`](../step1-store-finder.md).

## Phase A — Store Finder pull
3 candidates within 30 mi: **Atlantis Hobby** (903 S Front St), **The Dork Den**
(603 N Riverfront Dr), **Mirth Connection** (Mapleton, ~16 mi south). See
`data/mankato.json`.

## Phase B — verify + tier
Run via domain-scoped `site:<domain>` searches (homepage fetches were empty JS
shells — a capability gap, not a negative):
- **Atlantis Hobby** — confirmed GW stockist: own site has a Table Top Games >
  Warhammer > Age of Sigmar section stocking Games Workshop product.
- **The Dork Den** — confirmed GW stockist: own site carries AoS starter sets,
  GW product and Citadel paints; local press (Mankato Free Press / KEYC) confirms
  Warhammer 40k + Citadel.
- **Mirth Connection** (Mapleton) — listing-only (Tier B): on the Store Finder,
  opened May 2025, Facebook-only presence (not fetchable), no first-party product
  page found. Kept by default-include policy.

No discount sourced for any, so all stay `category: unconfirmed` pending outreach.

## Phase C — off-list (community-sourced) search
- **PULP Comics and Games** (633 S Front St, Mankato; formerly Double Play Cards
  and Comics, est. 1980) — a real comic + game shop, but its homepage and a
  domain-scoped search show **no** Games Workshop / Warhammer; the tabletop lines
  named are MTG, Pokémon, and D&D only → **not included** (Tier C needs
  first-party GW evidence). Worth a re-check if they later add GW.
- **No additions.**

## Status
A + B + C complete. Open item: discounts unverified for all 3 (needs outreach calls).
