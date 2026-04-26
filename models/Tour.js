const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    duration: { type: String, default: '3 Days' },
    maxGroupSize: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
