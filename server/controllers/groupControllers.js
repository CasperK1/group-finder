const Group = require("../models/Group");
const mongoose = require("mongoose");
const { listenerCount } = require("../models/User");

/* Example form:
{
    "owner": "Group Owner",
    "name": "Cool Group",
    "photo": "https://static.wikia.nocookie.net/silly-cat/images/1/19/Thumbs_Up.png/revision/latest/scale-to-width-down/1000?cb=20231201204731&format=original",
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
            owner,
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
            owner,
            information: {
                name,
                photo,
                bio,
                city,
                timePreference,
                location,
                groupSize,
                skillLevels
            }
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

// TODO:
// Implement GET functions that filter groups by city, skill levels etc. here?
// GET function for retrieving group members?

module.exports = {
    getAllGroups,
    getGroupInformation,
    createGroup,
    updateGroup,
    deleteGroup
}