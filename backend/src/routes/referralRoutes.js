const express = require('express');
const router = express.Router();
const {
  createReferralRequest,
  getAllReferrals,
  getReferralById,
  respondToReferral,
  withdrawReferral,
  getReferralStats
} = require('../controllers/referralController');

const {
  isAuthenticated,
  isStudent,
  isAlumni,
  authorizeRoles
} = require('../middlewares/auth');

const { body } = require('express-validator');

/**
 * REFERRAL ROUTES
 * Explanation: Referral system ke endpoints
 */

// Validation for referral request
const referralValidation = [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('message').isLength({ min: 20, max: 500 }).withMessage('Message must be between 20-500 characters'),
  body('resumeLink').optional().isURL().withMessage('Invalid resume URL')
];

// Common routes - specific routes MUST come before :id routes
router.get('/referrals', isAuthenticated, getAllReferrals);
router.get('/referrals/stats', isAuthenticated, getReferralStats);

// Student routes
router.post('/referrals', isAuthenticated, isStudent, referralValidation, createReferralRequest);

// Dynamic routes come after specific routes
router.get('/referrals/:id', isAuthenticated, getReferralById);
router.delete('/referrals/:id', isAuthenticated, isStudent, withdrawReferral);

// Alumni routes
router.put('/referrals/:id/respond', isAuthenticated, isAlumni, respondToReferral);

module.exports = router;
