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
}

export default incomeServices;
