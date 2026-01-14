import ExpenseServices from "../services/expenseServices.js";

class ExpensesController {
  createExpense = async (req, res) => {
    const { category, amount, description } = req.body;
    if (!category || !amount)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    try {
      await ExpenseServices.createExpense({ category, amount, description });
      res.status(201).json({ success: true, message: "Expense created" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllExpenses = async (req, res) => {
    try {
      const expenses = await ExpenseServices.getAllExpenses();
      res.status(200).json({ success: true, data: expenses });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
}

export default new ExpensesController();
