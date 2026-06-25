#!/usr/bin/env node
/**
 * Scaffolds a new region: location/<slug>/index.html, an empty data/<slug>.json,
 * a link on the root landing page, and an entry in the All Cities combined view.
 * Run with `node scripts/new-city.js <slug> "<name>" <lat> <lng>`.
 *
 * This only stamps out the empty shell described in README.md's "Adding a new
 * region" section — store data still comes from the Phase A/B/C research
 * process in docs/research-process/step1-store-finder.md.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ZOOM = 11; // city-level zoom, matches the existing unconfirmed-only regions

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const [slug, name, latStr, lngStr] = argv;
  if (!slug || !name || latStr === undefined || lngStr === undefined) {
    fail('Usage: node scripts/new-city.js <slug> "<name>" <lat> <lng>');
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail(`Invalid slug "${slug}" — must be lowercase kebab-case (a-z, 0-9, -).`);
  }
  const lat = Number(latStr);
  const lng = Number(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    fail(`Invalid lat/lng "${latStr}, ${lngStr}" — must be numbers.`);
  }
  return { slug, name, lat, lng };
}

function regionHtml(slug, name, lat, lng) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GW Discount Map - ${name} Hobby Stores with Games Workshop Discounts</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
  <header>
    <h1>Games Workshop Discount Map — ${name}</h1>
    <p>Find local hobby stores selling Games Workshop models and see which ones offer persistent discounts.</p>
  </header>
  <details class="legend-menu">
    <summary>Legend <span class="expand-hint">(click to expand)</span></summary>
    <div id="legend"></div>
  </details>
  <div id="map"></div>
  <details class="store-list-menu">
    <summary>Store list <span class="expand-hint">(click to expand)</span></summary>
    <ul id="store-list" class="store-list"></ul>
  </details>
  <footer class="footer-links">
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdka8Ua9pjBsVoRD4os_BnRg6IJbrZOrYtsi2p8AUp5AW1vvQ/viewform" target="_blank" rel="noopener">Suggest a store</a>
    &nbsp;|&nbsp;
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSeCknJuHNeoyAjhpoPd4OgijqxiohbY26y4HtOTFJlPR09s_A/viewform" target="_blank" rel="noopener">See an issue or have a suggestion?</a>
    &nbsp;|&nbsp;
    <a href="#" id="site-info-link">Site Info</a>
  </footer>
  <div id="site-info-modal" class="modal-overlay" hidden>
    <div class="modal-box">
      <p>This is a fan project created by ShadowOp, unaffiliated with any store or merchant, and provided free to the Warhammer community.</p>
      <p>Remember the <span class="golden-rule">GOLDEN RULE</span>: Whenever possible, pay where you play<br>The only way to keep our Friendly Local Game Shops in business is to patronize them!</p>
      <button id="site-info-close">Close</button>
    </div>
  </div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="../../js/vendor/oms.js"></script>
  <script>
    window.GWMAP_DATA_URL = '../../data/${slug}.json';
    // New regions seed with no confirmed pins (everything starts unconfirmed),
    // so there's nothing yet to auto-fit. Center on ${name} until that changes.
    window.GWMAP_CENTER = [${lat}, ${lng}];
    window.GWMAP_ZOOM = ${ZOOM};
  </script>
  <script src="../../js/app.js"></script>
  <script src="../../js/site-info.js"></script>
</body>
</html>
`;
}

function addLandingLink(slug, name) {
  const indexPath = path.join(ROOT, 'index.html');
  const lines = fs.readFileSync(indexPath, 'utf8').split('\n');
  const allCitiesIdx = lines.findIndex(l => l.includes('location/allcities/'));
  if (allCitiesIdx === -1) fail('Could not find the "All cities" link in index.html to insert before.');
  const indent = lines[allCitiesIdx].match(/^\s*/)[0];
  lines.splice(allCitiesIdx, 0, `${indent}<li><a href="location/${slug}/">${name}</a></li>`);
  fs.writeFileSync(indexPath, lines.join('\n'));
}

function addAllCitiesDataUrl(slug) {
  const allcitiesPath = path.join(ROOT, 'location', 'allcities', 'index.html');
  const lines = fs.readFileSync(allcitiesPath, 'utf8').split('\n');
  const openIdx = lines.findIndex(l => l.includes('window.GWMAP_DATA_URLS = ['));
  if (openIdx === -1) fail('Could not find window.GWMAP_DATA_URLS in location/allcities/index.html.');
  const closeIdx = lines.findIndex((l, i) => i > openIdx && l.trim() === '];');
  if (closeIdx === -1) fail('Could not find the closing "];" for window.GWMAP_DATA_URLS.');
  const lastEntryIdx = closeIdx - 1;
  if (!lines[lastEntryIdx].trim().endsWith(',')) {
    lines[lastEntryIdx] = `${lines[lastEntryIdx]},`;
  }
  const indent = lines[lastEntryIdx].match(/^\s*/)[0];
  lines.splice(closeIdx, 0, `${indent}'../../data/${slug}.json'`);
  fs.writeFileSync(allcitiesPath, lines.join('\n'));
}

function main() {
  const { slug, name, lat, lng } = parseArgs(process.argv.slice(2));

  const regionDir = path.join(ROOT, 'location', slug);
  const dataPath = path.join(ROOT, 'data', `${slug}.json`);
  if (fs.existsSync(regionDir) || fs.existsSync(dataPath)) {
    fail(`Region "${slug}" already exists (location/${slug}/ or data/${slug}.json).`);
  }

  fs.mkdirSync(regionDir);
  fs.writeFileSync(path.join(regionDir, 'index.html'), regionHtml(slug, name, lat, lng));
  fs.writeFileSync(dataPath, '[]\n');
  addLandingLink(slug, name);
  addAllCitiesDataUrl(slug);

  console.log(`Scaffolded region "${slug}":`);
  console.log(`  location/${slug}/index.html`);
  console.log(`  data/${slug}.json`);
  console.log(`  linked from index.html and location/allcities/index.html`);
  console.log(`\nNext: run the store-finding process (docs/research-process/step1-store-finder.md) to populate data/${slug}.json.`);
}

main();
