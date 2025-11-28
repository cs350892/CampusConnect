const Referral = require('../models/Referral');
const Job = require('../models/Job');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { sendReferralRequestEmail, sendReferralResponseEmail } = require('../utils/sendEmail');

/**
 * REFERRAL CONTROLLER
 * Explanation: Student alumni se referral request karta hai
 * - Student approved job pe referral request karega
 * - Alumni accept/reject karega
 * - Email notifications jayegi
 */

// @desc    Create referral request (Student Only)
// @route   POST /api/referrals
// @access  Private (Student)
exports.createReferralRequest = async (req, res) => {
  try {
    const { jobId, message, resumeLink } = req.body;
    
    // Check if job exists and is approved
    const job = await Job.findById(jobId).populate('postedBy');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (job.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Can only request referral for approved jobs'
      });
    }
    
    // Check if job is expired
    if (job.expiryDate < new Date()) {
      return res.status(403).json({
        success: false,
        message: 'This job has expired'
      });
    }
    
    // Check if student already requested referral for this job
    const existingReferral = await Referral.findOne({
      job: jobId,
      student: req.user._id
    });
    
    if (existingReferral) {
      return res.status(400).json({
        success: false,
        message: 'You have already requested a referral for this job',
        referral: existingReferral
      });
    }
    
    // Create referral request
    const referral = await Referral.create({
      job: jobId,
      student: req.user._id,
      alumni: job.postedBy._id,
      message,
      resumeLink: resumeLink || req.user.resumeLink,
      studentEmail: req.user.email,
      studentPhone: req.user.phone
    });
    
    // Increment referral count on job
    job.referralCount += 1;
    await job.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'referral_requested',
      targetModel: 'Referral',
      targetId: referral._id,
      details: `Referral requested for: ${job.title}`,
      newStatus: 'pending'
    });
    
    // Send email to alumni
    await sendReferralRequestEmail(referral, job, req.user, job.postedBy);
    
    res.status(201).json({
      success: true,
      message: 'Referral request sent successfully!',
      referral
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create referral request',
      error: error.message
    });
  }
};

// @desc    Get all referrals (filtered by role)
// @route   GET /api/referrals
// @access  Private
exports.getAllReferrals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter based on user role
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'alumni') {
      query.alumni = req.user._id;
    }
    // Admin can see all
    
    if (status) {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const referrals = await Referral.find(query)
      .populate('job', 'title company location jobType')
      .populate('student', 'name email phone batch branch')
      .populate('alumni', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Referral.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: referrals.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      referrals
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referrals',
      error: error.message
    });
  }
};

// @desc    Get single referral details
// @route   GET /api/referrals/:id
// @access  Private
exports.getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('job')
      .populate('student', 'name email phone batch branch rollNumber resumeLink')
      .populate('alumni', 'name email company phone');
    
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }
    
    // Check if user is authorized to view this referral
    const isAuthorized = 
      req.user.role === 'admin' ||
      referral.student._id.toString() === req.user._id.toString() ||
      referral.alumni._id.toString() === req.user._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this referral'
      });
    }
    
    // Mark as viewed if alumni is viewing for first time
    if (
      req.user.role === 'alumni' && 
      referral.alumni._id.toString() === req.user._id.toString() &&
      !referral.isViewed
    ) {
      referral.isViewed = true;
      referral.viewedAt = new Date();
      await referral.save();
    }
    
    res.status(200).json({
      success: true,
      referral
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referral',
      error: error.message
    });
  }
};

// @desc    Respond to referral request (Alumni Only)
// @route   PUT /api/referrals/:id/respond
// @access  Private (Alumni - Owner)
exports.respondToReferral = async (req, res) => {
  try {
    const { action, response } = req.body;  // action: 'accept' or 'reject'
    
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "accept" or "reject"'
      });
    }
    
    const referral = await Referral.findById(req.params.id)
      .populate('job', 'title company')
      .populate('student', 'name email')
      .populate('alumni', 'name email');
    
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }
    
    // Check if alumni is the owner
    if (referral.alumni._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to your own referrals'
      });
    }
    
    // Check if already responded
    if (referral.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'You have already responded to this referral'
      });
    }
    
    referral.status = action === 'accept' ? 'accepted' : 'rejected';
    referral.alumniResponse = response;
    referral.respondedAt = new Date();
    await referral.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: action === 'accept' ? 'referral_accepted' : 'referral_rejected',
      targetModel: 'Referral',
      targetId: referral._id,
      details: `Referral ${action}ed for: ${referral.job.title}`,
      previousStatus: 'pending',
      newStatus: referral.status
    });
    
    // Send email to student
    await sendReferralResponseEmail(
      referral, 
      referral.job, 
      referral.student, 
      referral.alumni, 
      action === 'accept'
    );
    
    res.status(200).json({
      success: true,
      message: `Referral ${action}ed successfully`,
      referral
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to respond to referral',
      error: error.message
    });
  }
};

// @desc    Withdraw referral request (Student Only)
// @route   DELETE /api/referrals/:id
// @access  Private (Student - Owner)
exports.withdrawReferral = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id);
    
    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
    }
    
    // Check if student is the owner
    if (referral.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only withdraw your own referrals'
      });
    }
    
    // Can only withdraw pending referrals
    if (referral.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only withdraw pending referrals'
      });
    }
    
    referral.status = 'withdrawn';
    await referral.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'referral_withdrawn',
      targetModel: 'Referral',
      targetId: referral._id,
      details: 'Referral request withdrawn',
      previousStatus: 'pending',
      newStatus: 'withdrawn'
    });
    
    res.status(200).json({
      success: true,
      message: 'Referral withdrawn successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to withdraw referral',
      error: error.message
    });
  }
};

// @desc    Get referral statistics
// @route   GET /api/referrals/stats
// @access  Private
exports.getReferralStats = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'alumni') {
      query.alumni = req.user._id;
    }
    
    const stats = await Referral.aggregate([
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
      accepted: 0,
      rejected: 0,
      withdrawn: 0
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
