import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import goalController from "../controllers/goalController.js";

const router = Router();

router.post("/", authenticateUser, goalController.createGoal);
router.get("/", authenticateUser, goalController.getAllGoals);
router.patch("/:id", authenticateUser, goalController.addMoney);
router.put("/:id", authenticateUser, goalController.updateGoal);
router.delete("/:id", authenticateUser, goalController.delGoal);

export default router;
