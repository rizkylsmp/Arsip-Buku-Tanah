import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Petugas } from "../models/Petugas.js";
dotenv.config();

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Alias for compatibility
export const verifyToken = authenticate;

// Middleware to check if user is admin
export async function isAdmin(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await Petugas.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    next();
  } catch (err) {
    console.error("[auth][isAdmin] error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Middleware to check if user is admin or pegawai (authenticated users)
export function isAuthenticated(req, res, next) {
  // This is just an alias for authenticate
  // All authenticated users (both admin and pegawai) can pass
  return authenticate(req, res, next);
}
