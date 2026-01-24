// src/server.js
import app from "./app.js";
import { sequelize } from "./config/db.js";
import { Petugas } from "./models/Petugas.js";
import { BukuTanah } from "./models/BukuTanah.js";
import { Peminjaman } from "./models/Peminjaman.js";
import { Pengembalian } from "./models/Pengembalian.js";
import bcrypt from "bcrypt";

const PORT = process.env.PORT || 4000;

async function seedDatabase() {
  try {
    // Check if data already exists
    const petugasCount = await Petugas.count();

    if (petugasCount > 0) {
      console.log("ℹ️  Database already has data. Skipping seed...");
      return;
    }

    console.log("📦 Database is empty. Starting seed...");

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Insert Petugas
    await Petugas.bulkCreate([
      {
        nama: "Admin Utama",
        username: "admin",
        password: hashedPassword,
        role: "admin",
        jenis_kelamin: "Laki-laki",
        no_handphone: "081234567890",
        alamat: "Jl. BPN No. 1, Jakarta",
      },
      {
        nama: "Budi Santoso",
        username: "budi",
        password: hashedPassword,
        role: "pegawai",
        jenis_kelamin: "Laki-laki",
        no_handphone: "081234567891",
        alamat: "Jl. Merdeka No. 10, Jakarta",
      },
      {
        nama: "Siti Nurhaliza",
        username: "siti",
        password: hashedPassword,
        role: "pegawai",
        jenis_kelamin: "Perempuan",
        no_handphone: "081234567892",
        alamat: "Jl. Sudirman No. 20, Jakarta",
      },
      {
        nama: "Ahmad Fauzi",
        username: "ahmad",
        password: hashedPassword,
        role: "pegawai",
        jenis_kelamin: "Laki-laki",
        no_handphone: "081234567893",
        alamat: "Jl. Gatot Subroto No. 30, Jakarta",
      },
    ]);

    // Insert Buku Tanah
    await BukuTanah.bulkCreate([
      {
        kode_buku: "BT-001-2024",
        nama_pemilik: "Andi Wijaya",
        kecamatan: "Menteng",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-15",
        id_petugas: 1,
        status: "tersedia",
      },
      {
        kode_buku: "BT-002-2024",
        nama_pemilik: "Dewi Lestari",
        kecamatan: "Kebayoran Baru",
        jenis_buku: "Sertifikat Hak Guna Bangunan",
        tanggal_input: "2024-01-16",
        id_petugas: 1,
        status: "tersedia",
      },
      {
        kode_buku: "BT-003-2024",
        nama_pemilik: "Rudi Hartono",
        kecamatan: "Tebet",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-17",
        id_petugas: 1,
        status: "tersedia",
      },
      {
        kode_buku: "BT-004-2024",
        nama_pemilik: "Sri Wahyuni",
        kecamatan: "Cakung",
        jenis_buku: "Sertifikat Hak Pakai",
        tanggal_input: "2024-01-18",
        id_petugas: 2,
        status: "tersedia",
      },
      {
        kode_buku: "BT-005-2024",
        nama_pemilik: "Bambang Pamungkas",
        kecamatan: "Kelapa Gading",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-19",
        id_petugas: 2,
        status: "tersedia",
      },
      {
        kode_buku: "BT-006-2024",
        nama_pemilik: "Ratna Sari",
        kecamatan: "Menteng",
        jenis_buku: "Sertifikat Hak Guna Bangunan",
        tanggal_input: "2024-01-20",
        id_petugas: 2,
        status: "tersedia",
      },
      {
        kode_buku: "BT-007-2024",
        nama_pemilik: "Hendra Gunawan",
        kecamatan: "Tanah Abang",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-21",
        id_petugas: 3,
        status: "tersedia",
      },
      {
        kode_buku: "BT-008-2024",
        nama_pemilik: "Lina Marlina",
        kecamatan: "Kemayoran",
        jenis_buku: "Sertifikat Hak Pakai",
        tanggal_input: "2024-01-22",
        id_petugas: 3,
        status: "tersedia",
      },
      {
        kode_buku: "BT-009-2024",
        nama_pemilik: "Agus Salim",
        kecamatan: "Cilandak",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-23",
        id_petugas: 3,
        status: "tersedia",
      },
      {
        kode_buku: "BT-010-2024",
        nama_pemilik: "Yuni Kartika",
        kecamatan: "Pondok Indah",
        jenis_buku: "Sertifikat Hak Guna Bangunan",
        tanggal_input: "2024-01-24",
        id_petugas: 4,
        status: "tersedia",
      },
      {
        kode_buku: "BT-011-2024",
        nama_pemilik: "Dedi Kurniawan",
        kecamatan: "Jagakarsa",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-25",
        id_petugas: 4,
        status: "tersedia",
      },
      {
        kode_buku: "BT-012-2024",
        nama_pemilik: "Rina Susanti",
        kecamatan: "Pasar Minggu",
        jenis_buku: "Sertifikat Hak Pakai",
        tanggal_input: "2024-01-26",
        id_petugas: 4,
        status: "tersedia",
      },
      {
        kode_buku: "BT-013-2024",
        nama_pemilik: "Faisal Rahman",
        kecamatan: "Serpong",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-27",
        id_petugas: 1,
        status: "tersedia",
      },
      {
        kode_buku: "BT-014-2024",
        nama_pemilik: "Maya Anggraini",
        kecamatan: "BSD",
        jenis_buku: "Sertifikat Hak Guna Bangunan",
        tanggal_input: "2024-01-28",
        id_petugas: 1,
        status: "tersedia",
      },
      {
        kode_buku: "BT-015-2024",
        nama_pemilik: "Irfan Hakim",
        kecamatan: "Bintaro",
        jenis_buku: "Sertifikat Hak Milik",
        tanggal_input: "2024-01-29",
        id_petugas: 1,
        status: "tersedia",
      },
    ]);

    // Insert Peminjaman
    await Peminjaman.bulkCreate([
      {
        kode_peminjaman: "PJM-001-2024",
        id_petugas: 2,
        id_buku: 1,
        tanggal_pinjam: "2024-01-20",
        keterangan: "Peminjaman untuk verifikasi data pemilik",
      },
      {
        kode_peminjaman: "PJM-002-2024",
        id_petugas: 3,
        id_buku: 3,
        tanggal_pinjam: "2024-01-22",
        keterangan: "Peminjaman untuk pengukuran ulang",
      },
      {
        kode_peminjaman: "PJM-003-2024",
        id_petugas: 4,
        id_buku: 5,
        tanggal_pinjam: "2024-01-23",
        keterangan: "Peminjaman untuk pengecekan legalitas",
      },
    ]);

    // Update status buku yang dipinjam
    await BukuTanah.update(
      { status: "terpinjam" },
      { where: { id_buku: [1, 3, 5] } },
    );

    // Insert Pengembalian
    await Pengembalian.bulkCreate([
      {
        kode_pengembalian: "PGM-001-2024",
        id_pinjam: 1,
        id_petugas: 2,
        id_buku: 1,
        tanggal_kembali: "2024-01-25",
        keterangan: "Buku dikembalikan dalam kondisi baik",
      },
      {
        kode_pengembalian: "PGM-002-2024",
        id_pinjam: 2,
        id_petugas: 3,
        id_buku: 3,
        tanggal_kembali: "2024-01-26",
        keterangan: "Buku dikembalikan dalam kondisi baik",
      },
    ]);

    // Update status buku yang sudah dikembalikan
    await BukuTanah.update(
      { status: "tersedia" },
      { where: { id_buku: [1, 3] } },
    );

    console.log("✅ Database seeded successfully!");
    console.log("🔐 Default login: admin / admin123");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  }
}

async function start() {
  try {
    await sequelize.authenticate();
    // Only sync without altering existing tables
    await sequelize.sync({ force: false });
    console.log("DB connected & synced");

    // Auto-seed database if empty
    await seedDatabase();

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("Failed starting:", err);
  }
}
start();
