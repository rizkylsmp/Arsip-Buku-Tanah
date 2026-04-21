// Script to setup database with all necessary migrations
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

async function setupDatabase() {
  try {
    console.log("========================================");
    console.log("  DATABASE SETUP & MIGRATION SCRIPT");
    console.log("========================================\n");

    // 1. Connect to database
    console.log("🔗 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected\n");

    // 2. Sync models
    console.log("📋 Syncing models...");
    await sequelize.sync();
    console.log("✅ Models synced\n");

    // 3. Check and migrate buku_tanah table
    console.log("🔍 Checking buku_tanah table structure...");
    const columns = await sequelize.query("SHOW COLUMNS FROM buku_tanah", {
      type: QueryTypes.SELECT,
    });

    const columnNames = columns.map((col) => col.Field);
    let migrationsDone = [];

    // 3a. Rename kode_buku to nomor_hak
    const hasKodeBuku = columnNames.includes("kode_buku");
    const hasNomorHak = columnNames.includes("nomor_hak");

    if (hasKodeBuku && !hasNomorHak) {
      console.log("  ➕ Renaming kode_buku to nomor_hak...");
      await sequelize.query(
        `ALTER TABLE buku_tanah CHANGE COLUMN kode_buku nomor_hak VARCHAR(50) NOT NULL UNIQUE`,
      );
      console.log("  ✅ Column renamed");
      migrationsDone.push("kode_buku → nomor_hak");
    } else if (hasNomorHak) {
      console.log("  ✓ nomor_hak column already exists");
    }

    // 3b. Add desa_kelurahan column
    const hasDesaKelurahan = columnNames.includes("desa_kelurahan");
    if (!hasDesaKelurahan) {
      console.log("  ➕ Adding desa_kelurahan column...");
      await sequelize.query(
        `ALTER TABLE buku_tanah ADD COLUMN desa_kelurahan VARCHAR(100) DEFAULT NULL AFTER kecamatan`,
      );
      console.log("  ✅ Column added");
      migrationsDone.push("desa_kelurahan column");
    } else {
      console.log("  ✓ desa_kelurahan column already exists");
    }

    // 3c. Add luas_tanah column
    const hasLuasTanah = columnNames.includes("luas_tanah");
    if (!hasLuasTanah) {
      console.log("  ➕ Adding luas_tanah column...");
      await sequelize.query(
        `ALTER TABLE buku_tanah ADD COLUMN luas_tanah VARCHAR(50) DEFAULT NULL AFTER jenis_buku`,
      );
      console.log("  ✅ Column added");
      migrationsDone.push("luas_tanah column");
    } else {
      console.log("  ✓ luas_tanah column already exists");
    }

    console.log("");

    // 4. Check and add role column to petugas
    console.log("🔍 Checking petugas table structure...");
    const petugasColumns = await sequelize.query("SHOW COLUMNS FROM petugas", {
      type: QueryTypes.SELECT,
    });

    const petugasColumnNames = petugasColumns.map((col) => col.Field);
    const hasRoleColumn = petugasColumnNames.includes("role");

    if (!hasRoleColumn) {
      console.log("  ➕ Adding role column to petugas...");
      await sequelize.query(`
        ALTER TABLE petugas 
        ADD COLUMN role ENUM('admin', 'pegawai') NOT NULL DEFAULT 'pegawai' 
        AFTER password
      `);
      console.log("  ✅ Column added");
      migrationsDone.push("role column");

      // Set first user as admin
      const [users] = await sequelize.query(
        "SELECT id_petugas FROM petugas ORDER BY id_petugas ASC LIMIT 1",
      );

      if (users && users.length > 0) {
        const firstUserId = users[0].id_petugas;
        await sequelize.query(
          `UPDATE petugas SET role = 'admin' WHERE id_petugas = ${firstUserId}`,
        );
        console.log(`  ✅ User (id=${firstUserId}) set as admin`);
      }
    } else {
      console.log("  ✓ role column already exists");
    }

    console.log("");

    // 5. Summary
    console.log("========================================");
    console.log("  SETUP COMPLETED ✅");
    console.log("========================================");

    if (migrationsDone.length > 0) {
      console.log("\n📝 Migrations applied:");
      migrationsDone.forEach((m) => console.log(`  ✓ ${m}`));
    } else {
      console.log("\n✓ Database already up-to-date, no migrations needed");
    }

    console.log("\n🚀 Ready to run! You can now start the server.\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    console.error("\nPlease check:");
    console.error("  1. Database connection in .env.development");
    console.error("  2. Database exists and is accessible");
    console.error("  3. MySQL server is running\n");
    process.exit(1);
  }
}

setupDatabase();
