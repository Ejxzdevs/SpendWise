import { Router } from "express";
import ExpenseController from "../controllers/expensesController.js";
import { authenticateUser } from "../middleware/authmiddleware.js"; // all lowercase

const router = Router();

// List of expense routes
router.post("/", authenticateUser, ExpenseController.createExpense);
router.get("/", authenticateUser, ExpenseController.getAllExpenses);
router.delete("/:id", authenticateUser, ExpenseController.deleteExpens);

export default router;
