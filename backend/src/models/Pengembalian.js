// src/models/Pengembalian.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Pengembalian = sequelize.define(
  "Pengembalian",
  {
    id_kembali: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kode_pengembalian: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    id_pinjam: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "peminjaman",
        key: "id_pinjam",
      },
    },
    id_petugas: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_buku: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tanggal_kembali: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "pengembalian",
    timestamps: true,
  }
);
