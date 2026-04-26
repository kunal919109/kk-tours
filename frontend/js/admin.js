// ===== ADMIN GUARD =====
(function () {
  const user = JSON.parse(localStorage.getItem('kk_user') || 'null');
  const token = localStorage.getItem('kk_token');
  if (!token || !user || user.role !== 'admin') {
    window.location.href = 'admin-login.html';
  }
})();

let editingTourId = null;
let allTours = [];
let allBookings = [];
let allUsers = [];

// ===== INIT =====
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));

  const user = JSON.parse(localStorage.getItem('kk_user') || 'null');
  if (user) {
    document.getElementById('admin-welcome').textContent =
      `Welcome back, ${user.name} — manage tours, bookings and users`;
  }
}

function adminLogout() {
  localStorage.removeItem('kk_token');
  localStorage.removeItem('kk_user');
  window.location.href = 'admin-login.html';
}

function refreshAll() {
  loadStats();
  loadToursTable();
  loadBookingsTable();
  loadUsersTable();
  showToast('Data refreshed!', 'success');
}

// ===== STATS =====
async function loadStats() {
  try {
    const [toursRes, bookingsRes, usersRes] = await Promise.all([
      api.getTours(),
      api.getBookings(),
      api.getUsers(),
    ]);

    document.getElementById('stat-tours').textContent =
      toursRes.success ? toursRes.count : '—';

    document.getElementById('stat-bookings').textContent =
      bookingsRes.success ? bookingsRes.count : '—';

    const revenue = bookingsRes.success
      ? bookingsRes.data.reduce((sum, b) => sum + (b.tourId?.price || 0) * (b.guests || 1), 0)
      : 0;
    document.getElementById('stat-revenue').textContent = '$' + revenue.toLocaleString();

    document.getElementById('stat-users').textContent =
      usersRes.success ? usersRes.count : '—';
  } catch { /* ignore */ }
}

// ===== TOURS TABLE =====
async function loadToursTable() {
  const tbody = document.getElementById('tours-tbody');
  tbody.innerHTML = `<tr><td colspan="7"><div class="loading"><div class="spinner"></div></div></td></tr>`;
  try {
    const res = await api.getTours();
    if (!res.success || res.data.length === 0) {
      allTours = [];
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray)">No tours yet. Add one or load sample data.</td></tr>`;
      return;
    }
    allTours = res.data;
    renderToursTable(allTours);
  } catch {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--red);padding:2rem">Failed to load tours.</td></tr>`;
  }
}

function renderToursTable(tours) {
  const tbody = document.getElementById('tours-tbody');
  if (tours.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray)">No matching tours found.</td></tr>`;
    return;
  }
  tbody.innerHTML = tours.map(t => `
    <tr>
      <td><img src="${t.image || ''}" style="width:56px;height:38px;object-fit:cover;border-radius:6px;border:1px solid var(--border)"
          onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60'"></td>
      <td><strong>${t.title}</strong></td>
      <td>${t.location}</td>
      <td><strong>$${t.price.toLocaleString()}</strong></td>
      <td>${t.duration || '—'}</td>
      <td>${t.maxGroupSize || '—'}</td>
      <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm" onclick="openEditModal('${t._id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTour('${t._id}')">🗑 Delete</button>
      </td>
    </tr>`).join('');
}

function filterTours() {
  const q = document.getElementById('tour-search').value.toLowerCase();
  const filtered = allTours.filter(t =>
    t.title.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)
  );
  renderToursTable(filtered);
}

