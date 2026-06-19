const CATEGORIES = [
  { key: '15', color: '#2ecc71', label: '15% discount' },
  { key: '10', color: '#f1c40f', label: '10% discount' },
  { key: 'none', color: '#e74c3c', label: 'No discount' },
  { key: 'loyalty', color: '#3498db', label: 'Discount with store loyalty program' }
];
const CATEGORY_COLORS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.color]));

function renderLegend() {
  const legend = document.getElementById('legend');
  legend.innerHTML = CATEGORIES.map(c => `
    <span class="legend-item">
      <span class="legend-dot" style="background:${c.color}"></span>${c.label}
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

async function loadStores(map) {
  const response = await fetch('data/stores.json');
  const stores = await response.json();
  const cache = loadGeocodeCache();
  const bounds = [];

  for (const store of stores) {
    try {
      const { lat, lng } = await geocode(store.address, cache);
      const color = CATEGORY_COLORS[store.category] || CATEGORY_COLORS.none;
      const marker = L.marker([lat, lng], { icon: createPinIcon(color) }).addTo(map);
      marker.bindPopup(`
        <div class="popup-content">
          <h3>${store.name}</h3>
          <p>${store.address}</p>
          <p><strong>${store.discount}</strong></p>
          ${store.website ? `<p><a href="${store.website}" target="_blank" rel="noopener">Website</a></p>` : ''}
          ${store.phone ? `<p>${store.phone}</p>` : ''}
        </div>
      `);
      bounds.push([lat, lng]);
    } catch (err) {
      console.error(`Failed to place marker for ${store.name}:`, err);
    }
  }

  if (bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }
}

renderLegend();

const map = L.map('map').setView([44.95, -93.15], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

loadStores(map);
