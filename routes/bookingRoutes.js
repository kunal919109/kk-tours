const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { createBooking, getAllBookings, deleteBooking } = require('../controllers/bookingController');

router.get('/', protect, isAdmin, getAllBookings);
router.post('/', protect, createBooking);
router.delete('/:id', protect, isAdmin, deleteBooking);

module.exports = router;
