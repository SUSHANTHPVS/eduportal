const express = require("express");
const Course = require("../models/Course");
const Progress = require("../models/Progress");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// UPLOAD COURSE FILES (Admin only)
router.post("/upload", authenticateToken, requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ url: fileUrl, name: req.file.originalname, mimeType: req.file.mimetype });
});

// GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE COURSE
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE COURSE (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.id,
    });
    const savedCourse = await course.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE COURSE (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE COURSE (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ENROLL IN COURSE
router.post("/:id/enroll", authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.enrolledUsers.includes(req.user.id)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    course.enrolledUsers.push(req.user.id);
    await course.save();

    // Create progress record
    const progress = new Progress({
      userId: req.user.id,
      courseId: req.params.id,
      totalModules: course.content.length,
    });
    await progress.save();

    res.json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER'S ENROLLED COURSES
router.get("/user/enrolled", authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({ enrolledUsers: req.user.id })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE COURSE PROGRESS
router.put("/:id/progress", authenticateToken, async (req, res) => {
  try {
    const { completedModules } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id, courseId: req.params.id },
      {
        completedModules,
        percentageCompleted: (completedModules.length / req.body.totalModules) * 100,
      },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET COURSE PROGRESS
router.get("/:id/progress", authenticateToken, async (req, res) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
      courseId: req.params.id,
    });
    res.json(progress || { completedModules: [], percentageCompleted: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;