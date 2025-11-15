import { BukuTanah, Petugas } from "../models/index.js";

// Get all buku tanah (with optional query params)
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
    return res.json({ data: books });
  } catch (err) {
    console.error("[bukuTanah][getAll] error:", err);
    return res.status(500).json({ error: "Failed to fetch data" });
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
    const kode_buku = body.kode_buku || body.kodeBuku || body.kode || null;
    const nama_pemilik =
      body.nama_pemilik || body.namaPemilik || body.nama || null;
    const kecamatan = body.kecamatan || body.kecamatanName || null;
    const jenis_buku = body.jenis_buku || body.jenisBuku || null;
    const tanggal_input = body.tanggal_input || body.tanggalInput || null;

    if (!kode_buku)
      return res.status(400).json({ error: "kode_buku is required" });

    const idPetugas = req.user?.id;
    if (!idPetugas) return res.status(401).json({ error: "Unauthorized" });

    // Check if kode_buku already exists
    const existingBuku = await BukuTanah.findOne({ where: { kode_buku } });
    if (existingBuku) {
      return res.status(400).json({
        error: `Kode buku "${kode_buku}" sudah ada di database. Gunakan kode buku yang berbeda.`,
      });
    }

    const buku = await BukuTanah.create({
      kode_buku,
      nama_pemilik,
      kecamatan,
      jenis_buku,
      tanggal_input,
      id_petugas: idPetugas,
    });

    console.log(
      `[bukuTanah][create] created id=${buku.id_buku} by petugas=${idPetugas}`
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
    // Note: DO NOT update kode_buku (it's unique and disabled in edit form)
    const updates = {
      nama_pemilik: req.body.nama_pemilik || req.body.namaPemilik,
      kecamatan: req.body.kecamatan,
      jenis_buku: req.body.jenis_buku || req.body.jenisBuku,
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
