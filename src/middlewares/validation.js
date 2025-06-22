import { body, param, query, validationResult } from 'express-validator';
import loggerService from '../services/loggerService.js';

// Middleware để xử lý validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    loggerService.logSystem('validation.failed', `Validation failed for ${req.method} ${req.path}: ${JSON.stringify(errors.array())}`);
    
    return res.error({
      status: 400,
      messageCode: 'system.validation_error',
      error: {
        type: 'ValidationError',
        details: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
          value: err.value,
        })),
      },
    });
  }
  next();
};

// Generic validation rules for common use cases
const commonValidation = {
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
    handleValidationErrors,
  ],

  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1-100'),
    query('search')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('Search term cannot exceed 255 characters')
      .escape(),
    handleValidationErrors,
  ],

  create: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1-255 characters')
      .escape(),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'pending'])
      .withMessage('Status must be active, inactive, or pending'),
    handleValidationErrors,
  ],

  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Name must be between 1-255 characters')
      .escape(),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    body('status')
      .optional()
      .isIn(['active', 'inactive', 'pending'])
      .withMessage('Status must be active, inactive, or pending'),
    handleValidationErrors,
  ],
};

// User validation rules (example for specific entity)
const userValidation = {
  create: [
    body('email')
      .isEmail()
      .withMessage('Email must be valid')
      .normalizeEmail(),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1-50 characters')
      .escape(),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1-50 characters')
      .escape(),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Phone number is invalid'),
    handleValidationErrors,
  ],

  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Email must be valid')
      .normalizeEmail(),
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1-50 characters')
      .escape(),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1-50 characters')
      .escape(),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Phone number is invalid'),
    handleValidationErrors,
  ],

  getById: commonValidation.id,
  list: commonValidation.pagination,
};

// Export both named exports and default export for flexibility
export { userValidation, commonValidation, handleValidationErrors };
export default handleValidationErrors;
