import apiClient from "@/utils/apiClient";
import { getUserToken } from "@/utils/authStorage";
import {
  ExpensePayload,
  ExpenseResponse,
  FetchExpensesResponse,
} from "@/types/expense";

// save expense data to the backend
export const saveExpense = async (
  payload: ExpensePayload,
): Promise<ExpenseResponse> => {
  try {
    const token = await getUserToken();

    const response = await apiClient.post("/expense/", payload, {
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

// fetch expense data from the backend
export const fetchExpenses = async (): Promise<FetchExpensesResponse> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.get("/expense/", {
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

// delete expense data from the backend
export const deleteExpense = async (
  expenseId: string,
): Promise<{ message: string }> => {
  try {
    const token = await getUserToken();
    const response = await apiClient.delete(`/expense/${expenseId}`, {
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
