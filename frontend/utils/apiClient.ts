// apiClient.ts
import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
