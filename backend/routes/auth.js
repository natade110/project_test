const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Validation middleware for signup
const signupValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least 1 uppercase letter')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain at least 1 lowercase letter')
    .matches(/(?=.*\d)/).withMessage('Password must contain at least 1 number')
    .matches(/(?=.*[!@#$%^&*])/).withMessage('Password must contain at least 1 special character'),
];

// Validation middleware for signin
const signinValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/signup', signupValidation, authController.signup);
router.post('/signin', signinValidation, authController.signin);
router.post('/signout', authMiddleware, authController.signout); // New route for signout

module.exports = router;