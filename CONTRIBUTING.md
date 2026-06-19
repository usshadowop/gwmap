# Adding a store

Edit `data/stores.json` and add a new entry to the array:

```json
{
  "id": "unique-slug",
  "name": "Store Name",
  "address": "Street, City, State",
  "lat": 0.0,
  "lng": 0.0,
  "discount": "Description of the GW discount offered",
  "website": "https://example.com",
  "phone": "(555) 555-5555"
}
```

`website` and `phone` are optional. Get `lat`/`lng` from a service like [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) or by right-clicking the location on Google Maps.

Open a pull request with your addition.
