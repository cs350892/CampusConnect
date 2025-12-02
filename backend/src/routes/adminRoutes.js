const express = require('express');
const router = express.Router();
const {
  getPendingAlumni,
  getAllAlumni,
  approveAlumni,
  rejectAlumni,
  bulkApproveAlumni,
  bulkRejectAlumni,
  getPendingJobs,
  bulkApproveJobs,
  getDashboardStats,
  getAllReferrals,
  getActivityLogs,
  // Simple admin approval
  simpleAdminLogin,
  getPendingEntries,
  approveStudent,
  approveAlumni: approveAlumniSimple,
  rejectStudent,
  rejectAlumni: rejectAlumniSimple
} = require('../controllers/adminController');

const { isAuthenticated, isAdmin } = require('../middlewares/auth');

/**
 * ADMIN ROUTES
 * Explanation: Sirf admin access kar sakta hai
 * All admin panel operations
 */

// ========== PUBLIC ROUTES (NO AUTH) ==========
// Simple admin login (NO /admin prefix - it's added by index.js)
router.post('/simple-login', simpleAdminLogin);

// Simple approval routes (no JWT - just for quick admin panel)
router.get('/pending-entries', getPendingEntries);
router.post('/approve-student/:id', approveStudent);
router.post('/approve-alumni/:id', approveAlumniSimple);
router.post('/reject-student/:id', rejectStudent);
router.post('/reject-alumni/:id', rejectAlumniSimple);

// All routes below require admin authentication
router.use(isAuthenticated, isAdmin);

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/activity-logs', getActivityLogs);

// Alumni management
router.get('/alumni', getAllAlumni);
router.get('/alumni/pending', getPendingAlumni);
router.put('/alumni/:id/approve', approveAlumni);
router.put('/alumni/:id/reject', rejectAlumni);
router.post('/alumni/bulk-approve', bulkApproveAlumni);
router.post('/alumni/bulk-reject', bulkRejectAlumni);

// Job management
router.get('/jobs/pending', getPendingJobs);
router.post('/jobs/bulk-approve', bulkApproveJobs);

// Referral management
router.get('/referrals', getAllReferrals);

module.exports = router;
