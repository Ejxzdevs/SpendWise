import { Router } from "express";
import authController from "../controllers/authController.js"; // ✅ default import

const router = Router();

// List of auth routes
router.post("/login", authController.userLogin);
router.post("/register", authController.userRegister);

export default router;
