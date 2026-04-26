const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  seedTours,
} = require('../controllers/tourController');

router.post('/seed/data', protect, isAdmin, seedTours);
router.get('/', getAllTours);
router.get('/:id', getTourById);
router.post('/', protect, isAdmin, createTour);
router.put('/:id', protect, isAdmin, updateTour);
router.delete('/:id', protect, isAdmin, deleteTour);

module.exports = router;
