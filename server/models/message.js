const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      username: {
        type: String,
        required: true
      }
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    },
    content: {
      text: { type: String, required: true },
      // For @mentions
      mentions: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String
      }],
      // For rich text formatting
      formatting: {
        bold: Boolean,
        italic: Boolean,
        underline: Boolean,
        code: Boolean
      }
    },
    // For file attachments
    attachments: [{
      fileKey: String,        // S3 file key
      fileName: String,       // Original filename
      fileType: String,      // File type
      fileSize: Number
    }],
    // Array of users who have read the message
    readBy: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      readAt: { type: Date, default: Date.now }
    }],
    // For editing/deleting messages
    edited: { type: Boolean, default: false },
    editedAt: Date,
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  {
    timestamps: true,
    validateBeforeSave: true
  }
);


// Index for faster queries
messageSchema.index({ group: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);