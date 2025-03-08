import { validationResult } from "express-validator";
import courses from "../constant/courses_data.js";


const handelGetAllCourses = (_, res) => {
  res.status(200).json(courses);
};
const handelGetCourseById = (req, res) => {
  const { course_id } = req.params;
  const corse = courses.find((c) => c.id === +course_id);
  res.json(corse);
};

const handelAddCourse = (req, res) => {
  const { title, price } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newCourse = {
    id: courses.length + 1,
    title,
    price,
  };

  courses.push(newCourse);
  res.status(200).json({
    message: "Course added successfully",
    course: newCourse,
  });
};

const handelDeleteCourse = (req, res) => {
  const { course_id } = req.params;
  const index = courses.findIndex((c) => c.id === +course_id);
  if (index === -1) {
    return res.status(404).json({ message: "Course not found" });
  }

  courses.filter((c) => c.id !== +course_id);

  res.status(200).json({
    message: "Course deleted successfully",
  });
};

const handelChangeCourseData = (req, res) => {
  const { course_id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const index = courses.findIndex((c) => c.id === +course_id);
  if (index === -1) {
    return res.status(404).json({ message: "Course not found" });
  }

  // when in database i won't do this because database will handle it

  courses[index] = {
    ...courses[index],
    ...req.body,
  };
  res.status(200).json({
    message: "Course updated successfully",
    course: courses[index],
  });
};

export {
  handelGetAllCourses,
  handelGetCourseById,
  handelAddCourse,
  handelDeleteCourse,
  handelChangeCourseData,
};
