const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const tourRoutes = require('../routes/tourRoutes');
const bookingRoutes = require('../routes/bookingRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();

// CORS — allow all origins (required for Vercel serverless)
app.use(cors());
app.use(express.json());

app.use('/tours', tourRoutes);
app.use('/bookings', bookingRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'KK Tours API is running' });
});

// MongoDB — reuse connection across serverless invocations
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log('MongoDB connected');
}

const handler = serverless(app);

module.exports = async (req, res) => {
  await connectDB();
  return handler(req, res);
};
