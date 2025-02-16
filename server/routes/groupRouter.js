const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();
const {
    getAllGroups,
    getGroupInformation,
    createGroup,
    updateGroup,
    deleteGroup
} = require("../controllers/groupControllers")

// Public routes
router.get("/", getAllGroups);
router.get("/:groupId", getGroupInformation);

// Protected routes (need authentication)
router.post("/", auth, createGroup);
router.put("/:groupId", auth, updateGroup);
router.delete("/:groupId", auth, deleteGroup);

module.exports = router;