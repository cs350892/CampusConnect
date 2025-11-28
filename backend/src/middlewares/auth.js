const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * AUTHENTICATION MIDDLEWARE
 * Explanation: JWT token verify karta hai aur user ko request me attach karta hai
 * Header me "Authorization: Bearer <token>" hona chahiye
 */

// Verify JWT Token
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user account is active
    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.'
      });
    }
    
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

/**
 * ROLE-BASED ACCESS CONTROL
 * Explanation: Check karta hai ki user ka role allowed hai ya nahi
 * Usage: isAuthenticated, authorizeRoles('admin', 'alumni')
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

/**
 * SPECIFIC ROLE CHECKS
 * Explanation: Quick shortcuts for common role checks
 */

// Only Admin can access
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can access this resource'
    });
  }
  next();
};

// Only Alumni can access
exports.isAlumni = (req, res, next) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({
      success: false,
      message: 'Only alumni can access this resource'
    });
  }
  next();
};

// Only Students can access
exports.isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Only students can access this resource'
    });
  }
  next();
};

/**
 * VERIFIED ALUMNI CHECK
 * Explanation: Alumni ko verified hona chahiye (admin approved)
 * Job posting ke liye ye check lagega
 */
exports.isVerifiedAlumni = (req, res, next) => {
  if (req.user.role !== 'alumni') {
    return res.status(403).json({
      success: false,
      message: 'Only alumni can access this resource'
    });
  }
  
  if (!req.user.isVerified || req.user.verificationStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Your alumni account is not verified yet. Please wait for admin approval.'
    });
  }
  
  next();
};

/**
 * OPTIONAL AUTH
 * Explanation: Token ho to user attach kar do, nahi to skip kar do
 * Public endpoints ke liye useful (like job listing - logged in users ko extra features)
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    }
    
    next();
  } catch (error) {
    // Token invalid hai but optional hai so continue
    next();
  }
};
