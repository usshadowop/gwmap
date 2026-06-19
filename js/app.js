const map = L.map('map').setView([39.5, -98.35], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

fetch('data/stores.json')
  .then(response => response.json())
  .then(stores => {
    const bounds = [];
    stores.forEach(store => {
      const marker = L.marker([store.lat, store.lng]).addTo(map);
      marker.bindPopup(`
        <div class="popup-content">
          <h3>${store.name}</h3>
          <p>${store.address}</p>
          <p><strong>${store.discount}</strong></p>
          ${store.website ? `<p><a href="${store.website}" target="_blank" rel="noopener">Website</a></p>` : ''}
          ${store.phone ? `<p>${store.phone}</p>` : ''}
        </div>
      `);
      bounds.push([store.lat, store.lng]);
    });
    if (bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
    }
  })
  .catch(err => console.error('Failed to load store data:', err));
