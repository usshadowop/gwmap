#!/usr/bin/env node
/**
 * Validates the store data files under data/ so a malformed or incomplete
 * entry can't reach the live site. Run locally with `node scripts/validate-stores.js`
 * or in CI via .github/workflows/validate.yml. Exits non-zero on any problem.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const VALID_CATEGORIES = new Set(['15', '10', 'loyalty', 'none', 'unconfirmed']);
const REQUIRED_STRINGS = ['id', 'name'];
const BOOLEAN_FIELDS = ['newReleases', 'preorders'];

function validateFile(file) {
  const errors = [];
  const raw = fs.readFileSync(file, 'utf8');

  let stores;
  try {
    stores = JSON.parse(raw);
  } catch (err) {
    return [`${path.basename(file)}: invalid JSON — ${err.message}`];
  }

  if (!Array.isArray(stores)) {
    return [`${path.basename(file)}: top-level value must be an array`];
  }

  const seenIds = new Set();
  stores.forEach((store, i) => {
    const where = `${path.basename(file)}[${i}]${store && store.id ? ` (${store.id})` : ''}`;
    if (store === null || typeof store !== 'object' || Array.isArray(store)) {
      errors.push(`${where}: entry must be an object`);
      return;
    }
    for (const key of REQUIRED_STRINGS) {
      if (typeof store[key] !== 'string' || store[key].trim() === '') {
        errors.push(`${where}: "${key}" is required and must be a non-empty string`);
      }
    }
    if (typeof store.id === 'string') {
      if (seenIds.has(store.id)) errors.push(`${where}: duplicate id "${store.id}"`);
      seenIds.add(store.id);
      if (!/^[a-z0-9-]+$/.test(store.id)) {
        errors.push(`${where}: id "${store.id}" must be lowercase kebab-case (a-z, 0-9, -)`);
      }
    }
    if (!VALID_CATEGORIES.has(store.category)) {
      errors.push(`${where}: category "${store.category}" not in {${[...VALID_CATEGORIES].join(', ')}}`);
    }
    for (const key of ['lat', 'lng']) {
      if (!(store[key] === null || typeof store[key] === 'number')) {
        errors.push(`${where}: "${key}" must be a number or null`);
      }
    }
    for (const key of BOOLEAN_FIELDS) {
      if (key in store && typeof store[key] !== 'boolean') {
        errors.push(`${where}: "${key}" must be a boolean`);
      }
    }
    if ('gameSystems' in store && !Array.isArray(store.gameSystems)) {
      errors.push(`${where}: "gameSystems" must be an array`);
    }
  });

  return errors;
}

function main() {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(DATA_DIR, f));

  if (files.length === 0) {
    console.error('No data/*.json files found to validate.');
    process.exit(1);
  }

  const allErrors = files.flatMap(validateFile);

  if (allErrors.length) {
    console.error('Store data validation FAILED:\n');
    allErrors.forEach(e => console.error(`  - ${e}`));
    console.error(`\n${allErrors.length} problem(s) found.`);
    process.exit(1);
  }

  console.log(`Store data OK — validated ${files.length} file(s).`);
}

main();
