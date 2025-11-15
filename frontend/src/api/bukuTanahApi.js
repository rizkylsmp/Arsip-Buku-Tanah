import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth header
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

// Get all buku tanah
export const getBukuTanah = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/buku-tanah`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching buku tanah:", error);
    throw error;
  }
};

// Create new buku tanah
export const createBukuTanah = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/buku-tanah`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error creating buku tanah:", error);
    throw error;
  }
};

// Get single buku tanah by ID
export const getBukuTanahById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/buku-tanah/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching buku tanah by id:", error);
    throw error;
  }
};

// Update buku tanah
export const updateBukuTanah = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/buku-tanah/${id}`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error updating buku tanah:", error);
    throw error;
  }
};

// Delete buku tanah
export const deleteBukuTanah = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/buku-tanah/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error deleting buku tanah:", error);
    throw error;
  }
};
