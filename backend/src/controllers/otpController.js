const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail, sendOtpSMS } = require('../utils/sendOtp');
const crypto = require('crypto');

/**
 * OTP CONTROLLER
 * Explanation: OTP verification system for profile updates
 */

// @desc    Send OTP to email or phone
// @route   POST /api/otp/send
// @access  Public
exports.sendOtp = async (req, res) => {
  try {
    const { identifier, type } = req.body; // identifier = email or phone
    
    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier (email/phone) and type'
      });
    }
    
    // Validate type
    if (!['email', 'phone'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be email or phone'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Check if user exists
    const query = type === 'email' 
      ? { email: normalizedIdentifier }
      : { phone: normalizedIdentifier };
    
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with this ${type}`
      });
    }
    
    // Check rate limit
    const canSendOtp = await Otp.checkRateLimit(normalizedIdentifier);
    
    if (!canSendOtp) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 30 minutes.'
      });
    }
    
    // Delete any existing OTPs for this identifier
    await Otp.deleteMany({ 
      identifier: normalizedIdentifier,
      verified: false 
    });
    
    // Generate OTP
    const otpCode = Otp.generateOTP();
    
    // Set expiry (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    // Create OTP record
    const otpRecord = await Otp.create({
      identifier: normalizedIdentifier,
      identifierType: type,
      otp: otpCode,
      expiresAt
    });
    
    // Send OTP
    try {
      if (type === 'email') {
        await sendOtpEmail(normalizedIdentifier, otpCode, user.name);
      } else {
        await sendOtpSMS(normalizedIdentifier, otpCode);
      }
    } catch (error) {
      // Delete OTP record if sending fails
      await Otp.findByIdAndDelete(otpRecord._id);
      
      return res.status(500).json({
        success: false,
        message: `Failed to send OTP via ${type}`,
        error: error.message
      });
    }
    
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to your ${type}`,
      expiresIn: '5 minutes'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
exports.verifyOtp = async (req, res) => {
  try {
    const { identifier, otp, type } = req.body;
    
    if (!identifier || !otp || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier, OTP, and type'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Find OTP record
    const otpRecord = await Otp.findOne({
      identifier: normalizedIdentifier,
      identifierType: type,
      verified: false
    }).sort({ createdAt: -1 }); // Get latest OTP
    
    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: 'No OTP found. Please request a new one.'
      });
    }
    
    // Check if OTP is expired
    if (otpRecord.isExpired()) {
      await Otp.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }
    
    // Check attempts
    if (otpRecord.attempts >= 5) {
      await Otp.findByIdAndDelete(otpRecord._id);
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.'
      });
    }
    
    // Verify OTP
    const isMatch = await otpRecord.compareOtp(otp);
    
    if (!isMatch) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
      
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
      });
    }
    
    // Generate session token for profile update
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Mark OTP as verified and save session token
    otpRecord.verified = true;
    otpRecord.sessionToken = sessionToken;
    await otpRecord.save();
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      allowUpdate: true,
      sessionToken,
      expiresIn: '5 minutes' // Session valid for remaining OTP expiry time
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// @desc    Update profile after OTP verification
// @route   POST /api/otp/update-profile
// @access  Public (with session token)
exports.updateProfile = async (req, res) => {
  try {
    const { identifier, type, sessionToken, ...updateData } = req.body;
    
    if (!identifier || !type || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier, type, and session token'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Verify session token
    const otpRecord = await Otp.findOne({
      identifier: normalizedIdentifier,
      identifierType: type,
      sessionToken,
      verified: true
    });
    
    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please verify OTP again.'
      });
    }
    
    // Check if session is still valid (not expired)
    if (otpRecord.isExpired()) {
      await Otp.findByIdAndDelete(otpRecord._id);
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please verify OTP again.'
      });
    }
    
    // Find user
    const query = type === 'email' 
      ? { email: normalizedIdentifier }
      : { phone: normalizedIdentifier };
    
    // Allowed fields for update
    const allowedFields = [
      'name', 'phone', 'image', 'pronouns', 'location', 'headline',
      'techStack', 'socialLinks', 'resumeLink', 'branch', 'batch'
    ];
    
    // Student specific fields
    const studentFields = ['dsaProblems', 'isPlaced'];
    
    // Alumni specific fields
    const alumniFields = ['company'];
    
    // Filter update data
    const filteredUpdate = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) || 
          studentFields.includes(key) || 
          alumniFields.includes(key)) {
        filteredUpdate[key] = updateData[key];
      }
    });
    
    // Update user
    const updatedUser = await User.findOneAndUpdate(
      query,
      filteredUpdate,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete OTP record after successful update
    await Otp.findByIdAndDelete(otpRecord._id);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/otp/resend
// @access  Public
exports.resendOtp = async (req, res) => {
  try {
    const { identifier, type } = req.body;
    
    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier and type'
      });
    }
    
    // Normalize identifier
    const normalizedIdentifier = type === 'email' 
      ? identifier.toLowerCase().trim()
      : identifier.trim();
    
    // Check rate limit
    const canSendOtp = await Otp.checkRateLimit(normalizedIdentifier);
    
    if (!canSendOtp) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 30 minutes.'
      });
    }
    
    // Delete existing OTPs
    await Otp.deleteMany({ 
      identifier: normalizedIdentifier,
      verified: false 
    });
    
    // Call sendOtp function
    req.body = { identifier, type };
    return exports.sendOtp(req, res);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP',
      error: error.message
    });
  }
};
