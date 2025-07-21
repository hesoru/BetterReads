import DOMPurify from 'dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} content - Content to sanitize
 * @param {Object} options - DOMPurify options
 * @returns {string} - Sanitized content
 */
export const sanitizeContent = (content, options = {}) => {
  if (!content) return '';
  
  // Default options strip all HTML tags and attributes
  const defaultOptions = { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  };
  
  return DOMPurify.sanitize(content, { ...defaultOptions, ...options });
};

/**
 * Safely parses JSON with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed JSON or default value
 */
export const safelyParseJSON = (jsonString, defaultValue = {}) => {
  try {
    if (!jsonString) return defaultValue;
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return defaultValue;
  }
};

/**
 * Sanitizes all string properties in an object recursively
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeContent(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Creates a sanitized version of localStorage.getItem that handles JSON parsing
 * @param {string} key - localStorage key
 * @param {*} defaultValue - Default value if item doesn't exist or parsing fails
 * @returns {*} - Parsed and sanitized value
 */
export const getSanitizedItem = (key, defaultValue = {}) => {
  const item = localStorage.getItem(key);
  const parsed = safelyParseJSON(item, defaultValue);
  return sanitizeObject(parsed);
};
