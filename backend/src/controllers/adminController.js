const User = require('../models/User');
const Job = require('../models/Job');
const Referral = require('../models/Referral');
const ActivityLog = require('../models/ActivityLog');
const { sendAlumniApprovalEmail, sendAlumniRejectionEmail } = require('../utils/sendEmail');

/**
 * ADMIN CONTROLLER
 * Explanation: Admin ke saare controls - alumni approve/reject, job approve/reject, stats
 * - Only admin access hai
 * - Bulk operations support
 * - Activity logs maintain karta hai
 */

// ========== ALUMNI MANAGEMENT ==========

// @desc    Get all pending alumni
// @route   GET /api/admin/alumni/pending
// @access  Private (Admin)
exports.getPendingAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const alumni = await User.find({
      role: 'alumni',
      verificationStatus: 'pending'
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments({
      role: 'alumni',
      verificationStatus: 'pending'
    });
    
    res.status(200).json({
      success: true,
      count: alumni.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      alumni
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending alumni',
      error: error.message
    });
  }
};

// @desc    Get all alumni (with filters)
// @route   GET /api/admin/alumni
// @access  Private (Admin)
exports.getAllAlumni = async (req, res) => {
  try {
    const { status, search, batch, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = { role: 'alumni' };
    
    if (status) {
      query.verificationStatus = status;
    }
    
    if (batch) {
      query.batch = batch;
    }
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') }
      ];
    }
    
    const alumni = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: alumni.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      alumni
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni',
      error: error.message
    });
  }
};

// @desc    Approve alumni
// @route   PUT /api/admin/alumni/:id/approve
// @access  Private (Admin)
exports.approveAlumni = async (req, res) => {
  try {
    const alumni = await User.findById(req.params.id);
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }
    
    if (alumni.role !== 'alumni') {
      return res.status(400).json({
        success: false,
        message: 'User is not an alumni'
      });
    }
    
    if (alumni.verificationStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Alumni is already approved'
      });
    }
    
    alumni.isVerified = true;
    alumni.verificationStatus = 'approved';
    alumni.rejectionReason = undefined;  // Clear any previous rejection reason
    await alumni.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'alumni_approved',
      targetModel: 'User',
      targetId: alumni._id,
      details: `Alumni approved: ${alumni.name}`,
      previousStatus: 'pending',
      newStatus: 'approved'
    });
    
    // Send approval email
    await sendAlumniApprovalEmail(alumni);
    
    res.status(200).json({
      success: true,
      message: 'Alumni approved successfully',
      alumni: alumni.getPublicProfile()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve alumni',
      error: error.message
    });
  }
};

// @desc    Reject alumni
// @route   PUT /api/admin/alumni/:id/reject
// @access  Private (Admin)
exports.rejectAlumni = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const alumni = await User.findById(req.params.id);
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }
    
    if (alumni.role !== 'alumni') {
      return res.status(400).json({
        success: false,
        message: 'User is not an alumni'
      });
    }
    
    alumni.isVerified = false;
    alumni.verificationStatus = 'rejected';
    alumni.rejectionReason = reason;
    await alumni.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'alumni_rejected',
      targetModel: 'User',
      targetId: alumni._id,
      details: `Alumni rejected: ${alumni.name}`,
      reason,
      previousStatus: 'pending',
      newStatus: 'rejected'
    });
    
    // Send rejection email
    await sendAlumniRejectionEmail(alumni, reason);
    
    res.status(200).json({
      success: true,
      message: 'Alumni rejected',
      alumni: alumni.getPublicProfile()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject alumni',
      error: error.message
    });
  }
};

