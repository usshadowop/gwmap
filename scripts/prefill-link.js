#!/usr/bin/env node
/**
 * Generate a prefilled verification-form link for a store, straight from its
 * record in data/<region>.json — so the outreach step can't drift from the
 * form's actual entry IDs.
 *
 * Usage:
 *   node scripts/prefill-link.js <region> [storeIdOrNameSubstring]
 *     <region>            a data/<region>.json basename, e.g. "twincities"
 *     storeIdOrName...    optional; omit to print a link for every store
 *
 * Only fields we actually have verified data for are prefilled (name, address,
 * Maps link, and — when known — the discount %, applies-to-new-releases /
 * pre-orders, and pre-order instructions). Everything else is left for the
 * store to fill in. The entry-ID map below mirrors docs/form/form-reference.md
 * §3 — keep the two in sync whenever the form changes.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// Live (view) base URL — docs/form/form-reference.md §1.
const BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSfzAk_VSsmppzKYyV-oZUDAzB17RT8SNli2H_zZDxv-KJRgnQ/viewform';

// Question → entry ID (subset we prefill) — docs/form/form-reference.md §3.
const ENTRY = {
  name: '1052932045',         // Store name
  address: '1138144738',      // Store street address
  mapsUrl: '1890704744',      // Google Maps link (optional)
  discountType: '1644707819', // Do you offer any innate persistent discounts...?
  percent: '1911433926',      // What's % discount?
  newReleases: '894533038',   // Applies to new Warhammer releases?
  preorders: '1656781913',    // Applies to Warhammer pre-orders?
  preorderText: '1759960920'  // Describe how someone puts in a pre-order
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

// Match Google's own prefilled-link encoding (form-reference.md §2): space→+,
// comma left literal, parens→%28/%29, apostrophe→%27.
function enc(v) {
  return encodeURIComponent(String(v))
    .replace(/%20/g, '+')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/%2C/g, ',');
}

function buildLink(store) {
  const params = ['usp=pp_url'];
  const add = function (entryId, val) {
    if (val !== undefined && val !== null && String(val).trim() !== '') {
      params.push('entry.' + entryId + '=' + enc(val));
    }
  };

  add(ENTRY.name, store.name);
  add(ENTRY.address, store.address);
  add(ENTRY.mapsUrl, store.mapsUrl);

  // Discount fields — only when we already know them (a confirmed tier).
  if (store.category === '15' || store.category === '10') {
    add(ENTRY.discountType, store.discountExclusions ? 'Yes with exceptions' : 'Yes');
    add(ENTRY.percent, store.category);
  } else if (store.category === 'loyalty') {
    add(ENTRY.discountType, 'We offer store loyalty discounts that include GW models');
  }
  if (store.newReleases === true) add(ENTRY.newReleases, 'Yes');
  if (store.preorders === true) add(ENTRY.preorders, 'Yes');
  add(ENTRY.preorderText, store.preorderLinkText);

  return BASE + '?' + params.join('&');
}

function main() {
  const [region, idOrName] = process.argv.slice(2);
  if (!region) {
    fail('Usage: node scripts/prefill-link.js <region> [storeIdOrNameSubstring]');
  }
  const dataPath = path.join(ROOT, 'data', region + '.json');
  if (!fs.existsSync(dataPath)) fail('No such region file: data/' + region + '.json');

  const stores = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  let selected = stores;
  if (idOrName) {
    const needle = idOrName.toLowerCase();
    selected = stores.filter(function (s) {
      return s.id === idOrName || String(s.name).toLowerCase().indexOf(needle) !== -1;
    });
    if (!selected.length) fail('No store matching "' + idOrName + '" in data/' + region + '.json');
  }

  selected.forEach(function (s) {
    console.log('# ' + s.name + (s.id ? '  [' + s.id + ']' : ''));
    console.log(buildLink(s));
    console.log('');
  });
}

main();
