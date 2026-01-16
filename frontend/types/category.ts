// Expense category type
export type expenseCategory =
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Gift"
  | "Other";

// Expense category to Ionicons mapping
export const expenseCategoryIcons = {
  Salary: "cash-outline",
  Freelance: "laptop-outline",
  Investment: "trending-up-outline",
  Gift: "gift-outline",
  Other: "wallet-outline",
} as const;
