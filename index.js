import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { CoursesRouter } from "./routes/courses.routes.js";

const app = express();
console.log();
app.use(express.json());

app.use("/api/courses", CoursesRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({ message: "not found" });
  next();
});
app.listen(3001, () => {
  console.log("listening on http://localhost:3001");
});
