// ===== AUTH HELPERS =====
const auth = {
  save: (token, user) => {
    localStorage.setItem('kk_token', token);
    localStorage.setItem('kk_user', JSON.stringify(user));
  },
  token: () => localStorage.getItem('kk_token'),
  user: () => JSON.parse(localStorage.getItem('kk_user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('kk_token'),
  logout: () => {
    localStorage.removeItem('kk_token');
    localStorage.removeItem('kk_user');
    window.location.href = 'login.html';
  },
};

// ===== UPDATE NAVBAR based on login state =====
function updateNavAuth() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;

  const existing = document.getElementById('nav-auth-item');
  if (existing) existing.remove();

  const li = document.createElement('li');
  li.id = 'nav-auth-item';

  if (auth.isLoggedIn()) {
    const user = auth.user();
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:.5rem">
        <a href="profile.html" style="display:flex;align-items:center;gap:.5rem;color:rgba(255,255,255,.9);padding:.4rem .85rem;border-radius:6px;font-weight:600;font-size:.85rem;transition:all .2s">
          <span style="background:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;color:var(--blue);flex-shrink:0">${user.name.charAt(0).toUpperCase()}</span>
          ${user.name.split(' ')[0]}
        </a>
        <button onclick="auth.logout()" style="background:#f97316;border:none;color:white;padding:.38rem .85rem;border-radius:6px;cursor:pointer;font-size:.78rem;font-weight:600;font-family:'Poppins',sans-serif;transition:all .2s">Logout</button>
      </div>`;
  } else {
    li.innerHTML = `<a href="login.html" style="background:#f97316;color:white;padding:.4rem 1rem;border-radius:6px;font-weight:600;font-size:.85rem">Login</a>`;
  }
  navLinks.appendChild(li);
}
