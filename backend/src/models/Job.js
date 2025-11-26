const mongoose = require('mongoose');

/**
 * JOB MODEL
 * Explanation: Alumni job post karenge, admin approve karega, students apply karenge
 * - Only verified alumni job post kar sakte hain
 * - Default status: "pending" (admin approval required)
 * - Expiry date ke baad job automatically "expired" status
 */

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },
  
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance'],
    required: [true, 'Job type is required']
  },
  
  workMode: {
    type: String,
    enum: ['On-site', 'Remote', 'Hybrid'],
    default: 'On-site'
  },
  
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  requirements: {
    type: String,
    maxlength: [1000, 'Requirements cannot exceed 1000 characters']
  },
  
  skillsRequired: [{
    type: String,
    trim: true
  }],
  
  experience: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  
  applyLink: {
    type: String,
    trim: true
  },
  
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  
  // Who posted this job (Alumni reference)
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Admin approval system
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // Admin who approved
  },
  
  approvedAt: {
    type: Date
  },
  
  rejectionReason: {
    type: String
  },
  
  // Stats
  viewCount: {
    type: Number,
    default: 0
  },
  
  referralCount: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// Index for better query performance
jobSchema.index({ status: 1, expiryDate: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ company: 'text', title: 'text' });  // Text search support

// Virtual for checking if job is expired
jobSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Middleware to auto-expire jobs
jobSchema.pre('find', function() {
  // Jobs fetch karte waqt automatically expired jobs ko mark kar do
  const now = new Date();
  this.model.updateMany(
    { 
      expiryDate: { $lt: now }, 
      status: 'approved' 
    },
    { 
      $set: { status: 'expired' } 
    }
  ).exec();
});

// Method to check if job can be edited
jobSchema.methods.canEdit = function(userId) {
  return this.postedBy.toString() === userId.toString() && this.status === 'pending';
};

module.exports = mongoose.model('Job', jobSchema);
