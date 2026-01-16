import { Router } from "express";
import IncomeController from "../controllers/incomeController.js";
const router = Router();

// List of income routes
router.post("/create", IncomeController.createIncome);

export default router;
