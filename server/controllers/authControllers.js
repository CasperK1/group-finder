const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
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

    // Return success without sending back password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "User created successfully",
    });
  } catch (error) {
    // Validation error =  missing required fields etc.
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      error: "Server error. Please try again.",
      message: error.message,
    });
  }
};

// POST /login/users
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error. Please try again.",
      message: error.message,
    });
  }
};
module.exports = { registerUser, loginUser };
