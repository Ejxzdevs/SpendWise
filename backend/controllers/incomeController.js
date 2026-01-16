import IncomeServices from "../services/incomeServices.js";

class IncomeController {
  createIncome = async (req, res) => {
    const { source, amount, description } = req.body;
    if (!source || !amount)
      return res
        .status(400)
        .json({ success: false, message: "Required fields missing" });

    try {
      await IncomeServices.createIncome({ source, amount, description });
      res.status(201).json({ success: true, message: "Income created" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllIncomes = async (req, res) => {
    try {
      const incomes = await IncomeServices.getAllIncomes();
      res.status(200).json({ success: true, data: incomes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new IncomeController();
