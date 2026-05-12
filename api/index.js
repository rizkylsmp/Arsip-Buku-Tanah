import app from "../backend/src/app.js";
import { sequelize } from "../backend/src/config/db.js";
import "../backend/src/models/index.js";

let databaseReady;

async function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = sequelize
      .authenticate()
      .then(async () => {
        if (process.env.AUTO_SYNC_DB === "true") {
          await sequelize.sync({ force: false });
        }
      })
      .catch((error) => {
        databaseReady = undefined;
        throw error;
      });
  }

  return databaseReady;
}

export default async function handler(req, res) {
  try {
    await ensureDatabase();

    if (req.url === "/api") {
      req.url = "/";
    } else if (req.url.startsWith("/api/")) {
      req.url = req.url.slice(4);
    }

    return app(req, res);
  } catch (error) {
    console.error("[vercel][api] failed to handle request:", error);
    return res.status(500).json({ error: "Backend service unavailable" });
  }
}
