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
  getActivityLogs
} = require('../controllers/adminController');

const { isAuthenticated, isAdmin } = require('../middlewares/auth');

/**
 * ADMIN ROUTES
 * Explanation: Sirf admin access kar sakta hai
 * All admin panel operations
 */

// All routes require admin authentication
router.use(isAuthenticated, isAdmin);

// Dashboard
router.get('/admin/stats', getDashboardStats);
router.get('/admin/activity-logs', getActivityLogs);

// Alumni management
router.get('/admin/alumni', getAllAlumni);
router.get('/admin/alumni/pending', getPendingAlumni);
router.put('/admin/alumni/:id/approve', approveAlumni);
router.put('/admin/alumni/:id/reject', rejectAlumni);
router.post('/admin/alumni/bulk-approve', bulkApproveAlumni);
router.post('/admin/alumni/bulk-reject', bulkRejectAlumni);

// Job management
router.get('/admin/jobs/pending', getPendingJobs);
router.post('/admin/jobs/bulk-approve', bulkApproveJobs);

// Referral management
router.get('/admin/referrals', getAllReferrals);

module.exports = router;
