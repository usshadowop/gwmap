# gwmap

An interactive map of local hobby stores that offer discounts on Games Workshop models. Built with [Leaflet](https://leafletjs.com/) and OpenStreetMap, hosted on GitHub Pages.

The site root (`index.html`) is a landing page that links out to each region's map, e.g. `/twincities/` for the Twin Cities map. Each region has its own subdirectory with an `index.html` and a corresponding `data/<region>.json` file, sharing the same `css/style.css` and `js/app.js`. There is also an `/allcities/` map that combines every region's data into one view.

## Running locally

Serve the directory with any static file server, e.g.:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Adding a store

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Adding a new region

1. Create a new subdirectory (e.g. `chicago/`) with an `index.html` modeled on `twincities/index.html`.
2. Set `window.GWMAP_DATA_URL` in that page to point at a new `data/<region>.json` file.
3. Add a link to the new region on the root `index.html` landing page.
4. Add the new data file to the `window.GWMAP_DATA_URLS` array in `allcities/index.html` so it appears on the combined map.

The map auto-fits to the confirmed (visible) pins in the loaded data. If a region has no confirmed pins yet (e.g. every store is `unconfirmed` and hidden by default), set `window.GWMAP_CENTER` (`[lat, lng]`) and `window.GWMAP_ZOOM` in the page so it still opens centered on the region — see `coloradosprings/index.html` for an example.

## Deploying

Enable GitHub Pages in the repo settings: **Settings > Pages > Source**, select the branch to deploy (e.g. `main`) and the root folder. No build step is required.
