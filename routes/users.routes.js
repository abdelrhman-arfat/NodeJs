import { Router } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import {
  getAllUsers,
  handelLogin,
  handelRegister,
} from "../controllers/users.controller.js";
import { tokenChecker } from "../middleware/tokenChecker.js";
const router = new Router();

router
  .get("/", tokenChecker, asyncWrapper(getAllUsers))
  .post("/register", asyncWrapper(handelRegister))
  .post("/login", asyncWrapper(handelLogin));

export { router as userRouter };
