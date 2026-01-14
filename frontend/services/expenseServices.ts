import apiClient from "../utils/apiClient";
import {
  ExpensePayload,
  ExpenseResponse,
  FetchExpensesResponse,
} from "@/types/expense";

// sava expense data to the backend
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

// fetch expense data from the backend
export const fetchExpenses = async (): Promise<FetchExpensesResponse> => {
  try {
    const response = await apiClient.get("/expense/products");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Network or unknown error");
    }
  }
};
