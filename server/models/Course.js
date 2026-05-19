const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    duration: {
      type: Number, // in hours
      default: 0,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    content: [
      {
        moduleNumber: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          default: "",
        },
        videoUrl: {
          type: String,
          default: "",
        },
        materials: [
          {
            type: String, // URLs/files
          },
        ],
        resources: [
          {
            type: {
              type: String,
              enum: ["video", "image", "file"],
              default: "file",
            },
            url: {
              type: String,
              required: true,
            },
            name: {
              type: String,
              default: "",
            },
          },
        ],
      },
    ],
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);