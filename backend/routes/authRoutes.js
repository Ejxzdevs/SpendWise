import { Router } from "express";
import authController from "../controllers/authController.js"; // ✅ default import

const router = Router();

// Use the method from the controller instance
router.post("/login", authController.userLogin);

export default router;
