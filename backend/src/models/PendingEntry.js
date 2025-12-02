const mongoose = require('mongoose');

/**
 * SIMPLE PENDING ENTRY MODEL
 * Stores raw text submissions before admin approval
 */

const pendingEntrySchema = new mongoose.Schema({
  // Simple raw text format
  rawText: {
    type: String,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Admin review info
  reviewedBy: String,
  reviewedAt: Date

}, {
  timestamps: true
});

// Index for faster queries
pendingEntrySchema.index({ status: 1 });
pendingEntrySchema.index({ createdAt: -1 });

module.exports = mongoose.model('PendingEntry', pendingEntrySchema);
