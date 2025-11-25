// Script to add role column to petugas table
import { sequelize } from "../config/db.js";
import { QueryTypes } from "sequelize";

async function addRoleColumn() {
  try {
    console.log("🔍 Checking for role column in petugas table...\n");

    // Check if role column exists
    const columns = await sequelize.query("SHOW COLUMNS FROM petugas", {
      type: QueryTypes.SELECT,
    });
    const hasRoleColumn = columns.some((col) => col.Field === "role");

    if (!hasRoleColumn) {
      console.log("➕ Adding role column to petugas table...");
      await sequelize.query(`
        ALTER TABLE petugas 
        ADD COLUMN role ENUM('admin', 'pegawai') NOT NULL DEFAULT 'pegawai' 
        AFTER password
      `);
      console.log("✅ Role column added successfully!");

      // Set first user (lowest id) as admin if no admin exists
      console.log("\n🔄 Checking for admin users...");
      const [users] = await sequelize.query(
        "SELECT id_petugas FROM petugas ORDER BY id_petugas ASC LIMIT 1"
      );

      if (users && users.length > 0) {
        const firstUserId = users[0].id_petugas;
        await sequelize.query(
          `UPDATE petugas SET role = 'admin' WHERE id_petugas = ${firstUserId}`
        );
        console.log(`✅ User with id=${firstUserId} set as admin\n`);
      } else {
        console.log("⚠️  No users found in database\n");
      }
    } else {
      console.log("✓ Role column already exists\n");
    }

    console.log("✅ Migration completed successfully!");
    console.log(
      "\n📝 Note: First registered user (lowest id) is set as admin."
    );
    console.log("   New registrations will check if admin exists,");
    console.log("   and automatically become admin if no admin exists yet.\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during migration:", error);
    process.exit(1);
  }
}

console.log("🚀 Starting role column migration...\n");
addRoleColumn();