// @desc    Bulk approve alumni
// @route   POST /api/admin/alumni/bulk-approve
// @access  Private (Admin)
exports.bulkApproveAlumni = async (req, res) => {
  try {
    const { alumniIds } = req.body;  // Array of alumni IDs
    
    if (!alumniIds || !Array.isArray(alumniIds) || alumniIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alumni IDs array'
      });
    }
    
    const result = await User.updateMany(
      {
        _id: { $in: alumniIds },
        role: 'alumni',
        verificationStatus: 'pending'
      },
      {
        $set: {
          isVerified: true,
          verificationStatus: 'approved'
        },
        $unset: { rejectionReason: 1 }
      }
    );
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'bulk_approval',
      targetModel: 'User',
      targetId: req.user._id,
      details: `Bulk alumni approval`,
      affectedCount: result.modifiedCount,
      newStatus: 'approved'
    });
    
    // Send emails to all approved alumni (in background)
    const approvedAlumni = await User.find({ _id: { $in: alumniIds } });
    approvedAlumni.forEach(alumni => {
      sendAlumniApprovalEmail(alumni).catch(err => 
        console.error('Email error:', err.message)
      );
    });
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} alumni approved successfully`,
      approvedCount: result.modifiedCount
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve alumni',
      error: error.message
    });
  }
};

// @desc    Bulk reject alumni
// @route   POST /api/admin/alumni/bulk-reject
// @access  Private (Admin)
exports.bulkRejectAlumni = async (req, res) => {
  try {
    const { alumniIds, reason } = req.body;
    
    if (!alumniIds || !Array.isArray(alumniIds) || alumniIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alumni IDs array'
      });
    }
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }
    
    const result = await User.updateMany(
      {
        _id: { $in: alumniIds },
        role: 'alumni',
        verificationStatus: 'pending'
      },
      {
        $set: {
          isVerified: false,
          verificationStatus: 'rejected',
          rejectionReason: reason
        }
      }
    );
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'bulk_rejection',
      targetModel: 'User',
      targetId: req.user._id,
      details: `Bulk alumni rejection`,
      reason,
      affectedCount: result.modifiedCount,
      newStatus: 'rejected'
    });
    
    // Send emails
    const rejectedAlumni = await User.find({ _id: { $in: alumniIds } });
    rejectedAlumni.forEach(alumni => {
      sendAlumniRejectionEmail(alumni, reason).catch(err => 
        console.error('Email error:', err.message)
      );
    });
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} alumni rejected`,
      rejectedCount: result.modifiedCount
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bulk reject alumni',
      error: error.message
    });
  }
};

// ========== JOB MANAGEMENT ==========

// @desc    Get all pending jobs
// @route   GET /api/admin/jobs/pending
// @access  Private (Admin)
exports.getPendingJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const jobs = await Job.find({ status: 'pending' })
      .populate('postedBy', 'name email company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Job.countDocuments({ status: 'pending' });
    
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
      message: 'Failed to fetch pending jobs',
      error: error.message
    });
  }
};

