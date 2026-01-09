// models/authModel.js
import { query as _query } from "../config/db.js";
import bcrypt from "bcrypt";

class AuthModel {
  // Find user by username
  static async findByUsername(username) {
    const sql = "SELECT * FROM users WHERE username = $1";
    try {
      const result = await _query(sql, [username]);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking username");
    }
  }

  // Create new user (registration)
  static async createUser({ username, password }) {
    const sql = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
    `;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await _query(sql, [username, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  // Authenticate user (login)
  static async findByUsernameAndPassword({ username, password }) {
    try {
      const users = await this.findByUsername(username);

      if (users.length === 0) return null;

      const user = users[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) return null;

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user data");
    }
  }
}

export default AuthModel;
