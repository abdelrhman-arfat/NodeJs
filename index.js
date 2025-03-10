import dotenv from "dotenv";
import express from "express";
dotenv.config();
import { CoursesRouter } from "./routes/courses.routes.js";
import { userRouter } from "./routes/users.routes.js";

const app = express();
app.use(express.json());
app.use((error, req, res, next) => {
  if (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
  next();
});

app.use("/api/courses", CoursesRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({ message: "not found" });
  next();
});
app.listen(3002, () => {
  console.log("listening on http://localhost:3002");
});
