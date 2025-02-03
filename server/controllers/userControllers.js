const User = require("../models/User");
const bcrypt = require("bcrypt");

// Data model. Required fields are email, password, firstName, lastName, major. Rest are optional.
// {
//   "email": "student@university.edu",
//   "password": "securepass123",
//   "firstName": "John",
//   "lastName": "Doe",
//   "major": "Computer Science",
//   "academicInterests": ["Programming", "AI"],
//   "bio": "CS student interested in AI",
//   "studyPreferences": {
//     "timePreference": "morning",
//     "locationPreference": "on-campus",
//     "groupSizePreference": 4
//   }
// }

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      studyPreferences,
      bio,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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
        studyPreferences: {
          timePreference: studyPreferences?.timePreference || "flexible",
          locationPreference:
            studyPreferences?.locationPreference || "flexible",
          groupSizePreference: studyPreferences?.groupSizePreference || 5,
        },
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
      message: "Server error. Please try again.",
    });
  }
};

module.exports = { getAllUsers, createUser };
