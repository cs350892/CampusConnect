const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

/**
 * AUTH CONTROLLER
 * Explanation: User registration, login, logout ke functions
 * - JWT token generate karta hai
 * - Student auto-approved, Alumni needs admin approval
 */

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, role, phone,
      // Student fields
      rollNumber, branch, batch, techStack, resumeLink,
      // Alumni fields
      company
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
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
    
    // Create user
    const userData = {
      name,
      email,
      password,
      role,
      phone,
      batch,
      branch
    };
    
    // Add role-specific fields
    if (role === 'student') {
      userData.rollNumber = rollNumber;
      userData.techStack = techStack ? techStack.split(',').map(t => t.trim()) : [];
      userData.resumeLink = resumeLink;
    } else if (role === 'alumni') {
      userData.company = company;
      userData.techStack = techStack ? techStack.split(',').map(t => t.trim()) : [];
    }
    
    const user = await User.create(userData);
    
    // Log activity
    await ActivityLog.logActivity({
      performedBy: user._id,
      action: role === 'alumni' ? 'alumni_registered' : 'user_registered',
      targetModel: 'User',
      targetId: user._id,
      details: `${role} registered: ${name}`,
      newStatus: role === 'alumni' ? 'pending' : 'approved'
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Send appropriate response based on role
    const message = role === 'alumni' 
      ? 'Registration successful! Your account is pending admin approval.'
      : 'Registration successful!';
    
    res.status(201).json({
      success: true,
      message,
      token,
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Get user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }
    
    // Check password
    const isPasswordMatched = await user.comparePassword(password);
    
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
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
      'name', 'phone', 'image', 'pronouns', 'location', 'headline',
      'resumeLink', 'techStack', 'socialLinks'
    ];
    
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
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
