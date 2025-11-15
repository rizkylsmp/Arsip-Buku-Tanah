import { sequelize } from "../config/db.js";
import { BukuTanah, Petugas } from "../models/index.js";

async function resetTestData() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connected\n");

    // Delete test data
    console.log("Deleting test data...");

    const deletedBuku = await BukuTanah.destroy({
      where: { kode_buku: "Tes Buku" },
    });
    console.log(`✓ Deleted ${deletedBuku} record(s) with kode_buku='Tes Buku'`);

    const deletedPetugas = await Petugas.destroy({
      where: { username: "testuser" },
    });
    console.log(
      `✓ Deleted ${deletedPetugas} record(s) with username='testuser'\n`
    );

    console.log("✓ Test data cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error);
    process.exit(1);
  }
}

resetTestData();
