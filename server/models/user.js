const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      photo: { type: String, default: null },
      bio: { type: String, maxlength: 500 },
      major: { type: String, required: true },
      academicInterests: [String],
      timePreference: {
        type: String,
        enum: ["morning", "afternoon", "evening", "flexible"],
      },
      locationPreference: {
        type: String,
        enum: ["on-campus", "off-campus", "online", "flexible"],
      },
      groupSizePreference: { type: Number, min: 2, max: 10 },
      skillLevels: [
        {
          subject: { type: String },
          level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
          },
        },
      ],
    },
    settings: {
      profileVisibility: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
      emailNotifications: { type: Boolean, default: false },
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
