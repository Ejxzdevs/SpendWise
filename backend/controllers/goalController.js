import GoalServices from "../services/goalServices.js";

class GoalController {
  createGoal = async (req, res) => {
    const userId = req.user.id;
    const { goal_name, target_amount, target_date, description, icon_name } =
      req.body;
    if (!goal_name || !target_amount || !target_date) {
      return res.status(400).json({
        success: false,
        message:
          "Required fields missing: goal_name, target_amount, or target_date",
      });
    }

    try {
      await GoalServices.createGoal({
        userId,
        goal_name,
        target_amount,
        target_date,
        description,
        icon_name,
      });
      res.status(201).json({ success: true, message: "Goal created" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllGoals = async (req, res) => {
    const userId = req.user.id;
    try {
      const goals = await GoalServices.getAllGoals(userId);
      res.status(200).json({ success: true, data: goals });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new GoalController();
