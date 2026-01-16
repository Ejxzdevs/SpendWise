import redisClient from "../utils/redisClient.js";
import IncomesModel from "../models/incomeModel.js";

class incomeServices {
  // CREATE income + invalidate cache
  static async createIncome({ source, amount, description }) {
    // Create new income in DB
    const newincome = await IncomesModel.createIncome({
      source,
      amount,
      description,
    });

    // Invalidate Redis cache
    await redisClient.del("incomes:all");
    return newincome;
  }

  static async getAllIncomes() {
    // Check Redis cache first
    const cachedIncomes = await redisClient.get("incomes:all");
    if (cachedIncomes) {
      return JSON.parse(cachedIncomes);
    }

    // If not in cache, fetch from DB
    const incomes = await IncomesModel.getAllIncomes();
    // Store in Redis cache for future requests
    await redisClient.set("incomes:all", JSON.stringify(incomes), "EX", 300);
    return incomes;
  }
}

export default incomeServices;
