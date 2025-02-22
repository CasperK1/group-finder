const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
    getAllGroups,
    getGroupInformation,
    createGroup,
    updateGroup,
    joinGroup,
    leaveGroup,
    deleteGroup
} = require("../controllers/groupControllers")

// Public routes
router.get("/", getAllGroups);
router.get("/:groupId", getGroupInformation);

// Protected routes (need authentication)
router.get("/auth/:groupId", auth, getGroupInformation);
router.post("/", auth, createGroup);
router.put("/:groupId", auth, updateGroup);
router.put("/:groupId/join", auth, joinGroup);
router.put("/:groupId/leave", auth, leaveGroup);
router.delete("/:groupId", auth, deleteGroup);

module.exports = router;