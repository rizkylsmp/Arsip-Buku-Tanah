// src/controllers/PeminjamanController.js
import { Peminjaman, BukuTanah, Petugas } from "../models/index.js";
import { Op } from "sequelize";

// Helper function to generate kode_peminjaman with format PJ-YYYYMMDD-XXX
const generateKodePeminjaman = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const prefix = `PJ-${dateStr}-`;

  // Find the highest sequence number for today
  const lastPeminjaman = await Peminjaman.findOne({
    where: {
      kode_peminjaman: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["kode_peminjaman", "DESC"]],
  });

  let sequence = 1;
  if (lastPeminjaman) {
    const lastSequence = parseInt(lastPeminjaman.kode_peminjaman.split("-")[2]);
    sequence = lastSequence + 1;
  }

  return `${prefix}${String(sequence).padStart(3, "0")}`;
};

// Get all peminjaman with associations
export const getAllPeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findAll({
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
      order: [["createdAt", "DESC"]],
    });
    res.json({ data: peminjaman });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch peminjaman", error: error.message });
  }
};

// Get peminjaman by ID
export const getPeminjamanById = async (req, res) => {
  try {
    const { id } = req.params;
    const peminjaman = await Peminjaman.findByPk(id, {
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

    if (!peminjaman) {
      return res.status(404).json({ message: "Peminjaman not found" });
    }

    res.json({ data: peminjaman });
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch peminjaman", error: error.message });
  }
};

// Create peminjaman
export const createPeminjamanController = async (req, res) => {
  try {
    const { id_petugas, id_buku, tanggal_pinjam, keterangan } = req.body;

    console.log("Create peminjaman request body:", req.body);
    console.log("id_buku:", id_buku, "type:", typeof id_buku);
    console.log("id_petugas:", id_petugas, "type:", typeof id_petugas);

    // Validate required fields
    if (!id_petugas || !id_buku || !tanggal_pinjam) {
      return res.status(400).json({
        message: "Missing required fields",
        missing: {
          id_petugas: !id_petugas,
          id_buku: !id_buku,
          tanggal_pinjam: !tanggal_pinjam,
        },
      });
    }

    // Auto-generate kode_peminjaman
    const kode_peminjaman = await generateKodePeminjaman();

    // Check if buku exists
    const buku = await BukuTanah.findByPk(id_buku);
    console.log("Found buku:", buku ? buku.id_buku : "NOT FOUND");
    if (!buku) {
      return res.status(404).json({ message: "Buku tanah not found" });
    }

    // Check if petugas exists
    const petugas = await Petugas.findByPk(id_petugas);
    if (!petugas) {
      return res.status(404).json({ message: "Petugas not found" });
    }

    // Create peminjaman
    const peminjaman = await Peminjaman.create({
      kode_peminjaman,
      id_petugas,
      id_buku,
      tanggal_pinjam,
      keterangan,
    });

    // Fetch with associations
    const result = await Peminjaman.findByPk(peminjaman.id_pinjam, {
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

    console.log(
      `[peminjaman][create] created id=${peminjaman.id_pinjam} kode=${kode_peminjaman}`,
    );
    res
      .status(201)
      .json({ data: result, message: "Peminjaman created successfully" });
  } catch (error) {
    console.error("Error creating peminjaman:", error);
    res
      .status(500)
      .json({ message: "Failed to create peminjaman", error: error.message });
  }
};

// Update peminjaman
export const updatePeminjamanController = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_petugas, id_buku, tanggal_pinjam, keterangan } = req.body;

    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) {
      return res.status(404).json({ message: "Peminjaman not found" });
    }

    // If changing buku, check availability
    if (id_buku && id_buku !== peminjaman.id_buku) {
      const newBuku = await BukuTanah.findByPk(id_buku);
      if (!newBuku) {
        return res.status(404).json({ message: "Buku tanah not found" });
      }
      if (newBuku.status === "terpinjam") {
        return res.status(400).json({ message: "Buku tanah sudah terpinjam" });
      }

      // Update old buku status to tersedia
      const oldBuku = await BukuTanah.findByPk(peminjaman.id_buku);
      if (oldBuku) {
        await oldBuku.update({ status: "tersedia" });
      }

      // Update new buku status to terpinjam
      await newBuku.update({ status: "terpinjam" });
    }

    // Update peminjaman (exclude kode_peminjaman)
    await peminjaman.update({
      id_petugas: id_petugas || peminjaman.id_petugas,
      id_buku: id_buku || peminjaman.id_buku,
      tanggal_pinjam: tanggal_pinjam || peminjaman.tanggal_pinjam,
      keterangan: keterangan !== undefined ? keterangan : peminjaman.keterangan,
    });

    // Fetch with associations
    const result = await Peminjaman.findByPk(id, {
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

    res.json({ data: result, message: "Peminjaman updated successfully" });
  } catch (error) {
    console.error("Error updating peminjaman:", error);
    res
      .status(500)
      .json({ message: "Failed to update peminjaman", error: error.message });
  }
};

// Delete peminjaman
export const deletePeminjamanController = async (req, res) => {
  try {
    const { id } = req.params;
    const peminjaman = await Peminjaman.findByPk(id);

    if (!peminjaman) {
      return res.status(404).json({ message: "Peminjaman not found" });
    }

    await peminjaman.destroy();
    res.json({ message: "Peminjaman deleted successfully" });
  } catch (error) {
    console.error("Error deleting peminjaman:", error);
    res
      .status(500)
      .json({ message: "Failed to delete peminjaman", error: error.message });
  }
};
