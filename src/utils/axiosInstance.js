import axios from "axios";

const API_BASE_URL =
  "https://dc9af-service-23360785-a4c1a002.us.monday.app/api";
// const API_BASE_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
