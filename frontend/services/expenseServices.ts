import apiClient from "./apiClient";
import { ExpensePayload, ExpenseResponse } from "@/types/expense";

export const saveExpense = async (
  payload: ExpensePayload
): Promise<ExpenseResponse> => {
  try {
    const response = await apiClient.post("/expense/create", payload);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
