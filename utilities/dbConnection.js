import mongoose from "mongoose";

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to MongoDB with Mongoose");
  } catch (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
};
