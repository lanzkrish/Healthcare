/**
 * Auth Routes
 * POST /api/auth/register - Register new user
 * POST /api/auth/login - Login
 * POST /api/auth/refresh - Refresh access token
 * GET  /api/auth/me - Get current user
 * PUT  /api/auth/profile - Update profile
 * PUT  /api/auth/push-token - Update push notification token
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  register, login, refreshToken, getMe, updateProfile, updatePushToken,
} = require('../controllers/authController');

// Registration validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['patient', 'caregiver']).withMessage('Role must be patient or caregiver'),
];

// Login validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/push-token', protect, updatePushToken);

module.exports = router;
