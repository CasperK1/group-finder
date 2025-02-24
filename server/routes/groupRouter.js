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
    deleteGroup,
    addModerator,
    removeModerator,
    changeOwner,
    kickMember
} = require("../controllers/groupControllers")

// Public routes
router.get("/", getAllGroups);
router.get("/:groupId", getGroupInformation);

// Protected routes (need authentication)
router.get("/auth/:groupId", auth, getGroupInformation);
router.post("/", auth, createGroup);
router.put("/:groupId", auth, updateGroup);
router.put("/join/:groupId", auth, joinGroup);
router.put("/leave/:groupId", auth, leaveGroup);
router.delete("/:groupId", auth, deleteGroup);
router.put("/addMod/:groupId", auth, addModerator);
router.put("/removeMod/:groupId", auth, removeModerator);
router.put("/owner/:groupId", auth, changeOwner);
router.put("/kick/:groupId", auth, kickMember);

module.exports = router;