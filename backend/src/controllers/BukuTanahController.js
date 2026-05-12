import {
  BukuTanah,
  Petugas,
  Peminjaman,
  Pengembalian,
} from "../models/index.js";
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

// Get all buku tanah with computed status based on peminjaman/pengembalian
export const getAllBuku = async (req, res) => {
  try {
    const books = await BukuTanah.findAll({
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get list of borrowed book IDs (peminjaman without pengembalian via id_pinjam)
    const borrowedBookIds = await sequelize.query(
      `SELECT DISTINCT p.id_buku 
       FROM peminjaman p
       LEFT JOIN pengembalian pg ON p.id_pinjam = pg.id_pinjam
       WHERE pg.id_kembali IS NULL`,
      { type: QueryTypes.SELECT },
    );

    const borrowedIds = borrowedBookIds.map((row) => row.id_buku);

    // Add computed status to each book
    const booksWithStatus = books.map((book) => {
      const bookData = book.toJSON();
      bookData.status = borrowedIds.includes(book.id_buku)
        ? "terpinjam"
        : "tersedia";
      return bookData;
    });

    return res.json({ data: booksWithStatus });
  } catch (err) {
    console.error("[bukuTanah][getAll] error:", err);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
};

// Get available books (tersedia) - optimized query for peminjaman dropdown
export const getAvailableBuku = async (req, res) => {
  try {
    // Get all books
    const allBooks = await BukuTanah.findAll({
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get borrowed book IDs using raw query for better performance
    const borrowedBookIds = await sequelize.query(
      `SELECT DISTINCT p.id_buku 
       FROM peminjaman p
       LEFT JOIN pengembalian pg ON p.id_pinjam = pg.id_pinjam
       WHERE pg.id_kembali IS NULL`,
      { type: QueryTypes.SELECT },
    );

    const borrowedIds = borrowedBookIds.map((row) => row.id_buku);

    // Filter out borrowed books
    const availableBooks = allBooks.filter(
      (book) => !borrowedIds.includes(book.id_buku),
    );

    return res.json({ data: availableBooks });
  } catch (err) {
    console.error("[bukuTanah][getAvailable] error:", err);
    return res.status(500).json({ error: "Failed to fetch available books" });
  }
};

// Get borrowed books (terpinjam) - for pengembalian dropdown
export const getBorrowedBuku = async (req, res) => {
  try {
    // Get all books
    const allBooks = await BukuTanah.findAll({
      include: [
        {
          model: Petugas,
          as: "Petugas",
          attributes: ["id_petugas", "nama"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Get borrowed book IDs using raw query
    const borrowedBookIds = await sequelize.query(
      `SELECT DISTINCT p.id_buku 
       FROM peminjaman p
       LEFT JOIN pengembalian pg ON p.id_pinjam = pg.id_pinjam
       WHERE pg.id_kembali IS NULL`,
      { type: QueryTypes.SELECT },
    );

    const borrowedIds = borrowedBookIds.map((row) => row.id_buku);

    // Filter only borrowed books
    const borrowedBooks = allBooks.filter((book) =>
      borrowedIds.includes(book.id_buku),
    );

    return res.json({ data: borrowedBooks });
  } catch (err) {
    console.error("[bukuTanah][getBorrowed] error:", err);
    return res.status(500).json({ error: "Failed to fetch borrowed books" });
  }
};

// Get single buku by id
export const getBukuById = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await BukuTanah.findByPk(id, {
      include: [{ model: Petugas, attributes: ["id_petugas", "nama"] }],
    });
    if (!buku) return res.status(404).json({ error: "Buku not found" });
    return res.json({ data: buku });
  } catch (err) {
    console.error("[bukuTanah][getById] error:", err);
    return res.status(500).json({ error: "Failed to fetch buku" });
  }
};

// Create buku tanah (requires authentication) - sets id_petugas from token
export const createBuku = async (req, res) => {
  try {
    // support both camelCase and snake_case from frontend
    const body = req.body || {};
    const nomor_hak = body.nomor_hak || body.nomorHak || null;
    const nama_pemilik =
      body.nama_pemilik || body.namaPemilik || body.nama || null;
    const kecamatan = body.kecamatan || body.kecamatanName || null;
    const desa_kelurahan = body.desa_kelurahan || body.desaKelurahan || null;
    const jenis_buku = body.jenis_buku || body.jenisBuku || null;
    const luas_tanah = body.luas_tanah || body.luasTanah || null;
    const tanggal_input = body.tanggal_input || body.tanggalInput || null;

    // Validate required fields
    if (!nomor_hak) {
      return res.status(400).json({ error: "Nomor Hak harus diisi" });
    }

    const idPetugas = req.user?.id;
    if (!idPetugas) return res.status(401).json({ error: "Unauthorized" });

    const buku = await BukuTanah.create({
      nomor_hak,
      nama_pemilik,
      kecamatan,
      desa_kelurahan,
      jenis_buku,
      luas_tanah,
      tanggal_input,
      id_petugas: idPetugas,
    });

    console.log(
      `[bukuTanah][create] created id=${buku.id_buku} nomor_hak=${nomor_hak} by petugas=${idPetugas}`,
    );
    return res.status(201).json({ data: buku });
  } catch (err) {
    console.error("[bukuTanah][create] error:", err);
    return res.status(500).json({ error: "Failed to create buku" });
  }
};

// Update buku tanah by id (requires authentication)
export const updateBuku = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await BukuTanah.findByPk(id);
    if (!buku) return res.status(404).json({ error: "Buku not found" });

    // Handle both camelCase and snake_case from frontend
    const updates = {
      nomor_hak: req.body.nomor_hak || req.body.nomorHak,
      nama_pemilik: req.body.nama_pemilik || req.body.namaPemilik,
      kecamatan: req.body.kecamatan,
      desa_kelurahan: req.body.desa_kelurahan || req.body.desaKelurahan,
      jenis_buku: req.body.jenis_buku || req.body.jenisBuku,
      luas_tanah: req.body.luas_tanah || req.body.luasTanah,
      tanggal_input: req.body.tanggal_input || req.body.tanggalInput,
    };

    await buku.update(updates);
    console.log(`[bukuTanah][update] updated id=${id}`);
    return res.json({ data: buku });
  } catch (err) {
    console.error("[bukuTanah][update] error:", err);
    return res.status(500).json({ error: "Failed to update buku" });
  }
};

// Delete buku tanah by id (requires authentication)
export const deleteBuku = async (req, res) => {
  try {
    const id = req.params.id;
    const buku = await BukuTanah.findByPk(id);
    if (!buku) return res.status(404).json({ error: "Buku not found" });

    await buku.destroy();
    console.log(`[bukuTanah][delete] deleted id=${id}`);
    return res.json({ message: "Buku deleted" });
  } catch (err) {
    console.error("[bukuTanah][delete] error:", err);
    return res.status(500).json({ error: "Failed to delete buku" });
  }
};

export default {
  getAllBuku,
  getBukuById,
  createBuku,
  updateBuku,
  deleteBuku,
};
