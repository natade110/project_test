// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Helper function to check password complexity
const isPasswordValid = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

// Sign up controller
exports.signup = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if all required fields are provided
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password complexity
    if (!isPasswordValid(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
      });
    }

    // Check if user with the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    // Save user to database
    await user.save();

    // Return success message
    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Sign in controller
exports.signin = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get JWT secret from environment or use a fallback (for development only)
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-here';

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRY || '1d' }
    );

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    console.log('User signed in:', user.email);
    
    // Return token and user info
    res.status(200).json({
      token,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Sign out controller
exports.signout = async (req, res) => {
  try {
    // Get user from token (attached by auth middleware)
    const userId = req.user.userId;
    
    // Find user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Optional: You can add any additional logout logic here
    // For example, updating the lastSeen timestamp
    user.lastSeen = new Date();
    await user.save();
    
    console.log('User signed out:', user.email);
    
    // Return success message
    // Note: The actual token invalidation happens client-side by removing the token
    res.status(200).json({ 
      message: 'Signed out successfully',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};