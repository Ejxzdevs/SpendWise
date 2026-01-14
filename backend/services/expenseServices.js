import redisClient from "../utils/redisClient.js";
import ExpensesModel from "../models/expenseModel.js";

class ExpenseServices {
  // CREATE EXPENSE + invalidate cache
  static async createExpense({ category, amount, description }) {
    // Create new expense in DB
    const newExpense = await ExpensesModel.createExpense({
      category,
      amount,
      description,
    });

    // Invalidate Redis cache
    await redisClient.del("expenses:all");

    return newExpense;
  }

  // GET ALL EXPENSES
  static async getAllExpenses() {
    // Check Redis cache first
    const cached = await redisClient.get("expenses:all");
    if (cached) return JSON.parse(cached);

    // If not in cache, fetch from DB
    const expenses = await ExpensesModel.getAllExpenses();
    await redisClient.setEx("expenses:all", 300, JSON.stringify(expenses));
    return expenses;
  }
}

export default ExpenseServices;
