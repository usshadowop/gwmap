# Step 1: Building an Authoritative Games Workshop Store List for Any City

Given any city, this is the full process to produce an authoritative list of
stores that sell Games Workshop models, plus a confidence rating for each one.
The process has three phases:

- **Phase A — Pull the official candidate list.** Get every store Games
  Workshop itself lists near the target city.
- **Phase B — Verify and tier each candidate.** Independently confirm (or
  fail to confirm) that each candidate actually sells GW product, using
  public web sources, and assign a confidence tier.
- **Phase C — Search for off-list stores (mandatory; easiest to forget).**
  Actively hunt for stores that sell GW but are *missing* from GW's official
  list, via independent web/Reddit/forum/review search. A city is not done
  until this runs — see the definition-of-done checklist at the end.

All three phases are city-agnostic — nothing below is specific to any one region.
Pair this file with a region-specific results file (`results/<region>.md`, e.g.
[`results/twincities.md`](results/twincities.md)) that records the actual
findings for a given city; this file only records *how* to find them.

---

## Phase A — Pull the official candidate list

### Background
`warhammer.com` sits behind an AWS WAF "Human Verification" CAPTCHA, so a
plain `curl`/fetch of the store-finder *page* returns a challenge page, not
data. But the page itself loads its data from a plain JSON API that is
**not** behind the WAF challenge and requires no auth token. Found by
inspecting the page's network traffic.

### The endpoint
```
GET https://www.warhammer.com/api/storefinder
```
- Returns a JSON array of ALL Games Workshop / Warhammer-stocking retail
  locations worldwide (~8,000+ entries, ~11MB).
- No auth headers, cookies, or WAF token needed.
- CDN-cached for 1 hour (`Cache-Control: max-age=3600`).
- Each store object includes: `name`, `displayName`, `addressLine1/2`, `city`,
  `region` (state, e.g. `"CO"`), `postalCode`, `countryCode`, `phone`,
  `isWarHammerStore` (bool — official GW-branded store vs. independent
  retailer that stocks Warhammer), `hours`, and `_geoloc` (`{lat, lng}`).

### How to find an endpoint like this yourself (if it ever changes)
1. Open the target page in Chrome, open DevTools (`F12`) → **Network** tab.
2. Filter to **Fetch/XHR**, check "Preserve log", clear the log.
3. Trigger the page action you care about (e.g. type a city into the store
   search box and submit).
4. Look through the new requests for one that looks data-shaped rather than
   analytics/cookie-consent/maps-config noise (ignore `telemetry`, `report`,
   `gen_204`, anything from `cookiepro.com`, `awswaf.com`, `maps.googleapis.com`
   mapConfigs calls, and GraphQL calls with unrelated `operationName`s like
   `getCart`).
5. If using Chrome's built-in AI assistance panel, just ask it directly:
   *"Which network request returns the list of stores from the store finder,
   and what is its response body?"* — it scans the log for you.
6. Once found, click the request → check the **Headers** tab for whether it
   needs cookies/auth (if yes, it's gated — you'd need a human to solve any
   challenge first and copy the response/cURL manually). If it's a clean GET
   with no special auth headers (like this one), it can just be curled
   directly from then on.

### Use the local cached snapshot (don't re-pull every session)
A dated snapshot of the full dataset lives at
`storefinder/storefinder-<YYYY-MM-DD>.json` (see
[`../../storefinder/README.md`](../../storefinder/README.md)). **Read from that
local file** instead of hitting the live endpoint each time. **Freshness check
first:** if the date in the filename is more than ~1 month old, refresh it with
`node scripts/pull-storefinder.js` (downloads, validates, and replaces the old
snapshot) before filtering — otherwise just load the existing file.

