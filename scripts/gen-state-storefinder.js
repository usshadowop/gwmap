#!/usr/bin/env node
/**
 * Generate a per-state "GW Store Finder supplement" data file.
 *
 * Reads the local Games Workshop Store Finder snapshot (storefinder/), keeps
 * every entry in the given US state, maps each into the unified store schema,
 * and drops the ones already covered by that state's existing city data files.
 * The survivors are written to data/<state-slug>-storefinder.json and the file
 * is wired into location/<state-slug>/index.html's GWMAP_DATA_URLS, so the state
 * map shows the full store-finder long tail without duplicating curated city pins.
 *
 * Categories: non-GW stores come in as "unconfirmed" (hidden behind the map's
 * "Show unconfirmed stores" toggle) with the note "Found in Games Workshop Store
 * Finder."; Games Workshop company-owned stores (isWarHammerStore) come in as
 * "none" — we already know they sell at full retail — matching how the city
 * files store them, so they stay visible and accurately categorized.
 *
 * Dedup: a snapshot entry is treated as already-covered if it sits within ~120 m
 * of ANY curated city store repo-wide (so a border store curated under an
 * adjacent state's metro doesn't double-pin on the combined All Cities view), or
 * if its normalized name matches one of THIS state's coordinate-less city stores
 * (a fallback used only when proximity can't apply — name matching is never used
 * for stores that have coordinates, so distinct same-named chain locations like
 * the official "Games Workshop" stores are each kept). City data files are never
 * modified — they stay the authoritative pin.
 *
 * Usage:
 *   node scripts/gen-state-storefinder.js <ST>     e.g. node scripts/gen-state-storefinder.js MN
 *
 * Re-running regenerates the file in place and is idempotent on the state page.
 * Refresh the snapshot first (scripts/pull-storefinder.js) if it's >~1 month old.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const CACHE_DIR = path.join(ROOT, 'storefinder');
const DEDUP_METERS = 120; // a snapshot entry this close to a city store is the same store

// USPS state codes → display names (kept in sync with scripts/new-city.js).
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

// Canonical key order — must match data/twincities.json so every region file
// shares an identical schema (see CLAUDE.md "Data").
const SCHEMA_KEYS = [
  'id', 'name', 'address', 'lat', 'lng', 'category', 'discount',
  'discountExclusions', 'discountDetails', 'loyaltyDetails', 'newReleases',
  'preorders', 'preorderUrl', 'preorderLinkText', 'mapsUrl', 'website', 'phone',
  'affiliation', 'note', 'gameSystems', 'stockLevel', 'discord', 'facebook',
  'instagram', 'twitter', 'otherSocials', 'playSpaceTables', 'playSpaceCost',
  'playSpacePrice', 'playSpaceRestrictions', 'playSpaceReserve'
];

const NON_GW_DISCOUNT = 'Discount status unknown — not yet researched. Call store to confirm their Warhammer discount policy.';
const GW_DISCOUNT = 'No discount on Warhammer models';
const STORE_FINDER_NOTE = 'Found in Games Workshop Store Finder.';
const GW_NOTE = 'Games Workshop company-owned store — sells Warhammer at full retail (no discount). Found in Games Workshop Store Finder.';

function fail(message) {
  console.error('gen-state-storefinder: ' + message);
  process.exit(1);
}

// kebab-case for ids: lowercase, non-alphanumeric runs → single '-'.
const kebab = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Compact comparison key for name-based dedup: drop common legal/article tokens,
// then strip everything but letters/digits.
const nameKey = s => String(s || '').toLowerCase().replace(/\b(llc|llp|inc|co|the)\b/g, '').replace(/[^a-z0-9]/g, '');

// Title-case an ALL-CAPS name; leave already-mixed-case names untouched so we
// never mangle properly-cased ones. Common acronyms stay uppercase.
const KEEP_UPPER = new Set(['LLC', 'LLP', 'INC', 'LTD', 'CO', 'TCG', 'CCG', 'LGS', 'FLGS', 'II', 'III', 'IV', 'USA', 'US', 'MN']);
function titleCase(s) {
  return String(s).replace(/[A-Za-z0-9.'&]+/g, w => {
    if (KEEP_UPPER.has(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  });
}
function displayName(raw) {
  const name = String(raw || '').trim();
  return /[a-z]/.test(name) ? name : titleCase(name);
}

function composeAddress(s) {
  const street = [s.addressLine1, s.addressLine2].map(x => String(x || '').trim()).filter(Boolean).join(' ');
  const regionZip = [s.region, s.postalCode].map(x => String(x || '').trim()).filter(Boolean).join(' ');
  return [street, String(s.city || '').trim(), regionZip].filter(Boolean).join(', ');
}

// Format a US phone number as (XXX) XXX-XXXX; pass anything else through as-is.
function formatPhone(p) {
  if (!p) return '';
  const m = String(p).replace(/[^\d+]/g, '').match(/^\+?1?(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : String(p);
}

// The store finder lists warhammer.com for its own branded stores; that's not a
// useful "store website", so only keep an entry's own domain.
function websiteFor(s) {
  const url = String(s.websiteUrl || '').trim();
  return /(^|\.)warhammer\.com/i.test(url) ? '' : url;
}

function num(v) {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function haversine(aLat, aLng, bLat, bLng) {
  const R = 6371000, toRad = Math.PI / 180;
  const dLat = (bLat - aLat) * toRad, dLng = (bLng - aLng) * toRad;
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(aLat * toRad) * Math.cos(bLat * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function latestSnapshot() {
  if (!fs.existsSync(CACHE_DIR)) fail(`No storefinder/ directory. Run scripts/pull-storefinder.js first.`);
  const snaps = fs.readdirSync(CACHE_DIR)
    .filter(f => /^storefinder-\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort();
  if (!snaps.length) fail('No storefinder-<date>.json snapshot found. Run scripts/pull-storefinder.js first.');
  return path.join(CACHE_DIR, snaps[snaps.length - 1]);
}

// Pull the data filenames the state page already loads (its city files), so we
// can dedup against them — minus our own supplement file.
function readStateCityFiles(statePath, supplementBase) {
  const html = fs.readFileSync(statePath, 'utf8');
  const bases = [];
  const re = /['"]\.\.\/\.\.\/data\/([^'"]+)\.json['"]/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1] !== supplementBase) bases.push(m[1]);
  }
  return bases;
}

// Collect coordinates of EVERY curated city store repo-wide (any data/*.json
// that isn't a generated *-storefinder.json supplement). Proximity dedup runs
// against these, not just this state's city files: a border store curated under
// an adjacent state's metro (e.g. a Wisconsin store in data/twincities.json)
// would otherwise reappear in this state's supplement and double-pin on the
// All Cities combined view, which loads both files.
function readAllCuratedPoints() {
  const points = [];
  for (const f of fs.readdirSync(DATA_DIR)) {
    if (!f.endsWith('.json') || /-storefinder\.json$/.test(f)) continue;
    const stores = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
    for (const s of stores) {
      if (typeof s.lat === 'number' && typeof s.lng === 'number') points.push([s.lat, s.lng]);
    }
  }
  return points;
}

// Add the supplement's data URL to the state page's GWMAP_DATA_URLS array if it
// isn't already there (mirrors scripts/new-city.js addDataUrl, but idempotent).
function ensureStateDataUrl(statePath, supplementBase) {
  const lines = fs.readFileSync(statePath, 'utf8').split('\n');
  const url = `'../../data/${supplementBase}.json'`;
  if (lines.some(l => l.includes(`data/${supplementBase}.json`))) return false;

  const openIdx = lines.findIndex(l => l.includes('window.GWMAP_DATA_URLS = ['));
  if (openIdx === -1) fail(`Could not find window.GWMAP_DATA_URLS in ${statePath}.`);
  const closeIdx = lines.findIndex((l, i) => i > openIdx && l.trim() === '];');
  if (closeIdx === -1) fail(`Could not find the closing "];" for GWMAP_DATA_URLS in ${statePath}.`);
  const lastEntryIdx = closeIdx - 1;
  if (!lines[lastEntryIdx].trim().endsWith(',')) lines[lastEntryIdx] = `${lines[lastEntryIdx]},`;
  const indent = lines[lastEntryIdx].match(/^\s*/)[0];
  lines.splice(closeIdx, 0, `${indent}${url}`);
  fs.writeFileSync(statePath, lines.join('\n'));
  return true;
}

