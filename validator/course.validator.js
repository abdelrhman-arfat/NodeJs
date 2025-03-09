import { body } from "express-validator";
const validateAddCourse = [
  body("title")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage("Title is required"),
  body("price")
    .notEmpty()
    .isLength({ min: 2, max: 50 })
    .withMessage("Price is required"),
];

export { validateAddCourse };
