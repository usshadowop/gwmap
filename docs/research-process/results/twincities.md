# Twin Cities — store research results

Region-specific results companion to [`../step1-store-finder.md`](../step1-store-finder.md)
(Phase A — official GW Store Finder pull; Phase B — independent web
verification/tiering). The process doc records *how* to find stores; this file
records *what was actually found* for this region.

- **Center point**: Minneapolis, MN (44.9778, -93.2650)
- **Radius**: 40 miles
- **Phase A source**: live `GET https://www.warhammer.com/api/storefinder` dump
- **Compared against**: `data/twincities.json`
- **Last run**: 2026-06

---

## Phase A — Official GW Store Finder pull

35 stores returned within 40 mi of Minneapolis. 29 of those matched an existing
`data/twincities.json` entry by street number + city.

### Address discrepancies found (GW's data is wrong, not ours)

Three stores are correctly listed in `data/twincities.json`, but GW's own Store
Finder has the wrong address for them:

| Store | Our (correct) address | GW Store Finder's (incorrect) entry |
|---|---|---|
| Phoenix Games | 1091 E Moore Lake Dr, Fridley, MN | "Phoenix Games 3.0 LLC" — 18285 Minnesota Blvd #d, Deephaven, MN |
| Dreamers Vault Games — St. Louis Park | 3015 Utah Ave S, St. Louis Park, MN | "Dreamers Vault - Roseville" (mislabeled name) — 4300 Park Glen Rd, St. Louis Park, MN |
| Battlegrounds Cafe | 2008 County Road E East, White Bear Lake, MN | "Battleground Cafe" — 1650 County Rd E, Vadnais Heights, MN |

No changes were made to `data/twincities.json` for these — our data was already
correct. (Intent: email these three stores to let them know GW's own
store-finder data is sending customers to the wrong address.)

### Other non-matches (expected, not discrepancies)

6 existing confirmed/discount entries have no GW Store Finder hit at all: Scale
Model Supplies, Brickmania, Lewis Game Shop (Monticello), The Forge (Chaska),
Tower Games Bloomington, Level Up Minneapolis, Phoenix Games Fridley. These are
independent stores outside GW's official partner network — expected, since the
Store Finder isn't an exhaustive list of every store that sells GW product.

One existing entry, **Dreamers Vault Games Roseville** (1143 Larpenteur Ave W,
Roseville), doesn't appear anywhere in the *entire* global GW Store Finder dump
(not just the 40 mi radius) — it's not on GW's network at all currently
(delisted or never listed). Doesn't affect the accuracy of our entry (no
discount claimed), just flagged as a fact.

---

## Phase B — Independent web verification of unconfirmed stores

16 of the 17 `category: "unconfirmed"` stores already in `data/twincities.json`
had an address and were run through the 8-item checklist (`jons-store` has no
address on file and was excluded).

> **Excluded 2026-06-27 — All Systems Go Games (Minneapolis).** Despite earlier
> first-party site text ("252 results found for 'warhammer'"), the store replied
> directly to outreach saying they do **not** carry Warhammer / Games Workshop
> models. Removed from `data/twincities.json` per the contradicting-evidence
> exclusion rule; do not re-add on a future Phase A pull.

### Promoted to Tier A (confirmed GW product, citable source)

- **The Gamers Den** (Cambridge) — own site's Games Workshop collection page
  lists 568+ real GW products with prices (40K rulebooks, Space Marines, Death
  Guard, Tyranids, etc.) — strongest evidence found.
- **JK's Cards and Collectibles** (Farmington) — own site states it carries
  rulebooks, codices, and can order anything GW offers, plus miniatures and
  paints.
- **Mystic Fortress Games** (Waconia) — own site lists a literal "Warhammer"
  product category.

All three remain `category: "unconfirmed"` in the data file (no discount policy
verified yet) — only their `note` field was updated to cite the real evidence,
per the repo's Tier A/B-without-discount convention.

### Remain Tier B (listing-only, no independent confirmation)

Each has an updated `note` recording what was checked and whether it's a true
negative or a tool-capability gap:

- Steamship Games (Minneapolis)
- Rockhopper Comics (New Hope)
- Games By James (Mall of America) — leans negative; every source describes it as board games/puzzles only
- Fox Den Board Game Cafe (Burnsville)
- Midtown Hobby Shop and Gaming (Anoka) — too small to be indexed
- Story Arc Comics & Collectibles (Savage)
- **Top Level Wargames LLC (Woodbury)** — strongest non-promoted candidate; name and site describe it as a dedicated tabletop wargaming store, and a search summary mentioned 40k/Age of Sigmar tournament events, but the site is JS-rendered and that text couldn't be independently confirmed. Worth a phone call to likely promote to Tier A.
- BigBadGameStore LLC (Oak Park Heights)
- Sliver King Games (Hastings) — leans negative; described as primarily a Pokémon/MTG/Yu-Gi-Oh TCG shop
- Game Quest – River Falls, WI — a search summary claimed GW inventory, but unverifiable directly (site didn't show it, Yelp blocked)
- Midwest Jedi (River Falls, WI) — zero search hits
- VB Games and More (Northfield) — zero search hits
- Dubois Station LLC (Princeton) — zero search hits

---

## Net result

- **No new stores added** to `data/twincities.json` from the GW Store Finder pass — every real candidate within 40 mi of Minneapolis was already present.
- **3 address errors identified in GW's own data** (Phoenix Games, Dreamers Vault St. Louis Park, Battlegrounds Cafe) — our site's data is correct; GW's isn't. Candidates for the planned outreach emails.
- **3 stores promoted Tier B → Tier A** (Gamers Den, JK's Cards, Mystic Fortress) based on citable evidence from their own websites.
- **1 store (Top Level Wargames) flagged as high-confidence near-Tier-A** pending a phone call.
- A later Tier C web pass added `all-systems-go-games-minneapolis` (Tier A, literal own-site evidence) and `galaxy-games-eagan` (added per explicit instruction despite no confirming evidence yet).
