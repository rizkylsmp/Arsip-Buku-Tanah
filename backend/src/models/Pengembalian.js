// src/models/Pengembalian.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Pengembalian = sequelize.define("Pengembalian", {
  id_kembali: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tanggal_kembali: { type: DataTypes.DATEONLY, allowNull:false },
  kondisi: { type: DataTypes.STRING(100) },
  keterangan: { type: DataTypes.TEXT }
}, {
  tableName: "pengembalian",
  timestamps: true
});
