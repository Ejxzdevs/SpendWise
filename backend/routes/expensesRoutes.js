import { Router } from "express";
import ExpenseController from "../controllers/expensesController.js";
import { authenticateUser } from "../middleware/authmiddleware.js"; // all lowercase

const router = Router();

// List of expense routes
router.post("/create", authenticateUser, ExpenseController.createExpense);
router.get("/products", authenticateUser, ExpenseController.getAllExpenses);

export default router;
