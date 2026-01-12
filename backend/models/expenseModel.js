// models/authModel.js
import { query as _query } from "../config/db.js";

class ExpensesModel {
  // Create new user (registration)
  static async createExpense({ category, amount, description }) {
    const sql = `
      INSERT INTO expenses (category, amount, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [category, amount, description]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }
}

export default ExpensesModel;
