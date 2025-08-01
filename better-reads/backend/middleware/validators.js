import { body, param, query, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

// Middleware to check validation results
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Custom sanitizer for HTML content
export const sanitizeInput = (value) => {
  if (typeof value === 'string') {
    // allow only basic formatting but strip scripts and dangerous attributes
    return sanitizeHtml(value, {
      allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
      allowedAttributes: {},
    });
  }
  return value;
};

// User validation rules
export const userValidationRules = {
  signup: [
    body('username')
      .trim()
      .escape()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
      .customSanitizer(sanitizeInput),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 12 }).withMessage('Password must be at least 12 characters'),
    
    body('favoriteGenres')
      .isArray().withMessage('Favorite genres must be an array')
      .customSanitizer(values => {
        if (Array.isArray(values)) {
          return values.map(sanitizeInput);
        }
        return values;
      }),
      
    body('avatarUrl')
      .optional()
      .isURL().withMessage('Avatar URL must be a valid URL')
      .customSanitizer(sanitizeInput),
  ],
  
  login: [
    body('username')
      .trim()
      .escape()
      .notEmpty().withMessage('Username is required')
      .customSanitizer(sanitizeInput),
    
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  
  // update: [
  //   body('favoriteGenres')
  //     .optional()
  //     .isArray().withMessage('Favorite genres must be an array')
  //     .customSanitizer(values => {
  //       if (Array.isArray(values)) {
  //         return values.map(sanitizeInput);
  //       }
  //       return values;
  //     }),
  // 
  //   body('avatarUrl')
  //     .optional()
  //     .isURL().withMessage('Avatar URL must be a valid URL')
  //     .customSanitizer(sanitizeInput),
  // 
  //   body('bio')
  //     .optional()
  //     .customSanitizer(sanitizeInput),
  // ],
  
  addToBooklist: [      
    body('bookId')
      .notEmpty().withMessage('Book ID is required')
      .isMongoId().withMessage('Invalid book ID format'),
  ]
};

// Review validation rules
export const reviewValidationRules = {
  create: [
    body('username')
      .notEmpty().withMessage('Username is required')
      .trim()
      .customSanitizer(sanitizeInput),
      
    body('rating')
      .optional()
      .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
      
    body('description')
      .optional()
      .customSanitizer(sanitizeInput),
  ],
  
  update: [
    body('rating')
      .optional()
      .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
      
    body('description')
      .optional()
      .customSanitizer(sanitizeInput),
  ]
};

// Parameter validation
export const paramValidation = {
  userId: [
    param('userId')
      .isMongoId().withMessage('Invalid user ID format'),
  ],
    
  bookId: [
    param('bookId')
      .isMongoId().withMessage('Invalid book ID format'),
  ],
    
  reviewId: [
    param('reviewId')
      .isMongoId().withMessage('Invalid review ID format'),
  ],
};

// Query validation rules
export const queryValidation = {
  // bookSearch: [
  //   param('q')
  //     .optional()
  //     .trim()
  //     .escape()
  //     .customSanitizer(sanitizeInput),
      
  //   param('genre')
  //     .optional()
  //     .customSanitizer(sanitizeInput),
      
  //   param('page')
  //     .optional()
  //     .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
      
  //   param('limit')
  //     .optional()
  //     .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  // ],
  
  userReview: [
    query('bookId')
      .isMongoId().withMessage('Invalid book ID format'),
      
    query('userId')
      .notEmpty().withMessage('Username is required')
      .trim()
      .customSanitizer(sanitizeInput),
],
  
  search: [
    query('q')
      .optional()
      .trim()
      .customSanitizer(sanitizeInput),
      
    query('genre')
      .optional()
      .customSanitizer(sanitizeInput),
      
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
      
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
      .toInt(),
  ],
  
  nlpSearch: [
    query('q')
      .optional()
      .trim()
      .customSanitizer(sanitizeInput),
      
    query('genre')
      .optional()
      .customSanitizer(sanitizeInput),
      
    query('min_year')
      .optional()
      .isInt({ min: 1000, max: 9999 }).withMessage('Min year must be a valid year')
      .toInt(),
      
    query('max_year')
      .optional()
      .isInt({ min: 1000, max: 9999 }).withMessage('Max year must be a valid year')
      .toInt(),
  ],
};
