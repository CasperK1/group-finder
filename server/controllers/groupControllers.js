// TODO:
// Group owner can either delete the group or transfer ownership to other user
// Function to add moderators (only for the owner?)
// Function to kick members out of groups (only for owner/moderators)
// Function to send group invites to users (only for owner/moderators)
// Removing user from group also removes them from moderator list

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
        const groups = await Group.find()
        .select("-chatHistory -documents -events")
        .sort({ createdAt: -1 });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/groups/group/:groupId
const getGroupInformation = async (req, res) => {
    const groupId = req.params.groupId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID"} );
    }

    try {

        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required"});
        }

        let query = Group.findById(groupId);
        
        // If user isn't logged in or a member of the group, exclude certain fields
        if (!req.user?.id || !(await Group.findOne({ _id: groupId, members: req.user.id }))) {
            query = query.select('-chatHistory -documents -events');
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
    const userId = req.user.id;

    try {
        const {
            name,
            photo,
            bio,
            city,
            timePreference,
            location,
            groupSize,
            major,
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
                major,
                skillLevels
            },
            chatHistory: [],
            documents: [],
            events: []
        });

        // Add the group ID to the user's groupsJoined array
        const user = await User.findById(userId);
        user.groupsJoined.push(group._id);
        
        const newGroup = await group.save();

        res.status(201).json(newGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// PUT /api/groups/:groupId
const updateGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user.id
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID"} );
    }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No update data provided" });
    }

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (userId !== group.owner) {
            return res.status(400).json({ message: "Only the group owner can edit group information!" })
        }

        if (updates.information) {
            updates.information = {
                ...group.information.toObject(),
                ...updates.information
            };
        }

        if (updates.settings) {
            updates.settings = {
                ...group.settings.toObject(),
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
    const groupId = req.params.groupId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        const group = await Group.findById(groupId);

        // Check if the current user is the owner of the group
        if (userId !== group.owner) {
            return res.status(400).json({ message: "Only the group owner can delete the group!" })
        }

        // Remove the group from all the members' groupsJoined arrays
        await Group.updateMany(
            {groupsJoined: groupId},
            {$pull: {groupsJoined: groupId}}
        );

        const deletedGroup = await Group.findOneAndDelete(groupId);

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