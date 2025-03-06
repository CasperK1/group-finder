// TODO:
// Function to send group invites to users (only for owner/moderators)

const Group = require("../models/group");
const User = require("../models/user");
const mongoose = require("mongoose");

/* Example form for creating a group with only required fields:
{
    "name": "Group Name",
    "city": "Helsinki",
    "groupSize": 4
}
*/


/* Example form for creating an event with only required fields:
{
    "title": "Event Name",
    "dateTime": "2025-03-15T14:30:00.000Z"
}
*/

// GET /api/groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
        .select({ chatHistory: 0, documents: 0, events: 0 }) //Remove unnecessary fields
        .sort({ createdAt: -1 });
        return res.status(200).json(groups);
    } catch (error) {
        return res.status(500).json({ message: error.message });
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

        const groupObj = group.toObject();

        const memberInfo = await Promise.all(
            group.members.map(memberId =>
                User.findById(memberId).select(
                    "username profile.firstName profile.lastName"
                )
            )
        );

        groupObj.members = memberInfo;

        return res.status(200).json(groupObj);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/groups
const createGroup = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

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

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
 
        user.groupsJoined.push(group._id); // Add the group to the user's groupsJoined array

        await user.save();
        await group.save();

        return res.status(201).json(group);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

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

        // Prevent non-owner from editing group information
        if (userId !== group.owner.toString()) {
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

        // Updates the group with the new information
        const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, { 
            new: true,
            runValidators: true
        });

        return res.status(200).json(updatedGroup);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//PUT /api/groups/join/:groupId
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

        // Prevent user from attempting to join a group they are already a member of
        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "You are already a member of this group!" });
        }

        // Prevent user from joining a group with maximum amount of members
        if (group.members.length >= group.information.groupSize) {
            return res.status(400).json({ message: "Group is full!" });
        }

         // Prevent user from joining a group that is invite-only
        if (group.settings.inviteOnly) {
            return res.status(403).json({
                message: "This group requires an invitation to join."
            });
        }

        group.members.push(userId); // Add current user to the groups members array
        user.groupsJoined.push(groupId); // Add the group to the user's groupsJoined array

        await Promise.all([group.save(), user.save()]);

        return res.status(200).json({ message: "Succesfully joined the group." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//PUT /api/groups/leave/:groupId
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

        // Prevent non-members from leaving the group (lol)
        if (!group.members.includes(userId)) { 
            return res.status(400).json({ message: "Can't leave a group you are not a member of!" });
        }

        // Prevent owner from leaving the group
        if (userId === group.owner.toString()) { 
            return res.status(400).json({ message: "Please either delete the group, or make someone else the owner first." })
        }

        // If user is a moderator, remove them from the moderator list
        if (group.moderators.includes(userId)) {
            group.moderators.pull(userId);
        }

        group.members.pull(userId); // Remove user from the group's members array
        user.groupsJoined.pull(groupId); // Remove the group from the user's groupsJoined array

        await Promise.all([group.save(), user.save()]);

        return res.status(200).json({ message: "Succesfully left the group." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE /api//groups/:groupId
const deleteGroup = async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Prevent non-owners from deleting the group
        if (userId !== group.owner.toString()) { 
            return res.status(400).json({ message: "Only the group owner can delete the group!" })
        }

        // Remove the group from all the members' groupsJoined arrays
        await User.updateMany(
            {groupsJoined: groupId},
            {$pull: {groupsJoined: groupId}}
        );

        await Group.findByIdAndDelete(groupId); // Deletes the group from the database

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/groups/addMod/:groupId
const addModerator = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const moderatorId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!moderatorId) {
        return res.status(400).json({ message: "No user provided" });
    }

    try {
        let moderator, group;

        [moderator, group] = await Promise.all([
            User.findById(moderatorId),
            Group.findById(groupId)
        ]);

        if (!group || !moderator) {
            return res.status(404).json({ 
                message: group ? "User not found" : "Group not found"
            });
        }

        // Prevent non-owner from adding moderators
        if (userId !== group.owner.toString()) {
            return res.status(400).json({ message: "Only the group owner can add moderators!" })
        }

        // Prevent adding non-members as moderators
        if (!group.members.includes(moderatorId)) {
            return res.status(400).json({ message: "User needs to be a member of the group!" });
        }

        // Prevent adding an already existing moderator
        if (group.moderators.includes(moderatorId)) {
            return res.status(400).json({ message: "This user is already a moderator!" });
        }

        group.moderators.push(moderatorId); // Add the new moderator to the group's moderators array
        await group.save();

        return res.status(200).json({ message: "Succesfully added moderator!" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/groups/removeMod/:groupId
const removeModerator = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const moderatorId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!moderatorId) {
        return res.status(400).json({ message: "No user provided" });
    }

    try {
        let moderator, group;

        [moderator, group] = await Promise.all([
            User.findById(moderatorId),
            Group.findById(groupId)
        ]);

        if (!group || !moderator) {
            return res.status(404).json({ 
                message: group ? "User not found" : "Group not found"
            });
        }

        // Prevent non-owners from removing moderators
        if (userId !== group.owner.toString()) {
            return res.status(400).json({ message: "Only the group owner can remove moderators!" })
        }

        // Prevent attempts to remove a non-moderator
        if (!group.moderators.includes(moderatorId)) {
            return res.status(400).json({ message: "This user is not a moderator!" });
        }

        // Prevents attempts to remove the group owner
        if (moderatorId === group.owner.toString()) {
            return res.status(400).json({ message: "Group owner must be a moderator!" });
        }

        group.moderators.pull(moderatorId); // Removes the moderator from the group's moderators array
        await group.save();

        return res.status(200).json({ message: "Successfully removed moderator." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/groups/owner/:groupId
const changeOwner = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const ownerId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!ownerId) {
        return res.status(400).json({ message: "No user provided" });
    }

    try {
        let owner, group;

        [owner, group] = await Promise.all([
            User.findById(ownerId),
            Group.findById(groupId)
        ]);

        if (!group || !owner) {
            return res.status(404).json({
                message: group ? "User not found" : "Group not found"
            });
        }

        // Prevents non-owners from changing ownership
        if (userId !== group.owner.toString()) {
            return res.status(400).json({ message: "Only the group owner can transfer ownership!" })
        }

        // Prevents the group owner from giving ownership to themselves again (lol)
        if (ownerId === group.owner.toString()) {
            return res.status(400).json({ message: "You are already the owner!" })
        }

        // Prevents from granting ownership to a non-member
        if (!group.members.includes(ownerId)) {
            return res.status(400).json({ message: "User has to be a member of the group!" });
        }

        // Make the new owner a moderator if not already one
        if (!group.moderators.includes(ownerId)) {
            group.moderators.push(ownerId);
        }

        group.owner = ownerId; // Changes the owner to the new one
        await group.save();

        return res.status(200).json({ message: "Successfully changed group owner." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/groups/kick/:groupId
const kickMember = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const memberId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!memberId) {
        return res.status(400).json({ message: "No user provided" });
    }

    try {
        let member, group;

        [member, group] = await Promise.all([
            User.findById(memberId),
            Group.findById(groupId)
        ]);

        if (!group || !member) {
            return res.status(404).json({
                message: group ? "User not found" : "Group not found"
            });
        }

        // Prevents non-moderators from kicking members
        if (!group.moderators.includes(userId)) {
            return res.status(400).json({ message: "Only moderators can kick members!" });
        }

        // Prevents attempts to kick non-members
        if (!group.members.includes(memberId)) {
            return res.status(400).json({ message: "That user is not a member of this group!" });
        }

        // Prevents kicking the group owner
        if (memberId === group.owner.toString()) {
            return res.status(400).json({ message: "Can't kick the group owner!" });
        }

        // Prevents kicking moderators, unless the current user is the group owner
        if (group.moderators.includes(memberId)) {
            if (userId !== group.owner.toString()) {
                return res.status(400).json({ message: "Only the owner can kick moderators!" })
            }
            group.moderators.pull(memberId); // Removes the member from the group's moderators array
        }

        group.members.pull(memberId); // Removes the member from the group's members array
        member.groupsJoined.pull(groupId); // Removes the member from the member's groupsJoined array

        await Promise.all([group.save(), member.save()]);

        return res.status(200).json({ message: "Member kicked succesfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/groups/createEvent/:groupId
const createEvent = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    try {
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        
        // Prevents regular members from creating events
        if (!group.moderators.includes(userId)) {
            return res.status(400).json({ message: "Only moderators can add events!" });
        }

        const { title, description, dateTime } = req.body;

        const newEvent = {
            title,
            description,
            dateTime,
            createdAt: new Date()
        };

        group.events.push(newEvent); // Adds the new event to the group's events array
        await group.save();
        
        return res.status(201).json({ message: "Event created succesfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE /api/groups/deleteEvent/:groupId
const deleteEvent = async (req, res) => {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const eventId = req.body.eventId;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!eventId) {
        return res.status(400).json({ message: "No event provided" });
    }

    try {
        const group = await Group.findById(groupId);
        const event = group.events.id(eventId);

        if (!group || !event) {
            return res.status(404).json({ 
                message: group ? "Event not found" : "Group not found"
            });
        }
        
        // Prevents regular members from deleting events
        if (!group.moderators.includes(userId)) {
            return res.status(400).json({ message: "Only moderators can delete events!" });
        }

        group.events.pull(event); // Removes the event from the group's events array
        await group.save();
        
        return res.status(201).json({ message: "Event deleted succesfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
    kickMember,
    createEvent,
    deleteEvent
}