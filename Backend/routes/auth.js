// routes/auth.js
const express  = require("express");
const bcrypt   = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const store    = require("../utils/store");
const { signToken, authenticate } = require("../middleware/auth");

const router = express.Router();

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, college, location, interests } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    // Duplicate check
    const existing = store.findOne("users", (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Build initials for avatar
    const initials = name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

    const user = {
      id:           uuidv4(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash,
      avatar:       initials,
      college:      college || "",
      location:     location || "Lucknow",
      interests:    Array.isArray(interests) ? interests : [],
      createdAt:    new Date().toISOString(),
    };

    store.insert("users", user);

    // Return token + safe user object (no passwordHash)
    const { passwordHash: _, ...safeUser } = user;
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    return res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = store.findOne("users", (u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const { passwordHash: _, ...safeUser } = user;
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    return res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// ─── GET /api/auth/me  (protected) ───────────────────────────────────────────
router.get("/me", authenticate, (req, res) => {
  const user = store.findById("users", req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// ─── PUT /api/auth/me  (protected) — update profile ──────────────────────────
router.put("/me", authenticate, (req, res) => {
  const allowed = ["name", "college", "location", "interests"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  if (updates.name) {
    updates.avatar = updates.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  store.updateById("users", req.user.id, updates);
  const user = store.findById("users", req.user.id);
  const { passwordHash: _, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
});

// ─── PUT /api/auth/change-password (protected) ───────────────────────────────
router.put("/change-password", authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Both current and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
  }

  const user = store.findById("users", req.user.id);
  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) {
    return res.status(401).json({ success: false, message: "Current password is incorrect" });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  store.updateById("users", req.user.id, { passwordHash });
  return res.json({ success: true, message: "Password updated successfully" });
});

module.exports = router;