const express = require("express");
const Drive = require("../models/Drive");
const DriveApplication = require("../models/DriveApplication");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const router = express.Router();

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

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" ||
        file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents are allowed"));
    }
  },
});

// CREATE DRIVE (Admin only)
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const drive = new Drive({
      ...req.body,
      createdBy: req.user.id,
    });

    const savedDrive = await drive.save();
    res.status(201).json(savedDrive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET ALL DRIVES (Public - for students to view)
router.get("/", async (req, res) => {
  try {
    const drives = await Drive.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET DRIVE BY ID
router.get("/:id", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id).populate("createdBy", "name email");
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE DRIVE (Admin only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.json(drive);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE DRIVE (Admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.json({ message: "Drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APPLY FOR DRIVE (Students only)
router.post("/:id/apply", authenticateToken, upload.single("resume"), async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const driveId = req.params.id;
    const userId = req.user.id;

    // Check if drive exists and is active
    const drive = await Drive.findById(driveId);
    if (!drive || !drive.isActive) {
      return res.status(404).json({ message: "Drive not found or inactive" });
    }

    // Check if user already applied
    const existingApplication = await DriveApplication.findOne({ driveId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this drive" });
    }

    // Create application
    const application = new DriveApplication({
      driveId,
      userId,
      name: req.body.name,
      email: req.body.email,
      cgpa: parseFloat(req.body.cgpa),
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      skills: req.body.skills,
      experience: req.body.experience || "",
      resume: req.file ? req.file.path : req.body.resume,
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET APPLICATIONS FOR A DRIVE (Admin only)
router.get("/:id/applications", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const applications = await DriveApplication.find({ driveId: req.params.id })
      .populate("userId", "name email")
      .populate("driveId", "companyName jobTitle")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER'S APPLICATIONS (Students only)
router.get("/applications/my", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Student access required" });
    }

    const applications = await DriveApplication.find({ userId: req.user.id })
      .populate("driveId", "companyName jobTitle driveDate applicationDeadline")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE APPLICATION STATUS (Admin only)
router.put("/applications/:id/status", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { status } = req.body;
    const application = await DriveApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "name email").populate("driveId", "companyName jobTitle");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;