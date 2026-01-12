// controllers/expensesController.js
import ExpensesModel from "../models/expenseModel.js";

class ExpensesController {
  // CREATE EXPENSE
  createExpense = async (req, res) => {
    const { category, amount, description } = req.body;

    // Validate input
    if (!category || !amount) {
      return res.status(400).json({
        success: false,
        message: "Category and amount are required fields",
      });
    }

    try {
      const newExpense = await ExpensesModel.createExpense({
        category,
        amount,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: newExpense,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new ExpensesController();
