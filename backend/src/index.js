import "dotenv/config";        // loads variables from .env into process.env
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

const app = express();

// --- Middleware (runs on every request, in order) ---
app.use(cors({ origin: process.env.CLIENT_URL }));  // allow the React app to call us
app.use(express.json());                            // parse JSON request bodies into req.body

// --- Routes ---
// A simple health check to confirm the server is running.
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "NipunAI backend is running 🚀" });
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});