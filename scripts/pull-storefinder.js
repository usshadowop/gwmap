#!/usr/bin/env node
/**
 * Refresh the local cached copy of the Games Workshop Store Finder dataset.
 *
 * The discovery process (docs/research-process/step1-store-finder.md, Phase A)
 * filters this dataset by distance for every city. Rather than hit the live
 * endpoint each time, we keep one dated snapshot under storefinder/ and re-pull
 * it about once a month — the date in the filename is the freshness signal.
 *
 * Usage:
 *   node scripts/pull-storefinder.js
 *
 * Writes storefinder/storefinder-<YYYY-MM-DD>.json and removes any older
 * snapshot, so the directory always holds exactly one current copy. The pull is
 * validated (HTTP 200 + parses as a non-empty JSON array) before it replaces the
 * old file, so a failed fetch can never clobber a good snapshot.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ENDPOINT = 'https://www.warhammer.com/api/storefinder';
const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'storefinder');
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)

function fail(message) {
  console.error('pull-storefinder: ' + message);
  process.exit(1);
}

fs.mkdirSync(CACHE_DIR, { recursive: true });

// Pull to a temp file first so a failed/partial download can't replace a good
// snapshot. -f makes curl exit non-zero on HTTP >= 400.
const tmp = path.join(CACHE_DIR, '.storefinder-download.tmp');
try {
  execFileSync('curl', ['-fsS', '-o', tmp, ENDPOINT], { stdio: ['ignore', 'ignore', 'inherit'] });
} catch (e) {
  if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  fail('download failed (curl error above). Existing snapshot left untouched.');
}

// Validate it parses as a non-empty array before trusting it.
let data;
try {
  data = JSON.parse(fs.readFileSync(tmp, 'utf8'));
} catch (e) {
  fs.unlinkSync(tmp);
  fail('downloaded file is not valid JSON. Existing snapshot left untouched.');
}
if (!Array.isArray(data) || data.length === 0) {
  fs.unlinkSync(tmp);
  fail('downloaded JSON is not a non-empty array (got ' +
    (Array.isArray(data) ? 'empty array' : typeof data) + '). Snapshot left untouched.');
}

// Remove any prior snapshot(s) so exactly one dated copy remains.
const dest = path.join(CACHE_DIR, `storefinder-${today}.json`);
for (const f of fs.readdirSync(CACHE_DIR)) {
  if (/^storefinder-\d{4}-\d{2}-\d{2}\.json$/.test(f) && path.join(CACHE_DIR, f) !== dest) {
    fs.unlinkSync(path.join(CACHE_DIR, f));
  }
}
fs.renameSync(tmp, dest);

console.log(`Saved ${data.length} stores → storefinder/storefinder-${today}.json`);
console.log('Re-run this script when the snapshot is older than ~1 month.');
