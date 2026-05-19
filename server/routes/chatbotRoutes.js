const express = require("express");
const ChatbotFAQ = require("../models/ChatbotFAQ");
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

// GET ALL FAQ QUESTIONS
router.get("/faqs", async (req, res) => {
  try {
    const category = req.query.category;

    let query = { isActive: true };
    if (category) {
      query.category = category;
    }

    const faqs = await ChatbotFAQ.find(query).sort({ order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SEARCH FAQ QUESTIONS
router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term required" });
    }

    const faqs = await ChatbotFAQ.find({
      isActive: true,
      $or: [
        { question: { $regex: searchTerm, $options: "i" } },
        { answer: { $regex: searchTerm, $options: "i" } },
      ],
    }).limit(10);

    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ANSWER DYNAMIC QUESTION (AI-like response)
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    // Search for similar FAQs
    const relatedFAQs = await ChatbotFAQ.find({
      isActive: true,
      $or: [
        { question: { $regex: question, $options: "i" } },
        { answer: { $regex: question, $options: "i" } },
      ],
    }).limit(5);

    // If we find related FAQs, return them
    if (relatedFAQs.length > 0) {
      return res.json({
        answer: relatedFAQs[0].answer,
        relatedFAQs,
        source: "FAQ",
      });
    }

    // Generate a helpful response for unknown questions
    const responses = {
      exam: "For exam-related questions, please check the Exams section or contact your instructor.",
      course: "For course information, please visit the Courses section of the portal.",
      drive: "For placement drive details, check the Drives section.",
      profile: "You can update your profile information in the Profile section.",
      default:
        "Thank you for your question. Please check the FAQ section or contact support for more information.",
    };

    let category = "default";
    if (question.toLowerCase().includes("exam")) category = "exam";
    else if (question.toLowerCase().includes("course")) category = "course";
    else if (question.toLowerCase().includes("drive")) category = "drive";
    else if (question.toLowerCase().includes("profile")) category = "profile";

    res.json({
      answer: responses[category],
      relatedFAQs: [],
      source: "Generated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADMIN: CREATE FAQ
router.post("/faqs", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { question, answer, category, order } = req.body;

    const faq = new ChatbotFAQ({
      question,
      answer,
      category,
      order,
    });

    const savedFAQ = await faq.save();
    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: UPDATE FAQ
router.put("/faqs/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const faq = await ChatbotFAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN: DELETE FAQ
router.delete("/faqs/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const faq = await ChatbotFAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;