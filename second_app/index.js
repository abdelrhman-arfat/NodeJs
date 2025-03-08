import express from "express";
import { CoursesRouter } from "./routes/app_routes.js";

const app = express();
app.use(express.json());

app.use(CoursesRouter);

app.listen(4010, () => {
  console.log("Listening on port 4010");
});
