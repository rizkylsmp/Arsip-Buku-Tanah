import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

async function addIdPinjamColumn() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connected\n");

    console.log("Adding id_pinjam column to pengembalian table...");

    // Check if column exists
    const columns = await sequelize.query(
      `SHOW COLUMNS FROM pengembalian LIKE 'id_pinjam'`,
      { type: QueryTypes.SELECT }
    );

    if (columns.length > 0) {
      console.log("⚠️  Column id_pinjam already exists. Skipping...");
    } else {
      // Step 1: Add column as nullable first (without FK constraint)
      console.log("Step 1: Adding id_pinjam column (nullable)...");
      await sequelize.query(
        `ALTER TABLE pengembalian 
         ADD COLUMN id_pinjam INT NULL AFTER kode_pengembalian`,
        { type: QueryTypes.RAW }
      );
      console.log("✓ Column added");

      // Step 2: Try to auto-populate id_pinjam from existing data
      console.log("Step 2: Auto-populating id_pinjam from existing data...");
      await sequelize.query(
        `UPDATE pengembalian pg
         INNER JOIN peminjaman p ON pg.id_buku = p.id_buku
         SET pg.id_pinjam = p.id_pinjam
         WHERE pg.id_pinjam IS NULL`,
        { type: QueryTypes.UPDATE }
      );
      console.log("✓ Data populated");

      // Step 3: Check if there are rows without id_pinjam
      const orphanRows = await sequelize.query(
        `SELECT COUNT(*) as count FROM pengembalian WHERE id_pinjam IS NULL`,
        { type: QueryTypes.SELECT }
      );

      if (orphanRows[0].count > 0) {
        console.log(
          `⚠️  Warning: ${orphanRows[0].count} pengembalian records couldn't be linked to peminjaman`
        );
        console.log(
          "   These records will be deleted to maintain data integrity."
        );

        await sequelize.query(
          `DELETE FROM pengembalian WHERE id_pinjam IS NULL`,
          { type: QueryTypes.DELETE }
        );
        console.log("✓ Orphan records deleted");
      }

      // Step 4: Make column NOT NULL and add FK constraint
      console.log("Step 3: Adding constraints...");
      await sequelize.query(
        `ALTER TABLE pengembalian 
         MODIFY COLUMN id_pinjam INT NOT NULL,
         ADD CONSTRAINT fk_pengembalian_peminjaman 
         FOREIGN KEY (id_pinjam) REFERENCES peminjaman(id_pinjam)`,
        { type: QueryTypes.RAW }
      );
      console.log("✓ Constraints added");
    }

    console.log("\n✓ Migration completed!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error during migration:", error.message);
    console.error(error);
    process.exit(1);
  }
}

addIdPinjamColumn();
