import { Router } from "express";
import ExpenseController from "../controllers/expensesController.js";

const router = Router();

// List of expense routes
router.post("/create", ExpenseController.createExpense);

export default router;
