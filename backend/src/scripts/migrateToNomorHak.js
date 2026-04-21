// Script to migrate buku_tanah table from kode_buku to nomor_hak and add new columns
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

async function migrateToNomorHak() {
  try {
    console.log("🔍 Checking buku_tanah table structure...\n");

    // Get current columns
    const columns = await sequelize.query("SHOW COLUMNS FROM buku_tanah", {
      type: QueryTypes.SELECT,
    });

    const columnNames = columns.map((col) => col.Field);
    console.log("Current columns:", columnNames);
    console.log("");

    // Check if we need to rename kode_buku to nomor_hak
    const hasKodeBuku = columnNames.includes("kode_buku");
    const hasNomorHak = columnNames.includes("nomor_hak");

    if (hasKodeBuku && !hasNomorHak) {
      console.log("➕ Renaming kode_buku to nomor_hak...");
      await sequelize.query(
        `ALTER TABLE buku_tanah CHANGE COLUMN kode_buku nomor_hak VARCHAR(50) NOT NULL UNIQUE`,
      );
      console.log("✅ Column renamed successfully!\n");
    } else if (hasNomorHak) {
      console.log("✓ nomor_hak column already exists\n");
    } else {
      console.log(
        "⚠️  Neither kode_buku nor nomor_hak found. Skipping rename.\n",
      );
    }

    // Check if desa_kelurahan column exists
    const hasDesaKelurahan = columnNames.includes("desa_kelurahan");
    if (!hasDesaKelurahan) {
      console.log("➕ Adding desa_kelurahan column...");
      await sequelize.query(
        `ALTER TABLE buku_tanah ADD COLUMN desa_kelurahan VARCHAR(100) DEFAULT NULL AFTER kecamatan`,
      );
      console.log("✅ desa_kelurahan column added successfully!\n");
    } else {
      console.log("✓ desa_kelurahan column already exists\n");
    }

    // Check if luas_tanah column exists
    const hasLuasTanah = columnNames.includes("luas_tanah");
    if (!hasLuasTanah) {
      console.log("➕ Adding luas_tanah column...");
      await sequelize.query(
        `ALTER TABLE buku_tanah ADD COLUMN luas_tanah VARCHAR(50) DEFAULT NULL AFTER jenis_buku`,
      );
      console.log("✅ luas_tanah column added successfully!\n");
    } else {
      console.log("✓ luas_tanah column already exists\n");
    }

    // Verify final structure
    console.log("🔍 Verifying final table structure...\n");
    const finalColumns = await sequelize.query("SHOW COLUMNS FROM buku_tanah", {
      type: QueryTypes.SELECT,
    });

    console.log("Final columns:");
    finalColumns.forEach((col) => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📝 Summary of changes:");
    console.log("  ✓ kode_buku → nomor_hak");
    console.log("  ✓ Added desa_kelurahan column");
    console.log("  ✓ Added luas_tanah column");

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  }
}

migrateToNomorHak();
