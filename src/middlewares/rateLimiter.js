import rateLimit from 'express-rate-limit';
import config from '../config/index.js';
import i18nService from '../services/i18nService.js';

const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || config.rateLimit.windowMs,
    max: options.max || config.rateLimit.max,
    message: (req) => {
      const language = req.headers['accept-language']?.startsWith('en') ? 'en' : 'vi';
      return {
        success: false,
        message: i18nService.getMessage('system.too_many_requests', language),
        messageCode: 'system.too_many_requests',
        data: null,
        error: null,
      };
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
};

// General rate limiter
export const generalLimiter = createRateLimiter();

// Strict rate limiter for auth endpoints
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

// File upload rate limiter
export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 file uploads per minute
});

export default createRateLimiter;
