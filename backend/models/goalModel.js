// models/authModel.js
import { query as _query } from "../config/db.js";

class GoalModel {
  // Create new goal
  static async createGoal({
    userId,
    goal_name,
    target_amount,
    target_date,
    description,
  }) {
    const sql = `
      INSERT INTO goals (user_id, goal_name, target_amount, target_date, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [
        userId,
        goal_name,
        target_amount,
        target_date,
        description,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  // Get all goals
  static async getAllGoals(userId) {
    const sql = `
      SELECT * FROM goals WHERE user_id = $1;
    `;
    try {
      const result = await _query(sql, [userId]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching expenses");
    }
  }
}

export default GoalModel;
