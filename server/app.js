const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, '../documentation/swagger.yaml'));
const {corsOptions, rootRouter} = require("./config/config.js");
const {unknownEndpoint, errorHandler} = require("./middleware/errorHandler.js");
const {authLimiter, apiLimiter} = require('./middleware/rateLimiter');
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const groupRouter = require("./routes/groupRouter");
const fileRouter = require("./routes/fileRouter");
const connectDb = require("./config/db");

// Create express app
const app = express();
app.set('trust proxy', 1);

connectDb();

// Basic middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());
app.use(cors(corsOptions));

// API documentation only in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Routes
app.use("/", rootRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/groups", groupRouter);
app.use("/api/files", fileRouter);

// Error handling
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;