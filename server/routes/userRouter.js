const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllUsers,
  getUserProfile,
  getJoinedGroups,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

// http://localhost:3000/api/users
// Public routes (no auth needed)
router.get("/", getAllUsers);
router.get("/profile/:userId", getUserProfile);

// Protected routes (need JWT token)
router.get("/profile/", auth, getUserProfile);
router.get("/groups/joined", auth, getJoinedGroups);
router.put("/settings", auth, updateUser);
router.delete("/settings", auth, deleteUser);

module.exports = router;
