import express from "express";
import { CoursesRouter } from "../routes/courses.routes.js";

const app = express();

app.use(express.json());

app.use(CoursesRouter);

app.listen(3001, () => {
  console.log("listening on http://localhost:3001");
});
