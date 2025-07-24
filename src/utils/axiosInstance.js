import axios from "axios";

// const API_BASE_URL =
//   "https://b09d6-service-23360785-a4c1a002.us.monday.app/api";
const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
