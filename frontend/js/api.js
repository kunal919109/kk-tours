const API_BASE = 'https://kktour.vercel.app';

const _authHeaders = () => {
  const token = localStorage.getItem('kk_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

const api = {
  // ---- Tours ----
  getTours: () => fetch(`${API_BASE}/tours`).then(r => r.json()),
  getTour: (id) => fetch(`${API_BASE}/tours/${id}`).then(r => r.json()),
  createTour: (data) =>
    fetch(`${API_BASE}/tours`, {
      method: 'POST',
      headers: _authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  updateTour: (id, data) =>
    fetch(`${API_BASE}/tours/${id}`, {
      method: 'PUT',
      headers: _authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  deleteTour: (id) =>
    fetch(`${API_BASE}/tours/${id}`, {
      method: 'DELETE',
      headers: _authHeaders(),
    }).then(r => r.json()),
  seedTours: () =>
    fetch(`${API_BASE}/tours/seed/data`, {
      method: 'POST',
      headers: _authHeaders(),
    }).then(r => r.json()),

  // ---- Users ----
  getUsers: () =>
    fetch(`${API_BASE}/auth/users`, { headers: _authHeaders() }).then(r => r.json()),
  createAdmin: (data) =>
    fetch(`${API_BASE}/auth/create-admin`, {
      method: 'POST',
      headers: _authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  getBookings: () =>
    fetch(`${API_BASE}/bookings`, { headers: _authHeaders() }).then(r => r.json()),
  createBooking: (data) =>
    fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: _authHeaders(),
      body: JSON.stringify(data),
    }).then(r => r.json()),
  deleteBooking: (id) =>
    fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
      headers: _authHeaders(),
    }).then(r => r.json()),
};
