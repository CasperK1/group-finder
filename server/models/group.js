const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        information: {
            name: { type: String, required: true },
            // Photo could be chosen from a list of preset group icons?
            photo: { type: String, default: null },
            bio: { type: String, maxlength: 1000 },
            city: { type: String, required: true },
            timePreference: {
                type: String,
                enum: ["morning", "afternoon", "evening", "flexible"],
            },
            location: {
                type: String,
                enum: ["on-campus", "off-campus", "online", "flexible"],
            },
            groupSize: { type: Number, min: 2, max: 10 },
            skillLevels: [
                {
                    subject: { type: String },
                    level: { type: String, enum: ["beginner", "intermediate", "advanced"]},
                },
            ],
        },
        // List of all the members of the group
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        settings: {
            // Toggle whether users can join the group freely or they need an invite
            inviteOnly: { type: Boolean, default: false },
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Group", groupSchema);
