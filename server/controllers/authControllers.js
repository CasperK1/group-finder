const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailAuth');
// For testing. Required fields are email, password, firstName, lastName, major. Rest are optional.
// {
// email: "test@example.com",
// password: "password123",
// profile: {
//   firstName: "Test",
//   lastName: "User",
//   major: "Computer Science",
// }}

// POST /login/users
const registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
        firstName,
        lastName,
        major,
        academicInterests,
        timePreference,
        locationPreference,
        groupSizePreference,
        bio,
    } = req.body;
    
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: "Email already exists"});
    }
    // Generate verification token for email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      profile: {
        firstName,
        lastName,
        major,
        academicInterests,
        bio,
        timePreference: timePreference || "flexible",
        locationPreference: locationPreference || "flexible",
        groupSizePreference: groupSizePreference || 5,
      },
    });

    // Save to database
    await user.save();
    await sendVerificationEmail(email, verificationToken);

    // Return success without sending back password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "User created successfully. Check your email for verification.",
    });
  } catch (error) {
    // Validation error =  missing required fields etc.
    if (error.name === "ValidationError") {
      return res.status(400).json({message: error.message});
    }
    res.status(500).json({
      error: "Server error. Please try again.",
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token"
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message
    });
  }
};


// POST /login/users
const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
      return res.status(400).json({message: "User does not exist"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({message: "Invalid password"});
    }
    const isVerified = user.isVerified;
    if (!isVerified) {
      return res.status(400).json({message: "Please verify your email first"});
    }

    // Log in expires automatically in 1 hour
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    delete user.password;
    return res.status(200).json({
      message: "Login successful",
      token: token,
      userId: user.id,
      email: user.email,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error. Please try again.",
      message: error.message,
    });
  }
};

module.exports = {registerUser, verifyEmail , loginUser};