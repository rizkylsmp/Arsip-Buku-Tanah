// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./routes/AuthRoute.js";
import BukuTanahRoute from "./routes/BukuTanahRoute.js";
import PetugasRoute from "./routes/PetugasRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// routes
app.use(AuthRoute);
app.use(BukuTanahRoute);
app.use(PetugasRoute);

export default app;
