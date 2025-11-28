const { body, validationResult } = require('express-validator');

const validateStudent = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('rollNumber').trim().notEmpty().withMessage('Roll number is required'),
  body('batch').trim().notEmpty().withMessage('Batch is required'),
  body('branch').optional().trim(),
  body('phone').optional().trim(),
  body('dsaProblems').optional().isInt({ min: 0 }).toInt(),
  body('techStack').optional().trim(),
  body('resumeLink').optional().trim().custom((value) => {
    if (value && value.length > 0 && !value.startsWith('http')) {
      throw new Error('Resume link must be a valid URL');
    }
    return true;
  }),
  body('github').optional().trim(),
  body('linkedin').optional().trim(),
  body('location').optional().trim(),
  body('pronouns').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        error: errors.array()[0].msg,
        errors: errors.array() 
      });
    }
    next();
  }
];

const validateAlumni = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('batch').trim().notEmpty().withMessage('Batch is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('branch').optional().trim(),
  body('techStack').optional().trim(),
  body('github').optional().trim(),
  body('linkedin').optional().trim(),
  body('resumeLink').optional().trim().custom((value) => {
    if (value && value.length > 0 && !value.startsWith('http')) {
      throw new Error('Resume link must be a valid URL');
    }
    return true;
  }),
  body('location').optional().trim(),
  body('pronouns').optional().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        error: errors.array()[0].msg,
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = { validateStudent, validateAlumni };