# Colorado Springs / Pikes Peak — store research results

Region-specific results companion to [`../step1-store-finder.md`](../step1-store-finder.md).
The process doc records *how* to find stores; this file records *what was
actually found* for this region.

**Method.** Started from the authoritative Games Workshop directory pulled from
`https://www.warhammer.com/api/storefinder` (8,219 stores; 13 fell within ~40 mi
of Colorado Springs). Each was cross-checked against general web search, store
websites/Facebook, Yelp, gaming-store locators (wargames.com, CMON, Wizards,
DakkaDakka), local news (Colorado Springs Gazette) and Reddit, then tiered by
how well its *Games-Workshop-selling status* is corroborated. Discounts are
**not** yet researched for any store — so all non-GW-owned stores are marked
`unconfirmed` in the data.

- **Center point**: downtown Colorado Springs (38.8339, -104.8214)
- **Radius**: ~40 miles (straight-line)
- **Output file**: `data/coloradosprings.json` (12 stores)
- **Last run**: 2026-06 (Kev J Art removed 2026-06-28; Phase C re-run + Phase B refresh 2026-06-24)

---

## Tier A — On the GW Store Finder AND independently corroborated as GW stockists (9)

| Store | Address | ~Dist | GW evidence | Sources |
|---|---|---|---|---|
| **Warhammer – Colorado Springs** (official GW store) | 2912 N Powers Blvd, Colorado Springs 80922 | 6.1 mi | It *is* a Games Workshop store | Facebook, Nextdoor, Chamber of Commerce |
| **Gamer's Haven** | 5681 N Academy Blvd, Colorado Springs 80918 | 5.8 mi | "Colorado's leading retailer for Games Workshop" | gamershavenco.com, Yelp, wargames.com, Wizards locator |
| **Hobby Smith** | 1839 S Academy Blvd, Colorado Springs 80916 | 4.0 mi | Specializes in Warhammer 40k & Bolt Action | CS Gazette, store FB/IG |
| **Van's Comics Games Cards** | 2427 N Academy Blvd, Colorado Springs 80909 | 4.2 mi | "Strong Warhammer 40k sealed product" | Yelp, comicseternal, store site |
| **Tabletop Citadel** | 2051 B Street, Colorado Springs 80906 | 4.4 mi | GW 40k / AoS / Middle-earth, Kill Team events | tabletopcitadelcos.com, FB, boardgamecafefinder |
| **Petrie's Family Games** | 7681 N Union Blvd, Colorado Springs 80920 | 7.9 mi | Small wargames selection, weekly Warhammer Warcry | wargames.com, petriesgames.com, Yelp |
| **Valkyrie's Loft Toys and Games** | 481 W Hwy 105 Unit 205, Monument 80132 | 18.2 mi | "Pikes Peak's Premier location for Warhammer" | valkyriesloft.games, Yelp |
| **J & J Games N Hobbies** | 6324 S Highway 85-87, Fountain 80817 | 8.0 mi | "Great selection of Warhammer models" | jnjgamesnhobbies.com |
| **Chaos Games and More** | 4065 Club Manor Dr, Pueblo 81008 | ~40 mi | GW (40k) stockist | CMON locator, chaosgamesandmore.com, Yelp, FB |

## Tier B — On the GW Store Finder, but GW-selling status NOT independently confirmed (3)

| Store | Address | ~Dist | What the web actually says | Sources |
|---|---|---|---|---|
| **Impact Sports Cards & Collectibles** | 416 S 8th St, Colorado Springs 80905 | 1.2 mi | Sports cards / TCG / sealed wax — no GW mention found | impactsportscards.com, Yelp |
| **Theo's Toys & Games** | 934 Manitou Ave Ste 103, Manitou Springs 80829 | 5.5 mi | Family toy & board-game store — no GW mention found | theostoys.com, Yelp |
| **Squatch Bros. Retro Arcade** | 246 E Bennett Ave, Cripple Creek 80813 | 20.1 mi | Retro pinball arcade — no GW mention found | pinballmap, Yelp |

## Removed — confirmed non-stockist (1)

- **Kev J Art** (6110 Martinez St, Fort Carson 80913) — on the GW Store Finder
  and originally carried as Tier B `unconfirmed` (no retail web presence found,
  possibly home-based/trade account). **Removed 2026-06-28**: maintainer
  confirmed directly that Kev J Art no longer sells Warhammer models. This is
  a contradicting-evidence exclusion under the default-include policy (a known
  non-stockist, not merely an unconfirmed lead), so the entry was dropped from
  `data/coloradosprings.json` rather than kept as `unconfirmed`.

