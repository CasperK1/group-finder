const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// For testing. Required fields are email, password, firstName, lastName, major. Rest are optional.
// {
// email: "test@example.com",
// password: "password123",
// profile: {
//   firstName: "Test",
//   lastName: "User",
//   major: "Computer Science",
// }}

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v -password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:userId
const getUserById = async (req, res) => {
  // Validate id before any database calls
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({
      message: "Bad Request - Invalid user ID",
    });
  }
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
};

// POST /api/users
const createUser = async (req, res) => {
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

// PUT /api/users/:userId
const updateUser = async (req, res) => {
  const updates = req.body;
  const userId = req.params.userId;

  // Validate id before any database calls
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Bad Request - Invalid user ID",
    });
  }
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Merge nested objects instead of overwriting them
    if (updates.profile) {
      updates.profile = {
        ...existingUser.profile.toObject(),
        ...updates.profile,
      };
    }
    if (updates.settings) {
      updates.settings = {
        ...existingUser.settings.toObject(),
        ...updates.settings,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
};

// DELETE /api/users/:userId
const deleteUser = async (req, res) => {
  // Validate id before any database calls
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({
      message: "Bad Request - Invalid user ID",
    });
  }
  try {
    const result = await User.findByIdAndDelete(req.params.userId );
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `User '${result.profile.firstName} ${result.profile.lastName}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
