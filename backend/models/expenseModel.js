// models/authModel.js
import { query as _query } from "../config/db.js";

class ExpensesModel {
  // Create new expense
  static async createExpense({ userId, category, amount, description }) {
    const sql = `
      INSERT INTO expenses (user_id, category, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [userId, category, amount, description]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  // Get all expenses
  static async getAllExpenses(userId) {
    const sql = `
      SELECT * FROM expenses WHERE user_id = $1;
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

export default ExpensesModel;
