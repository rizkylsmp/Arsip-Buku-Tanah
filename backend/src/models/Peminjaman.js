// src/models/Peminjaman.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Petugas } from "./Petugas.js";
import { BukuTanah } from "./BukuTanah.js";

export const Peminjaman = sequelize.define(
  "Peminjaman",
  {
    id_pinjam: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_peminjaman: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    id_petugas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_buku: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_pinjam: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "peminjaman",
    timestamps: true,
  }
);

// Associations set in models/index (below)
