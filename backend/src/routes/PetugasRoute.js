import express from "express";
import {
  getAllPetugas,
  getPetugasById,
  createPetugasController,
  updatePetugasController,
  deletePetugasController,
  changePasswordController,
} from "../controllers/PetugasController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// Public: list and get
router.get("/petugas", getAllPetugas);
router.get("/petugas/:id", getPetugasById);

// Protected: create, update, delete
router.post("/petugas", authenticate, createPetugasController);
router.patch("/petugas/:id", authenticate, updatePetugasController);
router.delete("/petugas/:id", authenticate, deletePetugasController);
router.patch(
  "/petugas/:id/change-password",
  authenticate,
  changePasswordController
);

export default router;
