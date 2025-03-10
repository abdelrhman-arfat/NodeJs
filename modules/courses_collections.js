import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

export const Course =
  mongoose.models.Course || mongoose.model("course", courseSchema);
