const mongoose = require('mongoose');

/**
 * ACTIVITY LOG MODEL
 * Explanation: Har important action ka record rakhta hai
 * - Admin ne kisko approve/reject kiya
 * - Kab kiya
 * - Reason kya tha
 * - Audit trail ke liye useful
 */

const activityLogSchema = new mongoose.Schema({
  // Who performed the action
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Action type
  action: {
    type: String,
    enum: [
      // Alumni related
      'alumni_approved',
      'alumni_rejected',
      'alumni_registered',
      
      // Job related
      'job_posted',
      'job_approved',
      'job_rejected',
      'job_expired',
      'job_deleted',
      
      // Referral related
      'referral_requested',
      'referral_accepted',
      'referral_rejected',
      'referral_withdrawn',
      
      // User related
      'user_login',
      'user_logout',
      'user_registered',
      'user_deleted',
      
      // Admin actions
      'bulk_approval',
      'bulk_rejection'
    ],
    required: true
  },
  
  // Target of the action (user, job, referral, etc.)
  targetModel: {
    type: String,
    enum: ['User', 'Job', 'Referral'],
    required: true
  },
  
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  
  // Details about the action
  details: {
    type: String,
    maxlength: [500, 'Details cannot exceed 500 characters']
  },
  
  reason: {
    type: String,
    maxlength: [300, 'Reason cannot exceed 300 characters']
  },
  
  // Metadata
  ipAddress: {
    type: String
  },
  
  userAgent: {
    type: String
  },
  
  // For bulk operations
  affectedCount: {
    type: Number,
    default: 1
  },
  
  // Status change tracking
  previousStatus: {
    type: String
  },
  
  newStatus: {
    type: String
  }
  
}, {
  timestamps: true
});

// Index for faster queries
activityLogSchema.index({ performedBy: 1, createdAt: -1 });
activityLogSchema.index({ targetModel: 1, targetId: 1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function(data) {
  try {
    await this.create(data);
  } catch (error) {
    console.error('Activity log error:', error.message);
    // Log error but don't throw - activity log failure shouldn't break main flow
  }
};

// Static method to get user activity history
activityLogSchema.statics.getUserActivity = async function(userId, limit = 50) {
  return await this.find({ performedBy: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('performedBy', 'name email role');
};

// Static method to get activity by target
activityLogSchema.statics.getTargetActivity = async function(targetModel, targetId) {
  return await this.find({ targetModel, targetId })
    .sort({ createdAt: -1 })
    .populate('performedBy', 'name email role');
};

module.exports = mongoose.model('ActivityLog', activityLogSchema);
