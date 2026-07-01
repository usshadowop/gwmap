const IMAGE_BASE_URL = 'https://img.warhammerstores.com';

const CATEGORIES = [
  { key: '15', color: '#2ecc71', label: '15% discount' },
  { key: '10', color: '#3498db', label: '10% discount' },
  { key: 'loyalty', color: '#f1c40f', label: 'Discount with store loyalty program' },
  { key: 'none', color: '#e74c3c', label: 'No discount' },
  { key: 'unconfirmed', color: '#9b59b6', label: 'Unconfirmed stores' }
];
const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));
const CATEGORY_Z_INDEX_OFFSET = Object.fromEntries(
  CATEGORIES.map((c, i) => [c.key, (CATEGORIES.length - i) * 10000])
);

// --- Distance-to-stores state ---
let allLoadedStores = [];   // populated after loadStores() resolves coordinates
let userLocation = null;    // { lat, lng } or null
let userMarker = null;      // Leaflet marker or null

// Haversine formula — returns distance in miles between two lat/lng points.
function haversineMiles(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(miles) {
  return miles < 10 ? `~${miles.toFixed(1)} mi` : `~${Math.round(miles)} mi`;
}

// Stock-photo filenames lead with the capture date as YYYYMMDD (e.g.
// "20260629_124449.jpg"). Pull it out and format it for the lightbox caption so
// viewers can gauge how fresh a photo is. Returns '' if no date is parseable.
const STOCK_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function stockPhotoDate(key) {
  const file = String(key || '').split('/').pop() || '';
  const m = file.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!m) return '';
  const month = STOCK_MONTHS[parseInt(m[2], 10) - 1];
  if (!month) return '';
  return `${month} ${parseInt(m[3], 10)}, ${m[1]}`;
}

// Single full-screen lightbox shared by every "Stock photos" link. Built in JS
// (like the mail FAB) so it works on every region page without editing each
// HTML shell. A link carries its image keys in data-images; clicking opens the
// overlay and pages through them. Mirrors the .modal-overlay [hidden] idiom.
const stockLightbox = (() => {
  let images = [];
  let index = 0;
  let lastTrigger = null;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Store stock photos');
  overlay.innerHTML = `
    <div class="lightbox-date"></div>
    <button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>
    <button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo">&#8249;</button>
    <img class="lightbox-img" alt="Store stock photo">
    <button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo">&#8250;</button>
    <div class="lightbox-counter"></div>`;

  const imgEl = overlay.querySelector('.lightbox-img');
  const counterEl = overlay.querySelector('.lightbox-counter');
  const dateEl = overlay.querySelector('.lightbox-date');
  const prevBtn = overlay.querySelector('.lightbox-prev');
  const nextBtn = overlay.querySelector('.lightbox-next');
  const closeBtn = overlay.querySelector('.lightbox-close');

  function render() {
    imgEl.src = `${IMAGE_BASE_URL}/${images[index]}`;
    counterEl.textContent = `${index + 1} / ${images.length}`;
    const date = stockPhotoDate(images[index]);
    dateEl.textContent = date ? `Photo taken on: ${date}` : '';
    dateEl.hidden = !date;
    const multi = images.length > 1;
    prevBtn.hidden = !multi;
    nextBtn.hidden = !multi;
    counterEl.hidden = !multi;
  }
  function step(delta) {
    index = (index + delta + images.length) % images.length;
    render();
  }
  function open(imgs, trigger) {
    if (!imgs || !imgs.length) return;
    images = imgs;
    index = 0;
    lastTrigger = trigger || null;
    overlay.hidden = false;
    render();
    closeBtn.focus();
  }
  function close() {
    overlay.hidden = true;
    imgEl.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (overlay.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Body may not exist yet if this script is in <head>; append on DOM ready.
  if (document.body) document.body.appendChild(overlay);
  else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay));

  return { open };
})();