function toStore(s, id) {
  const isGW = !!s.isWarHammerStore;
  const geo = s._geoloc || {};
  const store = {
    id,
    name: displayName(s.displayName && /[a-z]/.test(s.displayName) ? s.displayName : s.name),
    address: composeAddress(s),
    lat: num(geo.lat),
    lng: num(geo.lng),
    category: isGW ? 'none' : 'unconfirmed',
    discount: isGW ? GW_DISCOUNT : NON_GW_DISCOUNT,
    discountExclusions: '',
    discountDetails: '',
    loyaltyDetails: '',
    newReleases: false,
    preorders: false,
    preorderUrl: '',
    preorderLinkText: '',
    mapsUrl: '',
    website: websiteFor(s),
    phone: formatPhone(s.phone),
    affiliation: '',
    note: isGW ? GW_NOTE : STORE_FINDER_NOTE,
    gameSystems: [],
    stockLevel: '',
    discord: '',
    facebook: '',
    instagram: '',
    twitter: '',
    otherSocials: '',
    playSpaceTables: '',
    playSpaceCost: '',
    playSpacePrice: '',
    playSpaceRestrictions: '',
    playSpaceReserve: ''
  };
  // Emit keys in canonical order.
  const ordered = {};
  for (const k of SCHEMA_KEYS) ordered[k] = store[k];
  return ordered;
}

