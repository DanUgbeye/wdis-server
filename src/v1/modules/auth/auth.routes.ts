import express from "express";
import authController from "./auth.controller";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { userLoginSchema, userSignupSchema } from "./auth.validation";

const authRouter = express.Router();

authRouter.post(
  "/login",
  validateRequest(userLoginSchema),
  authController.login
);

authRouter.post(
  "/signup",
  validateRequest(userSignupSchema),
  authController.signup
);

export default authRouter;
