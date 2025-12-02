const mongoose = require('mongoose');

/**
 * PENDING REGISTRATION MODEL
 * Stores new registrations before admin approval
 * After approval, data is transferred to User model
 */

const pendingRegistrationSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Role
  role: {
    type: String,
    enum: ['student', 'alumni'],
    required: [true, 'Role is required']
  },
  
  // Common Fields
  batch: {
    type: String,
    required: [true, 'Batch is required']
  },
  branch: {
    type: String,
    required: [true, 'Branch is required']
  },
  
  // Student Specific
  rollNumber: {
    type: String,
    trim: true,
    sparse: true // Allows null values with unique constraint
  },
  
  // Alumni Specific
  company: {
    type: String,
    trim: true
  },
  
  // Optional Fields
  techStack: [String],
  resumeLink: String,
  image: String,
  
  // Approval Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Admin Actions
  reviewedBy: {
    type: String, // Admin email
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  
  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String

}, {
  timestamps: true
});

// Index for faster queries
pendingRegistrationSchema.index({ email: 1 });
pendingRegistrationSchema.index({ status: 1 });
pendingRegistrationSchema.index({ role: 1 });
pendingRegistrationSchema.index({ submittedAt: -1 });

// Method to format for display
pendingRegistrationSchema.methods.getDisplayInfo = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    batch: this.batch,
    branch: this.branch,
    rollNumber: this.rollNumber,
    company: this.company,
    techStack: this.techStack,
    resumeLink: this.resumeLink,
    image: this.image,
    status: this.status,
    submittedAt: this.submittedAt,
    reviewedBy: this.reviewedBy,
    reviewedAt: this.reviewedAt,
    rejectionReason: this.rejectionReason
  };
};

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema);
