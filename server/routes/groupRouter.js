const express = require("express");
const router = express.Router();
const {
    getAllGroups,
    getGroupInformation,
    createGroup,
    updateGroup,
    deleteGroup
} = require("../controllers/groupControllers")

router.get("/", getAllGroups);
router.get("/:groupId", getGroupInformation);
router.post("/", createGroup);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

module.exports = router;