import { sequelize } from "../config/db.js";
import {
  Petugas,
  BukuTanah,
  Peminjaman,
  Pengembalian,
} from "../models/index.js";

async function syncDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connected\n");

    console.log("⚠️  WARNING: This will drop and recreate all tables!");
    console.log("⚠️  All existing data will be lost!\n");

    // Sync with force: true (drops and recreates tables)
    console.log("Syncing models with database...");
    await sequelize.sync({ force: true });

    console.log("\n✓ Database synced successfully!");
    console.log("\nTables created:");
    console.log("  - petugas");
    console.log("  - buku_tanah");
    console.log("  - peminjaman");
    console.log("  - pengembalian\n");

    console.log("✓ All tables are now up to date with the models!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error);
    process.exit(1);
  }
}

syncDatabase();
