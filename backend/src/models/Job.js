const mongoose = require('mongoose');

/**
 * SIMPLE JOB MODEL - NO LOGIN REQUIRED
 * Anyone (alumni) can post jobs directly without authentication
 * Jobs appear immediately on the Jobs page
 */

const jobSchema = new mongoose.Schema({
  jobTitle: { 
    type: String, 
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [150, 'Job title cannot exceed 150 characters']
  },
  
  companyName: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  location: { 
    type: String, 
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  
  applicationLink: { 
    type: String, 
    required: [true, 'Application link or contact is required'],
    trim: true,
    maxlength: [500, 'Application link cannot exceed 500 characters']
  },
  
  postedBy: { 
    type: String, 
    required: [true, 'Posted by name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: { 
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [100, 'Email cannot exceed 100 characters'],
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries - show newest jobs first
jobSchema.index({ createdAt: -1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ companyName: 'text', jobTitle: 'text' }); // Text search support

module.exports = mongoose.model('Job', jobSchema);