function main() {
  const code = String(process.argv[2] || '').toUpperCase();
  if (!code) fail('Usage: node scripts/gen-state-storefinder.js <ST>  (e.g. MN)');
  const stateName = STATE_NAMES[code];
  if (!stateName) fail(`Unknown state code "${code}". Known codes live in STATE_NAMES.`);
  const stateSlug = stateName.toLowerCase().replace(/[^a-z]/g, '');
  const supplementBase = `${stateSlug}-storefinder`;

  const statePath = path.join(ROOT, 'location', stateSlug, 'index.html');
  if (!fs.existsSync(statePath)) {
    fail(`No state page at location/${stateSlug}/index.html — scaffold a ${stateName} city first (scripts/new-city.js).`);
  }

  // Load snapshot + the state's existing city files (the dedup sources).
  const snapshotPath = latestSnapshot();
  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  const cityBases = readStateCityFiles(statePath, supplementBase);
  const cityStores = cityBases.flatMap(base => {
    const p = path.join(DATA_DIR, `${base}.json`);
    return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : [];
  });

  // Name dedup is ONLY the coordinate-less fallback: just this state's curated
  // stores that lack lat/lng (so proximity can't reach them) are matched by name.
  // Matching every curated store by name — or matching the stores we've already
  // kept this run by name — would wrongly collapse distinct chain locations that
  // share a name, e.g. the many official "Games Workshop"/"Warhammer" stores in a
  // state (each is a different shop with its own coordinates). Those are deduped
  // by proximity instead, never by name.
  const cityNameKeys = new Set(
    cityStores.filter(s => s.lat == null || s.lng == null).map(s => nameKey(s.name))
  );
  const curatedPoints = readAllCuratedPoints();

  // Covered = same location as an existing pin (any curated store repo-wide, or
  // one kept earlier this run), or — only for coordinate-less curated stores —
  // the same normalized name.
  function isCovered(s, keptPoints) {
    if (cityNameKeys.has(nameKey(s.name))) return true;
    const geo = s._geoloc || {};
    const lat = num(geo.lat), lng = num(geo.lng);
    if (lat == null || lng == null) return false;
    for (const [pLat, pLng] of [...curatedPoints, ...keptPoints]) {
      if (haversine(lat, lng, pLat, pLng) <= DEDUP_METERS) return true;
    }
    return false;
  }

  const inState = snapshot.filter(s =>
    s.countryCode === 'US' && (s.isoRegionCode === code || s.region === code));

  const keptPoints = [];
  const usedIds = new Set();
  const stores = [];
  let gwCount = 0;

  // Stable order: name, then city, so regeneration produces a clean diff.
  inState.sort((a, b) =>
    String(a.name).localeCompare(String(b.name)) || String(a.city).localeCompare(String(b.city)));

  for (const s of inState) {
    if (isCovered(s, keptPoints)) continue;

    // Unique, provenance-suffixed id (-sf) that won't collide with city files.
    // Many official stores share the name "Games Workshop"/"Warhammer", so fall
    // back to the city (then a counter) to keep ids unique within the file.
    const base = kebab(displayName(s.name)) || 'store';
    let id = `${base}-sf`;
    if (usedIds.has(id)) id = `${base}-${kebab(s.city)}-sf`;
    for (let i = 2; usedIds.has(id); i++) id = `${base}-${i}-sf`;
    usedIds.add(id);

    stores.push(toStore(s, id));
    const geo = s._geoloc || {};
    const lat = num(geo.lat), lng = num(geo.lng);
    if (lat != null && lng != null) keptPoints.push([lat, lng]);
    if (s.isWarHammerStore) gwCount++;
  }

  const outPath = path.join(DATA_DIR, `${supplementBase}.json`);
  fs.writeFileSync(outPath, JSON.stringify(stores, null, 2) + '\n');
  const wired = ensureStateDataUrl(statePath, supplementBase);

  const snapName = path.basename(snapshotPath);
  console.log(`${stateName} (${code}) — store finder supplement from ${snapName}:`);
  console.log(`  ${inState.length} in-state store-finder entries`);
  console.log(`  ${inState.length - stores.length} already covered by city files (deduped)`);
  console.log(`  ${stores.length} written to data/${supplementBase}.json (${gwCount} GW-owned → "none", ${stores.length - gwCount} → "unconfirmed")`);
  console.log(`  location/${stateSlug}/index.html: ${wired ? 'added supplement URL' : 'supplement URL already present'}`);
}

main();
