// src/models/BukuTanah.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const BukuTanah = sequelize.define(
  "BukuTanah",
  {
    id_buku: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomor_hak: { type: DataTypes.STRING(50), allowNull: false },
    nama_pemilik: { type: DataTypes.STRING(100) },
    kecamatan: { type: DataTypes.STRING(100) },
    desa_kelurahan: { type: DataTypes.STRING(100) },
    jenis_buku: { type: DataTypes.STRING(200) },
    luas_tanah: { type: DataTypes.STRING(50) },
    tanggal_input: { type: DataTypes.DATEONLY },
    id_petugas: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("tersedia", "terpinjam"),
      defaultValue: "tersedia",
    },
  },
  {
    tableName: "buku_tanah",
    timestamps: true,
  },
);
