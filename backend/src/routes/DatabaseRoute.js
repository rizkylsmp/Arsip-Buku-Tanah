// Database utility routes
import express from "express";
import {
  resetAndSeedDatabase,
  getDatabaseStatus,
} from "../controllers/DatabaseController.js";

const router = express.Router();

// GET /api/database/status - Check database status
router.get("/status", getDatabaseStatus);

// POST /api/database/reset - Reset and seed database (use with caution!)
router.post("/reset", resetAndSeedDatabase);

export default router;
