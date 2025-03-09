import { body } from "express-validator";

const validateAddCourse = [
  body("title").notEmpty().withMessage("Title is required"),
  body("price").notEmpty().withMessage("Price is required"),
];

export { validateAddCourse };