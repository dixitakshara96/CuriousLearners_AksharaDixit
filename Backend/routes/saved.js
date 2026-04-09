// routes/saved.js
const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const store    = require("../utils/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// ─── GET /api/saved  (protected) ─────────────────────────────────────────────
router.get("/", authenticate, (req, res) => {
  const saved = store.find("saved", (s) => s.userId === req.user.id);
  const events = saved.map((s) => {
    const event = store.findById("events", s.eventId);
    return { ...s, event };
  }).filter((s) => s.event !== null);
  return res.json({ success: true, count: events.length, saved: events });
});

// ─── POST /api/saved  (protected) — toggle save ───────────────────────────────
router.post("/", authenticate, (req, res) => {
  const { eventId } = req.body;
  if (!eventId) return res.status(400).json({ success: false, message: "eventId is required" });

  const event = store.findById("events", eventId);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  const existing = store.findOne("saved", (s) => s.userId === req.user.id && s.eventId === eventId);

  if (existing) {
    store.deleteWhere("saved", (s) => s.userId === req.user.id && s.eventId === eventId);
    return res.json({ success: true, saved: false, message: "Event removed from saved" });
  } else {
    store.insert("saved", { id: uuidv4(), userId: req.user.id, eventId, savedAt: new Date().toISOString() });
    return res.status(201).json({ success: true, saved: true, message: "Event saved" });
  }
});

// ─── DELETE /api/saved/:eventId  (protected) ──────────────────────────────────
router.delete("/:eventId", authenticate, (req, res) => {
  store.deleteWhere("saved", (s) => s.userId === req.user.id && s.eventId === req.params.eventId);
  return res.json({ success: true, message: "Removed from saved" });
});

module.exports = router;