// apiClient.ts
import axios, { AxiosInstance } from "axios";

// Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
