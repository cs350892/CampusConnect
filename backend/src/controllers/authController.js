const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');
const { cloudinary } = require('../utils/cloudinary');

/**
 * AUTH CONTROLLER
 * Explanation: User registration, login, logout ke functions
 * - JWT token generate karta hai
 * - ALL registrations go to PendingRegistration first
 * - Admin approval required before moving to User model
 */

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user (Saved in PendingRegistration, NOT in User)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role, phone,
      // Student fields
      rollNumber, branch, batch, techStack, resumeLink, image,
      // Alumni fields
      company
    } = req.body;
    
    // Check if already registered (in PendingRegistration OR User)
    const existingPending = await PendingRegistration.findOne({ email });
    const existingUser = await User.findOne({ email });
    
    if (existingPending) {
      return res.status(400).json({
        success: false,
        message: `Registration already submitted. Status: ${existingPending.status}. Please wait for admin approval.`
      });
    }
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Validate role
    if (!['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student or alumni'
      });
    }
    
    // Role-specific validation
    if (role === 'student' && !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required for students'
      });
    }
    
    if (role === 'alumni' && !company) {
      return res.status(400).json({
        success: false,
        message: 'Company is required for alumni'
      });
    }
    
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create pending registration data
    const pendingData = {
      name,
      email,
      password: hashedPassword, // Store hashed password
      role,
      phone,
      batch,
      branch,
      status: 'pending',
      submittedAt: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };
    
    // Add role-specific fields
    if (role === 'student') {
      pendingData.rollNumber = rollNumber;
      pendingData.techStack = techStack ? (Array.isArray(techStack) ? techStack : techStack.split(',').map(t => t.trim())) : [];
      pendingData.resumeLink = resumeLink;
      pendingData.image = image;
    } else if (role === 'alumni') {
      pendingData.company = company;
      pendingData.techStack = techStack ? (Array.isArray(techStack) ? techStack : techStack.split(',').map(t => t.trim())) : [];
      pendingData.image = image;
    }
    
    // Save to PendingRegistration (NOT User model)
    const pending = await PendingRegistration.create(pendingData);
    
    res.status(201).json({
      success: true,
      message: '✅ Registration submitted successfully! Your request is pending admin approval. You will receive an email once approved.',
      pendingId: pending._id,
      status: 'pending',
      submittedAt: pending.submittedAt
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// @desc    Login user (email + rollNumber ONLY)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, rollNumber } = req.body;
    
    // Validate input
    if (!email || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and roll number'
      });
    }
    
    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRollNumber = rollNumber.trim();
    
    // Find user by email and rollNumber
    const user = await User.findOne({ 
      email: normalizedEmail, 
      rollNumber: normalizedRollNumber 
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or roll number'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: user._id,
      action: 'user_login',
      targetModel: 'User',
      targetId: user._id,
      details: `User logged in: ${user.name}`
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Warning for pending alumni
    let warning = null;
    if (user.role === 'alumni' && !user.isVerified) {
      warning = 'Your alumni account is pending verification. Some features are restricted.';
    }
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      warning,
      token,
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'image', 'imageUrl', 'cloudinaryPublicId', 'pronouns', 
      'location', 'headline', 'resumeLink', 'techStack', 'socialLinks'
    ];
    
    const updates = {};
    
    // Get current user to check for old image
    const currentUser = await User.findById(req.user._id);
    
    // Handle image update with old image deletion
    if (req.body.cloudinaryPublicId && req.body.cloudinaryPublicId !== currentUser.cloudinaryPublicId) {
      // Delete old image from Cloudinary if exists
      if (currentUser.cloudinaryPublicId) {
        try {
          console.log(`🗑️  Deleting old profile image: ${currentUser.cloudinaryPublicId}`);
          await cloudinary.uploader.destroy(currentUser.cloudinaryPublicId);
          console.log(`✅ Old profile image deleted from Cloudinary`);
        } catch (deleteError) {
          console.error('⚠️  Failed to delete old image:', deleteError.message);
          // Continue with update even if deletion fails
        }
      }
      
      // Update with new image data
      updates.image = req.body.image;
      updates.imageUrl = req.body.imageUrl;
      updates.cloudinaryPublicId = req.body.cloudinaryPublicId;
    } else {
      // Regular field updates
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined && !['image', 'imageUrl', 'cloudinaryPublicId'].includes(field)) {
          updates[field] = req.body[field];
        }
      });
    }
    
    // Students can update DSA problems and isPlaced
    if (req.user.role === 'student') {
      if (req.body.dsaProblems !== undefined) updates.dsaProblems = req.body.dsaProblems;
      if (req.body.isPlaced !== undefined) updates.isPlaced = req.body.isPlaced;
    }
    
    // Alumni can update company
    if (req.user.role === 'alumni' && req.body.company) {
      updates.company = req.body.company;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Log activity
    await ActivityLog.logActivity({
      performedBy: req.user._id,
      action: 'user_logout',
      targetModel: 'User',
      targetId: req.user._id,
      details: `User logged out: ${req.user.name}`
    });
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
};
