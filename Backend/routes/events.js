// routes/events.js
const express  = require("express");
const { v4: uuidv4 } = require("uuid");
const store    = require("../utils/store");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// ─── Seed default events if collection is empty ───────────────────────────────
function seedEvents() {
  if (store.getAll("events").length > 0) return;
  const defaults = [
    {
      id: "evt-001", title: "Techfest 2025 — IIT Lucknow", category: "college-fest",
      date: "2025-04-15", time: "10:00 AM", venue: "IIT Lucknow Campus",
      location: "Gomti Nagar, Lucknow", distance: "2.3 km", price: 299,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      tags: ["Tech", "Robotics", "AI", "Hackathon"], organizer: "IIT Lucknow",
      attendees: 1240, capacity: 2000, isFeatured: true,
      description: "Annual technology festival featuring robotics competitions, AI workshops, startup pitches, and keynotes from industry leaders.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-002", title: "Sunday Bazaar Pop-Up", category: "popup",
      date: "2025-04-13", time: "11:00 AM", venue: "Hazratganj Central Park",
      location: "Hazratganj, Lucknow", distance: "1.1 km", price: 50,
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80",
      tags: ["Shopping", "Handmade", "Food", "Art"], organizer: "LKO Makers Collective",
      attendees: 320, capacity: 500, isFeatured: true,
      description: "A vibrant pop-up market featuring 60+ local artisans, handmade crafts, street food, and live music.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-003", title: "Indie Nights — Live Music", category: "music",
      date: "2025-04-18", time: "7:00 PM", venue: "Oudh 1590 Rooftop",
      location: "Vipin Khand, Lucknow", distance: "3.7 km", price: 499,
      image: "https://images.unsplash.com/photo-1501386761578-eaa54b41f1eb?w=800&q=80",
      tags: ["Music", "Indie", "Live", "Rooftop"], organizer: "Rhythm House Events",
      attendees: 180, capacity: 250, isFeatured: false,
      description: "An intimate rooftop evening featuring 4 indie artists performing original music.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-004", title: "Flavours of Awadh Food Fest", category: "food",
      date: "2025-04-20", time: "12:00 PM", venue: "Janeshwar Mishra Park",
      location: "Gomti Nagar, Lucknow", distance: "4.2 km", price: 149,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      tags: ["Food", "Awadhi", "Street Food", "Biryani"], organizer: "Lucknow Food Society",
      attendees: 860, capacity: 1500, isFeatured: true,
      description: "A 2-day celebration of Lucknow's legendary Awadhi cuisine. 40+ food stalls, live cooking demos.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-005", title: "Campus Startup Summit", category: "tech",
      date: "2025-04-25", time: "9:00 AM", venue: "BBAU Auditorium",
      location: "Lucknow University Road", distance: "5.8 km", price: 0,
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      tags: ["Startup", "Pitch", "Networking", "Free"], organizer: "BBAU E-Cell",
      attendees: 420, capacity: 600, isFeatured: false,
      description: "Free startup summit connecting student entrepreneurs with mentors, VCs, and industry experts.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-006", title: "Yoga & Wellness Morning", category: "community",
      date: "2025-04-14", time: "6:00 AM", venue: "Ambedkar Park",
      location: "Sector 6, Lucknow", distance: "0.8 km", price: 100,
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      tags: ["Wellness", "Yoga", "Morning", "Health"], organizer: "Lucknow Wellness Hub",
      attendees: 95, capacity: 150, isFeatured: false,
      description: "Guided 2-hour yoga and mindfulness session followed by a healthy breakfast social.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-007", title: "Inter-College Basketball Slam", category: "sports",
      date: "2025-04-22", time: "2:00 PM", venue: "KD Singh Babu Stadium",
      location: "Lalbagh, Lucknow", distance: "2.9 km", price: 80,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      tags: ["Basketball", "Sports", "College", "Competition"], organizer: "Lucknow Sports Federation",
      attendees: 540, capacity: 1200, isFeatured: false,
      description: "12 college teams compete in the ultimate inter-college basketball tournament.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
    {
      id: "evt-008", title: "Photography Walk — Old City", category: "community",
      date: "2025-04-19", time: "7:00 AM", venue: "Rumi Darwaza",
      location: "Chowk, Lucknow", distance: "3.4 km", price: 199,
      image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&q=80",
      tags: ["Photography", "Heritage", "Walk", "Art"], organizer: "Lucknow Lens Club",
      attendees: 45, capacity: 60, isFeatured: false,
      description: "Guided 3-hour photography walk through Old Lucknow's heritage lanes and nawabi architecture.",
      createdAt: new Date().toISOString(), organizerId: "system",
    },
  ];
  defaults.forEach((e) => store.insert("events", e));
  console.log("✅  Seeded", defaults.length, "default events");
}

seedEvents();

// ─── GET /api/events ─ list all, with optional filters ───────────────────────
router.get("/", (req, res) => {
  const { category, search, priceMax, priceMin, sort } = req.query;
  let events = store.getAll("events");

  if (category && category !== "all") {
    events = events.filter((e) => e.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.location.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
    );
  }
  if (priceMin !== undefined) events = events.filter((e) => e.price >= Number(priceMin));
  if (priceMax !== undefined) events = events.filter((e) => e.price <= Number(priceMax));

  if (sort === "price_asc")  events.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") events.sort((a, b) => b.price - a.price);
  if (sort === "popular")    events.sort((a, b) => b.attendees - a.attendees);
  if (sort === "date")       events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return res.json({ success: true, count: events.length, events });
});

// ─── GET /api/events/featured ─────────────────────────────────────────────────
router.get("/featured", (req, res) => {
  const events = store.find("events", (e) => e.isFeatured === true);
  return res.json({ success: true, events });
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const event = store.findById("events", req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  return res.json({ success: true, event });
});

// ─── POST /api/events  (protected) — create event ────────────────────────────
router.post("/", authenticate, (req, res) => {
  const { title, category, date, time, venue, location, price, capacity, description, tags, image } = req.body;

  if (!title || !category || !date || !venue) {
    return res.status(400).json({ success: false, message: "title, category, date and venue are required" });
  }

  const organizer = store.findById("users", req.user.id);
  const event = {
    id:          uuidv4(),
    title:       title.trim(),
    category,
    date,
    time:        time || "TBD",
    venue:       venue.trim(),
    location:    location || "",
    distance:    "Nearby",
    price:       Number(price) || 0,
    capacity:    Number(capacity) || 100,
    image:       image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    tags:        Array.isArray(tags) ? tags : (tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    organizer:   organizer ? organizer.name : "Unknown",
    organizerId: req.user.id,
    attendees:   0,
    isFeatured:  false,
    description: description || "",
    createdAt:   new Date().toISOString(),
  };

  store.insert("events", event);
  return res.status(201).json({ success: true, event });
});

// ─── PUT /api/events/:id  (protected) — edit own event ───────────────────────
router.put("/:id", authenticate, (req, res) => {
  const event = store.findById("events", req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  if (event.organizerId !== req.user.id && event.organizerId !== "system") {
    return res.status(403).json({ success: false, message: "Not authorized to edit this event" });
  }

  const allowed = ["title", "date", "time", "venue", "location", "price", "capacity", "description", "tags", "image"];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  store.updateById("events", req.params.id, updates);
  const updated = store.findById("events", req.params.id);
  return res.json({ success: true, event: updated });
});

// ─── DELETE /api/events/:id  (protected) ─────────────────────────────────────
router.delete("/:id", authenticate, (req, res) => {
  const event = store.findById("events", req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  if (event.organizerId !== req.user.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  store.deleteWhere("events", (e) => e.id === req.params.id);
  return res.json({ success: true, message: "Event deleted" });
});

module.exports = router;