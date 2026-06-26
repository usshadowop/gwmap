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

Run `node scripts/new-city.js <slug> "<name>" <lat> <lng>`, where `<name>` is `"City, ST"`, e.g. `node scripts/new-city.js chicago "Chicago, IL" 41.8781 -87.6298`. It scaffolds:

1. `location/<slug>/index.html`, modeled on `location/twincities/index.html`, with `window.GWMAP_DATA_URL` pointed at `../../data/<slug>.json` and `window.GWMAP_CENTER`/`GWMAP_ZOOM` set to the given coordinates (new regions start with every store `unconfirmed`, so there are no confirmed pins yet for the map to auto-fit to).
2. An empty `data/<slug>.json` ready for the store-finding process to populate.
3. A link to the new region on the root `index.html` landing page, grouped under its state (states are listed alphabetically, cities alphabetically within each state).
4. An entry in the per-state combined view `location/<state>/index.html` (e.g. `location/illinois/`), creating that state page from scratch if it's the first city in a new state.
5. An entry in the `window.GWMAP_DATA_URLS` array in `location/allcities/index.html` so it appears on the combined map.

The state code in `<name>` must be a known USPS code (see `STATE_NAMES` in the script). The script aborts if `location/<slug>/` or `data/<slug>.json` already exists, so it's safe to run without clobbering an existing region.

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
