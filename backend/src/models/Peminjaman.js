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
    nama_peminjam: { type: DataTypes.STRING(100), allowNull: false },
    tanggal_pinjam: { type: DataTypes.DATEONLY, allowNull: false },
    keterangan: { type: DataTypes.TEXT },
    status_pinjam: {
      type: DataTypes.ENUM("dipinjam", "dikembalikan"),
      defaultValue: "dipinjam",
    },
  },
  {
    tableName: "peminjaman",
    timestamps: true,
  }
);

// Associations set in models/index (below)
