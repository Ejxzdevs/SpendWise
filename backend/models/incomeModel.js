// models/authModel.js
import { query as _query } from "../config/db.js";

class IncomeModel {
  // Create new income
  static async createIncome({ source, amount, description }) {
    const sql = `
      INSERT INTO incomes (source, amount, description)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    try {
      const result = await _query(sql, [source, amount, description]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }
}

export default IncomeModel;
