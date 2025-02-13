const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllUsers,
  getUserProfile,
  getJoinedGroups,
  updateUser,
  joinGroup,
  leaveGroup,
  deleteUser,
} = require("../controllers/userControllers");

// TODO: leave group and upload user photo controllers
// http://localhost:3000/api/users
// Public routes (no auth needed)
router.get("/", getAllUsers);
router.get("/profile/:userId", getUserProfile);

// Protected routes (need JWT token)
router.get("/profile/", auth, getUserProfile);
router.get("/groups/joined", auth, getJoinedGroups);
router.put("/settings", auth, updateUser);
router.post("/groups/:groupId/join", auth, joinGroup);
router.delete("/groups/:groupId/leave", auth, leaveGroup);
router.delete("/settings", auth, deleteUser);

module.exports = router;
