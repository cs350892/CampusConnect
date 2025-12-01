const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * PROFILE UPDATE USER MODEL
 * OTP-based profile update system
 * No normal login - only OTP verification for profile updates
 */

const profileUpdateUserSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  roll: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  },
  
  // Technical Information
  skills: [{
    type: String,
    trim: true
  }],
  
  // Social Links
  linkedin: {
    type: String,
    trim: true,
    default: ''
  },
  
  github: {
    type: String,
    trim: true,
    default: ''
  },
  
  // About Section
  about: {
    type: String,
    trim: true,
    maxlength: [500, 'About section cannot exceed 500 characters'],
    default: ''
  },
  
  // OTP Fields (for profile update authentication)
  otp: {
    type: String,
    select: false // Don't return in queries by default
  },
  
  otpExpire: {
    type: Date,
    select: false
  },
  
  // Rate Limiting
  otpRequestCount: {
    type: Number,
    default: 0
  },
  
  otpRequestResetTime: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Index for faster queries
profileUpdateUserSchema.index({ email: 1 });
profileUpdateUserSchema.index({ phone: 1 });
profileUpdateUserSchema.index({ otpExpire: 1 });

/**
 * METHOD: Generate and hash OTP
 */
profileUpdateUserSchema.methods.generateOTP = function() {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * METHOD: Hash OTP before saving
 */
profileUpdateUserSchema.methods.hashOTP = async function(otp) {
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otp, salt);
  return hashedOtp;
};

/**
 * METHOD: Compare OTP
 */
profileUpdateUserSchema.methods.compareOTP = async function(enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

/**
 * METHOD: Check if OTP is expired
 */
profileUpdateUserSchema.methods.isOTPExpired = function() {
  return Date.now() > this.otpExpire;
};

/**
 * METHOD: Check rate limit (max 5 OTP per hour)
 */
profileUpdateUserSchema.methods.checkRateLimit = function() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  // Reset count if reset time has passed
  if (this.otpRequestResetTime < oneHourAgo) {
    this.otpRequestCount = 0;
    this.otpRequestResetTime = Date.now();
    return true;
  }
  
  // Check if limit exceeded
  if (this.otpRequestCount >= 5) {
    return false;
  }
  
  return true;
};

/**
 * METHOD: Increment rate limit counter
 */
profileUpdateUserSchema.methods.incrementRateLimit = function() {
  this.otpRequestCount += 1;
};

/**
 * METHOD: Get public profile (exclude sensitive data)
 */
profileUpdateUserSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    roll: this.roll,
    skills: this.skills,
    linkedin: this.linkedin,
    github: this.github,
    about: this.about,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('ProfileUpdateUser', profileUpdateUserSchema);
