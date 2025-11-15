// src/models/index.js
import { Petugas } from "./Petugas.js";
import { BukuTanah } from "./BukuTanah.js";
import { Peminjaman } from "./Peminjaman.js";
import { Pengembalian } from "./Pengembalian.js";

// relasi
Petugas.hasMany(Peminjaman, { foreignKey: "id_petugas" });
Peminjaman.belongsTo(Petugas, { foreignKey: "id_petugas" });

Petugas.hasMany(Pengembalian, { foreignKey: "id_petugas" });
Pengembalian.belongsTo(Petugas, { foreignKey: "id_petugas" });

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

Peminjaman.hasOne(Pengembalian, { foreignKey: "id_pinjam" });
Pengembalian.belongsTo(Peminjaman, { foreignKey: "id_pinjam" });

export { Petugas, BukuTanah, Peminjaman, Pengembalian };
