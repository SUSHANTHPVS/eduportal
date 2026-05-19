const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ["MCQ", "True/False", "Short Answer", "Coding"],
      default: "MCQ",
    },
    options: [
      {
        type: String,
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      default: 1,
    },
    explanation: {
      type: String,
      default: "",
    },
    sequence: {
      type: Number,
      default: 0,
    },
    // Coding question specific fields
    input: {
      type: String,
      default: "",
    },
    expectedOutput: {
      type: String,
      default: "",
    },
    supportedLanguages: [{
      type: String,
      enum: ["Java", "C", "C++", "Python", "JavaScript"],
      default: ["Java", "C", "C++", "Python", "JavaScript"],
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);