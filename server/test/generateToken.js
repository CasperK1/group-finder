require("dotenv").config({path: "../.env"});
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/user");

/*
    LIST OF ALL USERS IN DB:
      node generateToken.js

    TO GENERATE JWT TOKEN FOR ONE OR MULTIPLE USERS:
      node generateToken.js <userId or username> [userId2 or username2] [...]
*/

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Generate token for user by ID or username
const generateToken = async (identifiers) => {
  try {
    const users = [];

    // Process each identifier
    for (const identifier of identifiers) {
      const query = await (mongoose.Types.ObjectId.isValid(identifier)
        ? User.findById(identifier)
        : User.findOne({ username: identifier }));

      if (query) users.push(query);
    }

    if (users.length === 0) {
      console.error("User(s) not found");
      return null;
    }

    // Generate tokens for each user
    const tokens = users.map(user => ({
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" }),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    }));

    return tokens.length === 1 ? tokens[0] : tokens;
  } catch (error) {
    console.error("Error generating token:", error.message);
    return null;
  }
};

const main = async () => {
  await connectDb();

  // Get all arguments after the script name (index 2 and beyond)
  const identifiers = process.argv.slice(2);

  if (identifiers.length === 0) {
    // No identifiers provided, list users
    const users = await User.find()
      .select("_id username email profile.firstName profile.lastName")
      .limit(10);

    console.log("\nAvailable Users:");
    users.forEach(user => {
      const { _id, username, profile = {} } = user;
      const { firstName = 'N/A', lastName = 'N/A' } = profile;
      console.log(`- ID: ${_id}, Username: ${username}, Name: ${firstName} ${lastName}`);
    });
    console.log("\nUsage: node generateToken.js <userId or username> [userId2 or username2] [...]");
  } else {
    // Generate tokens for the specified users
    const results = await generateToken(identifiers);

    if (results) {
      console.log("\nToken(s) generated successfully!");

      if (Array.isArray(results)) {
        // Multiple users
        results.forEach((result, index) => {
          console.log(`\n--- User ${index + 1}: ${result.user.username} ---`);
          console.log("User details:", result.user);
          console.log("JWT Token:", result.token);
        });
      } else {
        // Single user
        console.log("\nUser details:", results.user);
        console.log("JWT Token:", results.token);
      }
    }
  }

  await mongoose.disconnect();
};

main();