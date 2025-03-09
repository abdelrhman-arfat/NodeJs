import { Router } from "express";
import { validateAddCourse } from "../validator/course.validator.js";
import {
  getAllCourses,
  handelAddCourse,
  handelChangeCourseById,
  handleDeleteCourse,
  handleGetCourseById,
} from "../controllers/courses.controller.js";
import { asyncWrapper } from "../utilities/asyncWrapper.js";

const router = new Router();

router
  .route("/")
  .get(asyncWrapper(getAllCourses))
  .post(validateAddCourse, asyncWrapper(handelAddCourse));

router
  .route("/:course_id")
  .get(asyncWrapper(handleGetCourseById))
  .delete(asyncWrapper(handleDeleteCourse))
  .patch(asyncWrapper(handelChangeCourseById));

export { router as CoursesRouter };