### Fetching + filtering (Python)
```python
import json, math, glob

# Load the local cached snapshot (refresh with `node scripts/pull-storefinder.js`
# if storefinder/storefinder-<date>.json is older than ~1 month).
with open(sorted(glob.glob("storefinder/storefinder-*.json"))[-1]) as f:
    data = json.load(f)

TARGET_LAT, TARGET_LNG = 38.8339, -104.8214  # swap for the target city's center point
RADIUS_MI = 40                               # swap for the desired search radius

def haversine(lat1, lng1, lat2, lng2):
    R = 3958.8  # miles
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2 * R * math.asin(math.sqrt(a))

# Compute distance for every store that has coordinates, then keep those
# within the radius. Distance is the real filter — do NOT pre-filter by state,
# or you'll silently drop stores just over a state line that are still in range.
nearby = []
for s in data:
    g = s.get("_geoloc")
    if not g or g.get("lat") is None or g.get("lng") is None:
        continue  # skip listings with no usable coordinates rather than treating them as (0, 0)
    s["_dist"] = haversine(TARGET_LAT, TARGET_LNG, g["lat"], g["lng"])
    if s["_dist"] <= RADIUS_MI:
        nearby.append(s)
nearby.sort(key=lambda s: s["_dist"])

print(f"{len(nearby)} stores within {RADIUS_MI} mi:")
for s in nearby:
    print(f"{s['_dist']:.1f} mi  {s.get('displayName') or s['name']}  -  "
          f"{s['addressLine1']}, {s['city']}, {s['region']} {s['postalCode']}  -  {s.get('phone')}")
```

### Reuse for any other city/region
- Swap `TARGET_LAT, TARGET_LNG` for the new target (look up via any geocoder)
  and `RADIUS_MI` for the desired net.
- The script scans the whole global dataset and filters by true distance, so
  it works anywhere and correctly catches cross-state-line stores. If you want
  to speed it up for a large run, you can pre-filter by `region`
  (state/country code) first — but only when the target is comfortably inside
  one region, never near a border.

### Key lesson
Don't assume "page is CAPTCHA-gated" means "no data without solving the
CAPTCHA." Check whether the page's own data-fetching calls are separately
exposed as plain JSON APIs — frontends frequently call unauthenticated
backend endpoints that have no bot-protection of their own, even when the
HTML page that uses them does.

The output of Phase A is the candidate list for Phase B: every store name,
address, phone, and lat/lng within the target radius of the target city.

---

## Phase B — Verify and tier each candidate

Phase A only proves Games Workshop *lists* a store — it doesn't prove the
listing is current or that the store still meaningfully stocks GW product.
Phase B independently checks that, using public web sources only.

### B.0 Inputs needed before starting
- The Phase A output: candidate stores for the target region (name, address,
  phone, lat/lng).
- The target region's center point and radius (for distance filtering).

### B.1 Confidence tier definitions

**Default-include policy: being on the official GW Store Finder is itself
sufficient evidence to include a store.** Every candidate from Phase A goes
into the dataset as `category: "unconfirmed"` by default — Phase B does not
need to independently corroborate a listing to justify keeping it. Phase B's
job is to (a) look for a sourced discount/category upgrade, and (b) look for
**contradictory** evidence that the listing itself is wrong or stale.

Classify every candidate store into exactly one tier:

- **Tier A — Corroborated.** On the official GW Store Finder *and*
  independently corroborated by ≥1 outside source as actually selling GW
  product. Use this to justify a real `category` (`15`/`10`/`loyalty`/`none`)
  instead of `unconfirmed`, when a discount is actually sourced.
- **Tier B — Listing only (default).** On the official GW Store Finder; no
  independent corroboration found, but also no contradicting evidence found.
  **Include as `unconfirmed` — this is the default outcome for most
  candidates, not a reason to exclude.**
- **Tier C — Community-sourced.** Found via independent sources (web/Reddit/
  forums/reviews) but **not** on the official GW Store Finder at all. Unlike
  Tier A/B, inclusion here *does* require real evidence the store sells GW
  product, since there's no GW-side listing to default to.
- **Excluded — Contradicted.** The *only* basis for leaving an official
  Store Finder listing out of the dataset entirely. Requires a positive,
  citable finding that the listing is wrong or stale — e.g. a confirmed
  permanent closure (review text, news, "permanently closed" on a directory),
  a verified address change to a location with no GW connection, the
  business not existing under that name/address anymore, or it being a
  duplicate of another store already listed. A plain absence of corroborating
  evidence ("we searched and found nothing positive") is **not** grounds for
  exclusion — that's Tier B, not Excluded.

Do not invent a discount, GW-stocking claim, or tier upgrade without a
citable source. When in doubt, leave the store as Tier B / `unconfirmed` —
do not leave it out of the dataset.

