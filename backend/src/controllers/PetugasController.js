import bcrypt from "bcrypt";
import { Petugas } from "../models/Petugas.js";

// Get all petugas
export const getAllPetugas = async (req, res) => {
  try {
    const list = await Petugas.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });
    return res.json({ data: list });
  } catch (err) {
    console.error("[petugas][getAll] error:", err);
    return res.status(500).json({ error: "Failed to fetch petugas" });
  }
};

// Get single petugas by id
export const getPetugasById = async (req, res) => {
  try {
    const id = req.params.id;
    const petugas = await Petugas.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!petugas) return res.status(404).json({ error: "Petugas not found" });
    return res.json({ data: petugas });
  } catch (err) {
    console.error("[petugas][getById] error:", err);
    return res.status(500).json({ error: "Failed to fetch petugas" });
  }
};

// Create petugas
export const createPetugasController = async (req, res) => {
  try {
    // Handle both camelCase and snake_case from frontend
    const nama = req.body.nama;
    const username = req.body.username;
    const password = req.body.password;
    const confPassword = req.body.conf_password || req.body.confPassword;
    const role = req.body.role || "pegawai"; // Default to pegawai
    const jenisKelamin = req.body.jenis_kelamin || req.body.jenisKelamin;
    const noHandphone = req.body.no_handphone || req.body.noHandphone;
    const alamat = req.body.alamat;

    if (!nama || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (password !== confPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirmation do not match" });
    }

    // Validate role
    if (role !== "admin" && role !== "pegawai") {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be 'admin' or 'pegawai'" });
    }

    // Check if username already exists
    const existingPetugas = await Petugas.findOne({ where: { username } });
    if (existingPetugas) {
      return res.status(400).json({
        error: `Username "${username}" sudah digunakan. Gunakan username yang berbeda.`,
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await Petugas.create({
      nama,
      username,
      password: hash,
      role,
      jenis_kelamin: jenisKelamin || null,
      no_handphone: noHandphone || null,
      alamat: alamat || null,
    });
    return res.status(201).json({ data: newUser });
  } catch (err) {
    console.error("[petugas][create] error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Update petugas
export const updatePetugasController = async (req, res) => {
  try {
    const id = req.params.id;
    const petugas = await Petugas.findByPk(id);
    if (!petugas) return res.status(404).json({ error: "Petugas not found" });

    // Handle both camelCase and snake_case from frontend
    const updates = {
      nama: req.body.nama,
      jenis_kelamin: req.body.jenis_kelamin || req.body.jenisKelamin,
      no_handphone: req.body.no_handphone || req.body.noHandphone,
      alamat: req.body.alamat,
    };

    // Allow admin to update role
    if (req.body.role) {
      if (req.body.role !== "admin" && req.body.role !== "pegawai") {
        return res
          .status(400)
          .json({ error: "Invalid role. Must be 'admin' or 'pegawai'" });
      }
      updates.role = req.body.role;
    }

    // Only update password if provided
    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      updates.password = hash;
    }

    await petugas.update(updates);
    return res.json({ data: petugas });
  } catch (err) {
    console.error("[petugas][update] error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// Delete petugas
export const deletePetugasController = async (req, res) => {
  try {
    const id = req.params.id;
    const petugas = await Petugas.findByPk(id);
    if (!petugas) return res.status(404).json({ error: "Petugas not found" });
    await petugas.destroy();
    return res.json({ message: "Petugas deleted" });
  } catch (err) {
    console.error("[petugas][delete] error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Change password
export const changePasswordController = async (req, res) => {
  try {
    const id = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "Password baru harus diisi" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password baru minimal 6 karakter" });
    }

    const petugas = await Petugas.findByPk(id);
    if (!petugas)
      return res.status(404).json({ error: "Petugas tidak ditemukan" });

    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10);
    await petugas.update({ password: hash });

    console.log(`[petugas][changePassword] password changed for id=${id}`);
    return res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    console.error("[petugas][changePassword] error:", err);
    return res.status(500).json({ error: "Gagal mengubah password" });
  }
};
