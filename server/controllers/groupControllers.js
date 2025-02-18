// TODO:
// When viewing group information, check if the given user ID matches the group owner's ID
// Function to add moderators (only for the owner?)
// Function to kick members out of groups, but only for owners/moderators
// Function to send group invites to users
// Hide certain fields from getAllGroups
// Removing user from group also removes them from moderator list (What to do when owner leaves the group?)
// Deleting the group also removes the group ID from all users' groupsJoined array

const Group = require("../models/Group");
const User = require("../models/User");
const mongoose = require("mongoose");

/* Example form:
{
    "name": "Cool Group",
    "photo": "group-pic",
    "bio": "Description goes here lorem ipsum blah blah",
    "city": "Helsinki",
    "groupSize": 4
}
*/

// GET /api/groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/groups/:groupId
const getGroupInformation = async (req, res) => {
    const { groupId } = req.params;
    // Placeholder variable for testing. Set to false for non-member view, true for member view
    const member = false;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID"} );
    }

    try {
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required"});
        }

        let query = Group.findById(groupId);
        
        // If user isn't a member of the group, exclude certain fields
        if (!member) {
            query = query.select("-chatHistory -documents -events");
        }

        const group = await query;

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/groups
const createGroup = async (req, res) => {
    try {
        const {
            name,
            photo,
            bio,
            city,
            timePreference,
            location,
            groupSize,
            skillLevels
          } = req.body;

        const group = new Group({
            owner: req.user.id,
            members: [req.user.id],
            moderators: [req.user.id],
            information: {
                name,
                photo,
                bio,
                city,
                timePreference,
                location,
                groupSize,
                skillLevels
            },
            chatHistory: [],
            documents: [],
            events: []
        });
        const newGroup = await group.save();

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// PUT /api/groups/:groupId
const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID"} );
    }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
    }

    try {
        const existingGroup = await Group.findById(groupId);
        if (!existingGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (updates.information) {
            updates.information = {
                ...existingGroup.information.toObject(),
                ...updates.information
            };
        }

        if (updates.settings) {
            updates.settings = {
                ...existingGroup.settings.toObject(),
                ...updates.settings
            };
        }

        const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, {
            new: true,
            runValidators: true
        });
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//PUT /api/groups/:groupId/join
const joinGroup = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        let user, group;

        [user, group] = await Promise.all([
              User.findById(userId),
              Group.findById(groupId)]);

        if (!group || !user) {
            return res.status(404).json({
                message: user ? "Group not found" : "User not found"
            });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "This user is already a member!" });
        }

        if (group.members.length >= group.information.groupSize) {
            return res.status(400).json({ message: "Group is full!" });
        }

        if (group.settings.inviteOnly) {
            return res.status(403).json({
                message: "This group requires an invitation to join."
            });
        }

        group.members.push(userId);
        user.groupsJoined.push(groupId);
        await Promise.all([group.save(), user.save()]);

        res.status(200).json({ message: "Succesfully joined the group." });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//PUT /api/groups/:groupId/leave
const leaveGroup = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        let user, group;

        [user, group] = await Promise.all([
              User.findById(userId),
              Group.findById(groupId)]);

        if (!group || !user) {
            return res.status(404).json({
                message: user ? "Group not found" : "User not found"
            });
        }

        group.members.pull(userId);
        user.groupsJoined.pull(groupId);
        await Promise.all([group.save(), user.save()]);

        res.status(200).json({ message: "Succesfully left the group." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// DELETE /groups/:groupId
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        const deletedGroup = await Group.findOneAndDelete({ _id: groupId });
        if (deletedGroup) {
            res.status(204).json({ message: "Group deleted" });
        } else {
            res.status(404).json({ message: "Group not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllGroups,
    getGroupInformation,
    createGroup,
    updateGroup,
    joinGroup,
    leaveGroup,
    deleteGroup
}