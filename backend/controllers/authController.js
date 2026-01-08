import authModel from "../models/authModel.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;

class AuthController {
  // LOGIN USER
  userLogin = async (req, res) => {
    const { username, password } = req.body;
    const userData = { username, password };

    try {
      const users = await authModel.findByUsernameAndPassword(userData);

      if (users.length === 0) {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const user = users[0];

      // Generate token
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
