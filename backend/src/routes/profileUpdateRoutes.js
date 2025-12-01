const express = require('express');
const router = express.Router();
const { 
  sendOtp, 
  verifyOtp, 
  updateProfile, 
  getProfile 
} = require('../controllers/profileUpdateController');
const { verifyProfileUpdateToken } = require('../middlewares/profileUpdateAuth');

/**
 * PROFILE UPDATE ROUTES
 * OTP-based authentication for profile updates
 */

// @route   POST /api/profile-update/sendOtp
// @desc    Send OTP to email or phone
// @access  Public
router.post('/sendOtp', sendOtp);

// @route   POST /api/profile-update/verifyOtp
// @desc    Verify OTP and get JWT token
// @access  Public
router.post('/verifyOtp', verifyOtp);

// @route   POST /api/profile-update/updateProfile
// @desc    Update user profile (requires JWT)
// @access  Private
router.post('/updateProfile', verifyProfileUpdateToken, updateProfile);

// @route   GET /api/profile-update/getProfile
// @desc    Get user profile (requires JWT)
// @access  Private
router.get('/getProfile', verifyProfileUpdateToken, getProfile);

module.exports = router;
