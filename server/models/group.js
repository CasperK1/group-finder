const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    owner: {type: String, required: true},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    moderators: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    information: {
      name: {type: String, required: true},
      // Photo could be chosen from a list of preset group icons?
      photo: {type: String, default: null},
      bio: {type: String, maxlength: 1000},
      city: {type: String, required: true},
      timePreference: {
        type: String,
        enum: ["morning", "afternoon", "evening", "flexible"],
      },
      location: {
        type: String,
        enum: ["on-campus", "off-campus", "online", "flexible"],
      },
      groupSize: {type: Number, required: true, min: 2, max: 10},
      skillLevels: [
        {
          subject: {type: String},
          level: {type: String, enum: ["beginner", "intermediate", "advanced"]},
        },
      ],
    },
    // Chat history, documents and events are only shown to members
    // Not sure if this is the proper way to implement them, these are mainly placeholders
    chatHistory: [{type: mongoose.Schema.Types.ObjectId, ref: "ChatHistory"}],
    // Pretty long, maybe split to another schema?
    documents: [{
      key: {type: String, required: true},           // S3 file path
      originalName: {type: String, required: true},  // Original filename
      fileType: {type: String, required: true},      // File extension
      size: {type: Number, required: true},
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {type: String},
      description: {type: String},
      tags: [String],
      downloads: {type: Number, default: 0},
      uploadedAt: {type: Date, default: Date.now},
      lastModified: {type: Date},
      isArchived: {type: Boolean, default: false}
    }],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],
    settings: {
      // Toggle whether users can join the group freely or they need an invite
      inviteOnly: {type: Boolean, default: false},
    },
    createdAt: {type: Date, default: Date.now},
  },
  {timestamps: true},
);

module.exports = mongoose.model("Group", groupSchema);
