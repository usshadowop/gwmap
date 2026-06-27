/**
 * gwmap — Google Form → twincities.json sync (PR-based, with email approval).
 *
 * Flow:
 *   1. A store owner submits the "Verify Your Store Listing" Google Form.
 *   2. onFormSubmit builds a single store entry from the responses.
 *   3. The change is written to a NEW BRANCH and a Pull Request is opened
 *      (never committed straight to main).
 *   4. You get an email linking to the PR (with an optional one-click
 *      "approve & merge" button that hits doGet).
 *   5. Merging the PR pushes to main, which triggers the existing
 *      GitHub Pages deploy workflow → the store goes live.
 *
 * Setup:
 *   - Project Settings → Script Properties: add GITHUB_TOKEN (a fine-grained
 *     PAT scoped to this repo with Contents: R/W and Pull requests: R/W).
 *     NEVER hardcode the token in this file.
 *   - Deploy → New deployment → Web app (execute as you, access = anyone) and
 *     paste the resulting /exec URL into WEB_APP_URL below (only needed for the
 *     optional one-click merge button).
 *   - Triggers → add an "On form submit" trigger for onFormSubmit.
 */

// ====== CONFIGURATION ======
const REPO_OWNER = 'usshadowop';
const REPO_NAME = 'gwmap';
// Region files live at data/<region>.json. A submission is routed to whichever
// region file already contains the store (stores are pre-seeded into their city
// file during the discovery phase, before outreach). A submission that matches
// no existing store falls back to DEFAULT_FILE_PATH and is flagged for triage.
const DATA_DIR = 'data';
const DEFAULT_FILE_PATH = 'data/twincities.json';
const MAIN_BRANCH = 'main';
const MY_EMAIL = 'us.shadow.op@gmail.com';
// Optional: paste your Web App /exec URL to enable the one-click merge button.
const WEB_APP_URL = '';
// ===========================

function githubToken_() {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN script property. Add it in Project Settings → Script Properties.");
  }
  return token;
}

/** Thin GitHub REST helper. Returns { code, text, json }. */
function gh_(method, apiPath, payload) {
  const options = {
    method: method,
    headers: {
      'Authorization': 'token ' + githubToken_(),
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    muteHttpExceptions: true
  };
  if (payload) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(payload);
  }
  const resp = UrlFetchApp.fetch('https://api.github.com' + apiPath, options);
  const code = resp.getResponseCode();
  const text = resp.getContentText();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* non-JSON response */ }
  return { code: code, text: text, json: json };
}

// ---------- form-response helpers ----------

/** Normalize a question title / key for tolerant matching. */
function normTitle_(s) {
  return String(s).toLowerCase().trim().replace(/\s+/g, ' ').replace(/[?:]+$/, '').trim();
}

/** Build a { normalizedTitle: answerString } map from the submission. */
function collectResponses_(formResponse) {
  const map = {};
  formResponse.getItemResponses().forEach(function (ir) {
    const title = normTitle_(ir.getItem().getTitle());
    let val = ir.getResponse();
    if (Array.isArray(val)) {
      val = val.join(', ').trim();
    } else if (val) {
      val = String(val).trim();
    } else {
      val = '';
    }
    map[title] = val;
  });
  return map;
}

function makeGetters_(map) {
  const get = function (title) {
    const k = normTitle_(title);
    return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : '';
  };
  // Return the first non-empty answer among several possible titles (branching form).
  const getAny = function (titles) {
    for (let i = 0; i < titles.length; i++) {
      const v = get(titles[i]);
      if (v) return v;
    }
    return '';
  };
  // Return the first answer whose (normalized) question title CONTAINS one of
  // the given substrings — tolerant of trailing parentheticals / minor wording.
  const getMatch = function (substrings) {
    const keys = Object.keys(map);
    for (let i = 0; i < substrings.length; i++) {
      const needle = normTitle_(substrings[i]);
      for (let j = 0; j < keys.length; j++) {
        if (keys[j].indexOf(needle) !== -1) return map[keys[j]];
      }
    }
    return '';
  };
  return { get: get, getAny: getAny, getMatch: getMatch };
}

