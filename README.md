# gwmap

An interactive map of local hobby stores that offer discounts on Games Workshop models. Built with [Leaflet](https://leafletjs.com/) and OpenStreetMap, hosted on GitHub Pages.

The site root (`index.html`) is a landing page that links out to each region's map, e.g. `/location/twincities/` for the Twin Cities map. Each region has its own subdirectory under `location/` (`location/<region>/index.html`) and a corresponding `data/<region>.json` file, sharing the same `css/style.css` and `js/app.js`. There is also a `/location/allcities/` map that combines every region's data into one view. Because region pages live two levels deep, they reference shared assets as `../../css/`, `../../js/`, and `../../data/`.

## Running locally

Serve the directory with any static file server, e.g.:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Adding a store

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Adding a new region

1. Create a new subdirectory under `location/` (e.g. `location/chicago/`) with an `index.html` modeled on `location/twincities/index.html` (it already uses the correct `../../` asset paths).
2. Set `window.GWMAP_DATA_URL` in that page to point at a new `../../data/<region>.json` file.
3. Add a link to the new region (`location/<region>/`) on the root `index.html` landing page.
4. Add the new data file to the `window.GWMAP_DATA_URLS` array in `location/allcities/index.html` so it appears on the combined map.

The map auto-fits to the confirmed (visible) pins in the loaded data. If a region has no confirmed pins yet (e.g. every store is `unconfirmed` and hidden by default), set `window.GWMAP_CENTER` (`[lat, lng]`) and `window.GWMAP_ZOOM` in the page so it still opens centered on the region — see `location/coloradosprings/index.html` for an example.

## Deploying

Enable GitHub Pages in the repo settings: **Settings > Pages > Source**, select the branch to deploy (e.g. `main`) and the root folder. No build step is required.

## Documentation

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — store schema and how to add a store.
- [`CLAUDE.md`](CLAUDE.md) — working notes / standing rules for contributors and AI assistants.
- [`docs/project-plan.md`](docs/project-plan.md) — high-level roadmap (setup + per-city workflow).
- [`docs/research-process/step1-store-finder.md`](docs/research-process/step1-store-finder.md) — the city-agnostic process for building an authoritative GW store list (Phase A pull + Phase B verify/tier).
- [`docs/research-process/results/`](docs/research-process/results/) — per-region findings ([Twin Cities](docs/research-process/results/twincities.md), [Colorado Springs](docs/research-process/results/coloradosprings.md), [Denver](docs/research-process/results/denver.md)).
- [`docs/form/form-reference.md`](docs/form/form-reference.md) — Google Form field/entry-ID map.
- [`docs/form/form-sync-operations.md`](docs/form/form-sync-operations.md) — how the form → PR automation runs.
