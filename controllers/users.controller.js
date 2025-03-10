import { User } from "../modules/user_collection.js";
import { connectToDatabase } from "../utilities/dbConnection.js";
import { createToken } from "../utilities/webToken.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

export const getAllUsers = async (req, res) => {
  await connectToDatabase();
  const { limit = 15, page = 1 } = req.query || req.params;
  const skip = (+page - 1) * +limit;
  const users = await User.find({})
    .select("-__v -token")
    .limit(+limit)
    .skip(+skip);
  return res.status(200).json({
    data: {
      users,
    },
    success: true,
  });
};

export const handelRegister = async (req, res, next) => {
  await connectToDatabase();

  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid data",
    });
  }

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  data.password = hashedPassword;

  const user = await new User(data);

  const token = await createToken(
    { email: user.email, _id: user._id },
    res,
    next
  );

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: userResponse,
      token,
    },
  });
};

export const handelLogin = async (req, res, next) => {
  await connectToDatabase();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = await createToken({ email: user.email, _id: user._id });
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.__v;
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: userResponse,
      token,
    },
  });
};
