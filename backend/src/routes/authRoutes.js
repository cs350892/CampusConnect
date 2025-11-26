const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

const { isAuthenticated } = require('../middlewares/auth');
const { body } = require('express-validator');

/**
 * AUTH ROUTES
 * Explanation: User registration, login aur profile management
 */

// Registration validation
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
  body('batch').notEmpty().withMessage('Batch is required')
];

// Login validation
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/auth/register', registerValidation, register);
router.post('/auth/login', loginValidation, login);

// Protected routes
router.get('/auth/me', isAuthenticated, getMe);
router.put('/auth/profile', isAuthenticated, updateProfile);
router.put('/auth/change-password', isAuthenticated, changePassword);
router.post('/auth/logout', isAuthenticated, logout);

module.exports = router;
