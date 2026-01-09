import apiClient from "./apiClient";
import { LoginPayload, LoginResponse } from "@/types/auth";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );

    return response.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(err.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
