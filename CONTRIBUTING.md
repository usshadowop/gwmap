# Contributing

## Suggesting a store (easiest)

Most stores are added through the Google Form linked in the site footer. A
submission opens a pull request automatically; a maintainer reviews and merges
it, and the site redeploys. You don't need a GitHub account to use the form.

## Adding a store by hand (pull request)

Edit `data/twincities.json` (or the relevant city's file under `data/`) and add
an entry to the array. **All regions share one flat schema**, so copy an
existing entry and fill in what you know — keep the full field set even when
most values are blank (`""`, `false`, `[]`, or `null`). Only a handful of fields
are required; the rest can stay blank:

```json
{
  "id": "unique-slug",
  "name": "Store Name",
  "address": "Street, City, State, Zip",
  "lat": null,
  "lng": null,
  "category": "15",
  "discount": "Description of the GW discount offered",
  "discountExclusions": "",
  "discountDetails": "",
  "loyaltyDetails": "",
  "newReleases": false,
  "preorders": false,
  "preorderUrl": "",
  "preorderLinkText": "",
  "mapsUrl": "",
  "website": "",
  "phone": "",
  "affiliation": "",
  "note": "",
  "gameSystems": [],
  "stockLevel": "",
  "discord": "",
  "facebook": "",
  "instagram": "",
  "twitter": "",
  "otherSocials": "",
  "playSpaceTables": "",
  "playSpaceCost": "",
  "playSpacePrice": "",
  "playSpaceRestrictions": "",
  "playSpaceReserve": "",
  "stockImages": []
}
```

Required: `id` (lowercase kebab-case, unique), `name`, and `category`. The map
geocodes `address` in the browser (via OpenStreetMap Nominatim), so `lat`/`lng`
may be `null`. Set them directly (e.g. from a Google Maps link) to skip
geocoding and pin exact coordinates. Everything else is optional and can be left
blank — but keep the key present so every entry has the same shape.

`category` controls the pin color in the legend:

| category      | color  | meaning                              |
|---------------|--------|--------------------------------------|
| `15`          | green  | 15% discount                         |
| `10`          | blue   | 10% discount                         |
| `loyalty`     | yellow | Discount with store loyalty program  |
| `none`        | red    | No discount                          |
| `unconfirmed` | purple | Not yet verified                     |

### Optional fields

| field | type | shown when |
|-------|------|-----------|
| `newReleases` | boolean | discount applies to launch-day releases |
| `preorders` | boolean | store takes pre-orders |
| `preorderUrl` | string | link shown in the pre-order box (if `preorders`) |
| `preorderLinkText` | string | label for `preorderUrl` (defaults to "Pre-order instructions") |
| `mapsUrl` | string | "View on Google Maps" link (defaults to an address search) |
| `website` | string | website link |
| `phone` | string | phone number |
| `note` | string | extra note under the popup |
| `stockImages` | array of strings | "Stock photos" link (shown when non-empty) |

`stockImages` holds **keys relative to a base image host**, not full URLs — the
host (`IMAGE_BASE_URL` in `js/app.js`, currently `https://img.warhammerdiscounts.com`)
is prepended at render time, so moving the host later is a one-line change
instead of an edit to every store. Stock photos are hosted in Cloudflare R2
under `<region>/<store-id>/stock/<filename>`, so an entry's key looks like
`"twincities/hub-hobby-richfield/stock/photo1.jpg"`. The card links to the
first image in the array; leave the array empty (`[]`) until photos exist for
that store.

Additional flat fields are also carried on each entry for upcoming phases
(`affiliation`, `discountExclusions`, `discountDetails`, `loyaltyDetails`,
`gameSystems` (array), `stockLevel`, socials `discord`/`facebook`/`instagram`/
`twitter`/`otherSocials`, and play-space `playSpaceTables`/`playSpaceCost`/
`playSpacePrice`/`playSpaceRestrictions`/`playSpaceReserve`). They aren't
rendered yet — leave them blank if you don't have the info.

## Generated state store-finder supplements

Some `data/` files are **generated, not hand-edited**: any file named
`data/<state>-storefinder.json` (e.g. `data/minnesota-storefinder.json`) is
produced by `scripts/gen-state-storefinder.js <ST>` from the local Games
Workshop Store Finder snapshot under `storefinder/`. It contains every
store-finder entry in that state — mapped to the same flat schema, GW
company-owned stores as `category: "none"` and everyone else as `unconfirmed`
with the note "Found in Games Workshop Store Finder." — **minus** any store
already covered by one of the state's curated city files (deduped by proximity
or name, so the city entry stays the authoritative pin). It's wired into the
per-state combined view (`location/<state>/index.html`) alongside the city
files.

Don't edit these files by hand — your changes would be overwritten on the next
regeneration. To promote a store, add or curate it in the relevant **city**
file instead; the dedup will then drop it from the supplement on regen. Refresh
the snapshot (`scripts/pull-storefinder.js`) and regenerate
(`scripts/gen-state-storefinder.js <ST>`) about once a month.

## Validation

`scripts/validate-stores.js` runs on every pull request (see
`.github/workflows/validate.yml`) and blocks merge if the data is malformed —
invalid JSON, a missing required field, an unknown `category`, or a duplicate
`id`. Run it locally before opening a PR:

```sh
node scripts/validate-stores.js
```

Then open a pull request with your change.
