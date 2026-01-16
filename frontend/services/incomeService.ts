import apiClient from "../utils/apiClient";
import {
  IncomePayload,
  IncomeResponse,
  FetchIncomesResponse,
} from "@/types/income";

// save income data to the backend
export const saveIncome = async (
  payload: IncomePayload
): Promise<IncomeResponse> => {
  try {
    const response = await apiClient.post("/income/create", payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
export const fetchIncomes = async (): Promise<FetchIncomesResponse> => {
  try {
    const response = await apiClient.get("/income/all");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
