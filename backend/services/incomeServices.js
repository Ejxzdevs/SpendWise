import redisClient from "../utils/redisClient.js";
import IncomesModel from "../models/incomeModel.js";

class incomeServices {
  // CREATE income + invalidate cache
  static async createIncome({ userId, source, amount, description }) {
    // Create new income in DB
    const newincome = await IncomesModel.createIncome({
      userId,
      source,
      amount,
      description,
    });

    // Invalidate Redis cache
    await redisClient.del(`incomes:${userId}`);
    return newincome;
  }

  static async getAllIncomes(userId) {
    // Check Redis cache first
    const cached = await redisClient.get(`incomes:${userId}`);
    if (cached) return JSON.parse(cached);

    // If not in cache, fetch from DB
    const incomes = await IncomesModel.getAllIncomes(userId);
    await redisClient.setEx(`incomes:${userId}`, 300, JSON.stringify(incomes));
    return incomes;
  }
}

export default incomeServices;
