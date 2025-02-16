const rateLimit = require('express-rate-limit');

const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: {
      status: 'error',
      message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
};

// Different limits based on environment
const isDevelopment = process.env.NODE_ENV === 'development';

const authLimiter = createRateLimiter({
  windowMs: isDevelopment ? 60 * 1000 : 5 * 60 * 1000, // 1 min in dev, 5 min in prod
  max: isDevelopment ? 30 : 5, // 30 attempts in dev, 5 in prod
  message: {
    status: 'error',
    message: 'Too many login attempts. Please try again later.'
  }
});

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: isDevelopment ? 300 : 60 // 300 requests/min in dev, 60 in prod
});

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter
};