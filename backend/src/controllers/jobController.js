const Job = require('../models/Job');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { sendJobApprovalEmail, sendJobRejectionEmail } = require('../utils/sendEmail');

/**
 * JOB CONTROLLER
 * Explanation: Job posting, approval, listing ke saare operations
 * - Alumni job post karenge (verified only)
 * - Admin approve/reject karega
 * - Students jobs dekh sakenge (approved only)
 */

// @desc    Create a new job post (Alumni Only - Verified)
// @route   POST /api/jobs
// @access  Private (Verified Alumni)
exports.createJob = async (req, res) => {
  try {
    const {
      title, company, location, salary, jobType, workMode,
      description, requirements, skillsRequired, experience,
      applyLink, expiryDate
    } = req.body;
    
    // Create job with alumni reference
    const job = await Job.create({
      title, company, location, salary, jobType, workMode,
      description, requirements, skillsRequired, experience,
      applyLink, expiryDate,
      postedBy: req.user._id,
      status: 'pending'  // Admin approval required
    });
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'job_posted',
      targetModel: 'Job',
      targetId: job._id,
      details: `Job posted: ${title} at ${company}`,
      newStatus: 'pending'
    });
    
    res.status(201).json({
      success: true,
      message: 'Job posted successfully! Waiting for admin approval.',
      job
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public (but logged in users see more details)
exports.getAllJobs = async (req, res) => {
  try {
    const {
      status = 'approved',
      jobType,
      workMode,
      company,
      search,
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    const query = {};
    
    // Only show approved jobs to non-admin users
    if (req.user?.role !== 'admin') {
      query.status = 'approved';
      query.expiryDate = { $gt: new Date() };  // Non-expired only
    } else if (status) {
      query.status = status;
    }
    
    if (jobType) query.jobType = jobType;
    if (workMode) query.workMode = workMode;
    if (company) query.company = new RegExp(company, 'i');
    
    // Text search
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'name company email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Job.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Get single job details
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company email phone socialLinks');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Only show approved jobs to non-admin/non-owner
    if (
      job.status !== 'approved' && 
      req.user?.role !== 'admin' && 
      req.user?._id.toString() !== job.postedBy._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'This job is not available'
      });
    }
    
    // Increment view count
    job.viewCount += 1;
    await job.save();
    
    res.status(200).json({
      success: true,
      job
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// @desc    Get my posted jobs (Alumni)
// @route   GET /api/jobs/my-jobs
// @access  Private (Alumni)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your jobs',
      error: error.message
    });
  }
};

// @desc    Update job (Alumni - only pending jobs)
// @route   PUT /api/jobs/:id
// @access  Private (Alumni - Owner)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check ownership
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own jobs'
      });
    }
    
    // Only pending jobs can be edited
    if (job.status !== 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Only pending jobs can be edited'
      });
    }
    
    job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      job
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Alumni - Owner or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if user is owner or admin
    if (
      job.postedBy.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }
    
    await job.deleteOne();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'job_deleted',
      targetModel: 'Job',
      targetId: job._id,
      details: `Job deleted: ${job.title}`,
      previousStatus: job.status
    });
    
    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// @desc    Approve job (Admin Only)
// @route   PUT /api/jobs/:id/approve
// @access  Private (Admin)
exports.approveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (job.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending jobs can be approved'
      });
    }
    
    job.status = 'approved';
    job.approvedBy = req.user._id;
    job.approvedAt = new Date();
    await job.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'job_approved',
      targetModel: 'Job',
      targetId: job._id,
      details: `Job approved: ${job.title}`,
      previousStatus: 'pending',
      newStatus: 'approved'
    });
    
    // Send email to alumni
    await sendJobApprovalEmail(job, job.postedBy);
    
    res.status(200).json({
      success: true,
      message: 'Job approved successfully',
      job
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve job',
      error: error.message
    });
  }
};

// @desc    Reject job (Admin Only)
// @route   PUT /api/jobs/:id/reject
// @access  Private (Admin)
exports.rejectJob = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const job = await Job.findById(req.params.id).populate('postedBy');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (job.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending jobs can be rejected'
      });
    }
    
    job.status = 'rejected';
    job.rejectionReason = reason;
    await job.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'job_rejected',
      targetModel: 'Job',
      targetId: job._id,
      details: `Job rejected: ${job.title}`,
      reason,
      previousStatus: 'pending',
      newStatus: 'rejected'
    });
    
    // Send email to alumni
    await sendJobRejectionEmail(job, job.postedBy, reason);
    
    res.status(200).json({
      success: true,
      message: 'Job rejected successfully',
      job
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject job',
      error: error.message
    });
  }
};

// @desc    Get job statistics
// @route   GET /api/jobs/stats
// @access  Private (Alumni - own stats, Admin - all stats)
exports.getJobStats = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { postedBy: req.user._id };
    
    const stats = await Job.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      expired: 0
    };
    
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });
    
    res.status(200).json({
      success: true,
      stats: formattedStats
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};
