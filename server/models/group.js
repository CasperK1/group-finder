const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        owner: { type: String, required: true },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
        // Chat history, documents and events are only shown to members
        // Not sure if this is the proper way to implement them, these are mainly placeholders
        chatHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "ChatHistory" }],
        documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
        events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
        settings: {
            // Toggle whether users can join the group freely or they need an invite
            inviteOnly: { type: Boolean, default: false },
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Group", groupSchema);
