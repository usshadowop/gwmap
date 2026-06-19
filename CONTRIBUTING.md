# Adding a store

Edit `data/stores.json` and add a new entry to the array:

```json
{
  "id": "unique-slug",
  "name": "Store Name",
  "address": "Street, City, State, Zip",
  "discount": "Description of the GW discount offered",
  "category": "15",
  "website": "https://example.com",
  "phone": "(555) 555-5555"
}
```

`website` and `phone` are optional. The map geocodes `address` automatically in the browser (via OpenStreetMap Nominatim) — no need to look up coordinates.

Optionally, set `lat`/`lng` directly (e.g. pulled from a Google Maps link) to skip geocoding entirely and use exact coordinates:

```json
{
  "id": "unique-slug",
  "name": "Store Name",
  "address": "Street, City, State, Zip",
  "lat": 44.8839,
  "lng": -93.2882,
  "discount": "Description of the GW discount offered",
  "category": "15"
}
```

`category` controls the pin color shown in the legend:

| category  | color  | meaning                              |
|-----------|--------|---------------------------------------|
| `15`      | green  | 15% discount                          |
| `10`      | yellow | 10% discount                          |
| `none`    | red    | No discount                           |
| `loyalty` | blue   | Discount with store loyalty program   |

Optional fields can be added to flag what a store carries:

```json
{
  "newReleases": true,
  "preorders": true,
  "preorderUrl": "https://example.com/preorders",
  "preorderLinkText": "fill out the pre-order form"
}
```

- `newReleases`: set `true` if the store carries new releases on launch day.
- `preorders`: set `true` if the store takes pre-orders.
- `preorderUrl`: optional link to pre-order instructions, only shown if `preorders` is `true`.
- `preorderLinkText`: optional custom text for the `preorderUrl` link. Defaults to "pre-order instructions".

Open a pull request with your addition.
