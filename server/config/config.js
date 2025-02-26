require("dotenv").config();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

module.exports = {corsOptions};
