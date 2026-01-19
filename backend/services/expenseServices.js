import redisClient from "../utils/redisClient.js";
import ExpensesModel from "../models/expenseModel.js";

class ExpenseServices {
  // CREATE EXPENSE + invalidate cache
  static async createExpense({ userId, category, amount, description }) {
    // Create new expense in DB
    const newExpense = await ExpensesModel.createExpense({
      userId,
      category,
      amount,
      description,
    });

    // Invalidate Redis cache
    await redisClient.del(`expenses:${userId}`);

    return newExpense;
  }

  // GET ALL EXPENSES
  static async getAllExpenses(userId) {
    // Check Redis cache first
    const cached = await redisClient.get(`expenses:${userId}`);
    if (cached) return JSON.parse(cached);

    // If not in cache, fetch from DB
    const expenses = await ExpensesModel.getAllExpenses(userId);
    await redisClient.setEx(
      `expenses:${userId}`,
      300,
      JSON.stringify(expenses),
    );
    return expenses;
  }
}

export default ExpenseServices;