## Tier C / Phase C — Off-list discovery (re-run 2026-06-24, 0 added)

Phase C (actively hunting for GW stockists **absent** from the official Store
Finder) was re-run with named candidates so this is a recorded negative, not a
silent skip. Discovery used general web roundups, jargon-filtered "where to buy
Warhammer" searches, the Yelp "Top 10 Warhammer 40k in Colorado Springs" list
(403, capability gap), and the `wargames.com` Colorado directory. Every
discovery query returned only stores already on the Phase A list **except** the
candidates below — none of which qualified for inclusion:

- **HobbyTown USA – Colorado Springs** — two franchise locations surfaced via
  `wargames.com`. The **7870 N Academy Blvd** location is **CLOSED** (Yelp,
  updated June 2026). The **1726 E Woodmen Rd** location shows active directory
  hours, but its own site (`hobbiescolorado.com`) is now a parked/for-sale
  domain, it is **not** on the GW Store Finder, and the only GW evidence is
  **chain-level** (the national hobbytown.com catalog stocks Games Workshop) —
  no store-specific first-party confirmation obtainable (Yelp 403). Not added;
  recorded as a phone-call lead.
- **War Battle Games** (`warbattlegames.com`) — surfaced on a Warhammer query
  but is an **online-only** retailer with no Colorado storefront. Excluded as
  non-local.

No independent brick-and-mortar store selling Games Workshop **models** in the
region surfaced that wasn't already on the official Store Finder. (Reddit
remains poorly indexed — `site:reddit.com` returned nothing, a capability gap,
not a hard zero — worth a manual Reddit pass later if desired.)

---

## Notable data corrections found by cross-comparison

Cases where the official Warhammer Store Finder data was stale or wrong, and
multiple independent web sources agree on the correction:

- **Gamer's Haven** — Store Finder says *5730* N Academy Blvd; correct current address is **5681 N Academy Blvd** (official site, Yelp, Wizards locator, Waze).
- **Chaos Games and More** — Store Finder says *521 Chinook Lane, 81001*; correct current address is **4065 Club Manor Dr, Pueblo 81008** (CMON, Yelp, store site, Facebook).
- **Valkyrie's Loft** — Store Finder had an incomplete address ("481 Unit 205") and a wrong phone (a 717 / Pennsylvania number). Corrected to **481 W Hwy 105 Unit 205, Monument** and **(719) 375-0482**.
- **J & J Games N Hobbies** — Store Finder lists the address under the name **"J&J Pac N Ship"** (the pack-and-ship business at the same location); the game store trades as J & J Games N Hobbies.
- **Van's** — Store Finder name "Van's Comics and Cards"; store trades as **Van's Comics Games Cards**.

## Phase B refresh (2026-06-24)

Re-verification pass over the 13 Phase A candidates, looking for closures and
sourced category upgrades. **No data changes were needed** — the file was
already current:

- **No new closures.** Spot-checked the marginal Tier B stores: Theo's Toys &
  Games (Manitou Springs) is open (Yelp, Nov 2025); Squatch Bros Retro Arcade
  (Cripple Creek) shows no closure signal. Both stay `unconfirmed`.
- **Hobby Smith** — its May 2026 move to **1839 S Academy Blvd** (already in the
  data) re-confirmed via the Colorado Springs Gazette; specializes in Warhammer
  40k & Bolt Action. Current.
- **Theo's Toys** — a search summary again asserted the store "mentions
  Warhammer products," but per the standing verify-don't-trust rule this could
  not be confirmed against literal first-party text (Yelp 403, site not
  fetchable), so it stays Tier B / `unconfirmed` — not upgraded.
- The official **Warhammer – Colorado Springs** store and **Gamer's Haven**
  (corrected address 5681 N Academy) remain open and current.

## Output

- Repo data file: `data/coloradosprings.json` (12 stores, schema matches
  `data/twincities.json`; all `unconfirmed`, incl. the official GW store, which
  carries a full-retail / no-discount `discount` note). Kev J Art removed
  2026-06-28 (confirmed non-stockist — see above).
- **Definition of done:** Phase A ✅, Phase B ✅ (+ 2026-06-24 refresh), Phase C
  ✅ (re-run 2026-06-24 with named candidates above), results file ✅. City is
  fully researched per the step1 checklist.
- Next step (separate): call/verify each store's actual Games Workshop discount
  policy and promote confirmed ones from `unconfirmed` to
  `15`/`10`/`loyalty`/`none`. The phone-call lead from Phase C (HobbyTown – 1726
  E Woodmen Rd) can be checked at the same time.
