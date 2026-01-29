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
    icon_name,
  }) {
    const sql = `
      INSERT INTO goals (user_id, goal_name, target_amount, target_date, description,icon_name)
      VALUES ($1, $2, $3, $4, $5 ,$6)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [
        userId,
        goal_name,
        target_amount,
        target_date,
        description,
        icon_name,
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

  // Add money to goal
  static async addMoneyToGoal(goalId, amount) {
    const sql = `
      UPDATE goals
      SET current_amount = current_amount + $1
      WHERE goal_id = $2
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [amount, goalId]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error adding money to goal");
    }
  }

  // Update goal
  static async updateGoal(goalId, updateData) {
    const fields = [];
    const values = [];
    let index = 1;

    // Only include keys with non-undefined values
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(updateData[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const sql = `
    UPDATE goals
    SET ${fields.join(", ")}
    WHERE goal_id = $${index}
    RETURNING *;
  `;

    try {
      const result = await _query(sql, [...values, goalId]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error updating goal");
    }
  }

  // Delete goal
  static async deleteGoal(goalId) {
    const sql = `
      DELETE FROM goals WHERE goal_id = $1;
    `;
    try {
      await _query(sql, [goalId]);
    } catch (error) {
      console.error(error);
      throw new Error("Error deleting goal");
    }
  }
}

export default GoalModel;