// @desc    Bulk approve jobs
// @route   POST /api/admin/jobs/bulk-approve
// @access  Private (Admin)
exports.bulkApproveJobs = async (req, res) => {
  try {
    const { jobIds } = req.body;
    
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job IDs array'
      });
    }
    
    const result = await Job.updateMany(
      {
        _id: { $in: jobIds },
        status: 'pending'
      },
      {
        $set: {
          status: 'approved',
          approvedBy: req.user._id,
          approvedAt: new Date()
        }
      }
    );
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'bulk_approval',
      targetModel: 'Job',
      targetId: req.user._id,
      details: `Bulk job approval`,
      affectedCount: result.modifiedCount,
      newStatus: 'approved'
    });
    
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} jobs approved successfully`,
      approvedCount: result.modifiedCount
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve jobs',
      error: error.message
    });
  }
};

// ========== DASHBOARD STATS ==========

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const pendingAlumni = await User.countDocuments({ 
      role: 'alumni', 
      verificationStatus: 'pending' 
    });
    const verifiedAlumni = await User.countDocuments({ 
      role: 'alumni', 
      isVerified: true 
    });
    
    // Job stats
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ 
      status: 'approved',
      expiryDate: { $gt: new Date() }
    });
    const pendingJobs = await Job.countDocuments({ status: 'pending' });
    const rejectedJobs = await Job.countDocuments({ status: 'rejected' });
    const expiredJobs = await Job.countDocuments({ status: 'expired' });
    
    // Referral stats
    const totalReferrals = await Referral.countDocuments();
    const pendingReferrals = await Referral.countDocuments({ status: 'pending' });
    const acceptedReferrals = await Referral.countDocuments({ status: 'accepted' });
    const rejectedReferrals = await Referral.countDocuments({ status: 'rejected' });
    
    // Recent activity
    const recentActivities = await ActivityLog.find()
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Top alumni by job posts
    const topAlumni = await Job.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$postedBy', jobCount: { $sum: 1 } } },
      { $sort: { jobCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'alumni'
        }
      },
      { $unwind: '$alumni' },
      {
        $project: {
          name: '$alumni.name',
          email: '$alumni.email',
          company: '$alumni.company',
          jobCount: 1
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          alumni: totalAlumni,
          pendingAlumni,
          verifiedAlumni
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          pending: pendingJobs,
          rejected: rejectedJobs,
          expired: expiredJobs
        },
        referrals: {
          total: totalReferrals,
          pending: pendingReferrals,
          accepted: acceptedReferrals,
          rejected: rejectedReferrals
        },
        topAlumni,
        recentActivities
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

// @desc    Get all referrals (Admin view)
// @route   GET /api/admin/referrals
// @access  Private (Admin)
exports.getAllReferrals = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (status) query.status = status;
    
    const referrals = await Referral.find(query)
      .populate('job', 'title company')
      .populate('student', 'name email batch branch')
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

// @desc    Get activity logs
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
exports.getActivityLogs = async (req, res) => {
  try {
    const { action, targetModel, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (action) query.action = action;
    if (targetModel) query.targetModel = targetModel;
    
    const logs = await ActivityLog.find(query)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      logs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity logs',
      error: error.message
    });
  }
};

// ========== SIMPLE ADMIN APPROVAL SYSTEM ==========

const Student = require('../models/student');
const Alumni = require('../models/alumni');

// @desc    Admin Login (Simple - hardcoded)
// @route   POST /api/admin/simple-login
// @access  Public
exports.simpleAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cs350892@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Chandra@5009';
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      res.status(200).json({
        success: true,
        message: 'Admin login successful',
        admin: { email: ADMIN_EMAIL, role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Get all pending students and alumni
// @route   GET /api/admin/pending-entries
// @access  Private (Admin)
exports.getPendingEntries = async (req, res) => {
  try {
    const pendingStudents = await Student.find({ status: 'pending' })
      .select('name email rollNumber batch branch phone techStack createdAt')
      .sort({ createdAt: -1 });
    
    const pendingAlumni = await Alumni.find({ status: 'pending' })
      .select('name email phone batch branch company techStack createdAt')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      students: pendingStudents,
      alumni: pendingAlumni,
      totalPending: pendingStudents.length + pendingAlumni.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending entries',
      error: error.message
    });
  }
};

// @desc    Approve student
// @route   POST /api/admin/approve-student/:id
// @access  Private (Admin)
exports.approveStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student approved successfully',
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve student',
      error: error.message
    });
  }
};

// @desc    Approve alumni
// @route   POST /api/admin/approve-alumni/:id
// @access  Private (Admin)
exports.approveAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date() },
      { new: true }
    );
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Alumni approved successfully',
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve alumni',
      error: error.message
    });
  }
};

// @desc    Reject student
// @route   POST /api/admin/reject-student/:id
// @access  Private (Admin)
exports.rejectStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Student rejected',
      student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject student',
      error: error.message
    });
  }
};

// @desc    Reject alumni
// @route   POST /api/admin/reject-alumni/:id
// @access  Private (Admin)
exports.rejectAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Alumni rejected',
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject alumni',
      error: error.message
    });
  }
};
