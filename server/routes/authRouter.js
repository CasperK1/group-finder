const express = require("express");
const { registerUser, verifyEmail, loginUser } = require("../controllers/authControllers");
const router = express.Router();

// http://localhost:3000/api/auth/
router.post("/register", registerUser);
router.get('/verify-email', verifyEmail);
router.post("/login", loginUser);

module.exports = router;
