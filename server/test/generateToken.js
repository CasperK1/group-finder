require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

/*
    LIST OF ALL USERS IN DB:
      node generateToken.js

    TO GENERATE JWT TOKEN:
    node generateToken.js <userId or username>
*/


const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Generate token for user by ID or username
const generateToken = async (identifier) => {
  try {
    let user;

    // Check if identifier is ObjectId or username
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      console.error('User not found');
      return null;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName
      }
    };
  } catch (error) {
    console.error('Error generating token:', error.message);
    return null;
  }
};


const main = async () => {
  await connectDb();

  const identifier = process.argv[2];

  if (!identifier) {
    // No identifier provided, list users
    const users = await User.find()
      .select('_id username email profile.firstName profile.lastName')
      .limit(10);

    console.log('\nAvailable Users:');
    users.forEach(user => {
      console.log(`- ID: ${user._id}, Username: ${user.username}, Name: ${user.profile.firstName} ${user.profile.lastName}`);
    });
    console.log('\nUsage: node generateToken.js <userId or username>');
  } else {
    // Generate token for the specified user
    const result = await generateToken(identifier);

    if (result) {
      console.log('\nToken generated successfully!');
      console.log('\nUser details:');
      console.log(result.user);
      console.log('\nJWT Token:');
      console.log(result.token);
    }
  }
  await mongoose.disconnect();
};
main()