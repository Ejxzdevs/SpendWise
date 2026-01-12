import apiClient from "./apiClient";
import { UserPayload, LoginResponse, RegisterResponse } from "@/types/auth";

// user login service
export const login = async (payload: UserPayload): Promise<LoginResponse> => {
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

// user registration service
export const register = async (
  payload: UserPayload
): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
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
