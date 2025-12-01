const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, updateProfile } = require('../controllers/profileVerifyController');

/**
 * Email + Roll Number + OTP Based Profile Update Routes
 * 3-Step Process:
 * 1. Send OTP to email after email+roll verification
 * 2. Verify OTP
 * 3. Update profile (only after OTP verification)
 */

// Debug middleware to log requests
router.use((req, res, next) => {
  console.log(`[ProfileVerify] ${req.method} ${req.path}`);
  next();
});

// Step 1: Verify email + rollNumber and send OTP
router.post('/send-otp', sendOTP);

// Step 2: Verify OTP and get user data
router.post('/verify-otp', verifyOTP);

// Step 3: Update profile after OTP verification
router.post('/update', updateProfile);

module.exports = router;
