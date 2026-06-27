#!/usr/bin/env node
/**
 * Scaffolds a new region: location/<slug>/index.html, an empty data/<slug>.json,
 * a link on the root landing page (grouped under its state), an entry in the
 * state combined view (location/<state>/, created if the state is new), and an
 * entry in the All Cities combined view.
 * Run with `node scripts/new-city.js <slug> "<name>" <lat> <lng>` where <name>
 * is "City, ST" (e.g. "Austin, TX").
 *
 * This only stamps out the empty shell described in README.md's "Adding a new
 * region" section — store data still comes from the Phase A/B/C research
 * process in docs/research-process/step1-store-finder.md.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ZOOM = 11; // city-level zoom, matches the existing unconfirmed-only regions

// USPS state codes → display names. Used to group cities by state on the
// landing page and to name the per-state combined view.
const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia',
  FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois',
  IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana',
  ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan',
  MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota',
  OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const [slug, name, latStr, lngStr] = argv;
  if (!slug || !name || latStr === undefined || lngStr === undefined) {
    fail('Usage: node scripts/new-city.js <slug> "<name>" <lat> <lng>  (name is "City, ST")');
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    fail(`Invalid slug "${slug}" — must be lowercase kebab-case (a-z, 0-9, -).`);
  }
  const m = name.match(/^(.*),\s*([A-Za-z]{2})$/);
  if (!m) {
    fail(`Invalid name "${name}" — must be "City, ST" (e.g. "Austin, TX").`);
  }
  const cityName = m[1].trim();
  const stateCode = m[2].toUpperCase();
  const stateName = STATE_NAMES[stateCode];
  if (!stateName) {
    fail(`Unknown state code "${stateCode}". Add it to STATE_NAMES in scripts/new-city.js.`);
  }
  const stateSlug = stateName.toLowerCase().replace(/[^a-z]/g, '');
  const lat = Number(latStr);
  const lng = Number(lngStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    fail(`Invalid lat/lng "${latStr}, ${lngStr}" — must be numbers.`);
  }
  return { slug, cityName, stateName, stateSlug, lat, lng };
}

function regionHtml(slug, cityName, lat, lng) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GW Discount Map - ${cityName} Hobby Stores with Warhammer Discounts</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
  <header>
    <h1>Warhammer Discount Map — ${cityName}</h1>
    <p>Find local hobby stores selling Warhammer models and see which ones offer persistent discounts.</p>
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
    // so there's nothing yet to auto-fit. Center on ${cityName} until that changes.
    window.GWMAP_CENTER = [${lat}, ${lng}];
    window.GWMAP_ZOOM = ${ZOOM};
  </script>
  <script src="../../js/app.js"></script>
  <script src="../../js/site-info.js"></script>
</body>
</html>
`;
}

function statePageHtml(stateName, citySlug) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GW Discount Map - ${stateName} Hobby Stores with Warhammer Discounts</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="../../css/style.css">
</head>
<body>
  <header>
    <h1>Warhammer Discount Map — ${stateName}</h1>
    <p>Every store across ${stateName}. Find local hobby stores selling Warhammer models and see which ones offer persistent discounts.</p>
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
    // State view: load every ${stateName} region's data file. The map auto-fits
    // to the confirmed (visible) pins across the state; add new ${stateName} data
    // files here as regions are added.
    window.GWMAP_DATA_URLS = [
      '../../data/${citySlug}.json'
    ];
  </script>
  <script src="../../js/app.js"></script>
  <script src="../../js/site-info.js"></script>
</body>
</html>
`;
}

// Insert a city link on the landing page, grouped under its state. Creates the
// state group (in alphabetical state order) if the state isn't present yet, and
// keeps cities within a state alphabetical.
function addLandingLink(slug, cityName, stateName, stateSlug) {
  const indexPath = path.join(ROOT, 'index.html');
  const lines = fs.readFileSync(indexPath, 'utf8').split('\n');

  const allCitiesIdx = lines.findIndex(l => l.includes('class="all-cities"'));
  if (allCitiesIdx === -1) fail('Could not find the "all-cities" link in index.html.');
  const stateIndent = lines[allCitiesIdx].match(/^\s*/)[0];

  const stateHref = `location/${stateSlug}/`;
  const stateLinkIdx = lines.findIndex(l => l.includes(`<a href="${stateHref}">`));

  if (stateLinkIdx !== -1) {
    // Existing state group — insert the city alphabetically in its inner <ul>.
    const innerOpen = lines.findIndex((l, i) => i > stateLinkIdx && l.trim() === '<ul>');
    const innerClose = lines.findIndex((l, i) => i > innerOpen && l.trim() === '</ul>');
    if (innerOpen === -1 || innerClose === -1) fail(`Malformed state group for ${stateName} in index.html.`);
    const cityIndent = lines[innerClose].match(/^\s*/)[0] + '  ';
    let insertIdx = innerClose;
    for (let i = innerOpen + 1; i < innerClose; i++) {
      const m = lines[i].match(/<a href="location\/[^"]+\/">([^<]+)<\/a>/);
      if (m && m[1] > cityName) { insertIdx = i; break; }
    }
    lines.splice(insertIdx, 0, `${cityIndent}<li><a href="location/${slug}/">${cityName}</a></li>`);
  } else {
    // New state group — insert before the first state that sorts after it,
    // else just before the "All cities" link.
    let insertIdx = allCitiesIdx;
    for (let i = 0; i < allCitiesIdx; i++) {
      if (lines[i].includes('class="state"')) {
        const m = lines[i + 1] && lines[i + 1].match(/<a href="location\/[^"]+\/">([^<]+)<\/a>/);
        if (m && m[1] > stateName) { insertIdx = i; break; }
      }
    }
    const block = [
      `${stateIndent}<li class="state">`,
      `${stateIndent}  <a href="location/${stateSlug}/">${stateName}</a>`,
      `${stateIndent}  <ul>`,
      `${stateIndent}    <li><a href="location/${slug}/">${cityName}</a></li>`,
      `${stateIndent}  </ul>`,
      `${stateIndent}</li>`
    ];
    lines.splice(insertIdx, 0, ...block);
  }
  fs.writeFileSync(indexPath, lines.join('\n'));
}

