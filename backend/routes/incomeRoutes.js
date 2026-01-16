import { Router } from "express";
import IncomeController from "../controllers/incomeController.js";
const router = Router();

// List of income routes
router.post("/create", IncomeController.createIncome);
router.get("/all", IncomeController.getAllIncomes);

export default router;
