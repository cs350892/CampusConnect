const Student = require('../models/student');
const Alumni = require('../models/alumni');
const PendingRegistration = require('../models/PendingRegistration');
const User = require('../models/User');

/**
 * ADMIN APPROVAL CONTROLLER
 * Admin approval system for students and alumni profiles
 * Admin Credentials: cs350892@gmail.com / Chandra@5009
 */

// ========== ADMIN LOGIN ==========

// @desc    Admin login with email/password
// @route   POST /api/admin-approval/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials from environment or hardcoded
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cs350892@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Chandra@5009';

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Create admin session token
    const adminToken = Buffer.from(`${ADMIN_EMAIL}:${Date.now()}:ADMIN`).toString('base64');

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token: adminToken,
      admin: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// ========== STUDENT APPROVAL ==========

// @desc    Get all pending students
// @route   GET /api/admin/students/pending
// @access  Private (Admin)
exports.getPendingStudents = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const students = await Student.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      students
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending students',
      error: error.message
    });
  }
};

// @desc    Get all students (with filters)
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getAllStudents = async (req, res) => {
  try {
    const { status, search, batch, branch, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (batch) {
      query.batch = batch;
    }

    if (branch) {
      query.branch = branch;
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { rollNumber: new RegExp(search, 'i') }
      ];
    }

    const students = await Student.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      students
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// @desc    Approve student
// @route   PUT /api/admin/students/:id/approve
// @access  Private (Admin)
exports.approveStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Student is already approved'
      });
    }

    student.status = 'approved';
    student.approvedAt = new Date();
    student.rejectionReason = undefined;
    await student.save();

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

// @desc    Reject student
// @route   PUT /api/admin/students/:id/reject
// @access  Private (Admin)
exports.rejectStudent = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.status = 'rejected';
    student.rejectionReason = reason;
    await student.save();

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

// @desc    Bulk approve students
// @route   POST /api/admin/students/bulk-approve
// @access  Private (Admin)
exports.bulkApproveStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student IDs array'
      });
    }

    const result = await Student.updateMany(
      {
        _id: { $in: studentIds },
        status: 'pending'
      },
      {
        $set: {
          status: 'approved',
          approvedAt: new Date()
        },
        $unset: { rejectionReason: 1 }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} students approved successfully`,
      approvedCount: result.modifiedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve students',
      error: error.message
    });
  }
};

// ========== ALUMNI APPROVAL ==========

// @desc    Get all pending alumni
// @route   GET /api/admin/alumni/pending
// @access  Private (Admin)
exports.getPendingAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const alumni = await Alumni.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Alumni.countDocuments({ status: 'pending' });

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
exports.getAllAlumniForAdmin = async (req, res) => {
  try {
    const { status, search, batch, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (status) {
      query.status = status;
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

    const alumni = await Alumni.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Alumni.countDocuments(query);

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
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    if (alumni.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Alumni is already approved'
      });
    }

    alumni.status = 'approved';
    alumni.approvedAt = new Date();
    alumni.rejectionReason = undefined;
    await alumni.save();

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

// @desc    Reject alumni
// @route   PUT /api/admin/alumni/:id/reject
// @access  Private (Admin)
exports.rejectAlumni = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found'
      });
    }

    alumni.status = 'rejected';
    alumni.rejectionReason = reason;
    await alumni.save();

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

// @desc    Bulk approve alumni
// @route   POST /api/admin/alumni/bulk-approve
// @access  Private (Admin)
exports.bulkApproveAlumni = async (req, res) => {
  try {
    const { alumniIds } = req.body;

    if (!alumniIds || !Array.isArray(alumniIds) || alumniIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide alumni IDs array'
      });
    }

    const result = await Alumni.updateMany(
      {
        _id: { $in: alumniIds },
        status: 'pending'
      },
      {
        $set: {
          status: 'approved',
          approvedAt: new Date()
        },
        $unset: { rejectionReason: 1 }
      }
    );

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

// ========== PENDING REGISTRATIONS MANAGEMENT ==========

// @desc    Get all pending registrations
// @route   GET /api/admin-approval/pending-registrations
// @access  Private (Admin)
exports.getPendingRegistrations = async (req, res) => {
  try {
    const { role, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const query = { status: 'pending' };
    if (role) query.role = role;

    const registrations = await PendingRegistration.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PendingRegistration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      registrations: registrations.map(r => r.getDisplayInfo())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending registrations',
      error: error.message
    });
  }
};

// @desc    Get all registrations (with status filter)
// @route   GET /api/admin-approval/registrations
// @access  Private (Admin)
exports.getAllRegistrations = async (req, res) => {
  try {
    const { status, role, search, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { rollNumber: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') }
      ];
    }

    const registrations = await PendingRegistration.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PendingRegistration.countDocuments(query);

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      registrations: registrations.map(r => r.getDisplayInfo())
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

// @desc    Approve registration - Move to User database
// @route   PUT /api/admin-approval/registrations/:id/approve
// @access  Private (Admin)
exports.approveRegistration = async (req, res) => {
  try {
    const registration = await PendingRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Registration already ${registration.status}`
      });
    }

    // Create user in main User database
    const userData = {
      name: registration.name,
      email: registration.email,
      password: registration.password, // Already hashed
      phone: registration.phone,
      role: registration.role,
      batch: registration.batch,
      branch: registration.branch,
      techStack: registration.techStack,
      image: registration.image,
      isVerified: true, // Auto-verify on admin approval
      verificationStatus: 'approved'
    };

    // Add role-specific fields
    if (registration.role === 'student') {
      userData.rollNumber = registration.rollNumber;
      userData.resumeLink = registration.resumeLink;
    } else if (registration.role === 'alumni') {
      userData.company = registration.company;
    }

    // Create user in User model
    const user = await User.create(userData);

    // Update pending registration status
    registration.status = 'approved';
    registration.reviewedBy = req.adminEmail || 'admin';
    registration.reviewedAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: `✅ ${registration.role} registration approved! User created successfully.`,
      user: user.getPublicProfile(),
      registrationId: registration._id
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve registration',
      error: error.message
    });
  }
};

