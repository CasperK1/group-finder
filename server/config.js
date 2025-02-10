require("dotenv").config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  mailOptions: {
    from: process.env.EMAIL_USER,
    to: undefined,
    subject: 'Test Email from Node.js',
    text: ''
  }
  // ... other configurations
};

module.exports = config;
