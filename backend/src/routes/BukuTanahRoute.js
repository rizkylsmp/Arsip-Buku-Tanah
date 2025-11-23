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

// Public: list and get
router.get("/buku-tanah/available", getAvailableBuku); // Must be before /:id to avoid conflict
router.get("/buku-tanah/borrowed", getBorrowedBuku); // For pengembalian dropdown
router.get("/buku-tanah", getAllBuku);
router.get("/buku-tanah/:id", getBukuById);

// Protected: create, update, delete
router.post("/buku-tanah", authenticate, createBuku);
router.patch("/buku-tanah/:id", authenticate, updateBuku);
router.delete("/buku-tanah/:id", authenticate, deleteBuku);

export default router;
