// controllers/authController.js
import AuthModel from "../models/authModel.js";
import pkg from "jsonwebtoken"; // for JWT
const { sign } = pkg;

class AuthController {
  // REGISTER USER
  userRegister = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    try {
      // Check if username already exists
      const existingUser = await AuthModel.findByUsername(username);

      if (existingUser.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }

      // Create new user
      const newUser = await AuthModel.createUser({ username, password });

      res.status(201).json({
        success: true,
        message: "User registered successfully. Please login.",
        user: {
          id: newUser.user_id,
          username: newUser.username,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // LOGIN USER
  userLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    try {
      const user = await AuthModel.findByUsernameAndPassword({
        username,
        password,
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Generate JWT token
      const token = sign({ id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.user_id,
          username: user.username,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new AuthController();
