import { Router } from "express";
import { authenticateUser } from "../middleware/authmiddleware.js";
import goalController from "../controllers/goalController.js";

const router = Router();

router.post("/", authenticateUser, goalController.createGoal);
router.get("/", authenticateUser, goalController.getAllGoals);
router.patch("/:id", authenticateUser, goalController.addMoney);

export default router;
