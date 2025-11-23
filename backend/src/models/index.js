// src/models/index.js
import { Petugas } from "./Petugas.js";
import { BukuTanah } from "./BukuTanah.js";
import { Peminjaman } from "./Peminjaman.js";
import { Pengembalian } from "./Pengembalian.js";

// relasi
Petugas.hasMany(Peminjaman, { foreignKey: "id_petugas", as: "Peminjaman" });
Peminjaman.belongsTo(Petugas, { foreignKey: "id_petugas", as: "Petugas" });

Petugas.hasMany(Pengembalian, { foreignKey: "id_petugas", as: "Pengembalian" });
Pengembalian.belongsTo(Petugas, { foreignKey: "id_petugas", as: "Petugas" });

Petugas.hasMany(BukuTanah, {
  foreignKey: "id_petugas",
  as: "BukuTanah",
});
BukuTanah.belongsTo(Petugas, {
  foreignKey: "id_petugas",
  as: "Petugas",
});

BukuTanah.hasMany(Peminjaman, { foreignKey: "id_buku" });
Peminjaman.belongsTo(BukuTanah, { foreignKey: "id_buku" });

BukuTanah.hasMany(Pengembalian, { foreignKey: "id_buku" });
Pengembalian.belongsTo(BukuTanah, { foreignKey: "id_buku" });

// Relation between Peminjaman and Pengembalian
// A peminjaman can have one pengembalian via id_pinjam FK
Peminjaman.hasOne(Pengembalian, {
  foreignKey: "id_pinjam",
  as: "Pengembalian",
});
Pengembalian.belongsTo(Peminjaman, {
  foreignKey: "id_pinjam",
  as: "Peminjaman",
});

export { Petugas, BukuTanah, Peminjaman, Pengembalian };
