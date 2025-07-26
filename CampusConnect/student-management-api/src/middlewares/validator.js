const { body, validationResult } = require('express-validator');

const validateStudent = [
  body('id').isInt().notEmpty().withMessage('ID must be a number'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('branch').isString().notEmpty().withMessage('Branch is required'),
  body('batch').isString().notEmpty().withMessage('Batch is required'),
  body('email').isEmail().optional().withMessage('Invalid email format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateAlumni = [
  body('id').isInt().notEmpty().withMessage('ID must be a number'),
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('branch').isString().notEmpty().withMessage('Branch is required'),
  body('batch').isString().notEmpty().withMessage('Batch is required'),
  body('company').isString().notEmpty().withMessage('Company is required'),
  body('email').isEmail().optional().withMessage('Invalid email format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateStudent, validateAlumni };