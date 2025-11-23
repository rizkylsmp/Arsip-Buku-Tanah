// src/api/pengembalianApi.js
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

export const getPengembalian = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pengembalian`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error fetching pengembalian:", error);
    throw error;
  }
};

export const createPengembalian = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/pengembalian`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error creating pengembalian:", error);
    throw error;
  }
};

export const getPengembalianById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/pengembalian/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error fetching pengembalian by ID:", error);
    throw error;
  }
};

export const updatePengembalian = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/pengembalian/${id}`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error updating pengembalian:", error);
    throw error;
  }
};

export const deletePengembalian = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/pengembalian/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error deleting pengembalian:", error);
    throw error;
  }
};
