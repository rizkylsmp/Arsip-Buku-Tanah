// src/models/Petugas.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Petugas = sequelize.define(
  "Petugas",
  {
    id_petugas: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: { type: DataTypes.STRING(100), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    jenis_kelamin: { type: DataTypes.STRING(50) },
    no_handphone: { type: DataTypes.STRING(20) },
    alamat: { type: DataTypes.STRING(255) },
  },
  {
    tableName: "petugas",
    timestamps: true,
  }
);
