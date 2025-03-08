import { body } from "express-validator";

export const validateAddCourse = [
  body("title").notEmpty().withMessage("Title is required"),
  body("price").notEmpty().withMessage("price is required"),
];
