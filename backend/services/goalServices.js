import redisClient from "../utils/redisClient.js";
import GoalModel from "../models/goalModel.js";

class GoalServices {
  // CREATE GOAL + invalidate cache
  static async createGoal({
    userId,
    goal_name,
    target_amount,
    target_date,
    description,
    icon_name,
  }) {
    // Create new goal in DB
    const newGoal = await GoalModel.createGoal({
      userId,
      goal_name,
      target_amount,
      target_date,
      description,
      icon_name,
    });

    // Invalidate Redis cache
    await redisClient.del(`goal:${userId}`);

    return newGoal;
  }

  // GET ALL GOALS
  static async getAllGoals(userId) {
    // Check Redis cache first
    const cached = await redisClient.get(`goal:${userId}`);
    if (cached) return JSON.parse(cached);

    // If not in cache, fetch from DB
    const goal = await GoalModel.getAllGoals(userId);
    await redisClient.setEx(`goal:${userId}`, 300, JSON.stringify(goal));
    return goal;
  }

  // ADD MONEY TO GOAL + invalidate cache
  static async addMoneyToGoal(userId, goalId, amount) {
    // Add money to goal in DB
    const updatedGoal = await GoalModel.addMoneyToGoal(goalId, amount);
    // Invalidate Redis cache
    await redisClient.del(`goal:${userId}`);
    return updatedGoal;
  }
}

export default GoalServices;
