// src/api/peminjamanApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        },
  };
};

export const getPeminjaman = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/peminjaman`, getAuthHeader());
    return response;
  } catch (error) {
    console.error("Error fetching peminjaman:", error);
    throw error;
  }
};

export const createPeminjaman = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/peminjaman`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error creating peminjaman:", error);
    throw error;
  }
};

export const getPeminjamanById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/peminjaman/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error fetching peminjaman by ID:", error);
    throw error;
  }
};

export const updatePeminjaman = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/peminjaman/${id}`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error updating peminjaman:", error);
    throw error;
  }
};

export const deletePeminjaman = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/peminjaman/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error deleting peminjaman:", error);
    throw error;
  }
};
