# Colorado Springs / Pikes Peak — store research results

Region-specific results companion to [`../step1-store-finder.md`](../step1-store-finder.md).
The process doc records *how* to find stores; this file records *what was
actually found* for this region.

**Method.** Started from the authoritative Games Workshop directory pulled from
`https://www.warhammer.com/api/storefinder` (8,219 stores; 13 fall within ~40 mi
of Colorado Springs). Each was cross-checked against general web search, store
websites/Facebook, Yelp, gaming-store locators (wargames.com, CMON, Wizards,
DakkaDakka), local news (Colorado Springs Gazette) and Reddit, then tiered by
how well its *Games-Workshop-selling status* is corroborated. Discounts are
**not** yet researched for any store — so all non-GW-owned stores are marked
`unconfirmed` in the data.

- **Center point**: downtown Colorado Springs (38.8339, -104.8214)
- **Radius**: ~40 miles (straight-line)
- **Output file**: `data/coloradosprings.json` (13 stores)
- **Last run**: 2026-06

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

## Tier B — On the GW Store Finder, but GW-selling status NOT independently confirmed (4)

| Store | Address | ~Dist | What the web actually says | Sources |
|---|---|---|---|---|
| **Impact Sports Cards & Collectibles** | 416 S 8th St, Colorado Springs 80905 | 1.2 mi | Sports cards / TCG / sealed wax — no GW mention found | impactsportscards.com, Yelp |
| **Theo's Toys & Games** | 934 Manitou Ave Ste 103, Manitou Springs 80829 | 5.5 mi | Family toy & board-game store — no GW mention found | theostoys.com, Yelp |
| **Kev J Art** | 6110 Martinez St, Fort Carson 80913 | 6.8 mi | No retail web presence found — possibly home-based/trade account | (Store Finder only) |
| **Squatch Bros. Retro Arcade** | 246 E Bennett Ave, Cripple Creek 80813 | 20.1 mi | Retro pinball arcade — no GW mention found | pinballmap, Yelp |

## Tier C — Mentioned online but NOT on the GW Store Finder (0)

No brick-and-mortar store selling Games Workshop in the region surfaced in
web/Reddit/forum search that wasn't already on the official Store Finder.
(Reddit is poorly indexed by the search engine, so this is "none found," not a
hard zero — worth a manual Reddit pass later if desired.)

---

## Notable data corrections found by cross-comparison

Cases where the official Warhammer Store Finder data was stale or wrong, and
multiple independent web sources agree on the correction:

- **Gamer's Haven** — Store Finder says *5730* N Academy Blvd; correct current address is **5681 N Academy Blvd** (official site, Yelp, Wizards locator, Waze).
- **Chaos Games and More** — Store Finder says *521 Chinook Lane, 81001*; correct current address is **4065 Club Manor Dr, Pueblo 81008** (CMON, Yelp, store site, Facebook).
- **Valkyrie's Loft** — Store Finder had an incomplete address ("481 Unit 205") and a wrong phone (a 717 / Pennsylvania number). Corrected to **481 W Hwy 105 Unit 205, Monument** and **(719) 375-0482**.
- **J & J Games N Hobbies** — Store Finder lists the address under the name **"J&J Pac N Ship"** (the pack-and-ship business at the same location); the game store trades as J & J Games N Hobbies.
- **Van's** — Store Finder name "Van's Comics and Cards"; store trades as **Van's Comics Games Cards**.

## Output

- Repo data file written: `data/coloradosprings.json` (13 stores, schema matches `data/twincities.json`; 1 `none` for the official GW store, 12 `unconfirmed`).
- Next step (separate): call/verify each store's actual Games Workshop discount policy and promote confirmed ones from `unconfirmed` to `15`/`10`/`loyalty`/`none`.
