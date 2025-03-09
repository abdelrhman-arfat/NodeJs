import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { CoursesRouter } from "./routes/courses.routes.js";

const app = express();
app.use(express.json());
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

app.use("/api/courses", CoursesRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({ message: "not found" });
  next();
});
app.listen(3002, () => {
  console.log("listening on http://localhost:3002");
});
