import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const tokenChecker = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "No token provided or invalid format",
      data: null,
    });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, decoded) => {
    if (err) {
      err.status = 401;
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    next();
  });
};
