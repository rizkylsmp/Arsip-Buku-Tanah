// src/controllers/PengembalianController.js
import {
  Pengembalian,
  BukuTanah,
  Petugas,
  Peminjaman,
} from "../models/index.js";
import { Op } from "sequelize";

// Helper function to generate kode_pengembalian with format KB-YYYYMMDD-XXX
const generateKodePengembalian = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const prefix = `KB-${dateStr}-`;

  // Find the highest sequence number for today
  const lastPengembalian = await Pengembalian.findOne({
    where: {
      kode_pengembalian: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["kode_pengembalian", "DESC"]],
  });

  let sequence = 1;
  if (lastPengembalian) {
    const lastSequence = parseInt(
      lastPengembalian.kode_pengembalian.split("-")[2],
    );
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(3, "0")}`;
};

// Get all pengembalian with associations
export const getAllPengembalian = async (req, res) => {
  try {
    const pengembalian = await Pengembalian.findAll({
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
        {
          model: BukuTanah,
          attributes: ["id_buku", "nomor_hak", "nama_pemilik", "jenis_buku"],
        },
        {
          model: Peminjaman,
          as: "Peminjaman",
          attributes: ["id_pinjam", "kode_peminjaman", "tanggal_pinjam"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ data: pengembalian });
  } catch (error) {
    console.error("Error fetching pengembalian:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch pengembalian", error: error.message });
  }
};

// Get pengembalian by ID
export const getPengembalianById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengembalian = await Pengembalian.findByPk(id, {
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
        {
          model: BukuTanah,
          attributes: ["id_buku", "nomor_hak", "nama_pemilik", "jenis_buku"],
        },
        {
          model: Peminjaman,
          as: "Peminjaman",
          attributes: ["id_pinjam", "kode_peminjaman", "tanggal_pinjam"],
        },
      ],
    });

    if (!pengembalian) {
      return res.status(404).json({ message: "Pengembalian not found" });
    }

    res.json({ data: pengembalian });
  } catch (error) {
    console.error("Error fetching pengembalian:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch pengembalian", error: error.message });
  }
};

// Create pengembalian
export const createPengembalianController = async (req, res) => {
  try {
    const { id_petugas, id_buku, tanggal_kembali, keterangan } = req.body;

    // Auto-generate kode_pengembalian
    const kode_pengembalian = await generateKodePengembalian();

    // Check if buku exists
    const buku = await BukuTanah.findByPk(id_buku);
    if (!buku) {
      return res.status(404).json({ message: "Buku tanah not found" });
    }

    // Check if petugas exists
    const petugas = await Petugas.findByPk(id_petugas);
    if (!petugas) {
      return res.status(404).json({ message: "Petugas not found" });
    }

    // Check if there's an active peminjaman for this book
    const peminjaman = await Peminjaman.findOne({
      where: { id_buku },
      include: [
        {
          model: Pengembalian,
          as: "Pengembalian",
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!peminjaman) {
      return res.status(400).json({
        message: "Tidak ada peminjaman aktif untuk buku ini",
      });
    }

    // Check if this peminjaman already has pengembalian
    if (peminjaman.Pengembalian) {
      return res.status(400).json({
        message: "Buku ini sudah dikembalikan",
      });
    }

    // Create pengembalian with link to peminjaman
    const pengembalian = await Pengembalian.create({
      kode_pengembalian,
      id_pinjam: peminjaman.id_pinjam,
      id_petugas,
      id_buku,
      tanggal_kembali,
      keterangan,
    });

    // Fetch with associations
    const result = await Pengembalian.findByPk(pengembalian.id_kembali, {
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
        {
          model: BukuTanah,
          attributes: ["id_buku", "nomor_hak", "nama_pemilik", "jenis_buku"],
        },
        {
          model: Peminjaman,
          as: "Peminjaman",
          attributes: ["id_pinjam", "kode_peminjaman", "tanggal_pinjam"],
        },
      ],
    });

    console.log(
      `[pengembalian][create] created id=${pengembalian.id_kembali} kode=${kode_pengembalian}`,
    );
    res
      .status(201)
      .json({ data: result, message: "Pengembalian created successfully" });
  } catch (error) {
    console.error("Error creating pengembalian:", error);
    res
      .status(500)
      .json({ message: "Failed to create pengembalian", error: error.message });
  }
};

// Update pengembalian
export const updatePengembalianController = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_petugas, id_buku, tanggal_kembali, keterangan } = req.body;

    const pengembalian = await Pengembalian.findByPk(id);
    if (!pengembalian) {
      return res.status(404).json({ message: "Pengembalian not found" });
    }

    // Update pengembalian (exclude kode_pengembalian)
    await pengembalian.update({
      id_petugas: id_petugas || pengembalian.id_petugas,
      id_buku: id_buku || pengembalian.id_buku,
      tanggal_kembali: tanggal_kembali || pengembalian.tanggal_kembali,
      keterangan:
        keterangan !== undefined ? keterangan : pengembalian.keterangan,
    });

    // Fetch with associations
    const result = await Pengembalian.findByPk(id, {
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
        {
          model: BukuTanah,
          attributes: ["id_buku", "nomor_hak", "nama_pemilik", "jenis_buku"],
        },
      ],
    });

    res.json({ data: result, message: "Pengembalian updated successfully" });
  } catch (error) {
    console.error("Error updating pengembalian:", error);
    res
      .status(500)
      .json({ message: "Failed to update pengembalian", error: error.message });
  }
};

// Delete pengembalian
export const deletePengembalianController = async (req, res) => {
  try {
    const { id } = req.params;
    const pengembalian = await Pengembalian.findByPk(id);

    if (!pengembalian) {
      return res.status(404).json({ message: "Pengembalian not found" });
    }

    // Note: We don't change buku status back to terpinjam when deleting pengembalian
    // This is a business logic decision - discuss with user if needed
    await pengembalian.destroy();
    res.json({ message: "Pengembalian deleted successfully" });
  } catch (error) {
    console.error("Error deleting pengembalian:", error);
    res
      .status(500)
      .json({ message: "Failed to delete pengembalian", error: error.message });
  }
};
