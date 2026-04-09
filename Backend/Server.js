// server.js  —  lokl backend entry point
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const authRoutes   = require("./routes/auth");
const eventRoutes  = require("./routes/events");
const ticketRoutes = require("./routes/tickets");
const savedRoutes  = require("./routes/saved");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],   // React dev servers
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request logger (dev) ─────────────────────────────────────────────────────
app.use((req, _res, next) => {
  const ts = new Date().toLocaleTimeString("en-IN");
  console.log(`[${ts}]  ${req.method.padEnd(6)} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/events",  eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/saved",   savedRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "lokl backend is running",
    timestamp: new Date().toISOString(),
    dataDir: path.join(__dirname, "data"),
  });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("");
  console.log("  🎟   lokl backend");
  console.log(`  🚀   http://localhost:${PORT}`);
  console.log(`  📁   Data stored in: ./data/`);
  console.log("");
  console.log("  Routes:");
  console.log("    POST  /api/auth/signup");
  console.log("    POST  /api/auth/login");
  console.log("    GET   /api/auth/me           [auth]");
  console.log("    PUT   /api/auth/me           [auth]");
  console.log("    GET   /api/events");
  console.log("    GET   /api/events/:id");
  console.log("    POST  /api/events            [auth]");
  console.log("    GET   /api/tickets           [auth]");
  console.log("    POST  /api/tickets           [auth]");
  console.log("    PATCH /api/tickets/:id/cancel [auth]");
  console.log("    GET   /api/saved             [auth]");
  console.log("    POST  /api/saved             [auth]  (toggle)");
  console.log("");
});