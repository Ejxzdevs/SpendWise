// authModel.js
import { query as _query } from "../config/db.js";

class Account {
  static async findByUsernameAndPassword(data) {
    const sql = "SELECT * FROM users WHERE username = $1 AND password = $2";
    try {
      const result = await _query(sql, [data.username, data.password]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user data");
    }
  }
}

export default Account;