// Delegated so dynamically-rendered popup/list links work without per-element wiring.
document.addEventListener('click', e => {
  const trigger = e.target.closest('.stock-photos-link');
  if (!trigger) return;
  e.preventDefault();
  let imgs;
  try { imgs = JSON.parse(trigger.getAttribute('data-images')); }
  catch { return; }
  stockLightbox.open(imgs, trigger);
});

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = CATEGORIES.map(c => `
    <span class="legend-item">
      <span class="legend-dot" style="background:${c.color}"></span>${c.label}
      ${c.key === 'unconfirmed' ? '<button type="button" id="toggle-unconfirmed" class="legend-toggle-btn" aria-pressed="false">Show unconfirmed stores</button>' : ''}
    </span>
  `).join('');
}

function createPinIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 9.8 14 26 14 26s14-16.2 14-26C28 6.3 21.7 0 14 0z" fill="${color}" stroke="#1a1a1a" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5.5" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: 'pin-icon',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -38]
  });
}

function buildPopupHtml(store, { showName = true } = {}) {
  // The "Discount applies to …" tags describe a discount, so only show them when
  // the store actually has one. A store that merely takes pre-orders (no discount)
  // still gets the pre-order box below, but not the discount tag.
  const hasDiscount = store.category === '15' || store.category === '10' || store.category === 'loyalty';
  const tags = [];
  if (store.newReleases && hasDiscount) {
    tags.push('<li>✓ Discount applies to new releases</li>');
  }
  if (store.preorders && hasDiscount) {
    tags.push('<li>✓ Discount applies to pre-orders</li>');
  }

  // Show the pre-order box whenever the store takes pre-orders or has instructions,
  // independent of whether the discount applies to pre-orders.
  const hasPreorderInfo = store.preorders || store.preorderUrl || store.preorderLinkText;
  const preorderBox = hasPreorderInfo
    ? `<div class="popup-preorder-box"><div class="popup-preorder-title">Pre-order instructions</div>${
        store.preorderUrl
          ? `<a href="${store.preorderUrl}" target="_blank" rel="noopener">${store.preorderLinkText || 'Pre-order instructions'}</a>`
          : (store.preorderLinkText || 'Pre-order instructions available in store')
      }</div>`
    : '';

  const mapsUrl = store.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`;

  const stockPhotosLink = store.stockImages && store.stockImages.length
    ? `<p><a href="#" class="stock-photos-link" data-images='${JSON.stringify(store.stockImages)}'>Stock photos${store.stockImages.length > 1 ? ` (${store.stockImages.length})` : ''}</a></p>`
    : '';

  // Distance from user location (if set and store has resolved coords).
  const distanceHtml = (userLocation && store._resolvedLat != null && store._resolvedLng != null)
    ? `<p class="popup-distance">📍 ${formatDistance(haversineMiles(userLocation.lat, userLocation.lng, store._resolvedLat, store._resolvedLng))} from you</p>`
    : '';

  return `
    <div class="popup-content">
      ${showName ? `<h3>${store.name}</h3>` : ''}
      <p>${store.address}</p>
      ${distanceHtml}
      <p><strong>${store.discount}</strong></p>
      ${tags.length ? `<ul class="popup-tags">${tags.join('')}</ul>` : ''}
      ${store.website ? `<p><a href="${store.website}" target="_blank" rel="noopener">Website</a></p>` : ''}
      ${store.phone ? `<p>${store.phone}</p>` : ''}
      ${stockPhotosLink}
      ${preorderBox}
      <p><a href="${mapsUrl}" target="_blank" rel="noopener">View on Google Maps</a></p>
      ${store.note ? `<p class="popup-note">${store.note}</p>` : ''}
    </div>
  `;
}

function groupStoresByCategory(stores) {
  return CATEGORIES
    .map(cat => ({
      ...cat,
      stores: stores
        .filter(store => store.category === cat.key)
        .sort((a, b) => a.name.localeCompare(b.name))
    }))
    .filter(group => group.stores.length > 0);
}

function renderStoreList(stores) {
  const list = document.getElementById('store-list');
  if (!list) {
    return;
  }

  // When user location is set, compute distances and sort by distance within
  // each category group. Otherwise, keep alphabetical order.
  const storesWithDist = stores.map(store => {
    if (userLocation && store._resolvedLat != null && store._resolvedLng != null) {
      return { ...store, _distance: haversineMiles(userLocation.lat, userLocation.lng, store._resolvedLat, store._resolvedLng) };
    }
    return { ...store, _distance: null };
  });

  const groups = CATEGORIES
    .map(cat => ({
      ...cat,
      stores: storesWithDist
        .filter(store => store.category === cat.key)
        .sort((a, b) => {
          if (a._distance != null && b._distance != null) return a._distance - b._distance;
          if (a._distance != null) return -1;
          if (b._distance != null) return 1;
          return a.name.localeCompare(b.name);
        })
    }))
    .filter(group => group.stores.length > 0);

  list.innerHTML = groups.map(group => `
    <li class="category-group">
      <details>
        <summary>
          <span class="store-entry-dot" style="background:${group.color}"></span>
          <span class="store-entry-name">${group.label} (${group.stores.length})</span>
        </summary>
        <ul class="store-list">
          ${group.stores.map(store => `
            <li class="store-entry">
              <details>
                <summary>
                  <span class="store-entry-name">${store.name}</span>
                  ${store._distance != null ? `<span class="distance-badge">${formatDistance(store._distance)}</span>` : ''}
                </summary>
                ${buildPopupHtml(store, { showName: false })}
              </details>
            </li>
          `).join('')}
        </ul>
      </details>
    </li>
  `).join('');
}

const GEOCODE_CACHE_KEY = 'gwmap-geocode-cache';

function loadGeocodeCache() {
  try {
    return JSON.parse(localStorage.getItem(GEOCODE_CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveGeocodeCache(cache) {
  localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
}

async function geocode(address, cache) {
  if (cache[address]) {
    return cache[address];
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const results = await response.json();
  if (!results.length) {
    throw new Error(`No geocoding result for "${address}"`);
  }
  const coords = { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
  cache[address] = coords;
  saveGeocodeCache(cache);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return coords;
}

async function loadStores(map, oms, unconfirmedLayer) {
  const urls = window.GWMAP_DATA_URLS || [window.GWMAP_DATA_URL || 'data/stores.json'];
  const responses = await Promise.all(urls.map(url => fetch(url)));
  const stores = (await Promise.all(responses.map(r => r.json()))).flat();
  const cache = loadGeocodeCache();
  const bounds = [];
  const storeMarkers = [];  // track markers for popup refresh on distance search

  renderStoreList(stores);

  for (const store of stores) {
    try {
      const { lat, lng } = (store.lat != null && store.lng != null)
        ? { lat: store.lat, lng: store.lng }
        : await geocode(store.address, cache);

      // Save resolved coordinates on the store object for distance calculations.
      store._resolvedLat = lat;
      store._resolvedLng = lng;

      const color = CATEGORY_COLORS[store.category] || CATEGORY_COLORS.none;
      const zIndexOffset = CATEGORY_Z_INDEX_OFFSET[store.category] ?? 0;
      const marker = L.marker([lat, lng], { icon: createPinIcon(color), zIndexOffset });
      const popupMaxWidth = Math.min(Math.max(window.innerWidth * 0.6, 220), 320);
      marker.bindPopup(buildPopupHtml(store), { maxWidth: popupMaxWidth, autoPanPadding: [20, 20] });
      storeMarkers.push({ store, marker });
      if (oms) {
        marker.off('click');
        oms.addMarker(marker);
      }
      if (store.category === 'unconfirmed' && unconfirmedLayer) {
        marker.addTo(unconfirmedLayer);
      } else {
        marker.addTo(map);
        bounds.push([lat, lng]);
      }
    } catch (err) {
      console.error(`Failed to place marker for ${store.name}:`, err);
    }
  }

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }

  // Save loaded stores globally so the distance search can re-render the list.
  allLoadedStores = stores;

  // Function to refresh all popup content (called when user location changes).
  function refreshPopups() {
    for (const { store, marker } of storeMarkers) {
      const popupMaxWidth = Math.min(Math.max(window.innerWidth * 0.6, 220), 320);
      marker.setPopupContent(buildPopupHtml(store));
    }
  }

  // Wire up the distance search bar.
  initDistanceSearch(map, refreshPopups);
}

// --- Distance search bar (injected into the header at runtime) ---

function injectDistanceSearchBar() {
  const header = document.querySelector('header');
  if (!header) return;
  const bar = document.createElement('div');
  bar.className = 'distance-search';
  bar.innerHTML = `
    <input type="text" id="distance-address" placeholder="Enter your address to see distances…" aria-label="Your address">
    <button type="button" id="distance-search-btn">🔍 Search</button>
    <button type="button" id="distance-clear-btn" class="distance-clear-btn" hidden>✕ Clear</button>
  `;
  header.appendChild(bar);
}

function createUserIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#3498db" stroke="#fff" stroke-width="3"/>
      <circle cx="16" cy="16" r="5" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: 'pin-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function initDistanceSearch(map, refreshPopups) {
  const input = document.getElementById('distance-address');
  const searchBtn = document.getElementById('distance-search-btn');
  const clearBtn = document.getElementById('distance-clear-btn');
  if (!input || !searchBtn || !clearBtn) return;

  async function doSearch() {
    const address = input.value.trim();
    if (!address) return;

    searchBtn.textContent = '…';
    searchBtn.disabled = true;

    try {
      const cache = loadGeocodeCache();
      const coords = await geocode(address, cache);
      userLocation = coords;

      // Place or move the user marker.
      if (userMarker) {
        userMarker.setLatLng([coords.lat, coords.lng]);
      } else {
        userMarker = L.marker([coords.lat, coords.lng], { icon: createUserIcon(), zIndexOffset: 99999 }).addTo(map);
        userMarker.bindPopup('<div class="popup-content"><strong>Your location</strong></div>');
      }

      // Re-render the store list with distances and refresh popup content.
      renderStoreList(allLoadedStores);
      refreshPopups();

      clearBtn.hidden = false;
    } catch (err) {
      alert('Could not find that address. Please try a more specific address.');
      console.error('Distance search error:', err);
    } finally {
      searchBtn.textContent = '🔍 Search';
      searchBtn.disabled = false;
    }
  }

  searchBtn.addEventListener('click', doSearch);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch();
    }
  });

  clearBtn.addEventListener('click', () => {
    userLocation = null;
    if (userMarker) {
      map.removeLayer(userMarker);
      userMarker = null;
    }
    input.value = '';
    clearBtn.hidden = true;
    renderStoreList(allLoadedStores);
    refreshPopups();
  });
}

renderLegend();
injectDistanceSearchBar();

const map = L.map('map').setView(window.GWMAP_CENTER || [44.95, -93.15], window.GWMAP_ZOOM || 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

const oms = typeof OverlappingMarkerSpiderfier !== 'undefined'
  ? new OverlappingMarkerSpiderfier(map, { keepSpiderfied: true, nearbyDistance: 20 })
  : null;
if (oms) {
  oms.addListener('click', marker => marker.openPopup());
}

const unconfirmedLayer = L.layerGroup();

const toggleUnconfirmedBtn = document.getElementById('toggle-unconfirmed');
if (toggleUnconfirmedBtn) {
  toggleUnconfirmedBtn.addEventListener('click', () => {
    const isShown = map.hasLayer(unconfirmedLayer);
    if (isShown) {
      map.removeLayer(unconfirmedLayer);
      toggleUnconfirmedBtn.textContent = 'Show unconfirmed stores';
      toggleUnconfirmedBtn.setAttribute('aria-pressed', 'false');
    } else {
      unconfirmedLayer.addTo(map);
      toggleUnconfirmedBtn.textContent = 'Hide unconfirmed stores';
      toggleUnconfirmedBtn.setAttribute('aria-pressed', 'true');
    }
  });
}

loadStores(map, oms, unconfirmedLayer);
