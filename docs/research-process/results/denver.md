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
- **Output file**: `data/denver.json` (27 stores)
- **Last run**: 2026-06 (Phase C + Phase B refresh added 2026-06-24)

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

### Phase B refresh (2026-06-24)

Re-verification pass over the Phase A candidates, looking for closures
(contradicting evidence) and sourced category upgrades. Findings:

- **Crit Castle Games (Aurora) — address corrected.** The Store Finder /
  prior data had **15382 E Alameda Pkwy**; the store has moved to **414 S
  Chambers Rd, Aurora 80017** (City Center Marketplace). Corroborated by Yelp
  (updated June 2026, store open, same phone (303) 745-4140), the Flesh and
  Blood store locator, and ~10 business directories. Data updated (address +
  `lat`/`lng` re-geocoded via Nominatim to 39.707531, -104.809875). Own site
  `critcastle.com` still ECONNREFUSED from this toolset (capability gap), so GW
  stock remains directory-described, not first-party-confirmed. Stays
  `unconfirmed`.
- **Soft-positive Tier B stores re-checked**, no upgrade to first-party
  confirmation possible with current tools (JS-rendered sites / 403 / login
  walls): Atomic Goblin Games (a `site:` search now indexes a "Minis Cave"
  Warhammer mention on their own schedule page, but the non-JS fetch can't
  retrieve it verbatim), Heart of Gold Games (a goallevents.com listing for a
  "Warhammer Horus Heresy event" reinforces the soft-positive), Mythic Games
  (Littleton, suite Y — carries Warhammer per directories), Collectormania
  (Parker). All remain `unconfirmed` — still the best phone-call candidates.
- **No new closures** found among the 26 Phase A candidates. The two official
  GW stores (Square One Denver, Boulder) remain open and at their listed
  addresses.

---

## Phase C — Off-list (community-sourced) discovery (2026-06-24)

Phase C was **not run in the original Denver pass** (the results file had only
Phases A–B); this pass closes that gap. Discovery ran general web roundups,
`site:reddit.com` (poorly indexed — no usable hits, a capability gap not a
hard negative), local "where to buy Warhammer" searches, and the
`wargames.com` Colorado directory. Candidate store *names* not already on the
Phase A list were then verified for (a) still-open status and (b) first-party
evidence of selling GW product (Tier C requires real evidence — there is no
GW-side listing to default to).

### New Tier C store added (1)

- **Retro Gaming of Denver** — 4149 Gibraltar St, Denver 80249 (Green Valley
  Ranch; ~14 mi, in radius). Primarily a retro video-game / consignment store,
  **but** its own webstore has a Warhammer 40k collection selling new Games
  Workshop boxed sets in GW retail packaging — literal example fetched:
  *"Warhammer 40K: T'au Empire – Pathfinder Team"* ($55.20), with in-store
  shopping / local pickup offered. Confirmed open (Yelp, updated May 2026).
  First-party GW-miniatures sale confirmed → added as `category: "unconfirmed"`.

### Excluded — confirmed closed (citable contradicting evidence)

These surfaced as off-list leads (mostly via the stale `wargames.com`
directory — the Dungeon's End pattern) but are closed; recorded so a future run
doesn't re-investigate:

- **Attactix (Adventure Games)** — 15107 E Hampden Ave, Aurora. Yelp marks it
  **CLOSED** (updated Aug 2025). Long-running, well-stocked store that lapsed.
- **Karliquin's Game Knight** — Boulder (6545 Gunpark Dr / 2085 30th St). Yelp
  **CLOSED** (updated Dec 2025).
- **Bonnie Brae Hobby Shop** — 3421 S Broadway, Englewood. Formerly carried
  Warhammer 40k (Denver's oldest family hobby store, est. 1959). Yelp marks it
  **CLOSED** (updated June 2025); the boardgaming.com store page now 404s.
  Active hours still cached on some directories, but the dominant current
  signal is closure.
- **MythPlaced Treasures** — Lakewood. Closed years ago (~2010–2011 per Yelp /
  EN World threads).

### Checked, not included (no first-party GW-model evidence / non-local)

- **Black & Read** — 6655 Wadsworth Blvd, Arvada (open, very active — Yelp June
  2026, 191 reviews). Its own site's games section lists only "new and used
  roleplaying games, board games and gaming accessories"; the only "Warhammer"
  association found is used **novels** (Black Library books), not Citadel
  miniatures. No first-party evidence of GW-model sales → not added (per the
  verify-don't-trust rule and the project's GW-models scope). Worth a call if a
  used-minis angle matters.
- **HobbyTown – Centennial** (6810 S University Blvd) and **HobbyTown –
  Longmont** (1935 Main St) — off-list HobbyTown franchises. Only **chain-level**
  GW evidence exists (the national hobbytown.com catalog stocks Games Workshop);
  no store-specific first-party confirmation obtainable (their own pages are
  parked/JS, Yelp 403), and GW lists only the Westminster HobbyTown on its
  finder. Recorded as phone-call leads, not added.
- **Frontline Gaming**, **War Battle Games** — online-only retailers, no Denver
  storefront. Excluded as non-local.

### Out of radius (noted, not pursued)

`wargames.com` also lists GW-adjacent stores beyond the 40 mi net: Digital
Dungeon (Greeley, ~52 mi), Grand Slam Sportscards (Loveland, ~46 mi), Gryphon
Games & Comics (Fort Collins, ~60 mi). Leads for a future wider-radius pass.

---

## Output

- Repo data file written: `data/denver.json` (**27 stores**; 2 `none`, 25
  `unconfirmed`). Adds 1 Phase C find (Retro Gaming of Denver); Crit Castle
  Games address corrected.
- All entries validated with `node scripts/validate-stores.js`.
- **Definition of done:** Phase A ✅, Phase B ✅ (+ 2026-06-24 refresh), Phase C
  ✅ (run 2026-06-24, recorded above), results file ✅. City is now fully
  researched per the step1 checklist.
- Next step (separate): call/verify each store's actual Games Workshop discount
  policy and promote confirmed ones from `unconfirmed` to
  `15`/`10`/`loyalty`/`none`. Highest-value calls: the 6 Tier A stores, the 5
  soft-positive Tier B stores, the new Tier C store (Retro Gaming of Denver),
  and the off-list phone-call leads (Black & Read, HobbyTown Centennial /
  Longmont).
