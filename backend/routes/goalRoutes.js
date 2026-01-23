import { Router } from "express";
import { authenticateUser } from "../middleware/authmiddleware.js";
import goalController from "../controllers/goalController.js";

const router = Router();

router.post("/create", goalController.createGoal);
router.get("/all", goalController.getAllGoals);

export default router;
