import { Router } from "express";
import { authenticateUser } from "../middleware/authmiddleware.js";
import goalController from "../controllers/goalController.js";

const router = Router();

router.post("/create", authenticateUser, goalController.createGoal);
router.get("/all", authenticateUser, goalController.getAllGoals);

export default router;
