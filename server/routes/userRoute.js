const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

// Public routes (no auth needed)
router.get("/", getAllUsers);

// Protected routes (need auth)
router.post("/", auth, createUser);
// router.get("/:userId", auth, getUserById);
// router.put("/:userId", auth, updateUser);
// router.delete("/:userId", auth, deleteUser);

module.exports = router;
