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

export const getPetugas = async () => {
  try {
    // list all petugas
    const response = await axios.get(`${BASE_URL}/petugas`, getAuthHeader());
    return response; // return full axios response to keep consistency with other APIs
  } catch (error) {
    console.error("Error fetching petugas:", error);
    throw error;
  }
};

export const createPetugas = async (data) => {
  try {
    // create new petugas (protected)
    const response = await axios.post(
      `${BASE_URL}/petugas`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error creating petugas:", error);
    throw error;
  }
};

export const getPetugasById = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/petugas/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching petugas by id:", error);
    throw error;
  }
};

export const updatePetugas = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/petugas/${id}`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error updating petugas:", error);
    throw error;
  }
};

export const deletePetugas = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/petugas/${id}`,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error deleting petugas:", error);
    throw error;
  }
};

export const changePassword = async (id, data) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/petugas/${id}/change-password`,
      data,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
