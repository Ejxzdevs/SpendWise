import apiClient from "../utils/apiClient";
import {
  IncomePayload,
  IncomeResponse,
  FetchIncomesResponse,
} from "@/types/income";
import { getUserToken } from "@/utils/authStorage";

// save income data to the backend
export const saveIncome = async (
  payload: IncomePayload,
): Promise<IncomeResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.post("/income/create", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Income saved:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};

// fetch income data from the backend
export const fetchIncomes = async (): Promise<FetchIncomesResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.get("/income/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
