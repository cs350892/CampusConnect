const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * UNIFIED USER MODEL
 * Explanation: Ek hi model me student, alumni, aur admin sab handle kar rahe hain.
 * role: "student" | "alumni" | "admin"
 * - Student: Auto-approved, registration ke baad immediately access
 * - Alumni: isVerified: false by default, admin approval chahiye
 * - Admin: Manually created, full control
 */

const userSchema = new mongoose.Schema({
  // Common fields for all users
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
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: 6,
    select: false  // By default password return nahi hoga queries me
  },
  role: { 
    type: String, 
    enum: ['student', 'alumni', 'admin'],
    required: true
  },
  phone: { 
    type: String,
    trim: true
  },
  
  // Profile fields
  image: { 
    type: String, 
    default: 'https://i.ibb.co/TqK1XTQm/image-5.jpg' 
  },
  imageUrl: { 
    type: String, 
    default: 'https://i.ibb.co/TqK1XTQm/image-5.jpg' 
  },
  cloudinaryPublicId: { 
    type: String 
  },
  pronouns: { 
    type: String, 
    default: 'They/Them' 
  },
  location: { 
    type: String, 
    default: 'India' 
  },
  headline: { 
    type: String,
    default: function() {
      return this.role === 'alumni' ? 'Alumni at HBTU' : 'Student at HBTU';
    }
  },
  
  // Student specific fields
  rollNumber: { 
    type: String,
    sparse: true,  // Allows null for non-students
    unique: true
  },
  branch: { 
    type: String,
    default: 'Not Specified' 
  },
  batch: { 
    type: String,
    required: function() { return this.role !== 'admin'; }
  },
  dsaProblems: { 
    type: Number, 
    default: 0 
  },
  isPlaced: { 
    type: Boolean, 
    default: false 
  },
  skills: {
    dsa: [{ type: String }],
    development: [{ type: String }],
  },
  techStack: [{ type: String }],
  resumeLink: { type: String },
  
  // Alumni specific fields
  company: { 
    type: String,
    required: function() { return this.role === 'alumni'; }
  },
  
  // Alumni verification (Admin approval required)
  isVerified: { 
    type: Boolean, 
    default: function() {
      // Student aur admin auto-verified, alumni needs approval
      return this.role !== 'alumni';
    }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'alumni' ? 'pending' : 'approved';
    }
  },
  rejectionReason: { type: String },
  
  // Social links
  socialLinks: {
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: '' },
  },
  
  // Account status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { type: Date },
  
  // OTP Fields for Profile Update (No login required)
  otp: { 
    type: String, 
    select: false 
  },
  otpExpire: { 
    type: Date, 
    select: false 
  },
  otpRequestCount: { 
    type: Number, 
    default: 0 
  },
  otpRequestResetTime: { 
    type: Date, 
    default: Date.now 
  },
  
}, {
  timestamps: true  // createdAt, updatedAt automatically add hoga
});

// Password ko hash karna before saving
userSchema.pre('save', async function(next) {
  // Agar password change nahi hua to skip karo
  if (!this.isModified('password')) return next();
  
  // Password hash karo with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  delete userObject.otp;
  delete userObject.otpExpire;
  return userObject;
};

// OTP Methods for Profile Update System
userSchema.methods.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

userSchema.methods.hashOTP = async function(otp) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(otp, salt);
};

userSchema.methods.compareOTP = async function(enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otp);
};

userSchema.methods.isOTPExpired = function() {
  return Date.now() > this.otpExpire;
};

userSchema.methods.checkRateLimit = function() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  if (this.otpRequestResetTime < oneHourAgo) {
    this.otpRequestCount = 0;
    this.otpRequestResetTime = Date.now();
    return true;
  }
  
  if (this.otpRequestCount >= 5) {
    return false;
  }
  
  return true;
};

userSchema.methods.incrementRateLimit = function() {
  this.otpRequestCount += 1;
};

module.exports = mongoose.model('User', userSchema);
