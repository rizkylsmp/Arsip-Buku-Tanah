import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === "production"
  ? ".env.production"
  : ".env.development";

dotenv.config({
  path: path.resolve(__dirname, "../../", envFile),
  quiet: process.env.NODE_ENV === "production",
});

const dialectOptions = {
  connectTimeout: 60000,
};

if (process.env.DB_SSL === "true") {
  dialectOptions.ssl = {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,
    pool: {
      max: Number(process.env.DB_POOL_MAX || 2),
      min: 0,
      acquire: 30000,
      idle: 5000,
    },
    dialectOptions,
  }
);
