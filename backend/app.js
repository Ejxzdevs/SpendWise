import express, { json, urlencoded } from "express";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expensesRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
const app = express();
import cors from "cors";

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// ROUTES
app.use("/auth", authRoutes);
app.use("/expense", expenseRoutes);
app.use("/income", incomeRoutes);
app.use("/goal", goalRoutes);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080/");
});
