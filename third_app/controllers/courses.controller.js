import { validationResult } from "express-validator";
import { MongoClient, ObjectId } from "mongodb";

const url = `url form .env file`;

const client = new MongoClient(url);
let db;
export const connectToDatabase = async () => {
  if (db) return db;

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("my_db");
    return db;
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
};

export const handelAddCourse = async (req, res) => {
  const { title, price } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const result = await coursesCollection.insertOne({ title, price: +price });
    return res.status(200).json({
      message: "Course added successfully",
      course: result,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error connecting to db",
      error,
      success: false,
    });
  }
};

export const getAllCourses = async (_, res) => {
  try {
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const courses = await coursesCollection.find().toArray();
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
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
      message: "No course ID provided",
      success: false,
    });
  }

  try {
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const course = await coursesCollection.findOne({
      _id: new ObjectId(course_id),
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    return res.status(500).json({
      message: "Error connecting to db",
      success: false,
    });
  }
};
export const handelChangeCourseById = async (req, res) => {
  const { course_id } = req.params;
  if (!course_id) {
    return res.status(404).json({
      message: "No course ID provided",
      success: false,
    });
  }

  try {
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const result = await coursesCollection.updateOne(
      { _id: new ObjectId(course_id) },
      { $set: req.body }
    );
    if (result.matchedCount !== 1) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Course updated successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error connecting to db",
      success: false,
    });
  }
};
export const handleDeleteCourse = async (req, res) => {
  const { course_id } = req.params;
  if (!course_id) {
    return res.status(404).json({
      message: "No course ID provided",
      success: false,
    });
  }
  try {
    const db = await connectToDatabase();
    const coursesCollection = db.collection("courses");
    const result = await coursesCollection.deleteOne({
      _id: new ObjectId(course_id),
    });
    if (result.deletedCount !== 1) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Course deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error connecting to db",
      error,
      success: false,
    });
  }
};
