async function loadTourDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('tour-detail');

  if (!id) {
    container.innerHTML = `<div class="alert alert-error">No tour ID provided.</div>`;
    return;
  }

  container.innerHTML = `<div class="loading"><div class="spinner"></div></div>`;

  try {
    const res = await api.getTour(id);
    if (!res.success) throw new Error(res.message);
    const t = res.data;

    container.innerHTML = `
      <div class="tour-detail-hero">
        <img src="${t.image}" alt="${t.title}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'">
      </div>
      <div class="tour-detail-grid">
        <div class="tour-detail-info">
          <h1>${t.title}</h1>
          <div class="tour-detail-meta">
            <span class="meta-badge">📍 ${t.location}</span>
            <span class="meta-badge">⏱ ${t.duration || '3 Days'}</span>
            <span class="meta-badge">👥 Max ${t.maxGroupSize || 10} people</span>
            <span class="meta-badge">💰 $${t.price.toLocaleString()} / person</span>
          </div>
          <p>${t.description}</p>
        </div>
        <div class="booking-card">
          <h3>Ready to go?</h3>
          <div class="tour-price" style="font-size:2rem;margin-bottom:1rem">$${t.price.toLocaleString()} <span style="font-size:.9rem;color:#64748b">/ person</span></div>
          <a href="booking.html?id=${t._id}&title=${encodeURIComponent(t.title)}&price=${t.price}" class="btn btn-primary btn-lg" style="width:100%;justify-content:center">
            Book Now
          </a>
          <a href="index.html" class="btn-outline" style="width:100%;justify-content:center;margin-top:.75rem;display:flex">← Back to Tours</a>
        </div>
      </div>`;
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error">Failed to load tour: ${err.message}</div>`;
  }
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadTourDetail();
});
