import { validationResult } from "express-validator";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const courseSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

const Course = mongoose.models.Course || mongoose.model("course", courseSchema);

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
};

export const handelAddCourse = async (req, res, next) => {
  const { title, price } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.status = 400;
    return next(errors);
  }

  await connectToDatabase();

  const newCourse = new Course({ title, price: +price });
  await newCourse.save();

  const formattedResult = newCourse.toObject();
  delete formattedResult.__v;
  delete formattedResult._id;

  return res.status(200).json({
    data: formattedResult,
    success: true,
  });
};

export const getAllCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  await connectToDatabase();

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  if (!courses) {
    const error = new Error("Course not found");
    error.status = 404;
    return next(error);
  }
  return res.status(200).json({
    success: true,
    data: courses,
  });
};
export const handleGetCourseById = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    const error = new Error("No course ID provided");
    error.status = 404;
    return next(error);
  }

  await connectToDatabase();
  const course = await Course.findById(course_id).select("-__v");

  if (!course) {
    const error = new Error("Course not found");
    error.status = 404;
    return next(error);
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
};
export const handelChangeCourseById = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    const error = new Error("No course ID provided");
    error.status = 404;
    return next(error);
  }

  await connectToDatabase();

  const result = await Course.findByIdAndUpdate(course_id, req.body, {
    new: true,
  }).select("-__v");

  if (!result) {
    const error = new Error("Course not found");
    error.status = 404;
    return next(error);
  }

  return res.status(200).json({
    message: "Course updated successfully",
    success: true,
    data: result,
  });
};
export const handleDeleteCourse = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    const error = new Error("No course ID provided");
    error.status = 404;
    return next(error);
  }

  await connectToDatabase();

  const result = await Course.findByIdAndDelete(course_id).select("-__v -_id");

  if (!result) {
    const error = new Error("Course not found");
    error.status = 404;
    return next(error);
  }

  return res.status(200).json({
    data: result,
    message: "Course deleted successfully",
    success: true,
  });
};
