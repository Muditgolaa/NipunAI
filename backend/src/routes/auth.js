import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Helper: create a signed JWT that proves who the user is, valid for 7 days.
function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
        const { name, email, password } = req.body;

    // Reject non-string inputs (blocks NoSQL operator injection like {$gt:""})
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    const cleanEmail = email.toLowerCase().trim();

    if (!name || !cleanEmail || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: cleanEmail, passwordHash });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
        const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const cleanEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET /api/auth/me  — protected: returns the currently logged-in user
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("name email createdAt");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

export default router;