// ===== BOOKINGS TABLE =====
async function loadBookingsTable() {
  const tbody = document.getElementById('bookings-tbody');
  tbody.innerHTML = `<tr><td colspan="7"><div class="loading"><div class="spinner"></div></div></td></tr>`;
  try {
    const res = await api.getBookings();
    if (!res.success || res.data.length === 0) {
      allBookings = [];
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray)">No bookings yet.</td></tr>`;
      return;
    }
    allBookings = res.data;
    renderBookingsTable(allBookings);
  } catch {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--red);padding:2rem">Failed to load bookings.</td></tr>`;
  }
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookings-tbody');
  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray)">No matching bookings.</td></tr>`;
    return;
  }
  tbody.innerHTML = bookings.map(b => {
    const date = b.date ? new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    const amount = b.tourId?.price ? '$' + (b.tourId.price * (b.guests || 1)).toLocaleString() : '—';
    return `
      <tr>
        <td><strong>${b.name}</strong></td>
        <td>${b.email}</td>
        <td>${b.tourId?.title || 'N/A'}</td>
        <td>${date}</td>
        <td style="text-align:center">${b.guests || 1}</td>
        <td><strong style="color:var(--blue)">${amount}</strong></td>
        <td style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="viewBooking('${b._id}')">👁 View</button>
          <button class="btn btn-danger btn-sm" onclick="deleteBooking('${b._id}')">🗑</button>
        </td>
      </tr>`;
  }).join('');
}

function filterBookings() {
  const q = document.getElementById('booking-search').value.toLowerCase();
  const filtered = allBookings.filter(b =>
    b.name.toLowerCase().includes(q) ||
    b.email.toLowerCase().includes(q) ||
    (b.tourId?.title || '').toLowerCase().includes(q)
  );
  renderBookingsTable(filtered);
}

