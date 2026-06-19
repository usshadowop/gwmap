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

`category` controls the pin color shown in the legend:

| category  | color  | meaning                              |
|-----------|--------|---------------------------------------|
| `15`      | green  | 15% discount                          |
| `10`      | yellow | 10% discount                          |
| `none`    | red    | No discount                           |
| `loyalty` | blue   | Discount with store loyalty program   |

Open a pull request with your addition.
