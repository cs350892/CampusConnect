const { body, validationResult } = require('express-validator');

const validateStudent = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('rollNumber').isString().trim().notEmpty().withMessage('Roll number is required'),
  body('batch').isString().trim().notEmpty().withMessage('Batch is required'),
  body('dsaProblems').optional().isInt({ min: 0 }).withMessage('DSA problems must be a positive number'),
  body('techStack').optional().isString().withMessage('Tech stack must be a string'),
  body('resumeLink').optional().isURL().withMessage('Resume link must be a valid URL'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAlumni = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('batch').isString().trim().notEmpty().withMessage('Batch is required'),
  body('company').isString().trim().notEmpty().withMessage('Company is required'),
  body('techStack').optional().isString().withMessage('Tech stack must be a string'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateStudent, validateAlumni };