const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: [true, 'Tour ID is required'] },
    date: { type: Date, required: [true, 'Date is required'] },
    phone: { type: String, default: '' },
    guests: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
