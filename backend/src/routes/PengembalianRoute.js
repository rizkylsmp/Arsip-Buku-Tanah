// src/routes/PengembalianRoute.js
import express from "express";
import {
  getAllPengembalian,
  getPengembalianById,
  createPengembalianController,
  updatePengembalianController,
  deletePengembalianController,
} from "../controllers/PengembalianController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/pengembalian", getAllPengembalian);
router.get("/pengembalian/:id", getPengembalianById);

// Protected routes
router.post("/pengembalian", verifyToken, createPengembalianController);
router.patch("/pengembalian/:id", verifyToken, updatePengembalianController);
router.delete("/pengembalian/:id", verifyToken, deletePengembalianController);

export default router;