function isYes_(v) { return String(v).trim().toLowerCase() === 'yes'; }

function slugify_(name) {
  return String(name).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function toGameSystems_(v) {
  if (!v) return [];
  return String(v).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

/**
 * Derive the map category from the Q5 answer and the % value.
 * Returns { category, snappedFrom } where snappedFrom is the original
 * percentage when an off-grid value (not 15 or 10) was snapped to the
 * nearest tier — null otherwise. The real percentage is still kept in the
 * discount text; only the pin color/category snaps.
 */
function deriveCategory_(q5, pctNum) {
  const a = String(q5).toLowerCase();
  if (a.indexOf('loyalty') !== -1) return { category: 'loyalty', snappedFrom: null };
  if (a === 'no' || a.indexOf('no discount') !== -1) return { category: 'none', snappedFrom: null };
  if (a.indexOf('yes') !== -1) {
    if (pctNum === 15 || pctNum === 10) return { category: String(pctNum), snappedFrom: null };
    if (pctNum != null) {
      // Snap to the nearer of the two confirmed tiers (midpoint 12.5).
      const snapped = pctNum >= 12.5 ? '15' : '10';
      return { category: snapped, snappedFrom: pctNum };
    }
    return { category: 'unconfirmed', snappedFrom: null }; // "yes" but no % given
  }
  // "Other" / blank → needs human classification.
  return { category: 'unconfirmed', snappedFrom: null };
}

// ---------- region routing ----------

/** Strip "data/" and ".json" → region slug, for human-readable messages. */
function regionFromPath_(p) {
  return String(p).replace(/^data\//, '').replace(/\.json$/, '');
}

/**
 * Load every region file under data/ as { path, sha, stores }. One request to
 * list the directory plus one per file. Used to route a submission to the file
 * that already contains the store (no region question on the form needed).
 */
function loadAllRegionFiles_() {
  const listRes = gh_('GET', '/repos/' + REPO_OWNER + '/' + REPO_NAME +
    '/contents/' + DATA_DIR + '?ref=' + MAIN_BRANCH);
  if (listRes.code !== 200 || !Array.isArray(listRes.json)) {
    throw new Error('Failed to list ' + DATA_DIR + ': ' + listRes.code + ' ' + listRes.text);
  }
  const files = [];
  listRes.json.forEach(function (item) {
    if (item.type === 'file' && /\.json$/.test(item.name)) {
      const r = gh_('GET', '/repos/' + REPO_OWNER + '/' + REPO_NAME +
        '/contents/' + item.path + '?ref=' + MAIN_BRANCH);
      if (r.code !== 200) {
        throw new Error('Failed to fetch ' + item.path + ': ' + r.code + ' ' + r.text);
      }
      const content = Utilities.newBlob(
        Utilities.base64Decode(r.json.content.replace(/\s/g, ''))
      ).getDataAsString();
      files.push({ path: item.path, sha: r.json.sha, stores: JSON.parse(content) });
    }
  });
  return files;
}

// ---------- main entry point ----------

function onFormSubmit(e) {
  if (!e || !e.response) {
    console.error("No form response on event. Are you running from the editor instead of submitting the form?");
    return;
  }

  const map = collectResponses_(e.response);
  const g = makeGetters_(map);

  const rawName = g.get('Store name');
  if (!rawName) {
    console.warn("No 'Store name' answer — aborting.");
    return;
  }

  // Address and Google Maps link are two SEPARATE questions. Substring matching
  // tolerates the Maps-link question's trailing parenthetical / minor wording.
  const address = g.getMatch(['store street address', 'store address']);
  const mapsUrl = g.getMatch(['google maps link', 'maps link']);

  const q5 = g.get('Do you offer any innate persistent discounts on all Games Workshop models?');
  const pctRaw = g.get('What % discount?');
  const pctMatch = String(pctRaw).match(/\d+(\.\d+)?/);
  const pctNum = pctMatch ? parseFloat(pctMatch[0]) : null;
  const cat = deriveCategory_(q5, pctNum);

  const exclusions = g.get('Are any specific Warhammer models or categories of models excluded from this discount?');
  const loyaltyDetails = g.get('How does your store loyalty program work?');
  const otherDiscount = g.get('Explain how your discounts work on Games Workshop Models');

  let discount;
  if (cat.category === 'loyalty') {
    discount = loyaltyDetails || 'Discount with store loyalty program';
  } else if (cat.category === 'none') {
    discount = 'No discount on Games Workshop models';
  } else if ((cat.category === '15' || cat.category === '10') && pctNum != null) {
    discount = pctNum + '% off Games Workshop models' + (exclusions ? ' (' + exclusions + ')' : '');
  } else if (otherDiscount) {
    discount = otherDiscount;
  } else {
    discount = 'Discount status unknown — call store to confirm their Games Workshop discount policy.';
  }

  const entry = {
    id: slugify_(rawName),
    name: rawName,
    address: address,
    lat: null,
    lng: null,
    category: cat.category,
    discount: discount,
    discountExclusions: exclusions,
    discountDetails: g.get('Additional discount details'),
    loyaltyDetails: loyaltyDetails,
    newReleases: isYes_(g.getAny([
      'Does this discount apply to new Warhammer releases?',
      'Does the loyalty discount apply to new Warhammer releases?'
    ])),
    preorders: isYes_(g.getAny([
      'Does this discount apply to Warhammer pre-orders?',
      'Does the loyalty discount apply to Warhammer pre-orders?'
    ])),
    preorderUrl: '',
    preorderLinkText: g.get('Describe how someone puts in a pre-order at your shop:'),
    mapsUrl: mapsUrl,
    website: '',
    phone: '',
    affiliation: g.get('What is your affiliation with this store?'),
    note: '',
    gameSystems: toGameSystems_(g.get('Which Warhammer products do you carry?')),
    stockLevel: g.get('What is your approximate # of Warhammer items in stock?'),
    discord: g.get('Discord Server link or details on how to join:'),
    facebook: g.get('Facebook Link'),
    instagram: g.get('Instagram Link'),
    twitter: g.get('X / Twitter Link'),
    otherSocials: g.get('Other social medias'),
    playSpaceTables: g.get('Do you have tables available for Warhammer games?'),
    playSpaceCost: g.get('Are these spaces available for free or does it cost to use them?'),
    playSpacePrice: g.get('Price if there is a cost?'),
    playSpaceRestrictions: g.get('Restrictions if any?'),
    playSpaceReserve: g.get('How does someone go about reserving or requesting to use play space?')
  };

  // --- route to the region file that already holds this store ---
  const regionFiles = loadAllRegionFiles_();
  let target = null;
  let idx = -1;
  for (let f = 0; f < regionFiles.length; f++) {
    let i = regionFiles[f].stores.findIndex(function (s) { return s.id === entry.id; });
    if (i === -1) {
      i = regionFiles[f].stores.findIndex(function (s) {
        return String(s.name).toLowerCase() === entry.name.toLowerCase();
      });
    }
    if (i !== -1) { target = regionFiles[f]; idx = i; break; }
  }

  const isUpdate = target !== null;
  let needsTriage = false;
  if (isUpdate) {
    const existing = target.stores[idx];
    entry.id = existing.id; // keep the established id
    // Preserve fields the form never collects so an update can't wipe them
    // (most importantly lat/lng — losing those drops the store's map pin).
    ['lat', 'lng', 'website', 'phone', 'preorderUrl'].forEach(function (k) {
      entry[k] = existing[k];
    });
    // Preserve a human-written note, but when an owner verifies a previously
    // unconfirmed store, the auto-generated "found on the Store Finder / not yet
    // verified" seed note is no longer true — replace it with a dated
    // verification note instead of carrying the stale text forward.
    var seedNote = /^New listing — found on the official Warhammer Store Finder/.test(existing.note || '');
    if (existing.category === 'unconfirmed' && seedNote) {
      entry.note = 'Verified by store via form on ' + new Date().toISOString().slice(0, 10);
    } else {
      entry.note = existing.note;
    }
    // mapsUrl IS collected now, but the question is OPTIONAL — only overwrite
    // when the submission actually provides a link, so a blank answer can't
    // wipe a previously verified pin URL.
    if (!entry.mapsUrl) entry.mapsUrl = existing.mapsUrl;
    target.stores[idx] = Object.assign({}, existing, entry);
  } else {
    // No existing store matched — this submission didn't come from our seeded
    // outreach. Land it in the default region and flag for triage so a human
    // can confirm it's real and move it to the right city.
    needsTriage = true;
    target = regionFiles.find(function (f) { return f.path === DEFAULT_FILE_PATH; });
    if (!target) {
      console.error("Default region file " + DEFAULT_FILE_PATH + " not found; cannot route submission.");
      return;
    }
    target.stores.push(entry);
    idx = target.stores.length - 1;
  }

  const region = regionFromPath_(target.path);
  const updatedContent = JSON.stringify(target.stores, null, 2) + '\n';

  // --- create a branch off main ---
  const refRes = gh_('GET', '/repos/' + REPO_OWNER + '/' + REPO_NAME +
    '/git/ref/heads/' + MAIN_BRANCH);
  if (refRes.code !== 200) {
    console.error("Failed to read main ref: " + refRes.code + " " + refRes.text);
    return;
  }
  const baseSha = refRes.json.object.sha;
  const branch = 'form/' + entry.id + '-' + Date.now();

  const branchRes = gh_('POST', '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/git/refs', {
    ref: 'refs/heads/' + branch,
    sha: baseSha
  });
  if (branchRes.code !== 201) {
    console.error("Failed to create branch: " + branchRes.code + " " + branchRes.text);
    return;
  }

  // --- commit the change onto the branch (note: no [skip ci]) ---
  const putRes = gh_('PUT', '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + target.path, {
    message: (isUpdate ? 'Update' : 'Add') + ' store: ' + entry.name + ' in ' + region + ' (form submission)',
    content: Utilities.base64Encode(updatedContent, Utilities.Charset.UTF_8),
    sha: target.sha,
    branch: branch
  });
  if (putRes.code !== 200 && putRes.code !== 201) {
    console.error("Failed to write file on branch: " + putRes.code + " " + putRes.text);
    return;
  }

  // --- open the PR ---
  const prTitle = (needsTriage ? '[triage] ' : '') +
    (isUpdate ? 'Update' : 'Add') + ' store: ' + entry.name + ' (' + region + ')';
  const prRes = gh_('POST', '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/pulls', {
    title: prTitle,
    head: branch,
    base: MAIN_BRANCH,
    body: buildPrBody_(entry, isUpdate, cat.snappedFrom, region, needsTriage)
  });
  if (prRes.code !== 201) {
    console.error("Failed to open PR: " + prRes.code + " " + prRes.text);
    return;
  }
  const pr = prRes.json;
  console.log("Opened PR #" + pr.number + ": " + pr.html_url);

  sendApprovalEmail_(entry, isUpdate, cat.snappedFrom, pr, region, needsTriage);
}

// ---------- email + PR body ----------

function buildPrBody_(entry, isUpdate, snappedFrom, region, needsTriage) {
  let body = (isUpdate ? 'Updating' : 'Adding') + ' **' + entry.name + '** in `data/' + region +
    '.json` from a form submission.\n\n';
  if (needsTriage) {
    body += '> ⚠️ **Triage needed:** no existing store matched this submission, so it was added to ' +
      'the default region (`' + region + '`). Confirm it\'s real and move it to the correct city ' +
      'file before merging if needed.\n\n';
  }
  if (snappedFrom != null) {
    body += '> ℹ️ Discount of ' + snappedFrom + '% was snapped to the `' + entry.category +
      '` tier for the pin color. The exact percentage is preserved in the discount text.\n\n';
  }
  body += '```json\n' + JSON.stringify(entry, null, 2) + '\n```\n';
  return body;
}

function sendApprovalEmail_(entry, isUpdate, snappedFrom, pr, region, needsTriage) {
  const subject = (needsTriage ? '🔎 gwmap: Triage — ' :
    (isUpdate ? '⚠️ gwmap: Review edits for ' : '✨ gwmap: New store — ')) +
    entry.name + ' (' + region + ')';
  let html = '<div style="font-family:Arial,sans-serif;max-width:640px;color:#333;">';
  html += '<h2 style="color:' + (isUpdate ? '#d97706' : '#16a34a') + ';">' +
    (isUpdate ? 'Proposed edits to an existing store' : 'New store request') +
    ' <span style="font-size:14px;color:#888;">(' + region + ')</span></h2>';
  if (needsTriage) {
    html += '<p style="background:#fef3c7;border-left:4px solid #d97706;padding:8px 12px;">' +
      'No existing store matched this submission, so it was added to the default region <b>' +
      region + '</b>. Move it to the correct city file before merging if needed.</p>';
  }
  if (snappedFrom != null) {
    html += '<p style="background:#dbeafe;border-left:4px solid #2563eb;padding:8px 12px;">' +
      'Discount of <b>' + snappedFrom + '%</b> was snapped to the <b>' + entry.category +
      '</b> tier for the pin color. The exact percentage is kept in the discount text.</p>';
  }
  Object.keys(entry).forEach(function (k) {
    const v = Array.isArray(entry[k]) ? entry[k].join(', ') : entry[k];
    if (v !== '' && v !== false && v !== null) {
      html += '<p style="margin:4px 0;"><strong>' + k + ':</strong> ' + v + '</p>';
    }
  });
  html += '<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto;">' +
    '<tr><td align="center" bgcolor="#2563eb" style="border-radius:6px;">' +
    '<a href="' + pr.html_url + '" style="display:inline-block;padding:12px 28px;font-family:Arial,sans-serif;' +
    'font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">' +
    'Review PR #' + pr.number + ' on GitHub</a></td></tr></table>';
  if (WEB_APP_URL) {
    const mergeLink = WEB_APP_URL + '?action=merge&pr=' + pr.number;
    html += '<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:8px auto 24px;">' +
      '<tr><td align="center" bgcolor="#16a34a" style="border-radius:6px;">' +
      '<a href="' + mergeLink + '" style="display:inline-block;padding:10px 24px;font-family:Arial,sans-serif;' +
      'font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">' +
      'Approve &amp; merge</a></td></tr></table>' +
      '<p style="font-size:12px;color:#888;text-align:center;">Merging runs the deploy and ' +
      'takes the change live.</p>';
  }
  html += '</div>';

  try {
    MailApp.sendEmail({ to: MY_EMAIL, subject: subject, htmlBody: html });
    console.log("Approval email sent to " + MY_EMAIL);
  } catch (err) {
    console.error("Email send failed: " + err);
  }
}

// ---------- optional one-click merge web app ----------

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';
  const prNumber = e && e.parameter ? e.parameter.pr : '';

  if (action !== 'merge' || !prNumber) {
    return HtmlService.createHtmlOutput('<h2>Invalid request.</h2>');
  }

  const res = gh_('PUT', '/repos/' + REPO_OWNER + '/' + REPO_NAME + '/pulls/' + prNumber + '/merge', {
    merge_method: 'squash'
  });

  if (res.code === 200) {
    return HtmlService.createHtmlOutput(
      "<div style='font-family:sans-serif;text-align:center;margin-top:48px;color:#16a34a;'>" +
      "<h2>✅ Merged</h2><p>PR #" + prNumber + " merged to main. The deploy will run and the " +
      "store will go live shortly.</p></div>");
  }
  return HtmlService.createHtmlOutput(
    "<div style='font-family:sans-serif;text-align:center;margin-top:48px;color:#dc2626;'>" +
    "<h2>Merge failed</h2><pre style='text-align:left;'>" + res.text + "</pre></div>");
}
