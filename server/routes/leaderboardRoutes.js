const express = require("express");
const Submission = require("../models/Submission");
const User = require("../models/User");
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

// GET LEADERBOARD
router.get("/", async (req, res) => {
  try {
    // Aggregate submissions to calculate user rankings
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExams: { $sum: 1 },
          totalScore: { $sum: "$totalMarksObtained" },
          averageScore: { $avg: "$percentage" },
          passedExams: {
            $sum: {
              $cond: [{ $eq: ["$status", "passed"] }, 1, 0]
            }
          },
          highestScore: { $max: "$percentage" },
          submissions: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          role: "$user.role",
          totalExams: 1,
          totalScore: 1,
          averageScore: { $round: ["$averageScore", 2] },
          passedExams: 1,
          highestScore: { $round: ["$highestScore", 2] },
          passRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ["$passedExams", "$totalExams"] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $match: {
          role: "student" // Only include students in leaderboard
        }
      },
      {
        $sort: {
          averageScore: -1,
          totalExams: -1,
          highestScore: -1
        }
      },
      {
        $limit: 50 // Top 50 students
      }
    ]);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    res.json(rankedLeaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET USER'S RANKING
router.get("/my-rank", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all users' stats for comparison
    const allUsersStats = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExams: { $sum: 1 },
          averageScore: { $avg: "$percentage" },
          passedExams: {
            $sum: {
              $cond: [{ $eq: ["$status", "passed"] }, 1, 0]
            }
          },
          highestScore: { $max: "$percentage" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $match: {
          "user.role": "student"
        }
      },
      {
        $sort: {
          averageScore: -1,
          totalExams: -1,
          highestScore: -1
        }
      }
    ]);

    // Find current user's rank
    const userRank = allUsersStats.findIndex(user => user._id.toString() === userId) + 1;
    const userStats = allUsersStats.find(user => user._id.toString() === userId);

    if (!userStats) {
      return res.json({
        rank: null,
        stats: {
          totalExams: 0,
          averageScore: 0,
          passedExams: 0,
          highestScore: 0,
          passRate: 0
        },
        message: "No exam submissions found"
      });
    }

    res.json({
      rank: userRank,
      stats: {
        totalExams: userStats.totalExams,
        averageScore: Math.round(userStats.averageScore * 100) / 100,
        passedExams: userStats.passedExams,
        highestScore: Math.round(userStats.highestScore * 100) / 100,
        passRate: Math.round((userStats.passedExams / userStats.totalExams) * 100 * 100) / 100
      }
    });
  } catch (error) {
    console.error("My rank error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET TOP PERFORMERS (for dashboard)
router.get("/top-performers", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topPerformers = await Submission.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExams: { $sum: 1 },
          averageScore: { $avg: "$percentage" },
          passedExams: {
            $sum: {
              $cond: [{ $eq: ["$status", "passed"] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          averageScore: { $round: ["$averageScore", 2] },
          totalExams: 1,
          passedExams: 1
        }
      },
      {
        $match: {
          "user.role": "student",
          totalExams: { $gte: 1 } // Only users who have taken at least 1 exam
        }
      },
      {
        $sort: {
          averageScore: -1,
          totalExams: -1
        }
      },
      {
        $limit: limit
      }
    ]);

    res.json(topPerformers);
  } catch (error) {
    console.error("Top performers error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;