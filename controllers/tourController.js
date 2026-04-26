const Tour = require('../models/Tour');

// GET /tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find().sort({ createdAt: -1 });
    res.json({ success: true, count: tours.length, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /tours/:id
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tours
exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /tours/:id
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, data: tour });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /tours/:id
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ success: false, message: 'Tour not found' });
    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /tours/seed  — insert sample data
exports.seedTours = async (req, res) => {
  try {
    await Tour.deleteMany({});
    const sampleTours = [
      {
        title: 'Bali Paradise Escape',
        description: 'Experience the magic of Bali with stunning temples, rice terraces, and pristine beaches. Includes guided tours, accommodation, and daily breakfast.',
        price: 1299,
        location: 'Bali, Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
        duration: '7 Days',
        maxGroupSize: 12,
      },
      {
        title: 'Swiss Alps Adventure',
        description: 'Explore the breathtaking Swiss Alps with skiing, hiking, and scenic train rides. Perfect for adventure lovers and nature enthusiasts.',
        price: 2499,
        location: 'Zurich, Switzerland',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        duration: '10 Days',
        maxGroupSize: 8,
      },
      {
        title: 'Santorini Sunset Tour',
        description: 'Discover the iconic white-washed buildings, volcanic beaches, and world-famous sunsets of Santorini. A romantic getaway like no other.',
        price: 1799,
        location: 'Santorini, Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600',
        duration: '5 Days',
        maxGroupSize: 10,
      },
      {
        title: 'Amazon Rainforest Expedition',
        description: 'Venture deep into the Amazon rainforest for an unforgettable wildlife experience. Spot exotic animals, explore river tributaries, and stay in eco-lodges.',
        price: 1999,
        location: 'Manaus, Brazil',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
        duration: '8 Days',
        maxGroupSize: 6,
      },
      {
        title: 'Tokyo Cultural Journey',
        description: 'Immerse yourself in the vibrant culture of Tokyo — from ancient temples and tea ceremonies to futuristic technology and world-class cuisine.',
        price: 2199,
        location: 'Tokyo, Japan',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
        duration: '9 Days',
        maxGroupSize: 15,
      },
      {
        title: 'Machu Picchu Discovery',
        description: 'Trek the legendary Inca Trail to the ancient citadel of Machu Picchu. Experience breathtaking mountain scenery and rich Andean culture.',
        price: 1599,
        location: 'Cusco, Peru',
        image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600',
        duration: '6 Days',
        maxGroupSize: 10,
      },
    ];
    const tours = await Tour.insertMany(sampleTours);
    res.status(201).json({ success: true, message: `${tours.length} sample tours added`, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
