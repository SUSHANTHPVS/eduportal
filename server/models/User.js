const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "student"],
      default: "student",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Additional profile fields for drives
    phoneNumber: {
      type: String,
      default: "",
    },

    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },

    address: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);