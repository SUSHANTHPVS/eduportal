const express = require("express");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");

const router = express.Router();

const runShellCommand = (command, options = {}, input = "") =>
  new Promise((resolve) => {
    const child = exec(command, options, (error, stdout, stderr) => {
      resolve({ error, stdout, stderr });
    });

    if (child.stdin && input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });

const languageConfig = {
  Java: {
    fileName: "Main.java",
    compile: "javac Main.java",
    run: "java -cp . Main",
  },
  C: {
    fileName: "main.c",
    compile: process.platform === "win32" ? "gcc main.c -o main.exe" : "gcc main.c -o main_exec",
    run: process.platform === "win32" ? "main.exe" : "./main_exec",
  },
  "C++": {
    fileName: "main.cpp",
    compile: process.platform === "win32" ? "g++ main.cpp -o main.exe" : "g++ main.cpp -o main_exec",
    run: process.platform === "win32" ? "main.exe" : "./main_exec",
  },
  Python: {
    fileName: "script.py",
    compile: null,
    run: process.platform === "win32" ? "python script.py" : "python3 script.py",
  },
  JavaScript: {
    fileName: "script.js",
    compile: null,
    run: "node script.js",
  },
};

const cleanupTempDir = async (dir) => {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (error) {
    // ignore cleanup errors
  }
};

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

// GET ALL EXAMS
router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find({ isPublished: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    console.log('Returning published exams:', exams.length);
    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET ALL EXAMS (Admin - includes unpublished)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE EXAM
router.get("/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("questions");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE EXAM (Admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Creating exam with data:', req.body);
    const exam = new Exam({
      ...req.body,
      createdBy: req.user.id,
    });
    const savedExam = await exam.save();
    console.log('Exam saved:', savedExam);
    res.status(201).json(savedExam);
  } catch (error) {
    console.error('Exam creation error:', error);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE EXAM (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE EXAM (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    // Delete associated questions
    await Question.deleteMany({ examId: req.params.id });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUBLISH/UNPUBLISH EXAM (Admin only)
router.put("/:id/publish", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { isPublished } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true }
    );
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.json(exam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADD QUESTION TO EXAM (Admin only)
router.post("/:id/questions", authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('Adding question to exam', req.params.id, 'with data:', req.body);
    const question = new Question({
      ...req.body,
      examId: req.params.id,
    });
    const savedQuestion = await question.save();
    console.log('Question saved:', savedQuestion);

    // Add question to exam
    await Exam.findByIdAndUpdate(req.params.id, {
      $push: { questions: savedQuestion._id },
    });
    console.log('Question added to exam');

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Add question error:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET QUESTIONS FOR EXAM
router.get("/:id/questions", authenticateToken, async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.id }).sort({
      sequence: 1,
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// COMPILE CODE
router.post("/compile", authenticateToken, async (req, res) => {
  try {
    const { language, code, input = "" } = req.body;
    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    const config = languageConfig[language];
    if (!config) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "edup-"));
    const filePath = path.join(tempDir, config.fileName);
    await fs.writeFile(filePath, code);

    let compileOutput = "";
    if (config.compile) {
      const compileResult = await runShellCommand(config.compile, {
        cwd: tempDir,
        timeout: 10000,
        maxBuffer: 10 * 1024 * 1024,
      });
      if (compileResult.error) {
        await cleanupTempDir(tempDir);
        return res.json({
          success: false,
          compileOutput: compileResult.stderr || compileResult.stdout || compileResult.error.message,
          runtimeOutput: "",
        });
      }
      compileOutput = compileResult.stderr || compileResult.stdout || "Compiled successfully";
    }

    const runResult = await runShellCommand(config.run, {
      cwd: tempDir,
      timeout: 10000,
      maxBuffer: 10 * 1024 * 1024,
    }, input);

    await cleanupTempDir(tempDir);

    if (runResult.error) {
      return res.json({
        success: false,
        compileOutput,
        runtimeOutput: runResult.stderr || runResult.stdout || runResult.error.message,
      });
    }

    res.json({
      success: true,
      compileOutput,
      runtimeOutput: runResult.stdout || "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// SUBMIT EXAM
router.post("/:id/submit", authenticateToken, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const exam = await Exam.findById(req.params.id).populate("questions");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Check if user already submitted
    const existingSubmission = await Submission.findOne({
      userId: req.user.id,
      examId: req.params.id,
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "Exam already submitted" });
    }

    const normalizeAnswer = (value) =>
      typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';

    let totalMarksObtained = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = exam.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question) {
        const expected = normalizeAnswer(question.correctAnswer);
        const actual = normalizeAnswer(answer.selectedAnswer);
        const isCorrect = expected
          ? question.questionType === 'Coding'
            ? actual === expected
            : actual.toLowerCase() === expected.toLowerCase()
          : false;
        const marksObtained = isCorrect ? question.marks : 0;
        totalMarksObtained += marksObtained;

        processedAnswers.push({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          selectedLanguage: answer.selectedLanguage || null,
          isCorrect,
          marksObtained,
        });
      }
    }

    const percentage = (totalMarksObtained / exam.totalMarks) * 100;
    const status = percentage >= exam.passingScore ? "passed" : "failed";

    const submission = new Submission({
      userId: req.user.id,
      examId: req.params.id,
      answers: processedAnswers,
      totalMarksObtained,
      percentage,
      status,
      timeTaken,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER SUBMISSIONS
router.get("/user/submissions", authenticateToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate("examId", "title totalMarks")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SUBMISSION DETAILS
router.get("/submission/:id", authenticateToken, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("examId")
      .populate("answers.questionId");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Check if user owns this submission
    if (submission.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;