// ===== HOME PAGE — list all tours =====
async function loadTours() {
  const grid = document.getElementById('tours-grid');
  if (!grid) return;

  grid.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;

  try {
    const res = await api.getTours();
    if (!res.success || res.data.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="icon">🌍</div>
          <p>No tours available yet.</p>
          <button class="btn btn-primary" onclick="seedAndReload()">Load Sample Tours</button>
        </div>`;
      return;
    }
    grid.innerHTML = res.data.map(tourCard).join('');
  } catch {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="icon">⚠️</div><p>Could not connect to server. Make sure the backend is running on port 3000.</p></div>`;
  }
}

async function seedAndReload() {
  try {
    await api.seedTours();
    loadTours();
  } catch {
    alert('Failed to seed tours. Check backend connection.');
  }
}

function tourCard(tour) {
  return `
    <div class="tour-card">
      <div class="tour-card-img">
        <img src="${tour.image}" alt="${tour.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'">
        <span class="price-tag">$${tour.price.toLocaleString()}</span>
        <span class="duration-tag">⏱ ${tour.duration || '3 Days'}</span>
      </div>
      <div class="tour-card-body">
        <h3>${tour.title}</h3>
        <div class="tour-meta">
          <span>📍 ${tour.location}</span>
          <span>👥 Max ${tour.maxGroupSize || 10}</span>
        </div>
        <p class="tour-description">${tour.description}</p>
      </div>
      <div class="tour-card-footer">
        <div class="tour-price">$${tour.price.toLocaleString()} <span>/ person</span></div>
        <div style="display:flex;gap:.5rem">
          <a href="tour-detail.html?id=${tour._id}" class="btn-outline btn-sm">Details</a>
          <a href="booking.html?id=${tour._id}&title=${encodeURIComponent(tour.title)}&price=${tour.price}" class="btn btn-primary btn-sm">Book Now</a>
        </div>
      </div>
    </div>`;
}

// ===== NAV TOGGLE =====
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
  // Mark active link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  updateNavAuth();
  loadTours();
});
