# Denver — store research results

Region-specific results companion to [`../step1-store-finder.md`](../step1-store-finder.md).
The process doc records *how* to find stores; this file records *what was
actually found* for this region.

This summary was reconstructed from `data/denver.json` and the research session
handoff — Denver was the first region run fully under the **default-include
policy** (every official Store Finder candidate goes in as `unconfirmed` unless
there's citable contradicting evidence; corroboration is only used to *upgrade*
a listing, never required to *include* one).

- **Center point**: Denver, CO (39.7392, -104.9903)
- **Radius**: 40 miles
- **Phase A source**: live `GET https://www.warhammer.com/api/storefinder` dump
- **Output file**: `data/denver.json` (26 stores)
- **Last run**: 2026-06

---

## Phase A — Official GW Store Finder pull

26 candidates returned within 40 mi of Denver. Under the default-include policy,
all 26 were carried into `data/denver.json`; none had positive contradicting
evidence (closure / wrong address / duplicate) that would justify exclusion.
Per-store `note` fields in the data file record exactly what each pass found.

## Phase B — Verification and tiering

### Official GW stores — `category: "none"` (2)

These *are* Games Workshop, so no third-party corroboration is needed.

- **Warhammer – Square One Denver** — 1112 South Colorado Blvd, Glendale, CO 80246
- **Warhammer – Boulder** — 4800 Baseline Rd, Boulder, CO 80303

### Tier A — corroborated GW stockists, first-party evidence (6)

On the Store Finder *and* confirmed selling GW product by literal text on their
own site. Kept as `category: "unconfirmed"` (no discount policy verified yet);
only the `note` cites the evidence.

- **The Wizard's Chest** (Denver) — own `/events/` page literally references Warhammer
- **Timbuk Toys** (Denver) — direct site verification
- **Denver Central Games** (Denver) — direct site verification
- **Total Escape Games** (Broomfield) — direct site verification
- **Gamers Guild** (Boulder) — own site lists "Warhammer 40K, Miniatures…"
- **Bits & Bobs Toy Shop** (Longmont) — live product page, "Warhammer 40,000…"

### Tier B — listing-only, default-included as `unconfirmed` (18)

On the Store Finder; included by default. Split by what the web pass surfaced:

**Soft-positive but unverified** (search summaries suggest GW stock; not
literally confirmed through available tools — good phone-call candidates):
Atomic Goblin Games (Longmont), Heart of Gold Games (Longmont), Crit Castle
Games (Aurora), Mythic Games (Littleton), Collectormania / Gamers Quest
(Parker).

**No GW evidence found** (true negatives or capability gaps — 403/503/login
walls; included anyway per the default-include policy, `note` records the gap):
Twist & Shout Records, Bad Habit Hobbies, Colpar's HobbyTown (Lakewood / Aurora
/ Littleton — 3 locations), Atomic Games West (Golden), PlayForge (Littleton),
Coffee Cat Comics (Lakewood), HobbyTown USA – Westminster, Advantage Games
(Northglenn), Mind Goblin Games (Aurora), Do Gooder Games Cafe (Thornton),
Newcastle Comics (Longmont — own site checked directly, only Comics/MTG/eBay).

---

## Output

- Repo data file written: `data/denver.json` (26 stores; 2 `none`, 24 `unconfirmed`).
- All entries validated with `node scripts/validate-stores.js`.
- Next step (separate): call/verify each store's actual Games Workshop discount policy and promote confirmed ones from `unconfirmed` to `15`/`10`/`loyalty`/`none`. The 6 Tier A stores and 5 soft-positive Tier B stores are the highest-value calls.
