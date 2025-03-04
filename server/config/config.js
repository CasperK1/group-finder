require("dotenv").config();
const express = require("express");
const rootRouter = express.Router();

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// To clear PaaS error logs
rootRouter.get("/", (req, res) => {
  res.json({
    message: "Study Group Finder API is running",
    version: "1.0.0",
    endpoints: ["/api/users", "/api/auth", "/api/groups", "/api/files"],
  });
});
rootRouter.get("/favicon.ico", (req, res) => res.status(204).end());

module.exports = { corsOptions, rootRouter };
