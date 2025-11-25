import express from "express";
import {
  getAllPetugas,
  getPetugasById,
  createPetugasController,
  updatePetugasController,
  deletePetugasController,
  changePasswordController,
} from "../controllers/PetugasController.js";
import { authenticate, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Admin only: all petugas management
router.get("/petugas", authenticate, isAdmin, getAllPetugas);
router.get("/petugas/:id", authenticate, isAdmin, getPetugasById);
router.post("/petugas", authenticate, isAdmin, createPetugasController);
router.patch("/petugas/:id", authenticate, isAdmin, updatePetugasController);
router.delete("/petugas/:id", authenticate, isAdmin, deletePetugasController);
router.patch(
  "/petugas/:id/change-password",
  authenticate,
  isAdmin,
  changePasswordController
);

export default router;
