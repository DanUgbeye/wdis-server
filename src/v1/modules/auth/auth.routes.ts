import express from "express";
import authController from "./auth.controller";
import validateRequest from "../../../globals/middlewares/validator.middleware";
import { userLoginSchema, userSignupSchema } from "./auth.validation";
import authMiddleware from "./auth.middleware";

const authRouter = express.Router();

// login route
authRouter.post(
  "/login",
  validateRequest(userLoginSchema),
  authController.login
);

// signup route
authRouter.post(
  "/signup",
  validateRequest(userSignupSchema),
  authController.signup
);

// signup with google route
authRouter.get(
  "/signup/google",
  // passport JS setup,
  authController.signInWithGoogle
);

// generates a new access token
authRouter.get(
  "refresh-token",
  authMiddleware.verifyRefreshToken,
  authController.refreshAccessToken
);

// resend account verification email route
authRouter.post(
  "/verify-email/resend",
  // validateRequest(userSignupSchema),
  authController.resendAccountVerificationMail
);

// verify email route
authRouter.get("/verify-email/:token", authController.verifyAccount);

// request forgot password email route
authRouter.post(
  "/forgot-password",
  // validateRequest(userSignupSchema),
  authController.sendForgotPasswordMail
);

// change password route
authRouter.post(
  "/forgot-password/:token",
  // validateRequest(userSignupSchema),
  authController.changePasswordWithToken
);

export default authRouter;
