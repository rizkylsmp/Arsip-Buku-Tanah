// src/routes/PeminjamanRoute.js
import express from "express";
import {
  getAllPeminjaman,
  getPeminjamanById,
  createPeminjamanController,
  updatePeminjamanController,
  deletePeminjamanController,
} from "../controllers/PeminjamanController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Protected routes (both admin and pegawai can access)
router.get("/peminjaman", authenticate, getAllPeminjaman);
router.get("/peminjaman/:id", authenticate, getPeminjamanById);
router.post("/peminjaman", authenticate, createPeminjamanController);
router.patch("/peminjaman/:id", authenticate, updatePeminjamanController);
router.delete("/peminjaman/:id", authenticate, deletePeminjamanController);

export default router;
