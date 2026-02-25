/**
 * Validation Middleware
 * Uses express-validator to validate and sanitize request bodies
 */
const { validationResult } = require('express-validator');

/**
 * Processes validation errors from express-validator and returns 400 on failure
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = { validate };
