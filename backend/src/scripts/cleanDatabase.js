import { sequelize } from "../config/db.js";
import { BukuTanah, Petugas } from "../models/index.js";

async function cleanDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connected");

    // Sync models
    await sequelize.sync();
    console.log("✓ Models synced");

    // Find and delete duplicate kode_buku (keep first occurrence)
    console.log("\nCleaning duplicate kode_buku...");
    const allBuku = await BukuTanah.findAll({
      order: [["createdAt", "ASC"]],
    });

    const seen = new Set();
    let deletedCount = 0;

    for (const buku of allBuku) {
      if (seen.has(buku.kode_buku)) {
        console.log(
          `  Deleting duplicate: ${buku.kode_buku} (id: ${buku.id_buku})`
        );
        await buku.destroy();
        deletedCount++;
      } else {
        seen.add(buku.kode_buku);
      }
    }

    console.log(`✓ Deleted ${deletedCount} duplicate buku tanah\n`);

    // Find and delete duplicate username (keep first occurrence)
    console.log("Cleaning duplicate username...");
    const allPetugas = await Petugas.findAll({
      order: [["createdAt", "ASC"]],
    });

    const seenUsername = new Set();
    let deletedPetugas = 0;

    for (const petugas of allPetugas) {
      if (seenUsername.has(petugas.username)) {
        console.log(
          `  Deleting duplicate: ${petugas.username} (id: ${petugas.id_petugas})`
        );
        await petugas.destroy();
        deletedPetugas++;
      } else {
        seenUsername.add(petugas.username);
      }
    }

    console.log(`✓ Deleted ${deletedPetugas} duplicate petugas\n`);

    console.log("✓ Database cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error cleaning database:", error);
    process.exit(1);
  }
}

cleanDatabase();
