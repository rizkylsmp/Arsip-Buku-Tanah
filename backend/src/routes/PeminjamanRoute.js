// src/routes/PeminjamanRoute.js
import express from "express";
import {
  getAllPeminjaman,
  getPeminjamanById,
  createPeminjamanController,
  updatePeminjamanController,
  deletePeminjamanController,
} from "../controllers/PeminjamanController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/peminjaman", getAllPeminjaman);
router.get("/peminjaman/:id", getPeminjamanById);

// Protected routes
router.post("/peminjaman", verifyToken, createPeminjamanController);
router.patch("/peminjaman/:id", verifyToken, updatePeminjamanController);
router.delete("/peminjaman/:id", verifyToken, deletePeminjamanController);

export default router;
