import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const key = process.env.SECRET_TOKEN_KEY;

export const createToken = async (data, res, next) => {
  try {
    const { email, _id } = data;
    if (!email || !_id) {
      const error = new Error("No data provided");
      error.status = 400;
      return next(error);
    }

    const token = jwt.sign({ email, date: new Date().getTime(), _id }, key, {
      expiresIn: "1h",
    });

    if (!token) {
      const error = new Error("Failed to create token");
      error.status = 500;
      return next(error);
    }

    return token;
  } catch (error) {
    error.status = 400;
    return next(error);
  }
};
