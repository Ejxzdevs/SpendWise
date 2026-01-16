import { Ionicons } from "@expo/vector-icons";

// here we define the IconName type based on Ionicons glyphMap
type IconName = keyof typeof Ionicons.glyphMap;

// Income categories
export const incomeCategoryIcons: Record<string, IconName> = {
  Salary: "cash-outline",
  Freelance: "laptop-outline",
  Investment: "trending-up-outline",
  Gift: "gift-outline",
  Other: "wallet-outline",
};

// Expense categories
export const expenseCategoryIcons: Record<string, IconName> = {
  Food: "fast-food-outline",
  Transport: "car-outline",
  Rent: "home-outline",
  Utilities: "flash-outline",
  Entertainment: "film-outline",
  Others: "pricetag-outline",
};