// @desc    Reject registration
// @route   PUT /api/admin-approval/registrations/:id/reject
// @access  Private (Admin)
exports.rejectRegistration = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const registration = await PendingRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    if (registration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Registration already ${registration.status}`
      });
    }

    registration.status = 'rejected';
    registration.rejectionReason = reason;
    registration.reviewedBy = req.adminEmail || 'admin';
    registration.reviewedAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: '❌ Registration rejected',
      registration: registration.getDisplayInfo()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject registration',
      error: error.message
    });
  }
};

// @desc    Bulk approve registrations
// @route   POST /api/admin-approval/registrations/bulk-approve
// @access  Private (Admin)
exports.bulkApproveRegistrations = async (req, res) => {
  try {
    const { registrationIds } = req.body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide registration IDs array'
      });
    }

    const registrations = await PendingRegistration.find({
      _id: { $in: registrationIds },
      status: 'pending'
    });

    let approvedCount = 0;
    const errors = [];

    for (const registration of registrations) {
      try {
        // Create user
        const userData = {
          name: registration.name,
          email: registration.email,
          password: registration.password,
          phone: registration.phone,
          role: registration.role,
          batch: registration.batch,
          branch: registration.branch,
          techStack: registration.techStack,
          image: registration.image,
          isVerified: true,
          verificationStatus: 'approved'
        };

        if (registration.role === 'student') {
          userData.rollNumber = registration.rollNumber;
          userData.resumeLink = registration.resumeLink;
        } else if (registration.role === 'alumni') {
          userData.company = registration.company;
        }

        await User.create(userData);

        // Update status
        registration.status = 'approved';
        registration.reviewedBy = req.adminEmail || 'admin';
        registration.reviewedAt = new Date();
        await registration.save();

        approvedCount++;
      } catch (err) {
        errors.push({
          id: registration._id,
          email: registration.email,
          error: err.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `✅ ${approvedCount} registrations approved successfully`,
      approvedCount,
      totalRequested: registrationIds.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to bulk approve registrations',
      error: error.message
    });
  }
};

// ========== DASHBOARD STATS ==========

// @desc    Get admin dashboard stats
// @route   GET /api/admin-approval/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // PendingRegistration stats (NEW SYSTEM)
    const totalPendingRegs = await PendingRegistration.countDocuments({ status: 'pending' });
    const totalApprovedRegs = await PendingRegistration.countDocuments({ status: 'approved' });
    const totalRejectedRegs = await PendingRegistration.countDocuments({ status: 'rejected' });
    
    const pendingStudentRegs = await PendingRegistration.countDocuments({ role: 'student', status: 'pending' });
    const pendingAlumniRegs = await PendingRegistration.countDocuments({ role: 'alumni', status: 'pending' });

    // Approved users in main database
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAlumni = await User.countDocuments({ role: 'alumni' });

    // Legacy Student/Alumni models (if still in use)
    const legacyStudents = await Student.countDocuments().catch(() => 0);
    const legacyAlumni = await Alumni.countDocuments().catch(() => 0);

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPendingCount = await PendingRegistration.countDocuments({
      submittedAt: { $gte: sevenDaysAgo },
      status: 'pending'
    });

    // Recent pending registrations (for display)
    const recentPendingRegistrations = await PendingRegistration.find({ status: 'pending' })
      .sort({ submittedAt: -1 })
      .limit(10)
      .select('name email role rollNumber company batch branch submittedAt');

    res.status(200).json({
      success: true,
      stats: {
        pendingRegistrations: {
          total: totalPendingRegs,
          students: pendingStudentRegs,
          alumni: pendingAlumniRegs,
          recentWeek: recentPendingCount
        },
        processedRegistrations: {
          approved: totalApprovedRegs,
          rejected: totalRejectedRegs
        },
        approvedUsers: {
          total: totalUsers,
          students: totalStudents,
          alumni: totalAlumni
        },
        legacy: {
          students: legacyStudents,
          alumni: legacyAlumni
        },
        recentPending: recentPendingRegistrations.map(r => ({
          id: r._id,
          name: r.name,
          email: r.email,
          role: r.role,
          rollNumber: r.rollNumber,
          company: r.company,
          batch: r.batch,
          branch: r.branch,
          submittedAt: r.submittedAt
        }))
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
