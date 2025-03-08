import { Router } from "express";
import {
  handelAddCourse,
  handelChangeCourseData,
  handelDeleteCourse,
  handelGetAllCourses,
  handelGetCourseById,
} from "../funcs/handel_Courses.js";
import { validateAddCourse } from "../validator/validate_courses.js";
const router = new Router();

router
  .route("/api/courses")
  .get(handelGetAllCourses)
  .post(validateAddCourse, handelAddCourse);

router
  .route("/api/courses/:course_id")
  .get(handelGetCourseById)
  .delete(handelDeleteCourse)
  .patch(validateAddCourse, handelChangeCourseData);

export { router as CoursesRouter };
