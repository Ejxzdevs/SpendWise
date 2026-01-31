import { Router } from "express";
import IncomeController from "../controllers/incomeController.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

const router = Router();

// List of income routes
router.post("/", authenticateUser, IncomeController.createIncome);
router.get("/", authenticateUser, IncomeController.getAllIncomes);
router.delete("/:id", authenticateUser, IncomeController.deleteIncomee);
export default router;
