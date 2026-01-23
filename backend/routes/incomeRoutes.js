import { Router } from "express";
import IncomeController from "../controllers/incomeController.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

const router = Router();

// List of income routes
router.post("/create", authenticateUser, IncomeController.createIncome);
router.get("/all", authenticateUser, IncomeController.getAllIncomes);

export default router;
