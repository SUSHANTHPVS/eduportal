const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const Submission = require("../models/Submission");
const Progress = require("../models/Progress");
const DriveApplication = require("../models/DriveApplication");
const jwt = require("jsonwebtoken");

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

// GET DASHBOARD STATS (Admin)
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const [totalUsers, totalCourses, totalExams, totalSubmissions] =
      await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Exam.countDocuments(),
        Submission.countDocuments(),
      ]);

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");

    const recentSubmissions = await Submission.find()
      .populate("userId", "name")
      .populate("examId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalExams,
        totalSubmissions,
      },
      recentActivity: {
        users: recentUsers,
        submissions: recentSubmissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET STUDENT DASHBOARD STATS
router.get("/student", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [enrolledCourses, submissions, progress, driveApplications] = await Promise.all([
      Course.countDocuments({ enrolledUsers: userId }),
      Submission.find({ userId }).populate("examId", "title totalMarks").sort({ submittedAt: -1 }),
      Progress.find({ userId }).populate("courseId", "title"),
      DriveApplication.find({ userId }).populate("driveId", "companyName jobTitle")
    ]);

    const totalExamsTaken = submissions.length;
    const averageScore =
      submissions.length > 0
        ? submissions.reduce((acc, sub) => acc + sub.percentage, 0) /
          submissions.length
        : 0;

    const passedExams = submissions.filter(
      (sub) => sub.status === "passed"
    ).length;

    const completedCourses = progress.filter(
      (p) => p.percentageCompleted === 100
    ).length;

    // Calculate score distribution for charts
    const scoreRanges = {
      "90-100": submissions.filter(s => s.percentage >= 90).length,
      "80-89": submissions.filter(s => s.percentage >= 80 && s.percentage < 90).length,
      "70-79": submissions.filter(s => s.percentage >= 70 && s.percentage < 80).length,
      "60-69": submissions.filter(s => s.percentage >= 60 && s.percentage < 70).length,
      "Below 60": submissions.filter(s => s.percentage < 60).length,
    };

    // Monthly performance data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyPerformance = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthSubmissions = submissions.filter(sub =>
        sub.submittedAt >= monthStart && sub.submittedAt <= monthEnd
      );

      monthlyPerformance.push({
        month: date.toLocaleString('default', { month: 'short' }),
        examsTaken: monthSubmissions.length,
        averageScore: monthSubmissions.length > 0
          ? monthSubmissions.reduce((acc, sub) => acc + sub.percentage, 0) / monthSubmissions.length
          : 0
      });
    }

    // Course progress data
    const courseProgressData = progress.map(p => ({
      courseName: p.courseId.title,
      progress: p.percentageCompleted,
      completedModules: p.completedModules.length,
      totalModules: p.totalModules
    }));

    res.json({
      stats: {
        enrolledCourses,
        totalExamsTaken,
        averageScore: Math.round(averageScore * 100) / 100,
        passedExams,
        completedCourses,
        driveApplicationsCount: driveApplications.length,
        passRate: totalExamsTaken > 0 ? Math.round((passedExams / totalExamsTaken) * 100 * 100) / 100 : 0
      },
      charts: {
        scoreDistribution: scoreRanges,
        monthlyPerformance,
        courseProgress: courseProgressData
      },
      recentSubmissions: submissions.slice(0, 5),
      recentApplications: driveApplications.slice(0, 5),
      courseProgress: progress.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;