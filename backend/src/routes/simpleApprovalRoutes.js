const express = require('express');
const router = express.Router();
const {
  adminLogin,
  registerPending,
  getPendingEntries,
  approveEntry,
  rejectEntry,
  getStats
} = require('../controllers/simpleApprovalController');

/**
 * SIMPLE ADMIN APPROVAL ROUTES
 * Simple text-based approval system
 */

// Simple admin auth middleware
const simpleAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No admin token provided'
    });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (!decoded.includes('ADMIN')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token'
      });
    }
    
    const parts = decoded.split(':');
    req.adminEmail = parts[0];
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid admin token format'
    });
  }
};

// PUBLIC ROUTES
router.post('/login', adminLogin);
router.post('/register-pending', (req, res, next) => {
  console.log('🎯 Route handler: /register-pending hit');
  console.log('🎯 Headers:', req.headers);
  next();
}, registerPending);

// ADMIN PROTECTED ROUTES
router.get('/pending', simpleAdminAuth, getPendingEntries);
router.post('/approve', simpleAdminAuth, approveEntry);
router.post('/reject', simpleAdminAuth, rejectEntry);
router.get('/stats', simpleAdminAuth, getStats);

module.exports = router;
