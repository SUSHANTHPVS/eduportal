const mongoose = require("mongoose");

const driveApplicationSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    resume: {
      type: String, // File path/URL
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected", "selected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications
driveApplicationSchema.index({ driveId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("DriveApplication", driveApplicationSchema);