// Shared fields
export interface BaseExpense {
  category: string;
  amount: number;
  description?: string;
}

// insert Payloads
export interface ExpensePayload extends BaseExpense {}

// insert Response
export type ExpenseResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

// Expense items type
export interface ExpenseItem extends BaseExpense {
  id: string;
  created_at: string;
}

// API Expense fetch response type
export interface FetchExpensesResponse {
  success: boolean;
  data: ExpenseItem[];
}
