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

export const handelAddCourse = async (req, res) => {
  const { title, price } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array(), data: null });
  }
  try {
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
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: error.message,
      success: false,
    });
  }
};

export const getAllCourses = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();

    const courses = await Course.find({}, { __v: false })
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error connecting to db",
      success: false,
    });
  }
};
export const handleGetCourseById = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(404).json({
      data: null,
      message: "No course ID provided",
      success: false,
    });
  }

  try {
    await connectToDatabase();
    const course = await Course.findById(course_id);

    if (!course) {
      return res.status(404).json({
        data: null,
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: error.message,
      success: false,
    });
  }
};
export const handelChangeCourseById = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(404).json({
      data: null,
      message: "No course ID provided",
      success: false,
    });
  }

  try {
    await connectToDatabase();

    const result = await Course.findByIdAndUpdate(course_id, req.body, {
      new: true,
    }).select("-__v -_id");

    if (!result) {
      return res.status(404).json({
        data: null,
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: error.message,
      success: false,
    });
  }
};
export const handleDeleteCourse = async (req, res) => {
  const { course_id } = req.params;

  if (!course_id) {
    return res.status(404).json({
      data: null,
      message: "No course ID provided",
      success: false,
    });
  }

  try {
    await connectToDatabase();

    const result = await Course.findByIdAndDelete(course_id).select(
      "-__v -_id"
    );

    if (!result) {
      return res.status(404).json({
        data: null,
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      data: result,
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      message: error.message,
      success: false,
    });
  }
};
