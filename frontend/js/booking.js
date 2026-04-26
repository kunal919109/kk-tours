function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
}

function prefillFromParams() {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title');
  const price = params.get('price');

  if (title) document.getElementById('tour-name-display').textContent = decodeURIComponent(title);
  if (price) document.getElementById('tour-price-display').textContent = `$${Number(price).toLocaleString()} / person`;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').min = today;
}

async function populateTourSelect() {
  const select = document.getElementById('tourId');
  const params = new URLSearchParams(window.location.search);
  const preselected = params.get('id');
  try {
    const res = await api.getTours();
    if (res.success) {
      select.innerHTML = '<option value="">-- Select a Tour --</option>' +
        res.data.map(t => `<option value="${t._id}" ${t._id === preselected ? 'selected' : ''}>${t.title} — $${t.price}</option>`).join('');
    }
  } catch { /* ignore */ }
}

function showAlert(msg, type = 'error') {
  const el = document.getElementById('form-alert');
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.style.display = 'flex';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

async function handleBookingSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Booking...';

  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    tourId: document.getElementById('tourId').value,
    date: document.getElementById('date').value,
    guests: parseInt(document.getElementById('guests').value) || 1,
  };

  // Basic validation
  if (!data.name || !data.email || !data.tourId || !data.date) {
    showAlert('Please fill in all required fields.');
    btn.disabled = false;
    btn.textContent = 'Confirm Booking';
    return;
  }

  try {
    const res = await api.createBooking(data);
    if (res.success) {
      // Store confirmation data and redirect
      sessionStorage.setItem('booking_confirmation', JSON.stringify(res.data));
      window.location.href = 'confirmation.html';
    } else {
      showAlert(res.message || 'Booking failed. Please try again.');
      btn.disabled = false;
      btn.textContent = 'Confirm Booking';
    }
  } catch {
    showAlert('Could not connect to server. Make sure the backend is running.');
    btn.disabled = false;
    btn.textContent = 'Confirm Booking';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  prefillFromParams();
  populateTourSelect();
  document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
});
