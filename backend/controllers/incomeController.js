import IncomeServices from "../services/incomeServices.js";

class IncomeController {
  createIncome = async (req, res) => {
    const userId = req.user.id;
    const { source, amount, description } = req.body;
    if (!source || !amount)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    try {
      await IncomeServices.createIncome({
        userId,
        source,
        amount,
        description,
      });
      res.status(201).json({ success: true, message: "Income created" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllIncomes = async (req, res) => {
    const userId = req.user.id;
    try {
      const incomes = await IncomeServices.getAllIncomes(userId);
      res.status(200).json({ success: true, data: incomes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteIncomee = async (req, res) => {
    const userId = req.user.id;
    const source_id = req.params.id;
    if (!source_id)
      return res
        .status(400)
        .json({ success: false, message: "Income ID is required" });
    try {
      await IncomeServices.deleteIncome({ userId, source_id });
      res.status(200).json({ success: true, message: "Income deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new IncomeController();
