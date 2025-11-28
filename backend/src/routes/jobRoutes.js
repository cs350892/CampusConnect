const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  approveJob,
  rejectJob,
  getJobStats
} = require('../controllers/jobController');

const {
  isAuthenticated,
  isVerifiedAlumni,
  isAdmin,
  optionalAuth
} = require('../middlewares/auth');

const { body } = require('express-validator');

/**
 * JOB ROUTES
 * Explanation: Job se related saare endpoints
 */

// Validation middleware for job creation
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance']).withMessage('Invalid job type'),
  body('description').isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
];

// Public routes (with optional auth)
router.get('/jobs', optionalAuth, getAllJobs);

// Specific routes MUST come before :id routes
router.get('/jobs/my-jobs', isAuthenticated, isVerifiedAlumni, getMyJobs);
router.get('/jobs/stats', isAuthenticated, getJobStats);

// Dynamic routes come after specific routes
router.get('/jobs/:id', optionalAuth, getJobById);

// Alumni routes (verified alumni only)
router.post('/jobs', isAuthenticated, isVerifiedAlumni, jobValidation, createJob);
router.put('/jobs/:id', isAuthenticated, isVerifiedAlumni, updateJob);
router.delete('/jobs/:id', isAuthenticated, deleteJob);  // Alumni or Admin

// Admin routes
router.put('/jobs/:id/approve', isAuthenticated, isAdmin, approveJob);
router.put('/jobs/:id/reject', isAuthenticated, isAdmin, rejectJob);

module.exports = router;
