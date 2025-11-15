import express from "express";
import { login, register, getUser } from "../controllers/AuthController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// return current user
router.get("/me", authenticate, getUser);

export default router;
