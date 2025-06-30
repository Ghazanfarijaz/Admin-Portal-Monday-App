import axios from "axios";

const API_BASE_URL =
  "https://a61f1-service-23360785-a4c1a002.us.monday.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
