// src/server.js
import app from "./app.js";
import { sequelize } from "./config/db.js";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    // Only sync without altering existing tables
    await sequelize.sync({ force: false });
    console.log("DB connected & synced");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("Failed starting:", err);
  }
}
start();
