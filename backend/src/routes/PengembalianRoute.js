// src/routes/PengembalianRoute.js
import express from "express";
import {
  getAllPengembalian,
  getPengembalianById,
  createPengembalianController,
  updatePengembalianController,
  deletePengembalianController,
} from "../controllers/PengembalianController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes (both admin and pegawai can access)
router.get("/pengembalian", authenticate, getAllPengembalian);
router.get("/pengembalian/:id", authenticate, getPengembalianById);
router.post("/pengembalian", authenticate, createPengembalianController);
router.patch("/pengembalian/:id", authenticate, updatePengembalianController);
router.delete("/pengembalian/:id", authenticate, deletePengembalianController);

export default router;
