// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Handle Bored API proxy to avoid CORS issues
app.get('/api/activity', async (req, res) => {
  try {
    const response = await fetch('https://www.boredapi.com/api/activity');
    
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch activity' });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Activity API error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Connect to MongoDB
if (!module.parent) {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
    });
}

module.exports = app; // Export for testing