### B.2 Tool capability assessment (do this first, every session)
Before running the checklist, identify what the *current* AI agent's tools
can actually do — this changes between sessions/tools and determines which
checklist items will produce real evidence vs. dead ends. Common categories
and their typical (but not guaranteed) capability:

| Source type | Typically usable with text search + non-JS URL fetch? | Why / caveat |
|---|---|---|
| Search-engine-indexed text (general web, news, directories) | Yes | Core capability of any web-search tool |
| Review **text** (Google, Yelp, etc.) | Partial | Only what the search engine has indexed as a snippet; many review platforms block direct fetches (expect 403s) |
| Review/listing **photos** | No | No image/vision browsing of map or listing photos without a multimodal browsing tool |
| Public business **Facebook pages** | Partial | Sometimes fetchable; often login-walled or JS-rendered |
| Facebook/Discord **groups or chats** | No | Login-gated, not indexed by search |
| Reddit | Yes, but often weak | `site:reddit.com` works, but small-city/niche-store threads are frequently unindexed — a "no results" is not a confirmed negative |
| Instagram/TikTok (incl. location tags) | No | Login-gated, not indexed, no API access |
| Tournament/event platforms (e.g. Best Coast Pairings) | Untested per-tool | Often a JS-rendered app; a non-JS fetch may return an empty shell — try it, but don't assume success or failure without checking |
| Official brand community site (e.g. warhammer-community.com) | Yes | Normal indexable site |
| YouTube | Partial | Search can return title/description metadata only; an agent without video/transcript access **cannot verify on-screen content** — flag any hit as "video exists, content unverified," never as confirmation |
| Direct page fetch in general | Conditional | Works for static/server-rendered pages; fails (403, empty shell, or login wall) for JS-heavy sites and platforms with bot protection |

**Always verify, don't just trust, search-summary claims.** A web-search
tool's own generated summary can assert something ("this store carries X")
that isn't actually present on the cited page. If a claim matters for a tier
decision, fetch the source page directly and confirm the literal text exists.
If the fetch fails (403, blocked, empty/JS shell), the claim is **unverified**
— record that explicitly rather than treating it as evidence either way.

**Never conclude "no mention" from the homepage alone.** A store's homepage
is often just a hero image and nav links — the actual evidence (event
listings, a shop/products page, an about page) lives on a subpage you won't
guess by URL-guessing. Before ruling a store negative based on its own site,
run a domain-scoped search using the same jargon term list as checklist item 1 below
— `site:<storedomain.com> (Warhammer OR "Games Workshop" OR 40k OR "Age of
Sigmar" OR Citadel OR "Combat Patrol" OR "Kill Team" OR Necromunda OR
"Horus Heresy" OR "Space Marine" OR "Black Library" OR "Old World" OR
"Space Hulk" OR 30k OR Warcry OR "Legions Imperialis" OR "Blood Bowl" OR
"Middle-earth Strategy Battle Game" OR "Adeptus Titanicus" OR
"Warhammer Underworlds" OR "Aeronautica Imperialis" OR
miniatures OR wargaming)` — to let the search engine surface whichever
indexed subpage actually contains a hit, then fetch *that* page directly to
confirm the literal text. Only treat the site as checked once this
domain-scoped pass comes back empty, not after the homepage alone does.

### B.3 The 8-item search checklist
Every official Store Finder candidate is included by default (B.1) — this
checklist is not a gate for inclusion. Run all 8 per store to look for (a)
corroborating evidence that would upgrade it to Tier A, and (b) any
contradicting evidence (closure, wrong address, etc.) that would move it to
Excluded. Finding nothing in either direction just confirms Tier B — the
store stays in the dataset as `unconfirmed`. Substitute the actual store
name and city into `<Store>` / `<City>`.

