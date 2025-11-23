import React from "react";
import { createHashRouter, Navigate } from "react-router-dom";
import RootLayout from "../Layout/RootLayout";
import Auth from "../Pages/Auth";
import Dashboard from "../Pages/Dashboard";
import BukuTanah from "../Pages/BukuTanah";
import ProtectedRoute from "../middleware/ProtectedRoute";
import Petugas from "../Pages/Petugas";
import Peminjaman from "../Pages/Peminjaman";
import Pengembalian from "../Pages/Pengembalian";

export const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/buku-tanah",
        element: (
          <ProtectedRoute>
            <BukuTanah />
          </ProtectedRoute>
        ),
      },
      {
        path: "/petugas",
        element: (
          <ProtectedRoute>
            <Petugas />
          </ProtectedRoute>
        ),
      },
      {
        path: "/peminjaman",
        element: (
          <ProtectedRoute>
            <Peminjaman />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pengembalian",
        element: (
          <ProtectedRoute>
            <Pengembalian />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
