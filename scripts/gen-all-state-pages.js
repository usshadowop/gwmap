#!/usr/bin/env node
/**
 * Generate a per-state page + GW Store Finder supplement for EVERY US state (and
 * DC) present in the local store-finder snapshot, and link them all from the
 * landing page's region nav.
 *
 * For each state found in the snapshot:
 *   1. If location/<slug>/index.html doesn't exist, scaffold a state page,
 *      centered on the state's snapshot pins (median lat/lng, outlier-robust) and
 *      preloaded with its own supplement data URL. Most stores in a fresh state
 *      start "unconfirmed" (hidden behind the map toggle), so there's nothing to
 *      auto-fit to — hence the explicit per-state center/zoom.
 *   2. Run scripts/gen-state-storefinder.js <ST> to (re)build
 *      data/<slug>-storefinder.json and wire it into the page. That step dedups
 *      against any curated city files the state already loads (Minnesota,
 *      Colorado) and is idempotent on the page.
 *   3. Ensure the state is linked from index.html's region nav, inserted
 *      alphabetically, without disturbing existing curated city sublists.
 *
 * Idempotent: re-running refreshes every supplement and leaves existing pages and
 * landing links intact. Refresh the snapshot first (scripts/pull-storefinder.js)
 * if it's older than ~1 month.
 *
 * Usage:
 *   node scripts/gen-all-state-pages.js
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'storefinder');

// USPS state codes → display names (kept in sync with scripts/new-city.js and
// scripts/gen-state-storefinder.js).
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
  console.error('gen-all-state-pages: ' + message);
  process.exit(1);
}

function latestSnapshot() {
  if (!fs.existsSync(CACHE_DIR)) fail('No storefinder/ directory. Run scripts/pull-storefinder.js first.');
  const snaps = fs.readdirSync(CACHE_DIR)
    .filter(f => /^storefinder-\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort();
  if (!snaps.length) fail('No storefinder-<date>.json snapshot found. Run scripts/pull-storefinder.js first.');
  return path.join(CACHE_DIR, snaps[snaps.length - 1]);
}

const stateSlugFor = name => name.toLowerCase().replace(/[^a-z]/g, '');
const round4 = n => Math.round(n * 1e4) / 1e4;

function median(values) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

// Robust spread: the 10th–90th percentile range, ignoring a handful of
// mis-geocoded outliers that would otherwise blow up a raw min/max bounding box.
function pctile(values, p) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const i = Math.min(a.length - 1, Math.max(0, Math.round((p / 100) * (a.length - 1))));
  return a[i];
}

// Pick a Leaflet zoom that roughly frames a whole state from its pin spread.
function zoomFor(lats, lngs) {
  const span = Math.max(pctile(lats, 90) - pctile(lats, 10), pctile(lngs, 90) - pctile(lngs, 10));
  if (span >= 6) return 5;
  if (span >= 3.5) return 6;
  if (span >= 2) return 7;
  if (span >= 0.8) return 8;
  return 9;
}

function statePageHtml(stateName, slug, center, zoom) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warhammer Discount Map - ${stateName} Hobby Stores with Warhammer Discounts</title>
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
    <a href="https://docs.google.com/forms/d/e/1FAIpQLSdka8Ua9pjBsVoRD4os_BnRg6IJbrZOrYtsi2p8AUp5AW1vvQ/viewform?usp=header" target="_blank" rel="noopener">Have a request?</a>
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
    // State view: load every ${stateName} data file. Most stores here come
    // straight from the Games Workshop Store Finder and start "unconfirmed"
    // (hidden behind the map's toggle), so there's nothing to auto-fit to yet —
    // frame the whole state instead. Add curated city data files here as regions
    // are researched (the confirmed pins will then drive the auto-fit).
    window.GWMAP_DATA_URLS = [
      '../../data/${slug}-storefinder.json'
    ];
    window.GWMAP_CENTER = [${center[0]}, ${center[1]}];
    window.GWMAP_ZOOM = ${zoom};
  </script>
  <script src="../../js/app.js"></script>
  <script src="../../js/site-info.js"></script>
</body>
</html>
`;
}

// Link a state from the landing page's region nav, inserted alphabetically by
// display name, if it isn't already present. State-only entries carry no city
// sublist; existing curated groups (Colorado, Minnesota) are left untouched.
function ensureStateOnLanding(stateName, stateSlug) {
  const indexPath = path.join(ROOT, 'index.html');
  const lines = fs.readFileSync(indexPath, 'utf8').split('\n');
  const marker = `<a href="location/${stateSlug}/">`;
  if (lines.some(l => l.includes(marker))) return false;

  const allCitiesIdx = lines.findIndex(l => l.includes('class="all-cities"'));
  if (allCitiesIdx === -1) fail('Could not find the "all-cities" link in index.html.');
  const indent = lines[allCitiesIdx].match(/^\s*/)[0];

  // Insert before the first existing state whose name sorts after this one,
  // otherwise just before the "All cities" link.
  let insertIdx = allCitiesIdx;
  for (let i = 0; i < allCitiesIdx; i++) {
    if (lines[i].includes('class="state"')) {
      const m = lines[i + 1] && lines[i + 1].match(/<a href="location\/[^"]+\/">([^<]+)<\/a>/);
      if (m && m[1].localeCompare(stateName) > 0) { insertIdx = i; break; }
    }
  }
  const block = [
    `${indent}<li class="state">`,
    `${indent}  <a href="location/${stateSlug}/">${stateName}</a>`,
    `${indent}</li>`
  ];
  lines.splice(insertIdx, 0, ...block);
  fs.writeFileSync(indexPath, lines.join('\n'));
  return true;
}

function main() {
  const snapshotPath = latestSnapshot();
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));

  // Group every US snapshot entry by state code, collecting pin coordinates.
  const groups = {};
  for (const s of snapshot) {
    if (s.countryCode !== 'US') continue;
    const code = s.isoRegionCode || s.region;
    if (!STATE_NAMES[code]) continue;
    const g = (groups[code] ||= { lats: [], lngs: [] });
    const geo = s._geoloc || {};
    if (typeof geo.lat === 'number' && typeof geo.lng === 'number') {
      g.lats.push(geo.lat);
      g.lngs.push(geo.lng);
    }
  }

  const codes = Object.keys(groups).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b]));
  let created = 0, linked = 0;

  for (const code of codes) {
    const stateName = STATE_NAMES[code];
    const slug = stateSlugFor(stateName);
    const statePath = path.join(ROOT, 'location', slug, 'index.html');

    if (!fs.existsSync(statePath)) {
      const center = [round4(median(groups[code].lats)), round4(median(groups[code].lngs))];
      const zoom = zoomFor(groups[code].lats, groups[code].lngs);
      fs.mkdirSync(path.dirname(statePath), { recursive: true });
      fs.writeFileSync(statePath, statePageHtml(stateName, slug, center, zoom));
      created++;
    }

    // Build/refresh the supplement and wire it into the page (idempotent).
    execFileSync('node', [path.join(__dirname, 'gen-state-storefinder.js'), code], { stdio: 'pipe' });

    if (ensureStateOnLanding(stateName, slug)) linked++;
  }

  console.log(`Generated state pages from ${path.basename(snapshotPath)}:`);
  console.log(`  ${codes.length} states present in snapshot`);
  console.log(`  ${created} new state page(s) scaffolded, ${codes.length - created} already existed`);
  console.log(`  ${codes.length} store-finder supplement(s) (re)built and wired`);
  console.log(`  ${linked} new landing-page link(s) added`);
}

main();