1. `"<Store>" "<City>" (Warhammer OR "Games Workshop" OR 40k OR "Age of Sigmar" OR Citadel OR "Combat Patrol" OR "Kill Team" OR Necromunda OR "Horus Heresy" OR "Space Marine" OR "Black Library" OR "Old World" OR "Space Hulk" OR 30k OR Warcry OR "Legions Imperialis" OR "Blood Bowl" OR "Middle-earth Strategy Battle Game" OR "Adeptus Titanicus" OR "Warhammer Underworlds" OR "Aeronautica Imperialis" OR wargaming OR FLGS)` — jargon-filtered general search; the specific product/jargon terms cut out generic toy-store noise that a plain "Warhammer" query lets through.
2. `site:reddit.com "<Store>"` and `site:reddit.com "<City>" Warhammer` — store-specific and city+hobby-general passes.
3. `site:yelp.com "<Store>"` and `"<Store>" Yelp review Warhammer` — Yelp listing/review text.
4. `"<Store>" Google review Warhammer OR Citadel OR 40k` — surfaces indexed Google review snippet text (not a substitute for browsing Maps directly, which most agents can't do).
5. `"<Store>" facebook Warhammer` — public Facebook page check.
6. `"<Store>" "Best Coast Pairings" OR bestcoastpairings.com` — tournament-hosting evidence is close to definitive if found.
7. `"<Store>" site:warhammer-community.com` — official GW community stockist/event mentions.
8. `"<Store>" youtube "shop tour" OR "battle report"` — metadata-only; never treat a hit alone as confirmation.

Explicitly out of scope for a text-search + non-JS-fetch agent (don't claim
these were checked unless the toolset actually changed): Maps/listing photos,
Facebook/Discord groups, Instagram/TikTok tag browsing.

### B.4 Recording results
For each store, record in the region's results file:
- Tier (A/B/C/Excluded) and a one-line reason.
- Which checklist items were actually run (not just "general web search").
- The literal evidence (quoted text + source URL) for any Tier A promotion —
  not a paraphrase, and not an unverified search-summary claim.
- For Tier B stores (the default outcome): which checklist items came back
  empty/blocked, and whether that's a true negative or a tool-capability gap
  (e.g. "Yelp returned 403" is a capability gap) — this is recorded for
  completeness, not to justify exclusion. The store is included either way.
- For any Excluded store: the specific contradicting evidence (closure
  notice, address proof, etc.) that justified leaving it out — exclusion
  always needs a citable reason, never just an absence of positive evidence.

### B.5 Repo data conventions (gwmap-specific, not GW-finder-specific)
When emitting `data/<region>.json` (schema shared with `data/twincities.json`):
- Every official Store Finder candidate is included by default, unless
  Excluded per B.1/B.4 — do not drop a listing just because the checklist
  came back empty.
- Tier A, with a real sourced discount → real `category` (`15`/`10`/`loyalty`/`none`).
- Tier A (product-only, no discount) or Tier B (default) → `category: "unconfirmed"`,
  `discount: "Discount status unknown — not yet researched. Call store to confirm their Games Workshop discount policy."`
- Tier C (community-sourced, not on the official list) still requires real
  evidence before inclusion — same as before, unaffected by the default-include
  policy above.
- Excluded stores are left out of the JSON entirely, but the contradicting
  evidence should still be recorded in the region's results file so a future
  run doesn't waste time re-investigating the same listing.
- `note` should cite the specific tier-justifying evidence (or its absence)
  per B.4 above, not a generic "not yet verified" placeholder once any real
  research has actually been attempted.

### B.6 Trigger reminders for future runs of this step
- **Always run item 4 (Google review text) as its own explicit step.** It
  has repeatedly surfaced confirmations nothing else caught, precisely
  because review text isn't reliably surfaced by generic queries.
- **Don't skip items 6–7 (Best Coast Pairings, Warhammer Community)** just
  because they're untested for a given store — they're plausible
  high-signal sources, not dead weight.
- **Re-run the capability assessment (B.2) at the start of each new
  session/tool environment**, not just once — tool access (browser vs.
  text-only, JS-rendering vs. not) varies between agents and sessions and
  directly determines which checklist items will actually produce evidence.
- **Don't regress to excluding a store just because corroboration wasn't
  found.** Per B.1, official Store Finder listings are included by default;
  exclusion requires positive contradicting evidence (closure, wrong
  address, etc.), not an absence of positive evidence. If you find yourself
  writing "no Warhammer evidence found, excluded" without a closure/address
  citation, that's the old policy — fix it to Tier B / `unconfirmed` instead.

---

## Phase C — Search for off-list (community-sourced) stores

**Mandatory step, and the easiest one to forget.** Phases A–B only ever look at
stores GW *already* lists. Phase C is the opposite: actively hunt for stores
that sell GW product but are **absent** from the official Store Finder. GW drops
stores that lapse the trade program, and brand-new or community-run shops may
never have been listed — so skipping Phase C systematically misses exactly the
independent FLGS this project exists to surface. Phases A and B can both "pass"
while the city is still only half-researched; this is the step that completes it.

### C.1 How to run it
For the target city (and near neighbors within the same radius), run discovery
searches aimed at surfacing store *names* not already in your Phase A list:
- `"<City>" <state> game store OR hobby shop OR comic shop Warhammer 40k` (general)
- `site:reddit.com "<City>" (Warhammer OR "Games Workshop" OR FLGS OR "game store")`
- `best game store "<City>" <state>` and local "where to buy Warhammer" roundups
- Third-party stockist directories (e.g. `wargames.com`) for the city — treat
  these as **leads, not proof**: they go stale and keep closed stores listed.

### C.2 Verify every candidate before including it
A Tier C store has no GW-side listing to default to, so inclusion **requires
real first-party evidence** it currently sells GW product (B.1, Tier C). Run the
relevant B.3 checklist items on each candidate, and — critically — confirm it is
**still open**. A third-party directory hit *plus* a "CLOSED" review tag, a
dead/redirecting website, and absence from the current Store Finder together
mean it has very likely closed (this is the Dungeon's End / Duluth pattern:
wargames.com still listed it years after a confirmed 2022 closure). Confirm
closure with a citable source and **Exclude** it, recording the evidence per B.4
so a future run doesn't re-investigate the same stale listing.

### C.3 Output (a silent skip is not acceptable)
Phase C must end in one of two recorded outcomes in `results/<region>.md`:
- New Tier C stores added to the JSON, each with cited first-party evidence; or
- A recorded negative — "Phase C run; candidates X, Y checked; X excluded
  (closed <date>, source); no additions." Absence of a Phase C note means the
  step wasn't run, not that there was nothing to find.

---

## Two-state metros (e.g. Kansas City, MO/KS)

When a metro area straddles a state line, scaffold **two separate regions** —
one centered on each state's side of the city (e.g. `kansascity-mo` and
`kansascity-ks`), each with its own center point and the standard radius. Run
Phases A/B/C independently for each. The radius is **not** state-filtered (per
Phase A above), so both regions will legitimately pull in many of the same
physical stores near the state line — that's expected, not a bug.

