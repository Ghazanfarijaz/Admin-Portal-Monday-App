import axios from "axios";

// Backend with no Secure Storage
const API_BASE_URL =
  "https://d47d0-service-23360785-a4c1a002.us.monday.app/api";

// Backend with Secure Storage
// const API_BASE_URL =
//   "https://c52c1-service-23360785-a4c1a002.us.monday.app/api";

// const API_BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
