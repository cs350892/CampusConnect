const mongoose = require('mongoose');

/**
 * REFERRAL MODEL
 * Explanation: Student job pe referral request karta hai alumni se
 * - Student approved job pe hi request kar sakta hai
 * - Alumni ko email notification jayegi
 * - Alumni accept/reject kar sakta hai
 * - Student apni resume link aur message attach karega
 */

const referralSchema = new mongoose.Schema({
  // Job reference
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job reference is required']
  },
  
  // Student who is requesting referral
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required']
  },
  
  // Alumni who posted the job (auto-filled from job)
  alumni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Alumni reference is required']
  },
  
  // Student's message to alumni
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [20, 'Message must be at least 20 characters'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Student's resume
  resumeLink: {
    type: String,
    required: [true, 'Resume link is required'],
    trim: true
  },
  
  // Additional info
  studentEmail: {
    type: String,
    required: true
  },
  
  studentPhone: {
    type: String
  },
  
  // Referral status
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  
  // Alumni response
  alumniResponse: {
    type: String,
    maxlength: [500, 'Response cannot exceed 500 characters']
  },
  
  respondedAt: {
    type: Date
  },
  
  // Tracking
  isViewed: {
    type: Boolean,
    default: false
  },
  
  viewedAt: {
    type: Date
  }
  
}, {
  timestamps: true
});

// Index for better performance
referralSchema.index({ job: 1, student: 1 }, { unique: true });  // One referral per job per student
referralSchema.index({ alumni: 1, status: 1 });
referralSchema.index({ student: 1 });

// Middleware to prevent duplicate referral requests
referralSchema.pre('save', async function(next) {
  if (this.isNew) {
    const existing = await this.constructor.findOne({
      job: this.job,
      student: this.student
    });
    
    if (existing) {
      throw new Error('You have already requested a referral for this job');
    }
  }
  next();
});

// Method to check if referral can be withdrawn
referralSchema.methods.canWithdraw = function(userId) {
  return (
    this.student.toString() === userId.toString() && 
    this.status === 'pending'
  );
};

// Method to check if alumni can respond
referralSchema.methods.canRespond = function(userId) {
  return (
    this.alumni.toString() === userId.toString() && 
    this.status === 'pending'
  );
};

module.exports = mongoose.model('Referral', referralSchema);