- **Keep store `id`s unique per file** (e.g. suffix `-mo` / `-ks`). This is for
  data hygiene — two distinguishable records — *not* for form routing. Be aware
  it does **not** steer which file a form submission lands in: the prefilled
  link carries no `id` (`prefill-link.js` only prefills name/address/Maps/
  discount), so `form-sync.gs` rebuilds an id from the submitted *name*
  (`slugify_(name)`) and routes by `s.id === slugify(name)` else `s.name ===
  name`, taking the **first** matching region file (files are read in directory/
  alphabetical order) and stopping there. So for two same-named twins, a
  submission always updates exactly one file — whichever sorts first — regardless
  of the suffixed ids. (A suffixed id actually skips the primary id check and
  falls to the name match, which is fine; just don't expect the id to pick the
  side.)
- **Duplicates are not merged or deduped, and form-sync only updates one side.**
  When a duplicate store gets verified — by form submission (auto-updates one
  twin, per above), phone call, or email reply — manually copy the same fields
  (category, discount, note, etc.) into its twin entry in the other region's
  file. There's no automated cross-region sync.
- **Don't re-send outreach to a store that's already been emailed under its
  other region.** See step2-outreach.md A.6.
- **State pages are unaffected.** Each region's whole file still rides along
  into its state page as-is — a region's file can contain out-of-state stores
  and that's fine, intentional, and not filtered at render time (see the
  existing Minnesota/River Falls precedent: `data/twincities.json` has two
  River Falls, WI stores that still show up on the Minnesota state page).

## A city is not "done" until all of these are checked

Per-city definition of done — record each in `results/<region>.md`:

- [ ] **Phase A** — Store Finder pulled and haversine-filtered to the chosen radius.
- [ ] **Phase B** — every Phase A candidate tiered (A / B / Excluded) and recorded.
- [ ] **Phase C** — off-list discovery search run; each candidate verified + included or excluded with a cited reason, or a recorded negative.
- [ ] **Results file** — `results/<region>.md` written with tiers, evidence, and any exclusions.

If any box is unchecked the city is only *partially* researched — say so
explicitly rather than implying it's complete.
