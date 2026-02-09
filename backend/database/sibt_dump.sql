-- ========================================
-- DATABASE DUMP UNTUK SISTEM ARSIP BUKU TANAH
-- Database Cloud: be4pejj5xe4eb01qfocr
-- ========================================

-- Disable foreign key checks untuk menghindari error saat import
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Gunakan database yang sudah ada
USE be4pejj5xe4eb01qfocr;

-- Hapus semua data lama terlebih dahulu (dalam urutan yang benar)
TRUNCATE TABLE `pengembalian`;
TRUNCATE TABLE `peminjaman`;
TRUNCATE TABLE `buku_tanah`;
TRUNCATE TABLE `petugas`;

-- ========================================
-- 1. TABEL PETUGAS
-- ========================================
CREATE TABLE IF NOT EXISTS `petugas` (
  `id_petugas` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'pegawai') NOT NULL DEFAULT 'pegawai',
  `jenis_kelamin` VARCHAR(50) DEFAULT NULL,
  `no_handphone` VARCHAR(20) DEFAULT NULL,
  `alamat` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_petugas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. TABEL BUKU TANAH
-- ========================================
CREATE TABLE IF NOT EXISTS `buku_tanah` (
  `id_buku` INT NOT NULL AUTO_INCREMENT,
  `kode_buku` VARCHAR(50) NOT NULL UNIQUE,
  `nama_pemilik` VARCHAR(100) DEFAULT NULL,
  `kecamatan` VARCHAR(100) DEFAULT NULL,
  `jenis_buku` VARCHAR(200) DEFAULT NULL,
  `tanggal_input` DATE DEFAULT NULL,
  `id_petugas` INT NOT NULL,
  `status` ENUM('tersedia', 'terpinjam') DEFAULT 'tersedia',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_buku`),
  KEY `id_petugas` (`id_petugas`),
  CONSTRAINT `fk_buku_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. TABEL PEMINJAMAN
-- ========================================
CREATE TABLE IF NOT EXISTS `peminjaman` (
  `id_pinjam` INT NOT NULL AUTO_INCREMENT,
  `kode_peminjaman` VARCHAR(50) NOT NULL UNIQUE,
  `id_petugas` INT NOT NULL,
  `id_buku` INT NOT NULL,
  `tanggal_pinjam` DATE NOT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pinjam`),
  KEY `id_petugas` (`id_petugas`),
  KEY `id_buku` (`id_buku`),
  CONSTRAINT `fk_peminjaman_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_peminjaman_buku` FOREIGN KEY (`id_buku`) REFERENCES `buku_tanah` (`id_buku`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. TABEL PENGEMBALIAN
-- ========================================
CREATE TABLE IF NOT EXISTS `pengembalian` (
  `id_kembali` INT NOT NULL AUTO_INCREMENT,
  `kode_pengembalian` VARCHAR(50) NOT NULL UNIQUE,
  `id_pinjam` INT NOT NULL,
  `id_petugas` INT NOT NULL,
  `id_buku` INT NOT NULL,
  `tanggal_kembali` DATE NOT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kembali`),
  KEY `id_pinjam` (`id_pinjam`),
  KEY `id_petugas` (`id_petugas`),
  KEY `id_buku` (`id_buku`),
  CONSTRAINT `fk_pengembalian_peminjaman` FOREIGN KEY (`id_pinjam`) REFERENCES `peminjaman` (`id_pinjam`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pengembalian_petugas` FOREIGN KEY (`id_petugas`) REFERENCES `petugas` (`id_petugas`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pengembalian_buku` FOREIGN KEY (`id_buku`) REFERENCES `buku_tanah` (`id_buku`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- DATA DUMMY UNTUK TESTING
-- ========================================

-- Reset auto increment counter
ALTER TABLE `petugas` AUTO_INCREMENT = 1;
ALTER TABLE `buku_tanah` AUTO_INCREMENT = 1;
ALTER TABLE `peminjaman` AUTO_INCREMENT = 1;
ALTER TABLE `pengembalian` AUTO_INCREMENT = 1;

-- Data Petugas (Password: admin123 dan pegawai123 - sudah di-hash dengan bcrypt)
INSERT INTO `petugas` (`nama`, `username`, `password`, `role`, `jenis_kelamin`, `no_handphone`, `alamat`, `createdAt`, `updatedAt`) VALUES
('Admin Utama', 'admin', '$2b$10$rGfz8N7pD3m5JKqK7YJHNOqPqPvV4L5kX6hFvEZ5mEqYGZ8m4T4Tq', 'admin', 'Laki-laki', '081234567890', 'Jl. BPN No. 1, Jakarta', NOW(), NOW()),
('Budi Santoso', 'budi', '$2b$10$rGfz8N7pD3m5JKqK7YJHNOqPqPvV4L5kX6hFvEZ5mEqYGZ8m4T4Tq', 'pegawai', 'Laki-laki', '081234567891', 'Jl. Merdeka No. 10, Jakarta', NOW(), NOW()),
('Siti Nurhaliza', 'siti', '$2b$10$rGfz8N7pD3m5JKqK7YJHNOqPqPvV4L5kX6hFvEZ5mEqYGZ8m4T4Tq', 'pegawai', 'Perempuan', '081234567892', 'Jl. Sudirman No. 20, Jakarta', NOW(), NOW()),
('Ahmad Fauzi', 'ahmad', '$2b$10$rGfz8N7pD3m5JKqK7YJHNOqPqPvV4L5kX6hFvEZ5mEqYGZ8m4T4Tq', 'pegawai', 'Laki-laki', '081234567893', 'Jl. Gatot Subroto No. 30, Jakarta', NOW(), NOW());

-- Data Buku Tanah
INSERT INTO `buku_tanah` (`kode_buku`, `nama_pemilik`, `kecamatan`, `jenis_buku`, `tanggal_input`, `id_petugas`, `status`, `createdAt`, `updatedAt`) VALUES
('BT-001-2024', 'Andi Wijaya', 'Menteng', 'Sertifikat Hak Milik', '2024-01-15', 1, 'tersedia', NOW(), NOW()),
('BT-002-2024', 'Dewi Lestari', 'Kebayoran Baru', 'Sertifikat Hak Guna Bangunan', '2024-01-16', 1, 'tersedia', NOW(), NOW()),
('BT-003-2024', 'Rudi Hartono', 'Tebet', 'Sertifikat Hak Milik', '2024-01-17', 1, 'tersedia', NOW(), NOW()),
('BT-004-2024', 'Sri Wahyuni', 'Cakung', 'Sertifikat Hak Pakai', '2024-01-18', 2, 'tersedia', NOW(), NOW()),
('BT-005-2024', 'Bambang Pamungkas', 'Kelapa Gading', 'Sertifikat Hak Milik', '2024-01-19', 2, 'tersedia', NOW(), NOW()),
('BT-006-2024', 'Ratna Sari', 'Menteng', 'Sertifikat Hak Guna Bangunan', '2024-01-20', 2, 'tersedia', NOW(), NOW()),
('BT-007-2024', 'Hendra Gunawan', 'Tanah Abang', 'Sertifikat Hak Milik', '2024-01-21', 3, 'tersedia', NOW(), NOW()),
('BT-008-2024', 'Lina Marlina', 'Kemayoran', 'Sertifikat Hak Pakai', '2024-01-22', 3, 'tersedia', NOW(), NOW()),
('BT-009-2024', 'Agus Salim', 'Cilandak', 'Sertifikat Hak Milik', '2024-01-23', 3, 'tersedia', NOW(), NOW()),
('BT-010-2024', 'Yuni Kartika', 'Pondok Indah', 'Sertifikat Hak Guna Bangunan', '2024-01-24', 4, 'tersedia', NOW(), NOW()),
('BT-011-2024', 'Dedi Kurniawan', 'Jagakarsa', 'Sertifikat Hak Milik', '2024-01-25', 4, 'tersedia', NOW(), NOW()),
('BT-012-2024', 'Rina Susanti', 'Pasar Minggu', 'Sertifikat Hak Pakai', '2024-01-26', 4, 'tersedia', NOW(), NOW()),
('BT-013-2024', 'Faisal Rahman', 'Serpong', 'Sertifikat Hak Milik', '2024-01-27', 1, 'tersedia', NOW(), NOW()),
('BT-014-2024', 'Maya Anggraini', 'BSD', 'Sertifikat Hak Guna Bangunan', '2024-01-28', 1, 'tersedia', NOW(), NOW()),
('BT-015-2024', 'Irfan Hakim', 'Bintaro', 'Sertifikat Hak Milik', '2024-01-29', 1, 'tersedia', NOW(), NOW());

-- Data Peminjaman (Contoh beberapa peminjaman aktif)
INSERT INTO `peminjaman` (`kode_peminjaman`, `id_petugas`, `id_buku`, `tanggal_pinjam`, `keterangan`, `createdAt`, `updatedAt`) VALUES
('PJM-001-2024', 2, 1, '2024-01-20', 'Peminjaman untuk verifikasi data pemilik', NOW(), NOW()),
('PJM-002-2024', 3, 3, '2024-01-22', 'Peminjaman untuk pengukuran ulang', NOW(), NOW()),
('PJM-003-2024', 4, 5, '2024-01-23', 'Peminjaman untuk pengecekan legalitas', NOW(), NOW());

-- Update status buku yang dipinjam
UPDATE `buku_tanah` SET `status` = 'terpinjam' WHERE `id_buku` IN (1, 3, 5);

-- Data Pengembalian (Contoh beberapa pengembalian)
INSERT INTO `pengembalian` (`kode_pengembalian`, `id_pinjam`, `id_petugas`, `id_buku`, `tanggal_kembali`, `keterangan`, `createdAt`, `updatedAt`) VALUES
('PGM-001-2024', 1, 2, 1, '2024-01-25', 'Buku dikembalikan dalam kondisi baik', NOW(), NOW()),
('PGM-002-2024', 2, 3, 3, '2024-01-26', 'Buku dikembalikan dalam kondisi baik', NOW(), NOW());

-- Update status buku yang sudah dikembalikan
UPDATE `buku_tanah` SET `status` = 'tersedia' WHERE `id_buku` IN (1, 3);

-- ========================================
-- SELESAI - Re-enable foreign key checks
-- ========================================

-- Enable kembali foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Tampilkan ringkasan data
SELECT 'Data berhasil di-import!' AS Status;
SELECT COUNT(*) AS Total_Petugas FROM petugas;
SELECT COUNT(*) AS Total_Buku_Tanah FROM buku_tanah;
SELECT COUNT(*) AS Total_Peminjaman FROM peminjaman;
SELECT COUNT(*) AS Total_Pengembalian FROM pengembalian;
