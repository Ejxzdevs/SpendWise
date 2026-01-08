import apiClient from "./apiClient";
import { LoginPayload, LoginResponse } from "@/types/auth";

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<LoginResponse>("/auth/login", payload);

  if (response.data.success === false) {
    throw new Error(response.data.message);
  }

  return response.data;
};
