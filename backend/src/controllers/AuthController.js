import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Petugas } from "../models/Petugas.js";
import dotenv from "dotenv";
dotenv.config({ quiet: process.env.NODE_ENV === "production" });

export const register = async (req, res) => {
  const {
    nama,
    username,
    password,
    jenisKelamin,
    noHandphone,
    alamat,
    adminCode,
  } = req.body;
  try {
    if (!username || !password || !nama) {
      console.warn("[auth][register] missing fields", { username, nama });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if username already exists
    const existingUser = await Petugas.findOne({ where: { username } });
    if (existingUser) {
      console.warn(
        `[auth][register] username already exists: username=${username}`
      );
      return res.status(400).json({
        error: `Username "${username}" sudah terdaftar. Silakan gunakan username lain.`,
      });
    }

    // Check if there are any existing admins
    const adminCount = await Petugas.count({ where: { role: "admin" } });
    const isFirstUser = adminCount === 0;

    // Admin secret code from environment variable (default: ADMIN2024)
    const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || "ADMIN2024";
    const hasValidAdminCode = adminCode === ADMIN_SECRET_CODE;

    // Determine role: first user OR valid admin code → admin, otherwise pegawai
    let userRole = "pegawai";
    let roleReason = "";

    if (isFirstUser) {
      userRole = "admin";
      roleReason = "first user";
    } else if (hasValidAdminCode) {
      userRole = "admin";
      roleReason = "admin code";
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await Petugas.create({
      nama,
      username,
      password: hash,
      role: userRole,
      jenis_kelamin: jenisKelamin,
      no_handphone: noHandphone,
      alamat,
    });

    console.log(
      `[auth][register] new user registered: id=${user.id_petugas} username=${
        user.username
      } role=${user.role}${roleReason ? ` (${roleReason})` : ""}`
    );
    return res
      .status(201)
      .json({ user: { id: user.id_petugas, nama: user.nama } });
  } catch (err) {
    console.error("[auth][register] error registering user:", err);
    return res
      .status(400)
      .json({ error: "Terjadi kesalahan saat registrasi. Silakan coba lagi." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.warn("[auth][login] missing credentials", { username });
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await Petugas.findOne({ where: { username } });
    if (!user) {
      console.warn(
        `[auth][login] failed login attempt - user not found: username=${username}`
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.warn(
        `[auth][login] failed login attempt - wrong password: username=${username}`
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id_petugas, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log(
      `[auth][login] user logged in: id=${user.id_petugas} username=${user.username} role=${user.role}`
    );
    return res.json({
      token,
      user: { id: user.id_petugas, nama: user.nama, role: user.role },
    });
  } catch (err) {
    console.error("[auth][login] unexpected error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      console.warn("[auth][getUser] missing user id in token payload");
      return res.status(400).json({ error: "Invalid token payload" });
    }

    const user = await Petugas.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      console.warn(`[auth][getUser] user not found: id=${userId}`);
      return res.status(404).json({ error: "User not found" });
    }

    console.log(
      `[auth][getUser] fetched user: id=${user.id_petugas} username=${user.username}`
    );
    return res.json({ user });
  } catch (err) {
    console.error("[auth][getUser] error:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
