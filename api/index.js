const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const tourRoutes = require('../routes/tourRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tours', tourRoutes);
app.use('/bookings', bookingRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'KK Tours API is running', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI environment variable is not set on Vercel');
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

const handler = serverless(app);

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'DB connection failed: ' + err.message });
  }
  return handler(req, res);
};