// Append a region's data file to a GWMAP_DATA_URLS array in a combined view.
function addDataUrl(filePath, slug, label) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const openIdx = lines.findIndex(l => l.includes('window.GWMAP_DATA_URLS = ['));
  if (openIdx === -1) fail(`Could not find window.GWMAP_DATA_URLS in ${label}.`);
  const closeIdx = lines.findIndex((l, i) => i > openIdx && l.trim() === '];');
  if (closeIdx === -1) fail(`Could not find the closing "];" for window.GWMAP_DATA_URLS in ${label}.`);
  const lastEntryIdx = closeIdx - 1;
  if (!lines[lastEntryIdx].trim().endsWith(',')) {
    lines[lastEntryIdx] = `${lines[lastEntryIdx]},`;
  }
  const indent = lines[lastEntryIdx].match(/^\s*/)[0];
  lines.splice(closeIdx, 0, `${indent}'../../data/${slug}.json'`);
  fs.writeFileSync(filePath, lines.join('\n'));
}

// Create the per-state combined view if it doesn't exist yet, otherwise add the
// new region's data file to it.
function addStatePage(stateName, stateSlug, citySlug) {
  const stateDir = path.join(ROOT, 'location', stateSlug);
  const statePath = path.join(stateDir, 'index.html');
  if (fs.existsSync(statePath)) {
    addDataUrl(statePath, citySlug, `location/${stateSlug}/index.html`);
  } else {
    fs.mkdirSync(stateDir, { recursive: true });
    fs.writeFileSync(statePath, statePageHtml(stateName, citySlug));
  }
}

function addAllCitiesDataUrl(slug) {
  addDataUrl(
    path.join(ROOT, 'location', 'allcities', 'index.html'),
    slug,
    'location/allcities/index.html'
  );
}

function main() {
  const { slug, cityName, stateName, stateSlug, lat, lng } = parseArgs(process.argv.slice(2));

  const regionDir = path.join(ROOT, 'location', slug);
  const dataPath = path.join(ROOT, 'data', `${slug}.json`);
  if (fs.existsSync(regionDir) || fs.existsSync(dataPath)) {
    fail(`Region "${slug}" already exists (location/${slug}/ or data/${slug}.json).`);
  }

  fs.mkdirSync(regionDir);
  fs.writeFileSync(path.join(regionDir, 'index.html'), regionHtml(slug, cityName, lat, lng));
  fs.writeFileSync(dataPath, '[]\n');
  addLandingLink(slug, cityName, stateName, stateSlug);
  addStatePage(stateName, stateSlug, slug);
  addAllCitiesDataUrl(slug);

  console.log(`Scaffolded region "${slug}" (${cityName}, ${stateName}):`);
  console.log(`  location/${slug}/index.html`);
  console.log(`  data/${slug}.json`);
  console.log(`  linked from index.html (under ${stateName}), location/${stateSlug}/, and location/allcities/`);
  console.log(`\nNext: run the store-finding process (docs/research-process/step1-store-finder.md) to populate data/${slug}.json.`);
}

main();
