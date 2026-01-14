import redisClient from "../utils/redisClient.js";
import ExpensesModel from "../models/expenseModel.js";

class ExpenseServices {
  // CREATE EXPENSE + invalidate cache
  static async createExpense({ category, amount, description }) {
    // 1. Create in DB
    const newExpense = await ExpensesModel.createExpense({
      category,
      amount,
      description,
    });

    // 2. Invalidate Redis cache
    await redisClient.del("expenses:all");

    return newExpense;
  }

  // GET ALL EXPENSES (with caching)
  static async getAllExpenses() {
    const cached = await redisClient.get("expenses:all");
    if (cached) return JSON.parse(cached);

    const expenses = await ExpensesModel.getAllExpenses();
    await redisClient.setEx("expenses:all", 60, JSON.stringify(expenses));
    return expenses;
  }
}

export default ExpenseServices;
