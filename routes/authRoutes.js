const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers, createAdmin } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, isAdmin, getAllUsers);
router.post('/create-admin', protect, isAdmin, createAdmin); // admin only

module.exports = router;
