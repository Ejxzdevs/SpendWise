import ExpenseServices from "../services/expenseServices.js";

class ExpensesController {
  // Create a new expense
  createExpense = async (req, res) => {
    const userId = req.user.id;
    const { category, amount, description } = req.body;
    if (!category || !amount)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    try {
      await ExpenseServices.createExpense({
        userId,
        category,
        amount,
        description,
      });
      res.status(201).json({ success: true, message: "Expense created" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get all expenses for a user
  getAllExpenses = async (req, res) => {
    const userId = req.user.id;
    try {
      const expenses = await ExpenseServices.getAllExpenses(userId);
      res.status(200).json({ success: true, data: expenses });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // Delete an expense by ID
  deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const userId = req.user.id;
    try {
      const deleted = await ExpenseServices.deleteExpense(expenseId, userId);
      if (deleted) {
        res.status(200).json({ success: true, message: "Expense deleted" });
      } else {
        res.status(404).json({ success: false, message: "Expense not found" });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new ExpensesController();
