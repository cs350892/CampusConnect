const Job = require('../models/Job');

/**
 * SIMPLE JOB CONTROLLER - NO LOGIN REQUIRED
 * Anyone can post jobs and view jobs without authentication
 */

// @desc    Create a new job post (NO LOGIN REQUIRED)
// @route   POST /api/jobs
// @access  Public
const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      description,
      location,
      applicationLink,
      postedBy,
      email
    } = req.body;

    // Validation
    if (!jobTitle || !companyName || !description || !location || !applicationLink || !postedBy) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: jobTitle, companyName, description, location, applicationLink, postedBy'
      });
    }

    // Create job
    const job = await Job.create({
      jobTitle,
      companyName,
      description,
      location,
      applicationLink,
      postedBy,
      email: email || undefined // Optional field
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job
    });

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      company,
      location,
      page = 1,
      limit = 20
    } = req.query;

    // Build query - only show active jobs
    const query = { isActive: true };

    // Text search across multiple fields
    if (search) {
      query.$or = [
        { jobTitle: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }

    if (company) {
      query.companyName = new RegExp(company, 'i');
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Pagination
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      jobs
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (!job.isActive) {
      return res.status(404).json({
        success: false,
        message: 'This job is no longer active'
      });
    }

    res.status(200).json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById
};
