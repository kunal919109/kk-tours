function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (toggle && links) toggle.addEventListener('click', () => links.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  const raw = sessionStorage.getItem('booking_confirmation');
  const box = document.getElementById('confirmation-details');

  if (!raw) {
    box.innerHTML = `<div class="alert alert-info">No booking data found. <a href="index.html">Go to tours</a></div>`;
    return;
  }

  const b = JSON.parse(raw);
  const tourTitle = b.tourId?.title || 'Your Tour';
  const tourLocation = b.tourId?.location || '';
  const tourPrice = b.tourId?.price ? `$${b.tourId.price.toLocaleString()}` : '';
  const date = new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  box.innerHTML = `
    <table style="width:100%;border-collapse:collapse;text-align:left">
      <tr><td style="padding:.5rem;color:#64748b;font-weight:600">Name</td><td style="padding:.5rem">${b.name}</td></tr>
      <tr><td style="padding:.5rem;color:#64748b;font-weight:600">Email</td><td style="padding:.5rem">${b.email}</td></tr>
      <tr><td style="padding:.5rem;color:#64748b;font-weight:600">Tour</td><td style="padding:.5rem">${tourTitle}</td></tr>
      ${tourLocation ? `<tr><td style="padding:.5rem;color:#64748b;font-weight:600">Location</td><td style="padding:.5rem">${tourLocation}</td></tr>` : ''}
      <tr><td style="padding:.5rem;color:#64748b;font-weight:600">Date</td><td style="padding:.5rem">${date}</td></tr>
      <tr><td style="padding:.5rem;color:#64748b;font-weight:600">Guests</td><td style="padding:.5rem">${b.guests || 1}</td></tr>
      ${tourPrice ? `<tr><td style="padding:.5rem;color:#64748b;font-weight:600">Price</td><td style="padding:.5rem;font-weight:700;color:#2563eb">${tourPrice} / person</td></tr>` : ''}
    </table>`;

  sessionStorage.removeItem('booking_confirmation');
});
