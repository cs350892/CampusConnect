const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * OTP MODEL
 * Explanation: OTP verification ke liye temporary storage
 * - 6-digit OTP hash karke store
 * - 5 minutes expiry
 * - Rate limiting support
 */

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  identifierType: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - automatically delete expired documents
  },
  attempts: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false
  },
  sessionToken: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash OTP
otpSchema.pre('save', async function(next) {
  if (!this.isModified('otp')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare OTP
otpSchema.methods.compareOtp = async function(candidateOtp) {
  return await bcrypt.compare(candidateOtp.toString(), this.otp);
};

// Check if OTP is expired
otpSchema.methods.isExpired = function() {
  return Date.now() > this.expiresAt.getTime();
};

// Static method to check rate limit
otpSchema.statics.checkRateLimit = async function(identifier) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  const count = await this.countDocuments({
    identifier,
    createdAt: { $gte: thirtyMinutesAgo }
  });
  
  return count < 5; // Max 5 OTPs in 30 minutes
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
