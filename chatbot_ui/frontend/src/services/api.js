import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api"; // Update with backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { error: "Network error" };
  }
};

export const sendQuery = async (query) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { query });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { error: "Network error" };
  }
};
