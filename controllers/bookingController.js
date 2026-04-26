const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

// POST /bookings
exports.createBooking = async (req, res) => {
  try {
    const { name, email, tourId, date, phone, guests } = req.body;

    // Validate tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });

    const booking = await Booking.create({ name, email, tourId, date, phone, guests });
    const populated = await booking.populate('tourId', 'title location price');

    res.status(201).json({ success: true, message: 'Booking confirmed!', data: populated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('tourId', 'title location price').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /bookings/:id
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
