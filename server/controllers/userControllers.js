const User = require("../models/User");
const mongoose = require("mongoose");
const Group = require("../models/Group");
// TODO: Add pending invite check to joinGroup? Remove document and chat history field from the group query


// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-__v -password");
    res.json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// GET /api/users/profile (private profile view) or /api/users/profile/:userId (public profile view)
const getUserProfile = async (req, res) => {
  // Validate format when ID comes from URL parameter
  if (
    req.params.userId &&
    !mongoose.Types.ObjectId.isValid(req.params.userId)
  ) {
    return res.status(400).json({
      message: "Invalid user ID format",
    });
  }
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId).select(
      "-password -__v -updatedAt -admin -isVerified",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // If viewing someone else's profile and it's set to private
    if (req.params.userId && user.settings?.profileVisibility === "private") {
      return res.status(403).json({
        message: "This profile is private",
      });
    }

    // If it's not the user's own profile, exclude certain fields
    if (req.params.userId) {
      const publicProfile = user.toObject();
      // Remove any fields you want to keep private
      delete publicProfile.settings;
      delete publicProfile.email;
      delete publicProfile.createdAt;
      res.json(publicProfile);
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again.",
      error: error.message,
    });
  }
};

// PUT /api/users/settings
const updateUser = async (req, res) => {
  const updates = req.body;
  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({message: "No update data provided"});
  }
  try {
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return res.status(404).json({message: "User not found"});
    }

    //  These two blocks below are for updating nested objects in the schema
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

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// DELETE /api/users/
const deleteUser = async (req, res) => {
  try {
    // Start by removing the user from all groups they're in
    await Group.updateMany(
      {members: req.user.id},
      {$pull: {members: req.user.id}}
    );

    const result = await User.findByIdAndDelete(req.user.id);
    if (!result) {
      return res.status(404).json({message: "User not found"});
    }

    res.status(200).json({
      message: `User '${result.profile.firstName} ${result.profile.lastName}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

// GET /api/users/groups/joined
const getJoinedGroups = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("groupsJoined");
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.json(user.groupsJoined);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  getJoinedGroups,
  updateUser,
  deleteUser,
};
