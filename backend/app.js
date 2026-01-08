import express, { json, urlencoded } from "express";
import authRoutes from "./routes/authRoutes.js";
const app = express();
import cors from "cors";

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));

// ROUTES
app.use("/auth", authRoutes);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080/");
});
