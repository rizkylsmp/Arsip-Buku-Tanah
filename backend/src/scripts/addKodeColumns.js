// Script to add kode_peminjaman and kode_pengembalian columns to production database
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

async function addKodeColumns() {
  try {
    console.log("🔍 Checking database columns...\n");

    // Check if kode_peminjaman exists in peminjaman table
    const peminjamanColumns = await sequelize.query(
      "SHOW COLUMNS FROM peminjaman",
      { type: QueryTypes.SELECT }
    );
    const hasKodePeminjaman = peminjamanColumns.some(
      (col) => col.Field === "kode_peminjaman"
    );

    if (!hasKodePeminjaman) {
      console.log("➕ Adding kode_peminjaman column to peminjaman table...");
      await sequelize.query(`
        ALTER TABLE peminjaman 
        ADD COLUMN kode_peminjaman VARCHAR(50) 
        AFTER id_pinjam
      `);
      console.log("✅ kode_peminjaman column added successfully!");

      // Generate kode for existing records
      console.log("🔄 Generating kode_peminjaman for existing records...");
      const existingPeminjaman = await sequelize.query(
        "SELECT id_pinjam, tanggal_pinjam FROM peminjaman ORDER BY id_pinjam",
        { type: QueryTypes.SELECT }
      );

      for (const row of existingPeminjaman) {
        const date = new Date(row.tanggal_pinjam);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}${month}${day}`;
        const kode = `PJ-${dateStr}-${String(row.id_pinjam).padStart(3, "0")}`;

        await sequelize.query(
          "UPDATE peminjaman SET kode_peminjaman = ? WHERE id_pinjam = ?",
          { replacements: [kode, row.id_pinjam], type: QueryTypes.UPDATE }
        );
      }
      console.log(
        `✅ Generated kode_peminjaman for ${existingPeminjaman.length} records`
      );

      // Add unique constraint
      await sequelize.query(`
        ALTER TABLE peminjaman 
        ADD UNIQUE KEY unique_kode_peminjaman (kode_peminjaman)
      `);
      console.log("✅ Unique constraint added to kode_peminjaman\n");
    } else {
      console.log("✓ kode_peminjaman column already exists\n");
    }

    // Check if kode_pengembalian exists in pengembalian table
    const pengembalianColumns = await sequelize.query(
      "SHOW COLUMNS FROM pengembalian",
      { type: QueryTypes.SELECT }
    );
    const hasKodePengembalian = pengembalianColumns.some(
      (col) => col.Field === "kode_pengembalian"
    );

    if (!hasKodePengembalian) {
      console.log(
        "➕ Adding kode_pengembalian column to pengembalian table..."
      );
      await sequelize.query(`
        ALTER TABLE pengembalian 
        ADD COLUMN kode_pengembalian VARCHAR(50) 
        AFTER id_kembali
      `);
      console.log("✅ kode_pengembalian column added successfully!");

      // Generate kode for existing records
      console.log("🔄 Generating kode_pengembalian for existing records...");
      const existingPengembalian = await sequelize.query(
        "SELECT id_kembali, tanggal_kembali FROM pengembalian ORDER BY id_kembali",
        { type: QueryTypes.SELECT }
      );

      for (const row of existingPengembalian) {
        const date = new Date(row.tanggal_kembali);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}${month}${day}`;
        const kode = `KB-${dateStr}-${String(row.id_kembali).padStart(3, "0")}`;

        await sequelize.query(
          "UPDATE pengembalian SET kode_pengembalian = ? WHERE id_kembali = ?",
          { replacements: [kode, row.id_kembali], type: QueryTypes.UPDATE }
        );
      }
      console.log(
        `✅ Generated kode_pengembalian for ${existingPengembalian.length} records`
      );

      // Add unique constraint
      await sequelize.query(`
        ALTER TABLE pengembalian 
        ADD UNIQUE KEY unique_kode_pengembalian (kode_pengembalian)
      `);
      console.log("✅ Unique constraint added to kode_pengembalian\n");
    } else {
      console.log("✓ kode_pengembalian column already exists\n");
    }

    // Check if keterangan exists in pengembalian table
    const hasKeteranganPengembalian = pengembalianColumns.some(
      (col) => col.Field === "keterangan"
    );

    if (!hasKeteranganPengembalian) {
      console.log("➕ Adding keterangan column to pengembalian table...");
      await sequelize.query(`
        ALTER TABLE pengembalian 
        ADD COLUMN keterangan TEXT 
        AFTER tanggal_kembali
      `);
      console.log("✅ keterangan column added to pengembalian table\n");
    } else {
      console.log("✓ keterangan column already exists in pengembalian\n");
    }

    console.log("✅ All migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
}

console.log("🚀 Starting database migration...\n");
addKodeColumns();
