// models/authModel.js
import { query as _query } from "../config/db.js";

class IncomeModel {
  // Create new income
  static async createIncome({ userId, source, amount, description }) {
    const sql = `
      INSERT INTO incomes (user_id, source, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [userId, source, amount, description]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  // Get all incomes
  static async getAllIncomes(userId) {
    const sql = ` SELECT * FROM incomes WHERE user_id = $1`;
    try {
      const result = await _query(sql, [userId]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching incomes");
    }
  }
}

export default IncomeModel;
