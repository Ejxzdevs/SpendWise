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

  // Get all incomes
  static async getAllIncomes() {
    const sql = ` SELECT * FROM incomes ORDER BY created_at DESC; `;
    try {
      const result = await _query(sql);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching incomes");
    }
  }
}

export default IncomeModel;
