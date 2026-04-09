// routes/tickets.js
const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const store    = require("../utils/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// ─── GET /api/tickets  (protected) — my tickets ───────────────────────────────
router.get("/", authenticate, (req, res) => {
  const { status } = req.query;
  let tickets = store.find("tickets", (t) => t.userId === req.user.id);
  if (status) tickets = tickets.filter((t) => t.status === status);

  // Attach current event data
  tickets = tickets.map((t) => {
    const event = store.findById("events", t.eventId);
    return { ...t, event: event || null };
  });

  return res.json({ success: true, count: tickets.length, tickets });
});

// ─── GET /api/tickets/:id  (protected) ───────────────────────────────────────
router.get("/:id", authenticate, (req, res) => {
  const ticket = store.findById("tickets", req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  if (ticket.userId !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });

  const event = store.findById("events", ticket.eventId);
  return res.json({ success: true, ticket: { ...ticket, event } });
});

// ─── POST /api/tickets  (protected) — book ticket ────────────────────────────
router.post("/", authenticate, (req, res) => {
  const { eventId, quantity } = req.body;

  if (!eventId) return res.status(400).json({ success: false, message: "eventId is required" });

  const event = store.findById("events", eventId);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  const qty = Math.max(1, Math.min(10, Number(quantity) || 1));

  // Check capacity
  const bookedCount = store.find("tickets", (t) => t.eventId === eventId && t.status !== "cancelled")
    .reduce((sum, t) => sum + t.quantity, 0);

  if (bookedCount + qty > event.capacity) {
    return res.status(400).json({ success: false, message: "Not enough capacity remaining" });
  }

  // Check if user already has an active ticket for this event
  const existing = store.findOne("tickets", (t) => t.eventId === eventId && t.userId === req.user.id && t.status === "upcoming");
  if (existing) {
    return res.status(409).json({ success: false, message: "You already have a ticket for this event" });
  }

  const ticketNumber = `LKO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const ticket = {
    id:           uuidv4(),
    ticketNumber,
    userId:       req.user.id,
    eventId:      eventId,
    quantity:     qty,
    totalPrice:   event.price * qty,
    bookingDate:  new Date().toISOString(),
    status:       "upcoming",
    qrCode:       `QR_${uuidv4()}`,
    paymentMethod: req.body.paymentMethod || "upi",
  };

  store.insert("tickets", ticket);

  // Increment event attendee count
  store.updateById("events", eventId, { attendees: event.attendees + qty });

  return res.status(201).json({ success: true, ticket: { ...ticket, event } });
});

// ─── PATCH /api/tickets/:id/cancel  (protected) ──────────────────────────────
router.patch("/:id/cancel", authenticate, (req, res) => {
  const ticket = store.findById("tickets", req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  if (ticket.userId !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });
  if (ticket.status !== "upcoming") {
    return res.status(400).json({ success: false, message: `Cannot cancel a ticket with status: ${ticket.status}` });
  }

  store.updateById("tickets", req.params.id, { status: "cancelled", cancelledAt: new Date().toISOString() });

  // Decrement attendee count
  const event = store.findById("events", ticket.eventId);
  if (event) {
    store.updateById("events", ticket.eventId, { attendees: Math.max(0, event.attendees - ticket.quantity) });
  }

  const updated = store.findById("tickets", req.params.id);
  return res.json({ success: true, ticket: updated });
});

// ─── PATCH /api/tickets/:id/attend  (admin-ish) ──────────────────────────────
router.patch("/:id/attend", authenticate, (req, res) => {
  const ticket = store.findById("tickets", req.params.id);
  if (!ticket) return res.status(404).json({ success: false, message: "Ticket not found" });
  if (ticket.userId !== req.user.id) return res.status(403).json({ success: false, message: "Not authorized" });

  store.updateById("tickets", req.params.id, { status: "attended", attendedAt: new Date().toISOString() });
  const updated = store.findById("tickets", req.params.id);
  return res.json({ success: true, ticket: updated });
});

module.exports = router;