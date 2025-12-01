const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  updateProfile,
  resendOtp
} = require('../controllers/otpController');

const { body } = require('express-validator');

/**
 * OTP ROUTES
 * Explanation: OTP verification aur profile update ke routes
 */

// Validation rules
const sendOtpValidation = [
  body('identifier').notEmpty().withMessage('Email or phone is required'),
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone')
];

const verifyOtpValidation = [
  body('identifier').notEmpty().withMessage('Email or phone is required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone')
];

const updateProfileValidation = [
  body('identifier').notEmpty().withMessage('Email or phone is required'),
  body('type').isIn(['email', 'phone']).withMessage('Type must be email or phone'),
  body('sessionToken').notEmpty().withMessage('Session token is required')
];

// Send OTP
router.post('/otp/send', sendOtpValidation, sendOtp);

// Verify OTP
router.post('/otp/verify', verifyOtpValidation, verifyOtp);

// Update profile after OTP verification
router.post('/otp/update-profile', updateProfileValidation, updateProfile);

// Resend OTP
router.post('/otp/resend', sendOtpValidation, resendOtp);

module.exports = router;
