const express = require('express');
const router = express.Router();
const {
  adminLogin,
  getPendingStudents,
  getAllStudents,
  approveStudent,
  rejectStudent,
  bulkApproveStudents,
  getPendingAlumni,
  getAllAlumniForAdmin,
  approveAlumni,
  rejectAlumni,
  bulkApproveAlumni,
  getPendingRegistrations,
  getAllRegistrations,
  approveRegistration,
  rejectRegistration,
  bulkApproveRegistrations,
  getDashboardStats
} = require('../controllers/approvalController');

// Simple admin auth middleware (token check)
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No admin token provided'
    });
  }

  // Decode and validate token
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (!decoded.includes('ADMIN')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin token'
      });
    }
    
    // Extract email for logging
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

// ========== ADMIN LOGIN ==========
// Test route
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Admin Approval System is working!',
    timestamp: new Date().toISOString()
  });
});

router.post('/login', adminLogin);

// ========== NEW PENDING REGISTRATIONS ROUTES ==========
router.get('/pending-registrations', adminAuth, getPendingRegistrations);
router.get('/registrations', adminAuth, getAllRegistrations);
router.put('/registrations/:id/approve', adminAuth, approveRegistration);
router.put('/registrations/:id/reject', adminAuth, rejectRegistration);
router.post('/registrations/bulk-approve', adminAuth, bulkApproveRegistrations);

// ========== LEGACY STUDENT ROUTES (if still needed) ==========
router.get('/students/pending', adminAuth, getPendingStudents);
router.get('/students', adminAuth, getAllStudents);
router.put('/students/:id/approve', adminAuth, approveStudent);
router.put('/students/:id/reject', adminAuth, rejectStudent);
router.post('/students/bulk-approve', adminAuth, bulkApproveStudents);

// ========== LEGACY ALUMNI ROUTES (if still needed) ==========
router.get('/alumni/pending', adminAuth, getPendingAlumni);
router.get('/alumni', adminAuth, getAllAlumniForAdmin);
router.put('/alumni/:id/approve', adminAuth, approveAlumni);
router.put('/alumni/:id/reject', adminAuth, rejectAlumni);
router.post('/alumni/bulk-approve', adminAuth, bulkApproveAlumni);

// ========== DASHBOARD ==========
router.get('/stats', adminAuth, getDashboardStats);

module.exports = router;
