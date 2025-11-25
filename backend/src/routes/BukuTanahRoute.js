import express from "express";
import {
  getAllBuku,
  getAvailableBuku,
  getBorrowedBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku,
} from "../controllers/BukuTanahController.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public for authenticated users: list and get (pegawai can view)
router.get("/buku-tanah/available", authenticate, getAvailableBuku);
router.get("/buku-tanah/borrowed", authenticate, getBorrowedBuku);
router.get("/buku-tanah", authenticate, getAllBuku);
router.get("/buku-tanah/:id", authenticate, getBukuById);

// Admin only: create, update, delete
router.post("/buku-tanah", authenticate, isAdmin, createBuku);
router.patch("/buku-tanah/:id", authenticate, isAdmin, updateBuku);
router.delete("/buku-tanah/:id", authenticate, isAdmin, deleteBuku);

export default router;
