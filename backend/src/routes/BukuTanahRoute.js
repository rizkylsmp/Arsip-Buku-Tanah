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
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Public for authenticated users: list and get (pegawai can view)
router.get("/buku-tanah/available", authenticate, getAvailableBuku);
router.get("/buku-tanah/borrowed", authenticate, getBorrowedBuku);
router.get("/buku-tanah", authenticate, getAllBuku);
router.get("/buku-tanah/:id", authenticate, getBukuById);

// Protected routes (both admin and pegawai can create, update, delete)
router.post("/buku-tanah", authenticate, createBuku);
router.patch("/buku-tanah/:id", authenticate, updateBuku);
router.delete("/buku-tanah/:id", authenticate, deleteBuku);

export default router;
