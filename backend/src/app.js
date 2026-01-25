// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./routes/AuthRoute.js";
import BukuTanahRoute from "./routes/BukuTanahRoute.js";
import PetugasRoute from "./routes/PetugasRoute.js";
import PeminjamanRoute from "./routes/PeminjamanRoute.js";
import PengembalianRoute from "./routes/PengembalianRoute.js";
import DatabaseRoute from "./routes/DatabaseRoute.js";

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://arsip-buku-tanah.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// routes
app.use(AuthRoute);
app.use(BukuTanahRoute);
app.use(PetugasRoute);
app.use(PeminjamanRoute);
app.use(PengembalianRoute);
app.use("/api/database", DatabaseRoute);

export default app;
