// Shared fields
export interface BaseExpense {
  category: string;
  amount: number;
  description?: string;
}

// Payloads
export interface ExpensePayload extends BaseExpense {}

// Response
export interface ExpenseResponse extends BaseExpense {
  id: string;
  createdAt: string;
  updatedAt?: string;
}