function viewBooking(id) {
  const b = allBookings.find(x => x._id === id);
  if (!b) return;
  const date = b.date ? new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const amount = b.tourId?.price ? '$' + (b.tourId.price * (b.guests || 1)).toLocaleString() : '—';
  document.getElementById('booking-detail-body').innerHTML = `
    <div class="detail-row"><span class="lbl">Customer Name</span><span class="val">${b.name}</span></div>
    <div class="detail-row"><span class="lbl">Email</span><span class="val">${b.email}</span></div>
    <div class="detail-row"><span class="lbl">Phone</span><span class="val">${b.phone || '—'}</span></div>
    <div class="detail-row"><span class="lbl">Tour</span><span class="val">${b.tourId?.title || 'N/A'}</span></div>
    <div class="detail-row"><span class="lbl">Location</span><span class="val">${b.tourId?.location || '—'}</span></div>
    <div class="detail-row"><span class="lbl">Travel Date</span><span class="val">${date}</span></div>
    <div class="detail-row"><span class="lbl">Guests</span><span class="val">${b.guests || 1}</span></div>
    <div class="detail-row"><span class="lbl">Total Amount</span><span class="val" style="color:var(--blue)">${amount}</span></div>`;
  document.getElementById('booking-modal').classList.add('active');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

// ===== USERS TABLE =====
async function loadUsersTable() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = `<tr><td colspan="6"><div class="loading"><div class="spinner"></div></div></td></tr>`;
  try {
    const res = await api.getUsers();
    if (!res.success || res.data.length === 0) {
      allUsers = [];
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--gray)">No users found.</td></tr>`;
      return;
    }
    allUsers = res.data;
    renderUsersTable(allUsers);
  } catch {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--red);padding:2rem">Failed to load users.</td></tr>`;
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-tbody');
  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--gray)">No matching users.</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map((u, i) => {
    const joined = u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td>${u.phone || '—'}</td>
        <td><span class="user-role ${u.role}">${u.role}</span></td>
        <td>${joined}</td>
      </tr>`;
  }).join('');
}

function filterUsers() {
  const q = document.getElementById('user-search').value.toLowerCase();
  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  renderUsersTable(filtered);
}

// ===== ADD TOUR =====
async function handleAddTour(e) {
  e.preventDefault();
  const btn = document.getElementById('add-tour-btn');
  const alertEl = document.getElementById('add-alert');
  btn.disabled = true; btn.textContent = 'Saving...';
  alertEl.style.display = 'none';

  const data = {
    title: document.getElementById('t-title').value.trim(),
    description: document.getElementById('t-description').value.trim(),
    price: parseFloat(document.getElementById('t-price').value),
    location: document.getElementById('t-location').value.trim(),
    image: document.getElementById('t-image').value.trim() || undefined,
    duration: document.getElementById('t-duration').value.trim(),
    maxGroupSize: parseInt(document.getElementById('t-maxgroup').value) || 10,
  };

  if (!data.title || !data.description || !data.price || !data.location) {
    alertEl.className = 'alert alert-error';
    alertEl.textContent = 'Title, description, price and location are required.';
    alertEl.style.display = 'flex';
    btn.disabled = false; btn.textContent = 'Add Tour';
    return;
  }

  try {
    const res = await api.createTour(data);
    if (res.success) {
      showToast('Tour added successfully!', 'success');
      document.getElementById('add-tour-form').reset();
      alertEl.className = 'alert alert-success';
      alertEl.textContent = `"${res.data.title}" has been added.`;
      alertEl.style.display = 'flex';
      loadToursTable(); loadStats();
    } else {
      showToast(res.message || 'Failed to add tour.', 'error');
    }
  } catch { showToast('Server error. Check backend connection.', 'error'); }

  btn.disabled = false; btn.textContent = 'Add Tour';
}

// ===== EDIT MODAL =====
async function openEditModal(id) {
  editingTourId = id;
  try {
    const res = await api.getTour(id);
    if (!res.success) throw new Error(res.message);
    const t = res.data;
    document.getElementById('e-title').value = t.title;
    document.getElementById('e-description').value = t.description;
    document.getElementById('e-price').value = t.price;
    document.getElementById('e-location').value = t.location;
    document.getElementById('e-image').value = t.image || '';
    document.getElementById('e-duration').value = t.duration || '';
    document.getElementById('e-maxgroup').value = t.maxGroupSize || 10;
    document.getElementById('edit-modal').classList.add('active');
  } catch (err) { showToast('Could not load tour: ' + err.message, 'error'); }
}

function closeEditModal() {
  document.getElementById('edit-modal').classList.remove('active');
  editingTourId = null;
}

async function handleEditTour(e) {
  e.preventDefault();
  if (!editingTourId) return;
  const btn = document.getElementById('edit-tour-btn');
  btn.disabled = true; btn.textContent = 'Saving...';

  const data = {
    title: document.getElementById('e-title').value.trim(),
    description: document.getElementById('e-description').value.trim(),
    price: parseFloat(document.getElementById('e-price').value),
    location: document.getElementById('e-location').value.trim(),
    image: document.getElementById('e-image').value.trim() || undefined,
    duration: document.getElementById('e-duration').value.trim(),
    maxGroupSize: parseInt(document.getElementById('e-maxgroup').value) || 10,
  };

  try {
    const res = await api.updateTour(editingTourId, data);
    if (res.success) {
      showToast('Tour updated!', 'success');
      closeEditModal(); loadToursTable(); loadStats();
    } else { showToast(res.message || 'Update failed.', 'error'); }
  } catch { showToast('Server error.', 'error'); }

  btn.disabled = false; btn.textContent = 'Save Changes';
}

// ===== DELETE =====
async function deleteTour(id) {
  if (!confirm('Delete this tour? This cannot be undone.')) return;
  try {
    const res = await api.deleteTour(id);
    if (res.success) { showToast('Tour deleted.', 'success'); loadToursTable(); loadStats(); }
    else showToast(res.message, 'error');
  } catch { showToast('Server error.', 'error'); }
}

async function deleteBooking(id) {
  if (!confirm('Delete this booking?')) return;
  try {
    const res = await api.deleteBooking(id);
    if (res.success) { showToast('Booking deleted.', 'success'); loadBookingsTable(); loadStats(); }
    else showToast(res.message, 'error');
  } catch { showToast('Server error.', 'error'); }
}

// ===== SEED =====
async function seedSampleTours() {
  if (!confirm('This will replace all existing tours with sample data. Continue?')) return;
  try {
    const res = await api.seedTours();
    if (res.success) { showToast(`${res.data.length} sample tours loaded!`, 'success'); loadToursTable(); loadStats(); }
    else showToast(res.message, 'error');
  } catch { showToast('Server error.', 'error'); }
}

// ===== CREATE ADMIN =====
function caPwToggle() {
  const i = document.getElementById('ca-password');
  i.type = i.type === 'password' ? 'text' : 'password';
}

function caCheckStrength(v) {
  const bar = document.getElementById('ca-sbar');
  const lbl = document.getElementById('ca-slabel');
  if (!v) { bar.style.cssText = 'height:3px;border-radius:3px;margin-top:.3rem;background:#e2e8f0'; lbl.textContent = ''; return; }
  if (v.length < 6) { bar.style.cssText = 'height:3px;border-radius:3px;margin-top:.3rem;background:#ef4444;width:33%'; lbl.textContent = 'Too short'; lbl.style.color = '#ef4444'; }
  else if (v.length < 10 || !/[0-9]/.test(v)) { bar.style.cssText = 'height:3px;border-radius:3px;margin-top:.3rem;background:#f59e0b;width:66%'; lbl.textContent = 'Medium'; lbl.style.color = '#f59e0b'; }
  else { bar.style.cssText = 'height:3px;border-radius:3px;margin-top:.3rem;background:#16a34a;width:100%'; lbl.textContent = 'Strong ✓'; lbl.style.color = '#16a34a'; }
}

function resetCaForm() {
  document.getElementById('ca-sbar').style.cssText = 'height:3px;border-radius:3px;margin-top:.3rem;background:#e2e8f0';
  document.getElementById('ca-slabel').textContent = '';
  document.getElementById('ca-alert').style.display = 'none';
}

async function handleCreateAdmin(e) {
  e.preventDefault();
  const alertEl = document.getElementById('ca-alert');
  const btn = document.getElementById('ca-btn');
  alertEl.style.display = 'none';

  const name = document.getElementById('ca-name').value.trim();
  const email = document.getElementById('ca-email').value.trim();
  const phone = document.getElementById('ca-phone').value.trim();
  const password = document.getElementById('ca-password').value;
  const confirm = document.getElementById('ca-confirm').value;

  if (!name || !email || !password) {
    alertEl.className = 'alert alert-error';
    alertEl.textContent = 'Name, email and password are required.';
    alertEl.style.display = 'flex'; return;
  }
  if (password.length < 6) {
    alertEl.className = 'alert alert-error';
    alertEl.textContent = 'Password must be at least 6 characters.';
    alertEl.style.display = 'flex'; return;
  }
  if (password !== confirm) {
    alertEl.className = 'alert alert-error';
    alertEl.textContent = 'Passwords do not match.';
    alertEl.style.display = 'flex'; return;
  }

  btn.disabled = true; btn.textContent = 'Creating...';

  try {
    const res = await api.createAdmin({ name, email, password, phone });
    if (res.success) {
      alertEl.className = 'alert alert-success';
      alertEl.textContent = `✓ ${res.message}`;
      alertEl.style.display = 'flex';
      document.getElementById('create-admin-form').reset();
      resetCaForm();
      loadUsersTable();
      loadStats();
      showToast('New admin account created!', 'success');
    } else {
      alertEl.className = 'alert alert-error';
      alertEl.textContent = res.message || 'Failed to create admin.';
      alertEl.style.display = 'flex';
    }
  } catch {
    alertEl.className = 'alert alert-error';
    alertEl.textContent = 'Cannot connect to server.';
    alertEl.style.display = 'flex';
  }

  btn.disabled = false; btn.textContent = 'Create Admin Account';
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadStats();
  loadToursTable();
  loadBookingsTable();
  loadUsersTable();

  document.getElementById('add-tour-form').addEventListener('submit', handleAddTour);
  document.getElementById('edit-tour-form').addEventListener('submit', handleEditTour);

  document.getElementById('edit-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('edit-modal')) closeEditModal();
  });
  document.getElementById('booking-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('booking-modal')) closeBookingModal();
  });
});
