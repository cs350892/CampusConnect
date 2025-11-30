const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById
} = require('../controllers/jobController');

/**
 * SIMPLE JOB ROUTES - NO LOGIN REQUIRED
 * All routes are public - anyone can post and view jobs
 */

// @route   GET /api/jobs
// @desc    Get all jobs with optional search/filter
// @access  Public
router.get('/jobs', getAllJobs);

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/jobs/:id', getJobById);

// @route   POST /api/jobs
// @desc    Create a new job post (no login required)
// @access  Public
router.post('/jobs', createJob);

module.exports = router;
